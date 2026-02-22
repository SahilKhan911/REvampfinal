import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        // Verify user token
        const token = req.cookies.get('user_token')?.value
        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        let decoded: any
        try {
            decoded = jwt.verify(token, env.JWT_SECRET)
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        // Get user details
        const { data: user, error: userErr } = await supabase
            .from('User')
            .select('*')
            .eq('id', decoded.userId)
            .single()

        if (userErr || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Get user's orders with bundle info
        const { data: orders } = await supabase
            .from('Order')
            .select('*, bundle:Bundle(*)')
            .eq('userId', user.id)
            .order('createdAt', { ascending: false })

        // Get referral stats - how many users used this person's code
        const { data: referredUsers } = await supabase
            .from('User')
            .select('id, name, email, createdAt')
            .eq('referredBy', user.referralCode)

        return NextResponse.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                referralCode: user.referralCode,
                referralEarnings: user.referralEarnings || 0,
                totalReferrals: user.totalReferrals || 0,
                createdAt: user.createdAt,
            },
            orders: orders || [],
            referredUsers: referredUsers || [],
        })
    } catch (error: any) {
        console.error('Dashboard data error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
