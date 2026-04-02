import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

function getUserId(req: NextRequest): string | null {
  const token = req.cookies.get('user_token')?.value
  if (!token) return null
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any
    return decoded.userId
  } catch { return null }
}

// GET — list user's subscribed domains
export async function GET(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: subs } = await supabase
    .from('DomainSubscription')
    .select('*, cohort:Cohort(id, slug, name, emoji, accentHex, description)')
    .eq('userId', userId)
    .order('createdAt', { ascending: false })

  return NextResponse.json({ subscriptions: subs || [] })
}

// POST — subscribe to a domain
export async function POST(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { cohortId } = await req.json()
  if (!cohortId) return NextResponse.json({ error: 'cohortId required' }, { status: 400 })

  // Check if already subscribed
  const { data: existing } = await supabase
    .from('DomainSubscription')
    .select('id')
    .eq('userId', userId)
    .eq('cohortId', cohortId)
    .single()

  if (existing) {
    return NextResponse.json({ message: 'Already subscribed', subscribed: true })
  }

  const { error } = await supabase
    .from('DomainSubscription')
    .insert({ userId, cohortId })

  if (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }

  return NextResponse.json({ success: true, subscribed: true })
}

// DELETE — unsubscribe
export async function DELETE(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { cohortId } = await req.json()
  if (!cohortId) return NextResponse.json({ error: 'cohortId required' }, { status: 400 })

  await supabase
    .from('DomainSubscription')
    .delete()
    .eq('userId', userId)
    .eq('cohortId', cohortId)

  return NextResponse.json({ success: true, subscribed: false })
}
