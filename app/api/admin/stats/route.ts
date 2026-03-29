import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { adminAuth, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  const { searchParams } = new URL(req.url)
  const cohort = searchParams.get('cohort')

  try {
    // Get bundle IDs for the cohort filter if specified
    let bundleIds: string[] | null = null
    if (cohort) {
      const { data: cohortBundles } = await supabase
        .from('Bundle')
        .select('id')
        .eq('cohortSlug', cohort)

      bundleIds = cohortBundles?.map(b => b.id) || []
    }

    // Get paid orders stats (filtered by cohort if specified)
    let paidQuery = supabase
      .from('Order')
      .select('amount, bundleId')
      .eq('status', 'paid')

    if (bundleIds) {
      paidQuery = paidQuery.in('bundleId', bundleIds.length > 0 ? bundleIds : ['__none__'])
    }

    const { data: paidOrders } = await paidQuery

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

    // Get sales per bundle with names and cohort info
    const bundleSalesMap: Record<string, { count: number; name: string; cohortSlug: string }> = {}

    if (paidOrders) {
      // Get bundle details
      const uniqueBundleIds = Array.from(new Set(paidOrders.map(o => o.bundleId)))
      const { data: bundles } = await supabase
        .from('Bundle')
        .select('id, name, cohortSlug')
        .in('id', uniqueBundleIds.length > 0 ? uniqueBundleIds : ['__none__'])

      const bundleMap: Record<string, { name: string; cohortSlug: string }> = {}
      bundles?.forEach(b => {
        bundleMap[b.id] = { name: b.name, cohortSlug: b.cohortSlug }
      })

      paidOrders.forEach(o => {
        if (!bundleSalesMap[o.bundleId]) {
          bundleSalesMap[o.bundleId] = {
            count: 0,
            name: bundleMap[o.bundleId]?.name || o.bundleId,
            cohortSlug: bundleMap[o.bundleId]?.cohortSlug || ''
          }
        }
        bundleSalesMap[o.bundleId].count++
      })
    }

    const bundleSales = Object.entries(bundleSalesMap).map(([bundleId, info]) => ({
      bundleId,
      bundleName: info.name,
      cohortSlug: info.cohortSlug,
      _count: { id: info.count }
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
