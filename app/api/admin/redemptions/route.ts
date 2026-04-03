import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { adminAuth, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  try {
    const { data: redemptions, error } = await supabase
      .from('RedemptionRequest')
      .select('*, user:User(name, email, phone)')
      .order('createdAt', { ascending: false })

    if (error) throw error

    return NextResponse.json(redemptions || [])
  } catch (error) {
    console.error('Redemptions GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await adminAuth(req)
  if (!admin) return unauthorizedResponse()

  try {
    const { id, status, adminNote } = await req.json()

    if (!['PROCESSING', 'PAID', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const { error } = await supabase
      .from('RedemptionRequest')
      .update({
        status,
        adminNote,
        processedAt: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Redemption PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
