import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('user_token')?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any

    const { data: user, error } = await supabase
      .from('User')
      .select('id, name, email, phone, referralCode')
      .eq('id', decoded.userId)
      .single()

    if (error || !user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
