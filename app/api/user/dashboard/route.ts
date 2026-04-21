import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'
import { checkAndGrantAchievements, calculateLevel } from '@/lib/achievements'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('user_token')?.value
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    let decoded: any
    try { decoded = jwt.verify(token, env.JWT_SECRET) } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { data: user, error: userErr } = await supabase
      .from('User').select('*').eq('id', decoded.userId).single()
    if (userErr || !user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    checkAndGrantAchievements(user.id).catch(() => {})

    // ── Step 1: fetch flat rows (no FK joins) ──────────────────────────────
    const [
      { data: orderRows },
      { data: enrollmentRows },
      { data: subRows },
      { data: referredUsers },
      { data: referralPayouts },
      { data: userAchievements },
      { data: allAchievements },
      { data: redemptions },
    ] = await Promise.all([
      supabase.from('Order').select('*').eq('userId', user.id).order('createdAt', { ascending: false }),
      supabase.from('Enrollment').select('*').eq('userId', user.id).order('enrolledAt', { ascending: false }),
      supabase.from('DomainSubscription').select('*').eq('userId', user.id).order('createdAt', { ascending: false }),
      supabase.from('User').select('id, name, email, createdAt').eq('referredBy', user.referralCode),
      supabase.from('ReferralPayout').select('*').eq('userId', user.id).order('paidAt', { ascending: false }),
      supabase.from('UserAchievement').select('*, achievement:Achievement(*)').eq('userId', user.id).order('unlockedAt', { ascending: false }),
      supabase.from('Achievement').select('*').eq('isActive', true),
      supabase.from('RedemptionRequest').select('*').eq('userId', user.id).order('createdAt', { ascending: false }),
    ])

    // ── Step 2: collect IDs needed for lookups ─────────────────────────────
    const bundleIdSet = new Set<string>()
    ;(orderRows || []).forEach((o: any) => o.bundleId && bundleIdSet.add(o.bundleId))
    ;(enrollmentRows || []).forEach((e: any) => e.bundleId && bundleIdSet.add(e.bundleId))
    const bundleIds = Array.from(bundleIdSet)


    // ── Step 3: fetch bundles + all cohorts in parallel (primary key lookups) ─
    const [{ data: bundleRows }, { data: cohortRows }] = await Promise.all([
      bundleIds.length > 0
        ? supabase.from('Bundle').select('id, name, slug, cohortSlug, duration, startDate, eventPrice, originalPrice, status, isActive').in('id', bundleIds)
        : Promise.resolve({ data: [] as any[] }),
      supabase.from('Cohort').select('id, slug, name, emoji, accentHex, description'),
    ])

    // ── Step 4: build lookup maps ──────────────────────────────────────────
    const bundleMap: Record<string, any> = Object.fromEntries((bundleRows || []).map((b: any) => [b.id, b]))
    const cohortBySlug: Record<string, any> = Object.fromEntries((cohortRows || []).map((c: any) => [c.slug, c]))
    const cohortById: Record<string, any> = Object.fromEntries((cohortRows || []).map((c: any) => [c.id, c]))

    // ── Step 5: enrich rows ────────────────────────────────────────────────
    const enrich = (bundleId: string) => {
      const b = bundleMap[bundleId]
      if (!b) return null
      return { ...b, cohort: cohortBySlug[b.cohortSlug] || null }
    }

    const orders = (orderRows || []).map((o: any) => ({ ...o, bundle: enrich(o.bundleId) }))
    const enrollments = (enrollmentRows || []).map((e: any) => ({ ...e, bundle: enrich(e.bundleId) }))
    const subscriptions = (subRows || []).map((s: any) => ({ ...s, cohort: cohortById[s.cohortId] || null }))

    const totalEarnings = (referralPayouts || []).reduce((sum: number, p: any) => sum + (p.amountPaid || 0), 0)
    const totalRedeemed = (redemptions || []).filter((r: any) => r.status !== 'REJECTED').reduce((sum: number, r: any) => sum + (r.amount || 0), 0)
    const levelInfo = calculateLevel(user.xp || 0)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        college: user.college,
        graduationYear: user.graduationYear,
        skills: user.skills,
        linkedinUrl: user.linkedinUrl,
        githubUrl: user.githubUrl,
        twitterUrl: user.twitterUrl,
        isProfilePublic: user.isProfilePublic,
        xp: user.xp || 0,
        level: levelInfo.level,
        levelName: levelInfo.name,
        nextLevelXp: levelInfo.nextLevelXp,
        referralCode: user.referralCode,
        totalReferrals: user.totalReferrals || 0,
        createdAt: user.createdAt,
      },
      orders,
      enrollments,
      subscriptions,
      referredUsers: referredUsers || [],
      referralPayouts: referralPayouts || [],
      redemptions: redemptions || [],
      totalEarnings,
      totalRedeemed,
      availableBalance: totalEarnings - totalRedeemed,
      achievements: {
        unlocked: (userAchievements || []).map((ua: any) => ({
          ...ua.achievement,
          unlockedAt: ua.unlockedAt,
        })),
        all: allAchievements || [],
      },
    })
  } catch (error: any) {
    console.error('Dashboard data error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
