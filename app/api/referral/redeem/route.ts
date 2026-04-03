import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get('user_token')?.value
        if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

        let decoded: any
        try {
            decoded = jwt.verify(token, env.JWT_SECRET)
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const body = await req.json()
        const amount = Number(body.amount)
        const upiId = body.upiId

        if (!amount || isNaN(amount) || amount < 100) {
            return NextResponse.json({ error: 'Minimum withdrawal amount is ₹100' }, { status: 400 })
        }
        if (!upiId || typeof upiId !== 'string' || !upiId.includes('@')) {
            return NextResponse.json({ error: 'Invalid UPI ID' }, { status: 400 })
        }

        const { data: user } = await supabase.from('User').select('id').eq('id', decoded.userId).single()
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        // 1. Calculate total earnings
        const { data: payouts } = await supabase.from('ReferralPayout').select('amountPaid').eq('userId', user.id)
        const totalEarnings = (payouts || []).reduce((sum, p) => sum + (p.amountPaid || 0), 0)

        // 2. Calculate already redeemed/processing amounts
        const { data: redemptions } = await supabase
            .from('RedemptionRequest')
            .select('amount')
            .eq('userId', user.id)
            .neq('status', 'REJECTED')
            
        const totalRedeemed = (redemptions || []).reduce((sum, r) => sum + (r.amount || 0), 0)
        const availableBalance = totalEarnings - totalRedeemed
        
        if (amount > availableBalance) {
            return NextResponse.json({ error: `Insufficient balance. Available: ₹${availableBalance}` }, { status: 400 })
        }

        // 3. Create redemption request
        const { data: request, error: createError } = await supabase.from('RedemptionRequest').insert({
            userId: user.id,
            amount,
            upiId,
            status: 'INITIATED'
        }).select().single()

        if (createError) throw createError

        return NextResponse.json({ success: true, request })
    } catch (error) {
        console.error('Redeption POST error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
