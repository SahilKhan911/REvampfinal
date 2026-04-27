import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const code = new URL(req.url).searchParams.get('code')
  if (!code) return NextResponse.json({ valid: false })

  // Reject temp codes — they haven't been confirmed by payment yet
  if (code.startsWith('tmp_')) return NextResponse.json({ valid: false })

  const { data: user } = await supabase
    .from('User')
    .select('name')
    .eq('referralCode', code)
    .single()

  if (!user) return NextResponse.json({ valid: false })
  return NextResponse.json({ valid: true, name: user.name })
}
