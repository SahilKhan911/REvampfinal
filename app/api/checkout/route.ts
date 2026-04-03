import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { sendOrderConfirmationEmail } from '@/lib/email'
import { checkAndGrantAchievements } from '@/lib/achievements'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''
    const isFormData = contentType.includes('multipart/form-data')
    
    let userId: string, domain: string, plan: string, amount: number,
        transactionId: string, step: string, file: File | null = null, appliedBalance: number = 0

    if (isFormData) {
      const formData = await req.formData()
      userId = formData.get('userId') as string
      domain = formData.get('domain') as string
      plan = formData.get('plan') as string
      amount = parseFloat(formData.get('amount') as string) || 0
      appliedBalance = parseFloat(formData.get('appliedBalance') as string) || 0
      step = formData.get('step') as string || 'PAYMENT'
      file = formData.get('paymentProof') as File | null
      transactionId = formData.get('transactionId') as string
    } else {
      const body = await req.json()
      userId = body.userId
      domain = body.domain
      plan = body.plan
      amount = body.amount || 0
      appliedBalance = parseFloat(body.appliedBalance) || 0
      step = body.step || 'PAYMENT'
      transactionId = body.transactionId
    }

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required. Please log in.' }, { status: 401 })
    }

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found. Please log in again.' }, { status: 401 })
    }

    // Resolve the real Bundle from the DB by slug
    const bundleSlug = plan?.toLowerCase().replace(/ /g, '-')
    let bundleId: string | null = null
    let bundleRecord: any = null

    if (bundleSlug) {
      const { data: bundle } = await supabase
        .from('Bundle')
        .select('*')
        .eq('slug', bundleSlug)
        .single()

      if (bundle) {
        bundleId = bundle.id
        bundleRecord = bundle
      }
    }

    // Track lead
    if (step === 'DETAILS' || !isFormData) {
      try {
        await supabase.from('Lead').insert({
          id: crypto.randomUUID(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          bundleId: bundleId || null,
          stepReached: 'DETAILS',
        })
      } catch { /* non-blocking */ }
      
      if (!isFormData) {
        return NextResponse.json({ success: true, userId: user.id, message: 'Lead captured' })
      }
    }

    // Upload payment proof
    let paymentProofUrl: string | null = null
    const productLabel = domain && plan
      ? `${domain.toUpperCase()}_${plan.toUpperCase().replace(/ /g, '_')}`
      : bundleRecord?.name || 'UNKNOWN_PRODUCT'

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer()
      const extension = file.name.split('.').pop()
      const fileName = `${user.id}_${Date.now()}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, arrayBuffer, { contentType: file.type, upsert: false })

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(fileName)
        paymentProofUrl = publicUrl
      } else {
        console.error('File upload error:', uploadError)
      }
    }

    // bundleId is NOT NULL in schema — require it
    if (!bundleId) {
      return NextResponse.json({ error: 'Workshop not found. Please go back and try again.' }, { status: 400 })
    }

    // Cap referral balance at 50% of bundle price
    const maxReferralDiscount = Math.floor((bundleRecord?.eventPrice || amount) * 0.5)
    if (appliedBalance > maxReferralDiscount) {
      appliedBalance = maxReferralDiscount
    }

    // Atomic balance check + order creation + deduction inside a serializable transaction
    // This prevents double-spend race conditions from concurrent requests
    let order: any
    const orderId = crypto.randomUUID()

    if (appliedBalance > 0) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        order = await (prisma.$transaction as any)(async (tx: any) => {
          // 1. Calculate available balance inside the transaction
          const payouts = await tx.referralPayout.findMany({ where: { userId } })
          const earned = payouts.reduce((sum: number, p: any) => sum + (p.amountPaid || 0), 0)

          const redemptions = await tx.redemptionRequest.findMany({
            where: { userId, status: { not: 'REJECTED' } }
          })
          const redeemed = redemptions.reduce((sum: number, r: { amount: number }) => sum + r.amount, 0)
          const available = earned - redeemed

          if (appliedBalance > available) {
            throw new Error('INSUFFICIENT_BALANCE')
          }

          // Re-apply the 50% cap (defense in depth)
          const cappedBalance = Math.min(appliedBalance, maxReferralDiscount, available)
          const finalAmt = Math.max(0, amount - cappedBalance)

          // 2. Create order
          const newOrder = await tx.order.create({
            data: {
              id: orderId,
              userId,
              bundleId: bundleId!,
              amount: finalAmt,
              paymentMethod: finalAmt > 0 ? 'upi' : 'referral_balance',
              status: finalAmt > 0 ? 'pending' : 'paid',
              productName: productLabel,
              razorpayPaymentId: transactionId || null,
              paymentProofUrl,
            }
          })

          // 3. Deduct balance atomically
          await tx.redemptionRequest.create({
            data: {
              id: crypto.randomUUID(),
              userId,
              amount: cappedBalance,
              upiId: `WORKSHOP_PURCHASE:${orderId}`,
              status: 'PAID',
              adminNote: `Applied to order for ${bundleRecord?.name || 'Workshop'}`
            }
          })

          return newOrder
        }, {
          isolationLevel: 'Serializable',
          timeout: 10000,
        })
      } catch (txError: any) {
        if (txError.message === 'INSUFFICIENT_BALANCE') {
          return NextResponse.json({ error: 'Insufficient referral balance' }, { status: 400 })
        }
        console.error('Transaction error:', txError)
        return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 })
      }
    } else {
      // No referral balance — simple order creation
      const finalAmount = Math.max(0, amount)

      const { data: newOrder, error: orderError } = await supabase
        .from('Order')
        .insert({
          id: orderId,
          userId,
          bundleId,
          amount: finalAmount,
          paymentMethod: finalAmount > 0 ? 'upi' : 'free',
          status: finalAmount > 0 ? 'pending' : 'paid',
          productName: productLabel,
          razorpayPaymentId: transactionId || null,
          paymentProofUrl,
        })
        .select()
        .single()

      if (orderError) {
        console.error('Order creation failed:', orderError.message)
        return NextResponse.json({ error: 'Order creation failed: ' + orderError.message }, { status: 500 })
      }
      order = newOrder
    }

    // Update Lead
    await supabase.from('Lead')
      .update({ stepReached: 'PAYMENT', bundleId: bundleId || null })
      .eq('email', user.email)

    // Auto-create Enrollment for free or fully balance-covered registrations
    const orderAmount = order?.amount ?? amount
    if (orderAmount === 0 && bundleId) {
      await supabase.from('Enrollment').insert({
        id: crypto.randomUUID(),
        userId: user.id,
        bundleId,
        status: 'ACTIVE',
      })
    }

    // Send order confirmation email + achievement check (non-blocking)
    sendOrderConfirmationEmail(user.email, user.name, productLabel, orderAmount).catch(() => {})
    checkAndGrantAchievements(user.id).catch(() => {})

    // Note: Referral tracking happens on admin approval (admin/orders PATCH),
    // not here — the old increment_referral RPC no longer exists.

    return NextResponse.json({ 
      success: true, 
      userId: user.id,
      orderId: order?.id,
      message: amount > 0 
        ? 'Payment proof received. Your access will be confirmed soon.' 
        : 'Registration successful!'
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
