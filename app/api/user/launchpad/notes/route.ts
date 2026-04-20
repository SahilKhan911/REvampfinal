import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get('user_token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let decoded: any
  try { decoded = jwt.verify(token, env.JWT_SECRET) } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const { sessionId, note } = await req.json()
  if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 })

  const userId = decoded.userId

  const { data: existing } = await supabase
    .from('LaunchpadProfile')
    .select('id, sessionNotes')
    .eq('userId', userId)
    .single()

  const currentNotes = (existing?.sessionNotes as Record<string, string>) || {}
  const updatedNotes = { ...currentNotes, [sessionId]: note ?? '' }

  if (existing) {
    await supabase
      .from('LaunchpadProfile')
      .update({ sessionNotes: updatedNotes })
      .eq('userId', userId)
  } else {
    await supabase
      .from('LaunchpadProfile')
      .insert({ id: crypto.randomUUID(), userId, sessionNotes: updatedNotes, createdAt: new Date().toISOString() })
  }

  return NextResponse.json({ ok: true })
}
