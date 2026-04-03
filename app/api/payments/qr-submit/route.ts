import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { sendPendingEmail } from '@/lib/emails'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { bundleId, name, email, phone, password, transactionId } = await req.json()

    if (!bundleId || !name || !email || !phone || !password || !transactionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Verify bundle
    const { data: bundle, error: bundleError } = await supabase
      .from('Bundle')
      .select('*')
      .eq('id', bundleId)
      .eq('isActive', true)
      .single()

    if (bundleError || !bundle) {
      return NextResponse.json({ error: 'Bundle not found or inactive' }, { status: 404 })
    }

    const referralCookie = cookies().get('referral_code')?.value

    // 2. Upsert user
    const { data: existingUser } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .single()

    let user
    if (existingUser) {
      const { data, error } = await supabase
        .from('User')
        .update({ name, phone, passwordHash: password })
        .eq('email', email)
        .select()
        .single()
      if (error) throw error
      user = data
    } else {
      const { data, error } = await supabase
        .from('User')
        .insert({
          id: crypto.randomUUID(),
          name,
          email,
          phone,
          passwordHash: password,
          referralCode: `tmp_${Math.random().toString(36).substring(7)}`,
          referredBy: referralCookie || null,
        })
        .select()
        .single()
      if (error) throw error
      user = data
    }

    // 3. Create order
    const { data: order, error: orderError } = await supabase
      .from('Order')
      .insert({
        id: crypto.randomUUID(),
        userId: user.id,
        bundleId: bundle.id,
        amount: bundle.eventPrice,
        paymentMethod: 'qr',
        status: 'pending',
        razorpayPaymentId: transactionId,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 4. Send pending email
    await sendPendingEmail(email, name, bundle.name, bundle.eventPrice)

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error: any) {
    console.error('Manual payment submission error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
