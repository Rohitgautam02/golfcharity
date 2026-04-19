'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Check, ArrowRight, Info } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CharitySelector({ initialCharityId, initialPercent = 10 }) {
  const [charities, setCharities] = useState([])
  const [selectedId, setSelectedId] = useState(initialCharityId)
  const [percent, setPercent] = useState(initialPercent)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/charities')
      .then(res => res.json())
      .then(setCharities)
  }, [])

  const handleSave = async () => {
    if (!selectedId) return toast.error("Please select a charity")
    
    setLoading(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          charity_id: selectedId,
          charity_contribution_percent: percent 
        })
      })

      if (!res.ok) throw new Error('Failed to update')
      toast.success("Preferences saved!")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-12">
      {/* Percentage Slider */}
      <div className="card-premium">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h3 className="text-xl font-serif font-bold flex items-center space-x-2">
              <Heart className="w-5 h-5 text-brand-red" />
              <span>Your Contribution</span>
            </h3>
            <p className="text-brand-muted text-sm mt-1">Adjust how much of your subscription goes to charity (min 10%).</p>
          </div>
          <div className="bg-brand-green/10 px-6 py-2 rounded-2xl">
            <span className="text-3xl font-serif font-bold text-brand-green">{percent}%</span>
          </div>
        </div>

        <input
          type="range"
          min="10"
          max="100"
          step="1"
          value={percent}
          onChange={(e) => setPercent(parseInt(e.target.value))}
          className="w-full h-3 bg-brand-cream rounded-lg appearance-none cursor-pointer accent-brand-green mb-8"
        />

        <div className="bg-brand-cream/50 rounded-2xl p-6 border border-brand-cream-dark">
          <div className="flex justify-between items-center text-sm mb-4">
            <span className="text-brand-muted">Monthly Subscription</span>
            <span className="font-bold">£9.99</span>
          </div>
          <div className="flex justify-between items-center text-sm font-bold text-brand-green">
            <span>Direct Charity Impact</span>
            <span className="text-xl">£{(9.99 * (percent / 100)).toFixed(2)}</span>
          </div>
          <p className="text-[10px] text-brand-muted uppercase tracking-[0.2em] mt-6 text-center">
            The remaining funds support the prize pool and platform operations.
          </p>
        </div>
      </div>

      {/* Charity Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charities.map((charity) => (
          <motion.div
            key={charity.id}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedId(charity.id)}
            className={`cursor-pointer rounded-3xl overflow-hidden transition-all border-4 bg-white shadow-sm hover:shadow-md ${
              selectedId === charity.id ? 'border-brand-green' : 'border-transparent'
            }`}
          >
            <div className="h-40 relative">
              <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover" />
              {selectedId === charity.id && (
                <div className="absolute top-4 right-4 bg-brand-green text-white p-2 rounded-full shadow-lg">
                  <Check className="w-5 h-5" />
                </div>
              )}
              <div className="absolute bottom-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-brand-charcoal">
                  {charity.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h4 className="text-xl font-serif font-bold text-brand-charcoal mb-2">{charity.name}</h4>
              <p className="text-brand-muted text-sm line-clamp-2">{charity.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating Save Bar */}
      <div className="sticky bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-brand-charcoal text-white rounded-full py-4 px-8 font-bold shadow-2xl hover:bg-black transition-all flex items-center justify-center space-x-3"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Save Selection</span>
              <Check className="w-5 h-5 text-brand-green" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
