import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

function getUserId(req: NextRequest): string | null {
  const token = req.cookies.get('user_token')?.value
  if (!token) return null
  try { return (jwt.verify(token, env.JWT_SECRET) as any).userId }
  catch { return null }
}

// GET — list peers enrolled in a workshop
export async function GET(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const bundleId = searchParams.get('bundleId')
  if (!bundleId) return NextResponse.json({ error: 'bundleId required' }, { status: 400 })

  // Verify caller is enrolled
  const { data: myEnrollment } = await supabase
    .from('Enrollment')
    .select('id')
    .eq('userId', userId)
    .eq('bundleId', bundleId)
    .single()

  if (!myEnrollment) {
    return NextResponse.json({ error: 'You must be enrolled to see peers' }, { status: 403 })
  }

  // Get all enrolled users (public profiles only)
  const { data: enrollments } = await supabase
    .from('Enrollment')
    .select('userId, user:User(id, name, college, githubUrl, level, xp, isProfilePublic)')
    .eq('bundleId', bundleId)
    .neq('userId', userId)

  const peers = (enrollments || [])
    .filter((e: any) => e.user?.isProfilePublic !== false)
    .map((e: any) => e.user)

  // Check connection status with each peer
  const { data: connections } = await supabase
    .from('Connection')
    .select('id, fromUserId, toUserId, status')
    .or(`fromUserId.eq.${userId},toUserId.eq.${userId}`)

  const peersWithStatus = peers.map((peer: any) => {
    const conn = (connections || []).find((c: any) =>
      (c.fromUserId === userId && c.toUserId === peer.id) ||
      (c.fromUserId === peer.id && c.toUserId === userId)
    )
    return {
      ...peer,
      connectionStatus: conn?.status || null,
      connectionId: conn?.id || null,
    }
  })

  return NextResponse.json({ peers: peersWithStatus, total: peers.length })
}
