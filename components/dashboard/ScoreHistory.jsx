'use client'

import { format } from 'date-fns'
import { Trash2, Edit3, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function ScoreHistory({ scores, onScoreDeleted }) {
  const getScoreColor = (score) => {
    if (score < 15) return 'text-red-600 bg-red-50'
    if (score < 25) return 'text-amber-600 bg-amber-50'
    if (score < 35) return 'text-brand-green bg-brand-green/5'
    return 'text-brand-gold bg-brand-gold/5 border-brand-gold/20'
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this score?')) return

    try {
      const res = await fetch(`/api/scores/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success("Score removed")
      if (onScoreDeleted) onScoreDeleted(id)
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (scores.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
        <div className="bg-brand-cream w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-muted">
          <Calendar className="w-8 h-8" />
        </div>
        <h4 className="text-lg font-bold text-brand-charcoal mb-2">No scores entered yet</h4>
        <p className="text-brand-muted max-w-xs mx-auto">
          Start entering your rounds to get entered into the monthly prize draw.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode='popLayout'>
        {scores.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: i * 0.05 }}
            className="card-premium flex items-center justify-between p-4"
          >
            <div className="flex items-center space-x-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold border ${getScoreColor(item.score)}`}>
                {item.score}
              </div>
              <div>
                <p className="font-bold text-brand-charcoal">
                  {format(new Date(item.score_date), 'EEE do MMM')}
                </p>
                <p className="text-xs text-brand-muted uppercase tracking-widest mt-1">
                  Verified Entry
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-3 text-brand-muted hover:text-brand-red transition-colors hover:bg-red-50 rounded-xl"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {scores.length === 5 && (
        <p className="text-center text-xs text-amber-600 font-medium py-4">
          ⚠️ You have reached the 5-score limit. Adding a new one will replace the oldest entry.
        </p>
      )}
    </div>
  )
}
