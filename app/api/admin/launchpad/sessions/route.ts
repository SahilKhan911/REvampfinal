import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { adminAuth, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  const { data, error } = await supabase
    .from('LaunchpadSession')
    .select('*')
    .order('week', { ascending: true })
    .order('day', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  const body = await req.json()
  const { week, day, title, subtitle, topics, homework, homeworkType, resourceLinks, sessionDate, joinLink, recordingUrl, isVisible, isLive } = body

  if (!week || !day || !title) {
    return NextResponse.json({ error: 'week, day, and title are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('LaunchpadSession')
    .insert({
      id: crypto.randomUUID(),
      week: Number(week),
      day: Number(day),
      title,
      subtitle: subtitle || null,
      topics: Array.isArray(topics) ? topics : [],
      homework: homework || null,
      homeworkType: homeworkType || null,
      resourceLinks: Array.isArray(resourceLinks) ? resourceLinks : [],
      sessionDate: sessionDate || null,
      joinLink: joinLink || null,
      recordingUrl: recordingUrl || null,
      isVisible: isVisible !== false,
      isLive: isLive === true,
      createdAt: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  const body = await req.json()
  const { id, ...fields } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const update: any = {}
  if (fields.title !== undefined) update.title = fields.title
  if (fields.subtitle !== undefined) update.subtitle = fields.subtitle || null
  if (fields.topics !== undefined) update.topics = Array.isArray(fields.topics) ? fields.topics : []
  if (fields.homework !== undefined) update.homework = fields.homework || null
  if (fields.sessionDate !== undefined) update.sessionDate = fields.sessionDate || null
  if (fields.joinLink !== undefined) update.joinLink = fields.joinLink || null
  if (fields.recordingUrl !== undefined) update.recordingUrl = fields.recordingUrl || null
  if (fields.isVisible !== undefined) update.isVisible = fields.isVisible
  if (fields.isLive !== undefined) update.isLive = fields.isLive
  if (fields.homeworkType !== undefined) update.homeworkType = fields.homeworkType || null
  if (fields.resourceLinks !== undefined) update.resourceLinks = Array.isArray(fields.resourceLinks) ? fields.resourceLinks : []

  const { data, error } = await supabase
    .from('LaunchpadSession')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await supabase.from('LaunchpadSession').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
