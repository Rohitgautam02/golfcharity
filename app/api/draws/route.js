import { createAPIClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const supabase = createAPIClient()
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '10')
  const page = parseInt(searchParams.get('page') || '1')
  const offset = (page - 1) * limit

  try {
    const { data, count, error } = await supabase
      .from('draws')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('draw_year', { ascending: false })
      .order('draw_month', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      draws: data,
      pagination: {
        total: count,
        page,
        limit
      }
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  const supabase = createAPIClient()
  
  // Verify Admin role
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
    const { month, year, type } = await req.json()
    
    const { data, error } = await supabase
      .from('draws')
      .insert({
        draw_month: month,
        draw_year: year,
        draw_type: type || 'random',
        winning_numbers: [], // To be populated by simulation
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
