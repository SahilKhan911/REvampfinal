import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('user_token')?.value
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  let decoded: any
  try { decoded = jwt.verify(token, env.JWT_SECRET) } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const userId = decoded.userId

  // Check for active launchpad enrollment
  const { data: allEnrollments } = await supabase
    .from('Enrollment')
    .select('id, enrolledAt, bundleId, bundle:Bundle(id, name, startDate, cohortSlug)')
    .eq('userId', userId)
    .eq('status', 'ACTIVE')

  const enrollment = (allEnrollments || []).find((e: any) => e.bundle?.cohortSlug === 'launchpad')
  if (!enrollment) return NextResponse.json({ error: 'Not enrolled in Launchpad' }, { status: 403 })

  const [
    { data: profile },
    { data: sessions },
    { data: myAttendances },
    { data: myHomework },
    { data: peerEnrollments },
  ] = await Promise.all([
    supabase.from('LaunchpadProfile').select('*').eq('userId', userId).single(),
    supabase.from('LaunchpadSession').select('*').eq('isVisible', true).order('week', { ascending: true }).order('day', { ascending: true }),
    supabase.from('LaunchpadAttendance').select('sessionId').eq('userId', userId),
    supabase.from('HomeworkSubmission').select('sessionId, type, content, status, submittedAt').eq('userId', userId),
    supabase.from('Enrollment')
      .select('userId, user:User(id, name, githubUrl, linkedinUrl)')
      .eq('bundleId', enrollment.bundleId)
      .eq('status', 'ACTIVE')
      .neq('userId', userId)
      .limit(8),
  ])

  const attendedIds = new Set((myAttendances || []).map((a: any) => a.sessionId))
  const homeworkMap = Object.fromEntries((myHomework || []).map((h: any) => [h.sessionId, h]))

  return NextResponse.json({
    profile: profile || null,
    sessions: (sessions || []).map((s: any) => ({
      ...s,
      attended: attendedIds.has(s.id),
      homework_submission: homeworkMap[s.id] || null,
    })),
    enrolledAt: enrollment.enrolledAt,
    bundle: enrollment.bundle,
    peers: (peerEnrollments || []).map((p: any) => p.user).filter(Boolean),
    totalAttended: attendedIds.size,
    totalSessions: (sessions || []).length,
  })
}
