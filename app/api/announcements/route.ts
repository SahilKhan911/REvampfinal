import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  const now = new Date().toISOString()
  const { data } = await supabase
    .from('Announcement')
    .select('*')
    .eq('isActive', true)
    .or(`expiresAt.is.null,expiresAt.gt.${now}`)
    .order('sortOrder', { ascending: true })

  return NextResponse.json(data || [])
}
