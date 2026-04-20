import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { adminAuth, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// GET: all submissions, optionally filtered by sessionId
export async function GET(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  const sessionId = req.nextUrl.searchParams.get('sessionId')
  let query = supabase
    .from('HomeworkSubmission')
    .select('*, user:User(id, name, email)')
    .order('submittedAt', { ascending: false })

  if (sessionId) query = query.eq('sessionId', sessionId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

// PATCH: update submission status (seen | verified)
export async function PATCH(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  const { id, status } = await req.json()
  if (!id || !status) return NextResponse.json({ error: 'id and status required' }, { status: 400 })

  const update: any = { status }
  if (status === 'verified') update.verifiedAt = new Date().toISOString()

  const { data, error } = await supabase
    .from('HomeworkSubmission')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
