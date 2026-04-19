import { createClient } from '@supabase/supabase-js'
import { determineMatchType, splitPrizeAmongWinners } from '@/lib/draw-engine'
import { NextResponse } from 'next/server'
// import { Resend } from 'resend' // Assuming Resend is set up

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req, { params }) {
  const { id: drawId } = params

  try {
    const { data: draw } = await supabaseAdmin
      .from('draws')
      .select('*')
      .eq('id', drawId)
      .single()

    if (!draw || draw.status !== 'simulated') {
      return new NextResponse('Draw must be simulated first', { status: 400 })
    }

    // 1. Get winners from entries
    const { data: winningEntries } = await supabaseAdmin
      .from('draw_entries')
      .select('*, profiles(full_name, email)')
      .eq('draw_id', drawId)
      .gt('matched_count', 2)

    // 2. Calculate prize per tier
    const winnersCount = { 3: 0, 4: 0, 5: 0 }
    winningEntries.forEach(e => {
       if (e.matched_count >= 5) winnersCount[5]++
       else if (e.matched_count === 4) winnersCount[4]++
       else if (e.matched_count === 3) winnersCount[3]++
    })

    const prizePerTier = {
      '5-match': splitPrizeAmongWinners(draw.pool_5match, winnersCount[5]),
      '4-match': splitPrizeAmongWinners(draw.pool_4match, winnersCount[4]),
      '3-match': splitPrizeAmongWinners(draw.pool_3match, winnersCount[3]),
    }

    // 3. Create winners records
    const winnersRecords = winningEntries.map(e => {
      const matchType = determineMatchType(e.matched_count)
      return {
        draw_id: drawId,
        user_id: e.user_id,
        draw_entry_id: e.id,
        match_type: matchType,
        prize_amount: prizePerTier[matchType],
        verification_status: 'pending',
        payment_status: 'pending'
      }
    })

    if (winnersRecords.length > 0) {
      await supabaseAdmin.from('winners').insert(winnersRecords)
    }

    // 4. Finalize draw status
    await supabaseAdmin
      .from('draws')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        jackpot_rolled_over: winnersCount[5] === 0
      })
      .eq('id', drawId)

    // 5. Trigger notifications (Mock logic)
    // winningEntries.forEach(e => {
    //   sendEmail(e.profiles.email, ...)
    // })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Publish Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
