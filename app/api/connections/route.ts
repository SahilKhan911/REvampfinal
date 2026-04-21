import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'
import { checkAndGrantAchievements } from '@/lib/achievements'

export const dynamic = 'force-dynamic'

function getUserId(req: NextRequest): string | null {
  const token = req.cookies.get('user_token')?.value
  if (!token) return null
  try { return (jwt.verify(token, env.JWT_SECRET) as any).userId }
  catch { return null }
}

// GET — list my connections
export async function GET(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const [{ data: sent }, { data: received }] = await Promise.all([
    supabase.from('Connection').select('*, toUser:User!Connection_toUserId_fkey(id, name, college, githubUrl, linkedinUrl, level, xp)').eq('fromUserId', userId),
    supabase.from('Connection').select('*, fromUser:User!Connection_fromUserId_fkey(id, name, college, githubUrl, linkedinUrl, level, xp)').eq('toUserId', userId),
  ])

  const accepted = [
    ...(sent || []).filter((c: any) => c.status === 'ACCEPTED').map((c: any) => ({ ...c, peer: c.toUser })),
    ...(received || []).filter((c: any) => c.status === 'ACCEPTED').map((c: any) => ({ ...c, peer: c.fromUser })),
  ]

  const pendingIncoming = (received || []).filter((c: any) => c.status === 'PENDING').map((c: any) => ({ ...c, peer: c.fromUser }))
  const pendingOutgoing = (sent || []).filter((c: any) => c.status === 'PENDING').map((c: any) => ({ ...c, peer: c.toUser }))

  return NextResponse.json({ accepted, pendingIncoming, pendingOutgoing })
}

// POST — send connection request { toUserId }
export async function POST(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { toUserId } = await req.json()
  if (!toUserId) return NextResponse.json({ error: 'toUserId required' }, { status: 400 })
  if (toUserId === userId) return NextResponse.json({ error: 'Cannot connect with yourself' }, { status: 400 })

  // Check existing
  const { data: existing } = await supabase
    .from('Connection')
    .select('id, status')
    .or(`and(fromUserId.eq.${userId},toUserId.eq.${toUserId}),and(fromUserId.eq.${toUserId},toUserId.eq.${userId})`)
    .single()

  if (existing) {
    return NextResponse.json({ message: `Connection already ${existing.status.toLowerCase()}` })
  }

  await supabase.from('Connection').insert({ id: crypto.randomUUID(), fromUserId: userId, toUserId })

  return NextResponse.json({ success: true, message: 'Connection request sent' })
}

// PUT — accept/decline { connectionId, action: ACCEPTED | DECLINED }
export async function PUT(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { connectionId, action } = await req.json()
  if (!connectionId || !['ACCEPTED', 'DECLINED'].includes(action)) {
    return NextResponse.json({ error: 'connectionId and valid action required' }, { status: 400 })
  }

  // Only the recipient can accept/decline
  const { error } = await supabase
    .from('Connection')
    .update({ status: action })
    .eq('id', connectionId)
    .eq('toUserId', userId)

  if (error) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })

  if (action === 'ACCEPTED') {
    checkAndGrantAchievements(userId).catch(() => {})
  }

  return NextResponse.json({ success: true })
}
