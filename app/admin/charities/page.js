'use client'

import { useState, useEffect } from 'react'
import { createClientSideClient } from '@/lib/supabase'
import { 
  Heart, 
  Search, 
  ExternalLink, 
  Star, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  Plus
} from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function AdminCharitiesPage() {
  const [charities, setCharities] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCharity, setNewCharity] = useState({
    name: '',
    description: '',
    category: 'Children',
    website_url: '',
    image_url: ''
  })
  
  const supabase = createClientSideClient()

  useEffect(() => {
    fetchCharities()
  }, [])

  const fetchCharities = async () => {
    const { data, error } = await supabase
      .from('charities')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      toast.error("Failed to load charities")
    } else {
      setCharities(data || [])
    }
    setLoading(false)
  }

  const handleAddCharity = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('charities')
      .insert([newCharity])
      .select()

    if (error) {
      toast.error(error.message)
    } else {
      setCharities([...charities, data[0]])
      setIsModalOpen(false)
      setNewCharity({ name: '', description: '', category: 'Children', website_url: '', image_url: '' })
      toast.success("Charity added successfully!")
    }
  }

  const toggleStatus = async (id, field, currentVal) => {
    const { error } = await supabase
      .from('charities')
      .update({ [field]: !currentVal })
      .eq('id', id)

    if (error) {
      toast.error("Update failed")
    } else {
      setCharities(charities.map(c => 
        c.id === id ? { ...c, [field]: !currentVal } : c
      ))
      toast.success("Updated successfully")
    }
  }

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="p-10 text-center animate-pulse text-gray-500 font-serif">Loading impact partners...</div>
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-gray-900 mb-2">Charity Partners</h1>
          <p className="text-gray-500">Manage impact organizations and featured highlights.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search charities..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-green bg-white w-64 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center space-x-2 py-2 px-4 shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Charity</span>
          </button>
        </div>
      </header>

      {/* Add Charity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl"
          >
            <h2 className="text-2xl font-serif font-bold mb-6">Add New Partner</h2>
            <form onSubmit={handleAddCharity} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  value={newCharity.name}
                  onChange={e => setNewCharity({...newCharity, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Category</label>
                  <select 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    value={newCharity.category}
                    onChange={e => setNewCharity({...newCharity, category: e.target.value})}
                  >
                    <option>Children</option>
                    <option>Environment</option>
                    <option>Health</option>
                    <option>Education</option>
                    <option>Food Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Website URL</label>
                  <input 
                    type="url" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    value={newCharity.website_url}
                    onChange={e => setNewCharity({...newCharity, website_url: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Image URL</label>
                <input 
                  type="url" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  value={newCharity.image_url}
                  onChange={e => setNewCharity({...newCharity, image_url: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Description</label>
                <textarea 
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  value={newCharity.description}
                  onChange={e => setNewCharity({...newCharity, description: e.target.value})}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 btn-primary py-3 rounded-xl"
                >
                  Save Charity
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharities.map((charity) => (
          <div key={charity.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col group transition-all hover:shadow-md hover:border-brand-green/30">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={charity.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800'} 
                alt={charity.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button 
                  onClick={() => toggleStatus(charity.id, 'is_featured', charity.is_featured)}
                  className={`p-2 rounded-full shadow-lg backdrop-blur-md transition-all ${
                    charity.is_featured 
                      ? 'bg-brand-gold text-white' 
                      : 'bg-white/80 text-gray-400 hover:text-brand-gold'
                  }`}
                  title={charity.is_featured ? 'Featured' : 'Mark as Featured'}
                >
                  <Star className="w-4 h-4 fill-current" />
                </button>
                <div className={`p-2 rounded-full shadow-lg backdrop-blur-md ${
                  charity.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {charity.is_active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-brand-cream/80 bg-white/10 px-2 py-1 rounded backdrop-blur-sm">
                   {charity.category}
                 </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-serif font-bold text-gray-900 leading-tight">{charity.name}</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow">
                {charity.description}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Status:</span>
                  <button 
                    onClick={() => toggleStatus(charity.id, 'is_active', charity.is_active)}
                    className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                      charity.is_active ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'
                    }`}
                  >
                    {charity.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <a 
                  href={charity.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 text-brand-green hover:bg-brand-cream rounded-lg transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCharities.length === 0 && (
        <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-gray-100">
          <Heart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-400">No impact partners found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your search filters.</p>
        </div>
      )}
    </div>
  )
}
