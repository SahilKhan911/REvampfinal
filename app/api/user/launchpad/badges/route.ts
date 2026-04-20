import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

const BADGE_DEFS = [
  { id: 'showed_up',     label: 'Showed Up',       icon: 'celebration',    desc: 'Attended your first session' },
  { id: 'w1_complete',   label: 'W1 Complete',      icon: 'workspace_premium', desc: 'Attended all 5 Week 1 sessions' },
  { id: 'w2_complete',   label: 'W2 Complete',      icon: 'workspace_premium', desc: 'Attended all 5 Week 2 sessions' },
  { id: 'w3_complete',   label: 'W3 Complete',      icon: 'workspace_premium', desc: 'Attended all 5 Week 3 sessions' },
  { id: 'committed',     label: 'Committed',        icon: 'code',           desc: 'Submitted your first GitHub URL' },
  { id: 'builder',       label: 'Builder',          icon: 'construction',   desc: '5 homework submissions verified' },
  { id: 'deep_diver',    label: 'Deep Diver',       icon: 'scuba_diving',   desc: 'Attended all 4 domain deep-dive days (W3D1–W3D4)' },
  { id: 'streak_10',     label: 'Streak: 10',       icon: 'local_fire_department', desc: '10 consecutive sessions attended' },
  { id: 'hackathon',     label: 'Hackathon Shipped',icon: 'rocket_launch',  desc: 'Submitted a W4 project' },
  { id: 'certified',     label: 'Certified',        icon: 'verified',       desc: 'Certificate issued' },
]

export async function GET(req: NextRequest) {
  const token = req.cookies.get('user_token')?.value
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let decoded: any
  try { decoded = jwt.verify(token, env.JWT_SECRET) } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const userId = decoded.userId

  const [
    { data: attendances },
    { data: homeworkSubs },
    { data: sessions },
    { data: cert },
  ] = await Promise.all([
    supabase.from('LaunchpadAttendance').select('sessionId').eq('userId', userId),
    supabase.from('HomeworkSubmission').select('type, status, submittedAt').eq('userId', userId),
    supabase.from('LaunchpadSession').select('id, week, day').order('week').order('day'),
    supabase.from('LaunchpadCertificate').select('id').eq('userId', userId).limit(1),
  ])

  const attendedIds = new Set((attendances || []).map((a: any) => a.sessionId))
  const sessionMap: Record<string, {week: number, day: number}> = {}
  for (const s of (sessions || [])) sessionMap[s.id] = { week: s.week, day: s.day }

  // Count attended per week
  const attendedByWeek: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  const sessionsByWeek: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  for (const s of (sessions || [])) sessionsByWeek[s.week] = (sessionsByWeek[s.week] || 0) + 1
  for (const id of Array.from(attendedIds)) {
    const s = sessionMap[id]
    if (s) attendedByWeek[s.week] = (attendedByWeek[s.week] || 0) + 1
  }

  // Streak
  const pastSessions = (sessions || [])
    .filter((s: any) => attendedIds.has(s.id) !== undefined)
    .sort((a: any, b: any) => (b.week * 10 + b.day) - (a.week * 10 + a.day))
  let streak = 0
  for (const s of pastSessions) {
    if (attendedIds.has(s.id)) streak++
    else break
  }

  // Deep dive days: W3D1, W3D2, W3D3, W3D4
  const deepDiveDays = (sessions || []).filter((s: any) => s.week === 3 && s.day <= 4)
  const deepDiveAttended = deepDiveDays.filter((s: any) => attendedIds.has(s.id)).length

  const verifiedCount = (homeworkSubs || []).filter((h: any) => h.status === 'verified').length
  const hasGithubSub = (homeworkSubs || []).some((h: any) => h.type === 'github_url')

  const earned: Record<string, boolean> = {
    showed_up:   attendedIds.size >= 1,
    w1_complete: attendedByWeek[1] >= (sessionsByWeek[1] || 5),
    w2_complete: attendedByWeek[2] >= (sessionsByWeek[2] || 5),
    w3_complete: attendedByWeek[3] >= (sessionsByWeek[3] || 5),
    committed:   hasGithubSub,
    builder:     verifiedCount >= 5,
    deep_diver:  deepDiveAttended >= 4,
    streak_10:   streak >= 10,
    hackathon:   false, // set when team submits project (Phase 3)
    certified:   (cert?.length ?? 0) > 0,
  }

  const result = BADGE_DEFS.map(b => ({ ...b, earned: earned[b.id] || false }))
  return NextResponse.json(result)
}
