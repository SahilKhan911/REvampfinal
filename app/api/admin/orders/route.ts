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

      // 1b. Upsert Enrollment (idempotent — safe to call multiple times)
      if (order.bundleId && order.userId) {
        const { data: existing } = await supabase
          .from('Enrollment')
          .select('id')
          .eq('userId', order.userId)
          .eq('bundleId', order.bundleId)
          .maybeSingle()

        if (!existing) {
          const { error: enrollErr } = await supabase.from('Enrollment').insert({
            id: crypto.randomUUID(),
            userId: order.userId,
            bundleId: order.bundleId,
            status: 'ACTIVE',
            enrolledAt: new Date().toISOString(),
          })
          if (enrollErr) console.error('Enrollment creation failed:', enrollErr.message)
        } else {
          // Ensure status is ACTIVE if it was somehow set otherwise
          await supabase.from('Enrollment').update({ status: 'ACTIVE' }).eq('id', existing.id)
        }
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

      // 4. Referral reward — credit the referrer (idempotent: skip if payout already exists)
      if (order.user?.referredBy) {
        const transactionRef = `order_${orderId}`

        // Guard: don't double-pay if somehow called twice
        const { data: existingPayout } = await supabase
          .from('ReferralPayout')
          .select('id')
          .eq('transactionRef', transactionRef)
          .maybeSingle()

        if (!existingPayout) {
          const { data: referrer } = await supabase
            .from('User')
            .select('id, name, email, totalReferrals')
            .eq('referralCode', order.user.referredBy)
            .maybeSingle()

          if (referrer) {
            const earning = DEFAULT_REFERRAL_EARNING
            const newTotalReferrals = (referrer.totalReferrals || 0) + 1

            await supabase
              .from('User')
              .update({ totalReferrals: newTotalReferrals })
              .eq('id', referrer.id)

            await supabase.from('ReferralPayout').insert({
              id: crypto.randomUUID(),
              userId: referrer.id,
              amountPaid: earning,
              transactionRef,
              paidAt: new Date().toISOString(),
            })

            // Fetch actual total lifetime earnings for the email
            const { data: allPayouts } = await supabase
              .from('ReferralPayout')
              .select('amountPaid')
              .eq('userId', referrer.id)
            const lifetimeEarnings = (allPayouts || []).reduce((s: number, p: any) => s + (p.amountPaid || 0), 0) + earning

            try {
              await sendReferralEarningEmail(
                referrer.email,
                referrer.name,
                order.user.name,
                order.bundle?.name || order.bundleId,
                earning,
                lifetimeEarnings
              )
            } catch { /* non-blocking */ }
          }
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
