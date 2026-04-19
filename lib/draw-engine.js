/**
 * Core Draw Engine Logic
 */

export function generateRandomNumbers(count = 5, min = 1, max = 45) {
  const numbers = new Set()
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * (max - min + 1)) + min)
  }
  return [...numbers].sort((a, b) => a - b)
}

export function generateAlgorithmicDraw(allUserScores) {
  /**
   * allUserScores: flat array of all scores from all active users in the draw period
   * Find the 5 most frequently occurring scores
   */
  const freq = {}
  allUserScores.forEach(s => {
    freq[s] = (freq[s] || 0) + 1
  })

  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1] || Math.random() - 0.5)
  
  return sorted.slice(0, 5)
    .map(([score]) => parseInt(score))
    .sort((a, b) => a - b)
}

export function matchUserScores(userScores, winningNumbers) {
  /**
   * userScores: array of integers (snapshot from user's entries)
   * winningNumbers: array of 5 integers (the draw result)
   */
  const winSet = new Set(winningNumbers)
  return userScores.filter(s => winSet.has(s)).length
}

export function determineMatchType(matchCount) {
  if (matchCount >= 5) return '5-match'
  if (matchCount >= 4) return '4-match'
  if (matchCount >= 3) return '3-match'
  return null
}

export function calculatePrizePools(totalPoolAmount, hasJackpotRollover = false, rolloverAmount = 0) {
  /**
   * totalPoolAmount: 50% of the total subscriptions for the month
   */
  const jackpotPool = (totalPoolAmount * 0.40) + (hasJackpotRollover ? rolloverAmount : 0)
  
  return {
    '5-match': jackpotPool,
    '4-match': totalPoolAmount * 0.35,
    '3-match': totalPoolAmount * 0.25,
  }
}

export function splitPrizeAmongWinners(poolAmount, winnerCount) {
  if (winnerCount === 0) return 0
  return parseFloat((poolAmount / winnerCount).toFixed(2))
}
