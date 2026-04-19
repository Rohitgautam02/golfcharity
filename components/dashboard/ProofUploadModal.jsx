'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Check, AlertCircle, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProofUploadModal({ winner, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(selected)
    }
  }

  const handleUpload = async () => {
    if (!file) return toast.error("Please select an image first")
    
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`/api/winners/${winner.id}/upload-proof`, {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Upload failed')
      
      toast.success("Proof uploaded! Admin will review it shortly.")
      if (onUploadSuccess) onUploadSuccess()
      onClose()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[2rem] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-brand-cream transition-colors">
          <X className="w-5 h-5 text-brand-muted" />
        </button>

        <div className="p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-serif text-brand-charcoal mb-4">Upload Proof</h3>
            <p className="text-brand-muted">Please upload a screenshot of your official golf score record for verify your £{winner.prize_amount} win.</p>
          </div>

          <div className="space-y-6">
            <div className={`relative border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center transition-all ${
              preview ? 'border-brand-green bg-brand-green/5' : 'border-brand-cream-dark hover:border-brand-green'
            }`}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              
              {preview ? (
                <div className="relative group">
                  <img src={preview} alt="Preview" className="max-h-48 rounded-xl shadow-md" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                    <p className="text-white text-xs font-bold">Change Image</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-brand-cream p-4 rounded-2xl mb-4">
                    <Upload className="w-8 h-8 text-brand-green" />
                  </div>
                  <p className="font-bold text-brand-charcoal">Drag & Drop or Click</p>
                  <p className="text-xs text-brand-muted mt-2">PNG, JPG or PDF up to 10MB</p>
                </>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                Ensure the screenshot clearly shows your name, the date of the round, and the final score matching your entry.
              </p>
            </div>

            <div className="flex space-x-4 pt-4">
              <button onClick={onClose} className="flex-1 py-4 rounded-full font-bold border-2 border-brand-cream-dark text-brand-charcoal hover:bg-brand-cream transition-all">
                Cancel
              </button>
              <button 
                onClick={handleUpload}
                disabled={!file || loading}
                className="flex-[2] btn-primary py-4"
              >
                {loading ? 'Uploading...' : 'Submit Verification'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
