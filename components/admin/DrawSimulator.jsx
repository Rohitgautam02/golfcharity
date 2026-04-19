'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Check, AlertCircle, Trophy, Users, Calculator, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function DrawSimulator({ draw, onSimulateSuccess }) {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState(null)

  const handleSimulate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/draws/${draw.id}/simulate`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Simulation failed')
      
      setSummary(data.summary)
      toast.success("Simulation complete!")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!confirm('Are you ready to publish these results? This will notify winners and create winning records.')) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/draws/${draw.id}/publish`, { method: 'POST' })
      if (!res.ok) throw new Error('Publishing failed')
      
      toast.success("Results published successfully!")
      if (onSimulateSuccess) onSimulateSuccess()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-premium h-full">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-2xl font-serif font-bold text-gray-800">Draw Simulator</h3>
          <p className="text-sm text-brand-muted">Execute and review the monthly draw results.</p>
        </div>
        {!summary ? (
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="flex items-center space-x-2 bg-brand-charcoal text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Play className="w-5 h-5" />}
            <span>Run Simulation</span>
          </button>
        ) : (
          <div className="flex space-x-4">
             <button
              onClick={() => setSummary(null)}
              className="px-6 py-3 rounded-full font-bold border-2 border-gray-100 text-gray-600 hover:bg-gray-50 transition-all"
            >
              Reset
            </button>
            <button
              onClick={handlePublish}
              disabled={loading}
              className="flex items-center space-x-2 bg-brand-green text-white px-8 py-3 rounded-full font-bold hover:bg-brand-green-light transition-all shadow-xl shadow-brand-green/20"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
              <span>Publish Results</span>
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!summary ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 flex flex-col items-center justify-center border-4 border-dashed border-gray-50 rounded-3xl"
          >
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <Calculator className="w-12 h-12 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium italic">Click "Run Simulation" to generate winning numbers and match entries.</p>
          </motion.div>
        ) : (
          <motion.div 
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* Winning Numbers Reveal */}
            <div className="bg-brand-charcoal rounded-[2.5rem] p-10 text-center">
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500 mb-8">Generated Result</p>
              <div className="flex justify-center flex-wrap gap-6">
                {summary.winningNumbers.map((n, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    className="w-16 h-16 lg:w-20 lg:h-20 bg-brand-gold text-brand-charcoal rounded-full flex items-center justify-center text-3xl font-serif font-bold shadow-xl"
                  >
                    {n}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-brand-cream rounded-3xl border border-brand-cream-dark">
                <div className="flex items-center space-x-3 text-brand-blue mb-4">
                  <Users className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Total Entries</span>
                </div>
                <h4 className="text-4xl font-serif font-bold">{summary.totalEntries}</h4>
                <p className="text-xs text-brand-muted mt-2">Active subscribers matched</p>
              </div>

              <div className="p-6 bg-brand-cream rounded-3xl border border-brand-cream-dark">
                <div className="flex items-center space-x-3 text-brand-green mb-4">
                  <Trophy className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Total Winners</span>
                </div>
                <h4 className="text-4xl font-serif font-bold">
                  {summary.winners['3-match'] + summary.winners['4-match'] + summary.winners['5-match']}
                </h4>
                <p className="text-xs text-brand-muted mt-2">Across 3 tiers</p>
              </div>

              <div className="p-6 bg-brand-cream rounded-3xl border border-brand-cream-dark">
                <div className="flex items-center space-x-3 text-brand-gold mb-4">
                  <Check className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Status</span>
                </div>
                <h4 className="text-4xl font-serif font-bold">SIMULATED</h4>
                <p className="text-xs text-brand-muted mt-2 text-amber-600 font-bold">Awaiting publication</p>
              </div>
            </div>

            {/* Prize Table */}
            <div className="overflow-hidden rounded-3xl border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Match Tier</th>
                    <th className="px-6 py-4 text-center">Winners</th>
                    <th className="px-6 py-4 text-right">Prize Each</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {['5-match', '4-match', '3-match'].map((tier) => (
                    <tr key={tier}>
                      <td className="px-6 py-4">
                         <span className="font-bold text-gray-800">{tier}</span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {summary.winners[tier]}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-brand-green">
                        £{summary.prizes[tier].toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-brand-red/5 border border-brand-red/20 rounded-2xl p-6 flex items-start space-x-4">
               <AlertCircle className="w-5 h-5 text-brand-red mt-1" />
               <p className="text-xs text-brand-muted italic leading-relaxed">
                 Warning: Publishing the draw results is an irreversible action. Ensure winning numbers and prize splits are reviewed before proceeding.
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
