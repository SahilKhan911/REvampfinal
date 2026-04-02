import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'
import { checkAndGrantAchievements } from '@/lib/achievements'

export const dynamic = 'force-dynamic'

export async function PUT(req: NextRequest) {
  const token = req.cookies.get('user_token')?.value
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  let decoded: any
  try {
    decoded = jwt.verify(token, env.JWT_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const body = await req.json()
  const { name, phone, password, college, graduationYear, skills, githubUrl, linkedinUrl, twitterUrl } = body

  const updates: any = {}
  if (name?.trim()) updates.name = name.trim()
  if (phone?.trim()) updates.phone = phone.trim()
  if (password && password.length >= 6) updates.passwordHash = password
  if (college !== undefined) updates.college = college?.trim() || null
  if (graduationYear !== undefined) updates.graduationYear = graduationYear ? parseInt(graduationYear) : null
  if (skills !== undefined) updates.skills = Array.isArray(skills) ? skills : null
  if (githubUrl !== undefined) updates.githubUrl = githubUrl?.trim() || null
  if (linkedinUrl !== undefined) updates.linkedinUrl = linkedinUrl?.trim() || null
  if (twitterUrl !== undefined) updates.twitterUrl = twitterUrl?.trim() || null

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { error } = await supabase
    .from('User')
    .update(updates)
    .eq('id', decoded.userId)

  if (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }

  // Check achievements in background (profile_complete badge)
  checkAndGrantAchievements(decoded.userId).catch(() => {})

  return NextResponse.json({ success: true, message: 'Profile updated successfully!' })
}
