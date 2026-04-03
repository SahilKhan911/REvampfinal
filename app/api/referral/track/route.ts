import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { referralCode } = await req.json()
    const ip = req.headers.get('x-forwarded-for') || '0.0.0.0'

    if (!referralCode) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 })
    }

    // Check if referral code is valid
    const { data: user } = await supabase
      .from('User')
      .select('id')
      .eq('referralCode', referralCode)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 })
    }

    // Capture the click
    await supabase
      .from('ReferralClick')
      .insert({
        id: crypto.randomUUID(),
        referralCode,
        visitorIp: ip,
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Referral click tracking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
