'use client'

import { useState, useEffect } from 'react'
import { createClientSideClient } from '@/lib/supabase'
import { Plus, Calendar, Settings2, Trash2, CheckCircle2 } from 'lucide-react'
import DrawSimulator from '@/components/admin/DrawSimulator'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function AdminDrawsPage() {
  const [draws, setDraws] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDraw, setActiveDraw] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    type: 'random'
  })

  const supabase = createClientSideClient()

  const fetchDraws = async () => {
    const { data } = await supabase
      .from('draws')
      .select('*')
      .order('draw_year', { ascending: false })
      .order('draw_month', { ascending: false })
    
    setDraws(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchDraws()
  }, [])

  const handleCreateDraw = async (e) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      const res = await fetch('/api/draws', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!res.ok) throw new Error('Failed to create draw')
      toast.success("Draw scheduled!")
      fetchDraws()
      setFormData({ ...formData, month: (formData.month % 12) + 1 })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-gray-900 mb-2">Draw Management</h1>
          <p className="text-gray-500">Configure, simulate, and publish monthly prize draws.</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: Control Panel */}
        <div className="space-y-10">
          <div className="card-premium">
             <h3 className="text-xl font-serif font-bold mb-6 flex items-center space-x-2">
              <Plus className="w-5 h-5 text-brand-green" />
              <span>Schedule New Draw</span>
            </h3>

            <form onSubmit={handleCreateDraw} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Month</label>
                  <select 
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-brand-green outline-none"
                  >
                    {Array.from({length: 12}).map((_, i) => (
                      <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Year</label>
                  <input 
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-brand-green outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Draw Strategy</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'random'})}
                    className={`py-3 rounded-xl border-2 transition-all ${formData.type === 'random' ? 'border-brand-green bg-brand-green/5 font-bold text-brand-green' : 'border-gray-100 bg-gray-50 text-gray-500'}`}
                  >
                    Truly Random
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'algorithmic'})}
                    className={`py-3 rounded-xl border-2 transition-all ${formData.type === 'algorithmic' ? 'border-brand-green bg-brand-green/5 font-bold text-brand-green' : 'border-gray-100 bg-gray-50 text-gray-500'}`}
                  >
                    Most Popular
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isCreating}
                className="w-full btn-primary py-4"
              >
                {isCreating ? 'Scheduling...' : 'Create Upcoming Draw'}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold">Draw History</h3>
            {draws.map((d) => (
              <div 
                key={d.id} 
                onClick={() => setActiveDraw(d)}
                className={`card-premium p-4 flex items-center justify-between cursor-pointer transition-all border-2 ${
                  activeDraw?.id === d.id ? 'border-brand-green bg-brand-green/5' : 'border-transparent'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${d.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {d.status === 'published' ? <CheckCircle2 className="w-5 h-5" /> : <Settings2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-800 uppercase tracking-tight">{new Date(0, d.draw_month-1).toLocaleString('default', { month: 'long' })} {d.draw_year}</h5>
                    <p className="text-xs text-brand-muted capitalize">{d.status} • {d.draw_type}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                   {d.winning_numbers?.slice(0, 5).map((n, i) => (
                     <div key={i} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                       {n}
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Simulator */}
        <div>
          {activeDraw ? (
            <DrawSimulator 
              draw={activeDraw} 
              onSimulateSuccess={() => {
                fetchDraws()
                setActiveDraw(null)
              }}
            />
          ) : (
            <div className="bg-gray-100 rounded-[2.5rem] p-20 text-center flex flex-col items-center justify-center border-4 border-dashed border-gray-200 min-h-[500px]">
              <Calendar className="w-16 h-16 text-gray-300 mb-6" />
              <h4 className="text-2xl font-serif font-bold text-gray-400">Select a draw</h4>
              <p className="text-gray-400 max-w-xs mt-2">Pick a pending or simulated draw from the history to begin the simulation process.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
