import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const token = req.cookies.get('user_token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let decoded: any
  try { decoded = jwt.verify(token, env.JWT_SECRET) } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const { track } = await req.json()
  const validTracks = ['web', 'ai', 'security', 'oss']
  if (!validTracks.includes(track)) {
    return NextResponse.json({ error: 'Invalid track' }, { status: 400 })
  }

  const userId = decoded.userId

  const { data: existing } = await supabase
    .from('LaunchpadProfile')
    .select('id')
    .eq('userId', userId)
    .single()

  if (existing) {
    await supabase.from('LaunchpadProfile').update({ trackDeclared: track }).eq('userId', userId)
  } else {
    await supabase.from('LaunchpadProfile').insert({
      id: crypto.randomUUID(),
      userId,
      trackDeclared: track,
      createdAt: new Date().toISOString(),
    })
  }

  return NextResponse.json({ ok: true, track })
}
