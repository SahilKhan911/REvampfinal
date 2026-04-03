import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'
import { sendWelcomeEmail } from '@/lib/email'
import { checkAndGrantAchievements } from '@/lib/achievements'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json()

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    // Check if user already exists
    const { data: existing } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists. Please log in.' }, { status: 409 })
    }

    // Generate temp referral code (finalized to REV-XXXX on admin approval)
    const referralCode = `tmp_${Math.random().toString(36).substring(2, 8)}`

    // Capture referral cookie
    const referredBy = req.cookies.get('referral_code')?.value || null
    const utmSource = req.cookies.get('utm_source')?.value || null
    const utmCampaign = req.cookies.get('utm_campaign')?.value || null

    // Create user
    const { data: user, error: insertError } = await supabase
      .from('User')
      .insert({
        id: crypto.randomUUID(),
        name,
        email,
        phone,
        passwordHash: password,
        referralCode,
        referredBy,
        utmSource,
        utmCampaign,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Signup insert error:', insertError)
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
      }
      throw insertError
    }

    // Create JWT and set cookie
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: 'user' },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Fire welcome email + achievement check (non-blocking)
    sendWelcomeEmail(user.email, user.name).catch(() => {})
    checkAndGrantAchievements(user.id).catch(() => {})

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
    console.error('Signup error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
