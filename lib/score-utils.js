export async function getUserScores(supabase, userId) {
  const { data, error } = await supabase
    .from('golf_scores')
    .select('*')
    .eq('user_id', userId)
    .order('score_date', { ascending: false })
  
  if (error) throw error
  return data || []
}

export async function addScore(supabase, userId, score, scoreDate) {
  // 1. Check for duplicate date
  const { data: existing } = await supabase
    .from('golf_scores')
    .select('id')
    .eq('user_id', userId)
    .eq('score_date', scoreDate)
    .maybeSingle()
  
  if (existing) {
    throw new Error('A score already exists for this date. Please edit the existing entry.')
  }

  // 2. Get current scores count
  const { data: currentScores } = await supabase
    .from('golf_scores')
    .select('id, score_date')
    .eq('user_id', userId)
    .order('score_date', { ascending: true })

  // 3. Roll scores if at limit (5)
  if (currentScores && currentScores.length >= 5) {
    const oldestScoreId = currentScores[0].id
    const { error: deleteError } = await supabase
      .from('golf_scores')
      .delete()
      .eq('id', oldestScoreId)
    
    if (deleteError) throw deleteError
  }

  // 4. Insert new score
  const { data, error } = await supabase
    .from('golf_scores')
    .insert({
      user_id: userId,
      score: parseInt(score),
      score_date: scoreDate
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateScore(supabase, userId, scoreId, newScore) {
  const { data, error } = await supabase
    .from('golf_scores')
    .update({ score: parseInt(newScore) })
    .eq('id', scoreId)
    .eq('user_id', userId) // Ownership check
    .select()
    .single()

  if (error) throw error
  return data
}
