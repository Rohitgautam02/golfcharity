import { createAPIClient } from '@/lib/supabase-server'
import { addScore, getUserScores } from '@/lib/score-utils'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createAPIClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const scores = await getUserScores(supabase, user.id)
    return NextResponse.json(scores)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  const supabase = createAPIClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const { score, date } = await req.json()
    
    if (!score || !date) {
      return NextResponse.json({ error: 'Score and date are required' }, { status: 400 })
    }

    if (score < 1 || score > 45) {
      return NextResponse.json({ error: 'Score must be between 1 and 45' }, { status: 400 })
    }

    const newScore = await addScore(supabase, user.id, score, date)
    return NextResponse.json(newScore)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
