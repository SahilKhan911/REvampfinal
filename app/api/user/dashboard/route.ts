import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { env } from '@/lib/env'
import { checkAndGrantAchievements, calculateLevel, getLevelName } from '@/lib/achievements'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get('user_token')?.value
        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        let decoded: any
        try {
            decoded = jwt.verify(token, env.JWT_SECRET)
        } catch {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const { data: user, error: userErr } = await supabase
            .from('User')
            .select('*')
            .eq('id', decoded.userId)
            .single()

        if (userErr || !user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Fire achievement check in background (non-blocking)
        checkAndGrantAchievements(user.id).catch(() => {})

        // Parallel data fetches
        const [
            { data: orders },
            { data: enrollments },
            { data: subscriptions },
            { data: referredUsers },
            { data: referralPayouts },
            { data: userAchievements },
            { data: allAchievements },
            { data: redemptions },
        ] = await Promise.all([
            supabase.from('Order').select('*, bundle:Bundle(*, cohort:Cohort(name, slug, emoji, accentHex))').eq('userId', user.id).order('createdAt', { ascending: false }),
            supabase.from('Enrollment').select('*, bundle:Bundle(*, cohort:Cohort(name, slug, emoji, accentHex))').eq('userId', user.id).order('enrolledAt', { ascending: false }),
            supabase.from('DomainSubscription').select('*, cohort:Cohort(id, slug, name, emoji, accentHex, description)').eq('userId', user.id).order('createdAt', { ascending: false }),
            supabase.from('User').select('id, name, email, createdAt').eq('referredBy', user.referralCode),
            supabase.from('ReferralPayout').select('*').eq('userId', user.id).order('paidAt', { ascending: false }),
            supabase.from('UserAchievement').select('*, achievement:Achievement(*)').eq('userId', user.id).order('unlockedAt', { ascending: false }),
            supabase.from('Achievement').select('*').eq('isActive', true),
            supabase.from('RedemptionRequest').select('*').eq('userId', user.id).order('createdAt', { ascending: false }),
        ])

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
            orders: orders || [],
            enrollments: enrollments || [],
            subscriptions: subscriptions || [],
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
