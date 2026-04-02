import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/cohorts — returns all active cohorts
// GET /api/cohorts?slug=opensource — returns a single cohort with its bundles
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  try {
    if (slug) {
      // Single cohort with bundles
      const { data: cohort, error: cohortError } = await supabase
        .from('Cohort')
        .select('*')
        .eq('slug', slug)
        .eq('isActive', true)
        .single()

      if (cohortError || !cohort) {
        return NextResponse.json({ error: 'Cohort not found' }, { status: 404 })
      }

      const { data: bundles } = await supabase
        .from('Bundle')
        .select('*')
        .eq('cohortSlug', slug)
        .eq('isActive', true)
        .order('isPrimary', { ascending: false })

      return NextResponse.json({ ...cohort, bundles: bundles || [] })
    }

    // All cohorts (with bundles for count)
    const { data: cohorts, error } = await supabase
      .from('Cohort')
      .select('*, bundles:Bundle(id, slug, name)')
      .eq('isActive', true)
      .order('createdAt', { ascending: true })

    if (error) throw error

    return NextResponse.json(cohorts || [])
  } catch (error) {
    console.error('Cohorts fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
