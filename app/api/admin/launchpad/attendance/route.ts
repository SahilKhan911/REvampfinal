import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { adminAuth, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// GET attendance for a session: ?sessionId=xxx
export async function GET(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  const sessionId = req.nextUrl.searchParams.get('sessionId')
  if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 })

  const { data, error } = await supabase
    .from('LaunchpadAttendance')
    .select('userId')
    .eq('sessionId', sessionId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ attendedUserIds: (data || []).map((r: any) => r.userId) })
}

// POST bulk set attendance: { sessionId, attendedUserIds: string[] }
// Upserts present users, removes absent users for this session
export async function POST(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  const { sessionId, attendedUserIds } = await req.json()
  if (!sessionId || !Array.isArray(attendedUserIds)) {
    return NextResponse.json({ error: 'sessionId and attendedUserIds[] required' }, { status: 400 })
  }

  // Delete existing attendance for this session
  await supabase.from('LaunchpadAttendance').delete().eq('sessionId', sessionId)

  // Re-insert for all attended users
  if (attendedUserIds.length > 0) {
    const rows = attendedUserIds.map((userId: string) => ({
      id: crypto.randomUUID(),
      userId,
      sessionId,
      markedAt: new Date().toISOString(),
    }))
    const { error } = await supabase.from('LaunchpadAttendance').insert(rows)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, count: attendedUserIds.length })
}
