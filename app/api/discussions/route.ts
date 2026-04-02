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

// GET — list discussion posts for a bundle
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const bundleId = searchParams.get('bundleId')
  if (!bundleId) return NextResponse.json({ error: 'bundleId required' }, { status: 400 })

  const { data: posts } = await supabase
    .from('DiscussionPost')
    .select('*, user:User(id, name, college, level, avatarUrl), replies:DiscussionPost(*, user:User(id, name, college, level, avatarUrl))')
    .eq('bundleId', bundleId)
    .is('parentId', null) // Only top-level posts
    .eq('isReported', false)
    .order('createdAt', { ascending: false })

  return NextResponse.json(posts || [])
}

// POST — create a discussion post or reply
export async function POST(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { bundleId, content, parentId } = await req.json()
  if (!bundleId || !content?.trim()) {
    return NextResponse.json({ error: 'bundleId and content required' }, { status: 400 })
  }

  // Verify user is enrolled in this bundle
  const { data: enrollment } = await supabase
    .from('Enrollment')
    .select('id')
    .eq('userId', userId)
    .eq('bundleId', bundleId)
    .single()

  if (!enrollment) {
    return NextResponse.json({ error: 'You must be enrolled to post' }, { status: 403 })
  }

  const { data: post, error } = await supabase
    .from('DiscussionPost')
    .insert({
      bundleId,
      userId,
      content: content.trim(),
      parentId: parentId || null,
    })
    .select('*, user:User(id, name, college, level, avatarUrl)')
    .single()

  if (error) {
    console.error('Discussion post error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }

  // Achievement check (contributor badge)
  checkAndGrantAchievements(userId).catch(() => {})

  return NextResponse.json(post)
}

// PUT — report a post { postId }
export async function PUT(req: NextRequest) {
  const userId = getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { postId } = await req.json()
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 })

  await supabase.from('DiscussionPost').update({ isReported: true }).eq('id', postId)

  return NextResponse.json({ success: true, message: 'Post reported. Admin will review.' })
}
