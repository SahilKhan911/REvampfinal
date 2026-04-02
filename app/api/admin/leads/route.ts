import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { adminAuth, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  const { searchParams } = new URL(req.url)
  const step = searchParams.get('step') // DETAILS or PAYMENT
  const cohort = searchParams.get('cohort')

  try {
    let query = supabase
      .from('Lead')
      .select('*')
      .order('createdAt', { ascending: false })

    if (step) {
      query = query.eq('stepReached', step)
    }

    // If filtering by cohort, first get bundle IDs for that cohort
    if (cohort) {
      const { data: bundles } = await supabase
        .from('Bundle')
        .select('id')
        .eq('cohortSlug', cohort)
      const bundleIds = bundles?.map(b => b.id) || []
      if (bundleIds.length > 0) {
        query = query.in('bundleId', bundleIds)
      } else {
        return NextResponse.json([])
      }
    }

    const { data: leads, error } = await query.limit(200)

    if (error) throw error

    // Enrich leads with bundle info
    const bundleIds = Array.from(new Set((leads || []).filter(l => l.bundleId).map(l => l.bundleId)))
    let bundleMap: Record<string, any> = {}

    if (bundleIds.length > 0) {
      const { data: bundles } = await supabase
        .from('Bundle')
        .select('id, name, slug, cohortSlug')
        .in('id', bundleIds)

      bundles?.forEach(b => { bundleMap[b.id] = b })
    }

    const enrichedLeads = (leads || []).map(lead => ({
      ...lead,
      bundle: lead.bundleId ? bundleMap[lead.bundleId] || null : null,
    }))

    return NextResponse.json(enrichedLeads)
  } catch (error) {
    console.error('Leads fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
