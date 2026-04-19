'use client'

import { useState, useEffect } from 'react'
import { createClientSideClient } from '@/lib/supabase'
import { Trophy, Upload, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import ProofUploadModal from '@/components/dashboard/ProofUploadModal'
import { motion, AnimatePresence } from 'framer-motion'

export default function WinningsPage() {
  const [winnings, setWinnings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedWinner, setSelectedWinner] = useState(null)
  
  const supabase = createClientSideClient()

  const fetchWinnings = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { data } = await supabase
      .from('winners')
      .select('*, draws(draw_month, draw_year)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    setWinnings(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchWinnings()
  }, [])

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending':
        return { 
          icon: <Clock className="w-4 h-4" />, 
          label: 'Pending Proof', 
          color: 'bg-amber-100 text-amber-700 border-amber-200' 
        }
      case 'approved':
        return { 
          icon: <CheckCircle2 className="w-4 h-4" />, 
          label: 'Approved', 
          color: 'bg-green-100 text-green-700 border-green-200' 
        }
      case 'rejected':
        return { 
          icon: <AlertCircle className="w-4 h-4" />, 
          label: 'Rejected', 
          color: 'bg-red-100 text-red-700 border-red-200' 
        }
      default:
        return { 
          icon: <Clock className="w-4 h-4" />, 
          label: 'Under Review', 
          color: 'bg-blue-100 text-blue-700 border-blue-200' 
        }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-serif text-brand-charcoal mb-2">My Winnings</h1>
        <p className="text-brand-muted">Claim and track your prizes from successful draws.</p>
      </header>

      {winnings.length > 0 ? (
        <div className="grid gap-6">
          {winnings.map((win) => {
            const status = getStatusDisplay(win.verification_status)
            return (
              <motion.div 
                key={win.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-premium flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center space-x-6">
                  <div className="bg-brand-gold/10 p-4 rounded-2xl">
                    <Trophy className="w-8 h-8 text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-charcoal">£{win.prize_amount} Prize</h4>
                    <p className="text-sm text-brand-muted">
                      Draw: {win.draws.draw_month}/{win.draws.draw_year} • {win.match_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 w-full md:w-auto">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-xs font-bold ${status.color}`}>
                    {status.icon}
                    <span>{status.label}</span>
                  </div>
                  
                  {win.verification_status === 'pending' && !win.proof_url && (
                    <button 
                      onClick={() => setSelectedWinner(win)}
                      className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-brand-green text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm hover:translate-y-[-1px] transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Proof</span>
                    </button>
                  )}
                  
                  {win.proof_url && win.verification_status === 'pending' && (
                    <span className="text-xs font-medium text-brand-muted italic">Under Review</span>
                  )}

                  {win.payment_status === 'paid' && (
                    <div className="flex items-center space-x-2 bg-brand-charcoal text-white px-4 py-2 rounded-full text-xs font-bold">
                       <span>Paid 💰</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
          <div className="bg-brand-cream w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-brand-cream-dark" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-brand-charcoal mb-2">No winnings yet</h3>
          <p className="text-brand-muted max-w-sm mx-auto">
            Keep entering your scores! Your next round could be the matching entry we're looking for.
          </p>
        </div>
      )}

      <AnimatePresence>
        {selectedWinner && (
          <ProofUploadModal 
            winner={selectedWinner} 
            onClose={() => setSelectedWinner(null)}
            onUploadSuccess={fetchWinnings}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
