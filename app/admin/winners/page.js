'use client'

import { useState, useEffect } from 'react'
import { createClientSideClient } from '@/lib/supabase'
import { Check, X, ExternalLink, Trophy, User, Clock, ShieldCheck, Mail } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  
  const supabase = createClientSideClient()

  const fetchWinners = async () => {
    const { data } = await supabase
      .from('winners')
      .select('*, profiles(full_name, email), draws(draw_month, draw_year)')
      .order('created_at', { ascending: false })
    
    setWinners(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchWinners()
  }, [])

  const handleVerify = async (id, status) => {
    try {
      const res = await fetch(`/api/winners/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (!res.ok) throw new Error('Action failed')
      toast.success(`Winner ${status}!`)
      fetchWinners()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const filteredWinners = winners.filter(w => {
    if (filter === 'all') return true
    return w.verification_status === filter
  })

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-gray-900 mb-2">Winner Verification</h1>
          <p className="text-gray-500">Review score proof and authorize prize payouts.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {['pending', 'approved', 'rejected', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                filter === f ? 'bg-white text-brand-green shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'pending' ? `Pending (${winners.filter(w => w.verification_status === 'pending').length})` : f}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredWinners.map((winner) => (
            <motion.div
              key={winner.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full"
            >
              {/* Proof Image Wrapper */}
              <div className="h-48 bg-gray-100 relative group overflow-hidden">
                {winner.proof_url ? (
                  <>
                    <img src={winner.proof_url} alt="Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <a 
                      href={winner.proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                    >
                      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30">
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">View Original</span>
                      </div>
                    </a>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                    <Clock className="w-8 h-8 opacity-20" />
                    <span className="text-xs font-bold uppercase tracking-tighter">Awaiting Upload</span>
                  </div>
                )}
                
                <div className="absolute top-4 left-4 bg-brand-gold text-brand-charcoal px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center space-x-2">
                  <Trophy className="w-3 h-3" />
                  <span>£{winner.prize_amount}</span>
                </div>
              </div>

              {/* Winner Details */}
              <div className="p-8 flex-grow">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-cream border border-brand-cream-dark flex items-center justify-center font-bold text-brand-green">
                    {winner.profiles?.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{winner.profiles?.full_name}</h4>
                    <p className="text-xs text-gray-500 flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>{winner.profiles?.email}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Match Type</span>
                    <span className="font-bold text-gray-700">{winner.match_type}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Draw Month</span>
                    <span className="font-bold text-gray-700">{winner.draws?.draw_month}/{winner.draws?.draw_year}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Requested At</span>
                    <span className="font-bold text-gray-700">{format(new Date(winner.created_at), 'MMM d, HH:mm')}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {winner.verification_status === 'pending' && (
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex space-x-3">
                  <button 
                    onClick={() => handleVerify(winner.id, 'rejected')}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl border border-red-200 text-red-600 font-bold text-xs uppercase hover:bg-red-50 transition-all"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button 
                    disabled={!winner.proof_url}
                    onClick={() => handleVerify(winner.id, 'approved')}
                    className="flex-[2] flex items-center justify-center space-x-2 py-3 rounded-xl bg-brand-green text-white font-bold text-xs uppercase hover:bg-brand-green-light transition-all disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve Payout</span>
                  </button>
                </div>
              )}

              {winner.verification_status === 'approved' && (
                 <div className="p-6 bg-green-50 border-t border-green-100 flex items-center justify-center space-x-3 text-green-700">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Approved & Ready to Pay</span>
                 </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredWinners.length === 0 && (
         <div className="text-center py-40">
           <p className="text-gray-400 italic">No {filter} winners found matching your criteria.</p>
         </div>
      )}
    </div>
  )
}
