import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { adminAuth, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  try {
    const { data: bundles, error } = await supabase
      .from('Bundle')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) throw error
    return NextResponse.json(bundles || [])
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  try {
    const { id, eventPrice, isActive, isDiscounted } = await req.json()

    const updateData: any = {}
    if (eventPrice !== undefined) updateData.eventPrice = eventPrice
    if (isActive !== undefined) updateData.isActive = isActive
    if (isDiscounted !== undefined) updateData.isDiscounted = isDiscounted

    const { data: bundle, error } = await supabase
      .from('Bundle')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(bundle)
  } catch (error) {
    console.error('Bundle update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
