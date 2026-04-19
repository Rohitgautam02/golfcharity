export const PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    price: 9.99,
    stripePriceId: process.env.STRIPE_MONTHLY_PRICE_ID,
    prizePoolPercent: 0.50,   // 50% goes to prize pool
    charityMinPercent: 0.10,  // 10% min to charity
    platformPercent: 0.40,    // 40% platform
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly',
    price: 99.99,             // ~2 months free
    stripePriceId: process.env.STRIPE_YEARLY_PRICE_ID,
    prizePoolPercent: 0.50,
    charityMinPercent: 0.10,
    platformPercent: 0.40,
  }
}

export const PRIZE_POOL_SPLIT = {
  '5-match': 0.40,   // 40% jackpot (rolls over)
  '4-match': 0.35,
  '3-match': 0.25,
}

export const SCORE_RANGE = { min: 1, max: 45 }
export const MAX_SCORES = 5
export const DRAW_DAY = 28   // draws happen on 28th of each month
