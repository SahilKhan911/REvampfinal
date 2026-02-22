import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { adminAuth, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  try {
    // Get paid orders stats
    const { data: paidOrders } = await supabase
      .from('Order')
      .select('amount')
      .eq('status', 'paid')

    const revenue = paidOrders?.reduce((sum, o) => sum + o.amount, 0) || 0
    const sales = paidOrders?.length || 0

    // Get total users
    const { count: totalUsers } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true })

    // Get referral-driven users
    const { count: referralSales } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true })
      .not('referredBy', 'is', null)

    // Get sales per bundle
    const { data: allPaidOrders } = await supabase
      .from('Order')
      .select('bundleId')
      .eq('status', 'paid')

    const bundleSalesMap: Record<string, number> = {}
    allPaidOrders?.forEach(o => {
      bundleSalesMap[o.bundleId] = (bundleSalesMap[o.bundleId] || 0) + 1
    })
    const bundleSales = Object.entries(bundleSalesMap).map(([bundleId, count]) => ({
      bundleId,
      _count: { id: count }
    }))

    return NextResponse.json({
      revenue,
      sales,
      users: totalUsers || 0,
      referralSales: referralSales || 0,
      bundleSales,
    })
  } catch (error) {
    console.error('Stats fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
