import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data } = await supabase
    .from('User')
    .select('id, name, totalReferrals, avatarUrl')
    .gt('totalReferrals', 0)
    .order('totalReferrals', { ascending: false })
    .limit(10)

  // Only expose first name + last initial for privacy
  const leaders = (data || []).map((u: any, i: number) => ({
    rank: i + 1,
    name: u.name?.split(' ').length > 1
      ? `${u.name.split(' ')[0]} ${u.name.split(' ').slice(-1)[0][0]}.`
      : u.name,
    referrals: u.totalReferrals,
    avatarUrl: u.avatarUrl,
  }))

  return NextResponse.json(leaders)
}
