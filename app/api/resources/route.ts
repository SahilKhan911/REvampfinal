import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') // CHEATSHEET, ROADMAP, etc.
  const domain = searchParams.get('domain') // cohort slug

  let query = supabase
    .from('Resource')
    .select('*')
    .eq('isActive', true)
    .eq('isApproved', true)
    .order('sortOrder', { ascending: true })

  if (type) query = query.eq('type', type)
  if (domain) query = query.eq('cohortSlug', domain)

  const { data } = await query
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const { resourceId } = await req.json()
  if (!resourceId) return NextResponse.json({ error: 'resourceId required' }, { status: 400 })

  // Increment download count
  try {
    const { data: res } = await supabase.from('Resource').select('downloadCount').eq('id', resourceId).single()
    if (res) {
      await supabase.from('Resource').update({ downloadCount: (res.downloadCount || 0) + 1 }).eq('id', resourceId)
    }
  } catch {}

  // Get the resource URL
  const { data: resource } = await supabase.from('Resource').select('fileUrl').eq('id', resourceId).single()
  if (!resource) return NextResponse.json({ error: 'Resource not found' }, { status: 404 })

  return NextResponse.json({ url: resource.fileUrl })
}
