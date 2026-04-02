import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/bundles?slug=gsoc-intensive — returns a single bundle with its cohort
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'slug parameter required' }, { status: 400 })
  }

  try {
    const { data: bundle, error } = await supabase
      .from('Bundle')
      .select('*')
      .eq('slug', slug)
      .eq('isActive', true)
      .single()

    if (error || !bundle) {
      return NextResponse.json({ error: 'Bundle not found' }, { status: 404 })
    }

    // Also fetch the parent cohort
    const { data: cohort } = await supabase
      .from('Cohort')
      .select('*')
      .eq('slug', bundle.cohortSlug)
      .single()

    return NextResponse.json({ ...bundle, cohort: cohort || null })
  } catch (error) {
    console.error('Bundle fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
