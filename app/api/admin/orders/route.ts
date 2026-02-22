import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { adminAuth, unauthorizedResponse } from '@/lib/admin-auth'
import { sendPaymentConfirmationEmail, sendReferralEarningEmail } from '@/lib/emails'

export const dynamic = 'force-dynamic'

// Referral earning per bundle
const REFERRAL_EARNINGS: Record<string, number> = {
  'gsoc-intensive': 200,
  'opensource-starter': 100,
  'opensource-specific': 200,
}

export async function GET(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const bundleId = searchParams.get('bundleId')

  try {
    let query = supabase
      .from('Order')
      .select('*, user:User(*), bundle:Bundle(*)')
      .order('createdAt', { ascending: false })

    if (status) query = query.eq('status', status)
    if (bundleId) query = query.eq('bundleId', bundleId)

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

      // 2. Finalize referral code if temp
      let finalReferralCode = order.user?.referralCode || ''
      if (finalReferralCode.startsWith('tmp_')) {
        finalReferralCode = `REV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
        await supabase
          .from('User')
          .update({ referralCode: finalReferralCode })
          .eq('id', order.userId)
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
          const earning = REFERRAL_EARNINGS[order.bundleId] || 200
          const newTotalReferrals = (referrer.totalReferrals || 0) + 1
          const newTotalEarnings = (referrer.referralEarnings || 0) + earning

          // Update referrer's stats
          await supabase
            .from('User')
            .update({
              totalReferrals: newTotalReferrals,
              referralEarnings: newTotalEarnings,
            })
            .eq('id', referrer.id)

          // Email the referrer about their earning
          await sendReferralEarningEmail(
            referrer.email,
            referrer.name,
            order.user.name,
            order.bundle?.name || order.bundleId,
            earning,
            newTotalEarnings
          )
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
