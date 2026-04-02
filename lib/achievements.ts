import { supabase } from './supabase'

// XP thresholds for each level
const LEVEL_THRESHOLDS = [
  { level: 1, name: 'Newbie', minXp: 0 },
  { level: 2, name: 'Learner', minXp: 51 },
  { level: 3, name: 'Explorer', minXp: 151 },
  { level: 4, name: 'Builder', minXp: 301 },
  { level: 5, name: 'Legend', minXp: 501 },
]

export function calculateLevel(xp: number): { level: number; name: string; currentXp: number; nextLevelXp: number } {
  let current = LEVEL_THRESHOLDS[0]
  for (const t of LEVEL_THRESHOLDS) {
    if (xp >= t.minXp) current = t
  }
  const nextLevel = LEVEL_THRESHOLDS.find(t => t.level === current.level + 1)
  return {
    level: current.level,
    name: current.name,
    currentXp: xp,
    nextLevelXp: nextLevel?.minXp || current.minXp,
  }
}

export function getLevelName(level: number): string {
  return LEVEL_THRESHOLDS.find(t => t.level === level)?.name || 'Newbie'
}

/**
 * Check and grant achievements for a user. Call this fire-and-forget from API routes.
 * e.g. checkAndGrantAchievements(userId).catch(() => {})
 */
export async function checkAndGrantAchievements(userId: string): Promise<void> {
  try {
    // Load all data we need in parallel
    const [
      { data: user },
      { data: achievements },
      { data: existingUnlocks },
      { data: enrollments },
      { data: subscriptions },
      { data: userCount },
    ] = await Promise.all([
      supabase.from('User').select('*').eq('id', userId).single(),
      supabase.from('Achievement').select('*').eq('isActive', true),
      supabase.from('UserAchievement').select('achievementId').eq('userId', userId),
      supabase.from('Enrollment').select('id').eq('userId', userId),
      supabase.from('DomainSubscription').select('id').eq('userId', userId),
      supabase.from('User').select('id', { count: 'exact', head: true }),
    ])

    if (!user || !achievements) return

    const alreadyUnlocked = new Set((existingUnlocks || []).map((u: any) => u.achievementId))
    const newUnlocks: { achievementId: string; xp: number }[] = []

    for (const ach of achievements) {
      if (alreadyUnlocked.has(ach.id)) continue

      const condition = ach.condition as any
      if (!condition?.type) continue

      let earned = false

      switch (condition.type) {
        case 'profile_complete':
          earned = Boolean(user.name && user.email && user.phone && user.college && user.githubUrl)
          break

        case 'domains_followed':
          earned = (subscriptions || []).length >= (condition.count || 3)
          break

        case 'referrals':
          earned = (user.totalReferrals || 0) >= (condition.count || 1)
          break

        case 'enrollments':
          earned = (enrollments || []).length >= (condition.count || 1)
          break

        case 'founding_member':
          // Check if user is among first N signups
          const { count: totalUsers } = await supabase.from('User').select('id', { count: 'exact', head: true }).lt('createdAt', user.createdAt)
          earned = (totalUsers || 0) < (condition.count || 100)
          break

        case 'connections':
          const { count: connCount } = await supabase.from('Connection').select('id', { count: 'exact', head: true })
            .eq('status', 'ACCEPTED')
            .or(`fromUserId.eq.${userId},toUserId.eq.${userId}`)
          earned = (connCount || 0) >= (condition.count || 5)
          break

        case 'discussions':
          const { count: postCount } = await supabase.from('DiscussionPost').select('id', { count: 'exact', head: true }).eq('userId', userId)
          earned = (postCount || 0) >= (condition.count || 1)
          break
      }

      if (earned) {
        newUnlocks.push({ achievementId: ach.id, xp: ach.xpReward })
      }
    }

    if (newUnlocks.length === 0) return

    // Insert new unlocks
    const inserts = newUnlocks.map(u => ({
      userId,
      achievementId: u.achievementId,
    }))

    await supabase.from('UserAchievement').insert(inserts)

    // Update XP and level
    const totalNewXp = newUnlocks.reduce((sum, u) => sum + u.xp, 0)
    const newXp = (user.xp || 0) + totalNewXp
    const { level } = calculateLevel(newXp)

    await supabase.from('User').update({ xp: newXp, level }).eq('id', userId)
  } catch (error) {
    console.error('Achievement check error:', error)
  }
}
