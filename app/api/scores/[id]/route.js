import { createAPIClient } from '@/lib/supabase-server'
import { updateScore } from '@/lib/score-utils'
import { NextResponse } from 'next/server'

export async function PUT(req, { params }) {
  const supabase = createAPIClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { id } = params
    const { score } = await req.json()

    if (score < 1 || score > 45) {
      return NextResponse.json({ error: 'Score must be between 1 and 45' }, { status: 400 })
    }

    const updated = await updateScore(supabase, user.id, id, score)
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const supabase = createAPIClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { id } = params
    const { error } = await supabase
      .from('golf_scores')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
