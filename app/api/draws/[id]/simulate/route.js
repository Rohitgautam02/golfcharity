import { createClient } from '@supabase/supabase-js'
import { generateRandomNumbers, generateAlgorithmicDraw, matchUserScores, determineMatchType, calculatePrizePools, splitPrizeAmongWinners } from '@/lib/draw-engine'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req, { params }) {
  const { id: drawId } = params

  try {
    // 1. Get Draw Config
    const { data: draw, error: drawError } = await supabaseAdmin
      .from('draws')
      .select('*')
      .eq('id', drawId)
      .single()
    
    if (drawError || !draw) throw new Error('Draw not found')

    // 2. Get all active subscribers and their latest scores
    const { data: activeProfiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, subscription_status')
      .eq('subscription_status', 'active')

    if (profilesError) throw profilesError

    const activeUserIds = activeProfiles.map(p => p.id)

    const { data: allScores, error: scoresError } = await supabaseAdmin
      .from('golf_scores')
      .select('user_id, score')
      .in('user_id', activeUserIds)

    if (scoresError) throw scoresError

    // 3. Run Draw Engine
    let winningNumbers
    if (draw.draw_type === 'algorithmic') {
      const flatScores = allScores.map(s => s.score)
      winningNumbers = generateAlgorithmicDraw(flatScores)
    } else {
      winningNumbers = generateRandomNumbers()
    }

    // 4. Calculate total prize pool for this month
    // In a real app, we'd sum valid subscription payments for the month
    // For now, we'll estimate: active users * price * poolPercent
    const totalPool = activeProfiles.length * 9.99 * 0.50 
    
    // Check for rollover from previous month
    const { data: prevDraws } = await supabaseAdmin
      .from('draws')
      .select('pool_5match')
      .eq('jackpot_rolled_over', true)
      .order('created_at', { ascending: false })
      .limit(1)
    
    const rolloverAmount = prevDraws?.[0]?.pool_5match || 0
    const prizePools = calculatePrizePools(totalPool, rolloverAmount > 0, rolloverAmount)

    // 5. Match entries and count winners
    const entries = []
    const userMatchedCounts = {}

    // Group scores by user
    const userScoresMap = allScores.reduce((acc, curr) => {
      if (!acc[curr.user_id]) acc[curr.user_id] = []
      acc[curr.user_id].push(curr.score)
      return acc
    }, {})

    let winners3 = 0, winners4 = 0, winners5 = 0

    for (const userId of activeUserIds) {
      const userScores = userScoresMap[userId] || []
      const matchCount = matchUserScores(userScores, winningNumbers)
      const matchType = determineMatchType(matchCount)

      if (matchType === '3-match') winners3++
      if (matchType === '4-match') winners4++
      if (matchType === '5-match') winners5++

      entries.push({
        draw_id: drawId,
        user_id: userId,
        scores_snapshot: userScores,
        matched_count: matchCount,
        is_winner: matchCount >= 3
      })
    }

    // 6. Save Simulation Data
    // Delete existing entries for this draw if re-running
    await supabaseAdmin.from('draw_entries').delete().eq('draw_id', drawId)
    await supabaseAdmin.from('draw_entries').insert(entries)

    const prizePer3 = splitPrizeAmongWinners(prizePools['3-match'], winners3)
    const prizePer4 = splitPrizeAmongWinners(prizePools['4-match'], winners4)
    const prizePer5 = splitPrizeAmongWinners(prizePools['5-match'], winners5)

    await supabaseAdmin
      .from('draws')
      .update({
        winning_numbers: winningNumbers,
        jackpot_amount: prizePools['5-match'],
        pool_3match: prizePools['3-match'],
        pool_4match: prizePools['4-match'],
        pool_5match: prizePools['5-match'],
        status: 'simulated'
      })
      .eq('id', drawId)

    return NextResponse.json({
      success: true,
      summary: {
        winningNumbers,
        totalEntries: activeProfiles.length,
        winners: {
          '3-match': winners3,
          '4-match': winners4,
          '5-match': winners5
        },
        prizes: {
          '3-match': prizePer3,
          '4-match': prizePer4,
          '5-match': prizePer5
        }
      }
    })
  } catch (error) {
    console.error('Simulation Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
