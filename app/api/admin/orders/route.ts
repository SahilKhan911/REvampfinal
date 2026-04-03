import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { adminAuth, unauthorizedResponse } from '@/lib/admin-auth'
import { sendPaymentConfirmationEmail, sendReferralEarningEmail } from '@/lib/emails'

export const dynamic = 'force-dynamic'

// Default referral earning per approved order (flat rate)
const DEFAULT_REFERRAL_EARNING = 200

export async function GET(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const bundleId = searchParams.get('bundleId')
  const cohort = searchParams.get('cohort')

  try {
    // If cohort filter, get bundle IDs for that cohort first
    let cohortBundleIds: string[] | null = null
    if (cohort) {
      const { data: cohortBundles } = await supabase
        .from('Bundle')
        .select('id')
        .eq('cohortSlug', cohort)
      cohortBundleIds = cohortBundles?.map(b => b.id) || []
    }

    let query = supabase
      .from('Order')
      .select('*, user:User(*), bundle:Bundle(*)')
      .order('createdAt', { ascending: false })

    if (status) query = query.eq('status', status)
    if (bundleId) query = query.eq('bundleId', bundleId)
    if (cohortBundleIds) {
      query = query.in('bundleId', cohortBundleIds.length > 0 ? cohortBundleIds : ['__none__'])
    }

    const { data: orders, error } = await query

    if (error) throw error

    return NextResponse.json(orders || [])
  } catch (error) {
    console.error('Orders listing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  try {
    const { orderId, action } = await req.json()

    if (action === 'approve') {
      // Get the order with user and bundle info
      const { data: order, error: orderErr } = await supabase
        .from('Order')
        .select('*, user:User(*), bundle:Bundle(*)')
        .eq('id', orderId)
        .single()

      if (orderErr || !order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      if (order.status === 'paid') {
        return NextResponse.json({ error: 'Order already fulfilled' }, { status: 400 })
      }

      // 1. Update order status to paid
      const { error: updateErr } = await supabase
        .from('Order')
        .update({ status: 'paid' })
        .eq('id', orderId)

      if (updateErr) throw updateErr

      // 1b. Auto-create Enrollment
      if (order.bundleId && order.userId) {
        const { error: enrollErr } = await supabase.from('Enrollment').insert({
          id: crypto.randomUUID(),
          userId: order.userId,
          bundleId: order.bundleId,
          status: 'ACTIVE',
        })
        if (enrollErr) console.error('Enrollment creation failed:', enrollErr.message)
      }

      // 2. Finalize referral code if temp
      let finalReferralCode = order.user?.referralCode || ''
      if (finalReferralCode.startsWith('tmp_')) {
        const oldTempCode = finalReferralCode
        finalReferralCode = `REV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
        await supabase
          .from('User')
          .update({ referralCode: finalReferralCode })
          .eq('id', order.userId)

        // Cascade: update any users who were referred by the old temp code
        await supabase
          .from('User')
          .update({ referredBy: finalReferralCode })
          .eq('referredBy', oldTempCode)
      }

      // 3. Send confirmation email to buyer
      if (order.user?.email) {
        await sendPaymentConfirmationEmail(
          order.user.email,
          order.user.name,
          order.bundle?.name || order.bundleId,
          finalReferralCode
        )
      }

      // 4. Referral reward — credit the referrer
      if (order.user?.referredBy) {
        const { data: referrer } = await supabase
          .from('User')
          .select('*')
          .eq('referralCode', order.user.referredBy)
          .single()

        if (referrer) {
          const earning = DEFAULT_REFERRAL_EARNING
          const newTotalReferrals = (referrer.totalReferrals || 0) + 1

          // Update referrer's stats
          await supabase
            .from('User')
            .update({
              totalReferrals: newTotalReferrals,
            })
            .eq('id', referrer.id)

          // Record the payout
          await supabase.from('ReferralPayout').insert({
            id: crypto.randomUUID(),
            userId: referrer.id,
            amountPaid: earning,
            transactionRef: `order_${orderId}`,
          })

          // Email the referrer about their earning
          try {
            await sendReferralEarningEmail(
              referrer.email,
              referrer.name,
              order.user.name,
              order.bundle?.name || order.bundleId,
              earning,
              earning * newTotalReferrals
            )
          } catch { /* non-blocking */ }
        }
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Order approval error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
