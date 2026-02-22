import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { adminAuth, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  try {
    const { data: users, error } = await supabase
      .from('User')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) throw error

    // Get order counts per user
    const { data: orders } = await supabase
      .from('Order')
      .select('userId')
      .eq('status', 'paid')

    const orderCounts: Record<string, number> = {}
    orders?.forEach(o => {
      orderCounts[o.userId] = (orderCounts[o.userId] || 0) + 1
    })

    const usersWithCounts = (users || []).map(user => ({
      ...user,
      _count: { orders: orderCounts[user.id] || 0 }
    }))

    return NextResponse.json(usersWithCounts)
  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
