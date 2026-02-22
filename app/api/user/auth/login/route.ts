import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
        }

        // Find user by email
        const { data: user, error } = await supabase
            .from('User')
            .select('*')
            .eq('email', email)
            .single()

        if (error || !user) {
            return NextResponse.json({ error: 'No account found with this email. Please register for a workshop first.' }, { status: 404 })
        }

        // Check password
        if (user.passwordHash !== password) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
        }

        // Create JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: 'user' },
            env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })

        response.cookies.set('user_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        })

        return response
    } catch (error: any) {
        console.error('User login error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
