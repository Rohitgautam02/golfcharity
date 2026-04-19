'use client'

import { useState } from 'react'
import { Plus, Minus, Calendar, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function ScoreEntryForm({ onScoreAdded }) {
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState(25)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, date })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to add score')

      toast.success("Score added! You're entered in the draw.")
      setScore(25) // Reset
      if (onScoreAdded) onScoreAdded(data)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-premium">
      <h3 className="text-xl font-serif font-bold mb-6 flex items-center space-x-2">
        <PlusCircle className="w-5 h-5 text-brand-green" />
        <span>Add New Score</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Score Stepper */}
        <div>
          <label className="block text-sm font-medium text-brand-muted mb-4 uppercase tracking-wider">Score (1-45)</label>
          <div className="flex items-center justify-center space-x-8">
            <button
              type="button"
              onClick={() => setScore(Math.max(1, score - 1))}
              className="w-12 h-12 rounded-full border-2 border-brand-cream-dark flex items-center justify-center hover:bg-brand-cream transition-colors text-brand-charcoal"
            >
              <Minus className="w-6 h-6" />
            </button>
            <div className="text-6xl font-serif font-bold text-brand-green w-20 text-center">
              {score}
            </div>
            <button
              type="button"
              onClick={() => setScore(Math.min(45, score + 1))}
              className="w-12 h-12 rounded-full border-2 border-brand-cream-dark flex items-center justify-center hover:bg-brand-cream transition-colors text-brand-charcoal"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium text-brand-muted mb-2 uppercase tracking-wider">Date of Round</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted" />
            <input
              type="date"
              required
              max={new Date().toISOString().split('T')[0]}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 bg-brand-cream/30 focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none transition-all"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-4 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Submit Score</span>
            </>
          )}
        </button>

        <p className="text-xs text-center text-brand-muted">
          Reminder: We only keep your latest 5 scores.
        </p>
      </form>
    </div>
  )
}
