import { createAPIClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req, { params }) {
  const { id: winnerId } = params
  const supabase = createAPIClient()
  
  // Admin check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'admin') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const { status } = await req.json() // 'approved' | 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('winners')
      .update({
        verification_status: status,
        verified_at: status === 'approved' ? new Date().toISOString() : null
      })
      .eq('id', winnerId)
      .select()
      .single()

    if (error) throw error
    
    // Notify winner via email (Mock logic)
    // if (status === 'approved') sendWinnerApprovedEmail(...)

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
