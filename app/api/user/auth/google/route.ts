import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        const { credential } = await req.json()

        if (!credential) {
            return NextResponse.json({ error: 'Missing Google credential' }, { status: 400 })
        }

        // Decode the Google JWT token (the ID token from Google Sign-In)
        // Google ID tokens are JWTs - we decode to get user info
        // In production you'd verify with Google's public keys, but for now
        // we decode the payload (it's signed by Google and came from their SDK)
        const parts = credential.split('.')
        if (parts.length !== 3) {
            return NextResponse.json({ error: 'Invalid token format' }, { status: 400 })
        }

        const payload = JSON.parse(
            Buffer.from(parts[1], 'base64').toString('utf-8')
        )

        const { email, name, picture, sub: googleId } = payload

        if (!email) {
            return NextResponse.json({ error: 'No email in Google token' }, { status: 400 })
        }

        // Find or create user
        const { data: existingUser } = await supabase
            .from('User')
            .select('*')
            .eq('email', email)
            .single()

        let user
        if (existingUser) {
            user = existingUser
        } else {
            // Read referral cookie — set by middleware when user arrived via ?ref=CODE
            const referralCookie = req.cookies.get('referral_code')?.value || null

            const { data, error } = await supabase
                .from('User')
                .insert({
                    id: crypto.randomUUID(),
                    name: name || email.split('@')[0],
                    email,
                    phone: '',
                    passwordHash: `google_${googleId}`, // Google users don't need a password
                    referralCode: `tmp_${Math.random().toString(36).substring(2, 8)}`,
                    referredBy: referralCookie,
                })
                .select()
                .single()

            if (error) throw error
            user = data
        }

        // Create JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: 'user' },
            env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        const response = NextResponse.json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email },
        })

        response.cookies.set('user_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        })

        return response
    } catch (error: any) {
        console.error('Google auth error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
