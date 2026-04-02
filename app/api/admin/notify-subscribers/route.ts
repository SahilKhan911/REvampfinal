import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'
import { sendDomainUpdateEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

// POST — notify all subscribers of a domain about a new workshop
// Body: { cohortSlug, workshopName, workshopSlug }
export async function POST(req: NextRequest) {
  // Admin-only check
  const token = req.cookies.get('user_token')?.value
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  let decoded: any
  try {
    decoded = jwt.verify(token, env.JWT_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const { data: user } = await supabase
    .from('User')
    .select('role')
    .eq('id', decoded.userId)
    .single()

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const { cohortSlug, workshopName, workshopSlug } = await req.json()
  if (!cohortSlug || !workshopName) {
    return NextResponse.json({ error: 'cohortSlug and workshopName required' }, { status: 400 })
  }

  // Get cohort info
  const { data: cohort } = await supabase
    .from('Cohort')
    .select('id, name')
    .eq('slug', cohortSlug)
    .single()

  if (!cohort) return NextResponse.json({ error: 'Cohort not found' }, { status: 404 })

  // Get all subscribers
  const { data: subs } = await supabase
    .from('DomainSubscription')
    .select('user:User(id, name, email)')
    .eq('cohortId', cohort.id)

  if (!subs || subs.length === 0) {
    return NextResponse.json({ message: 'No subscribers to notify', sent: 0 })
  }

  // Send emails in batches
  let sent = 0
  let failed = 0
  for (const sub of subs) {
    const u = sub.user as any
    if (!u?.email) continue
    try {
      await sendDomainUpdateEmail(u.email, u.name, cohort.name, workshopName, workshopSlug || cohortSlug)
      sent++

      // Log communication
      try {
        await supabase.from('CommunicationLog').insert({
          userId: u.id,
          channel: 'EMAIL',
          messageType: 'DOMAIN_UPDATE',
          status: 'SENT',
        })
      } catch {}
    } catch (err: any) {
      failed++
      try {
        await supabase.from('CommunicationLog').insert({
          userId: u.id,
          channel: 'EMAIL',
          messageType: 'DOMAIN_UPDATE',
          status: 'FAILED',
          errorDetail: err?.message,
        })
      } catch {}
    }
  }

  return NextResponse.json({ success: true, sent, failed, total: subs.length })
}
