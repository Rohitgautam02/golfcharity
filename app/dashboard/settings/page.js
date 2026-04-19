'use client'

import { useState, useEffect } from 'react'
import { createClientSideClient } from '@/lib/supabase'
import { CreditCard, Shield, Mail, ArrowRight, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  
  const supabase = createClientSideClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        setLoading(false)
        return
      }
      
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          setProfile(data)
          setLoading(false)
        })
    })
  }, [])

  const handlePortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to open portal')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-serif text-brand-charcoal mb-2">Settings</h1>
        <p className="text-brand-muted">Manage your account and subscription details.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Profile Info */}
        <div className="card-premium">
          <h3 className="text-xl font-serif font-bold mb-6 flex items-center space-x-2">
            <Mail className="w-5 h-5 text-brand-green" />
            <span>Account Information</span>
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-brand-muted block mb-1">Full Name</label>
              <p className="font-medium text-brand-charcoal">{profile.full_name}</p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-brand-muted block mb-1">Email Address</label>
              <p className="font-medium text-brand-charcoal">{profile.email}</p>
            </div>
          </div>
          <button className="mt-8 text-sm text-brand-green font-bold hover:underline">Change Password (via email link)</button>
        </div>

        {/* Subscription */}
        <div className="card-premium border-brand-green bg-brand-green/5">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-serif font-bold flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-brand-green" />
              <span>Subscription</span>
            </h3>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              profile.subscription_status === 'active' ? 'bg-brand-green text-white' : 'bg-red-100 text-red-700'
            }`}>
              {profile.subscription_status}
            </span>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-brand-muted block mb-1">Current Plan</label>
              <p className="font-medium text-brand-charcoal capitalize">{profile.subscription_plan || 'No Active Plan'}</p>
            </div>
            {profile.subscription_renewal_date && (
               <div>
                <label className="text-xs font-bold uppercase tracking-widest text-brand-muted block mb-1">Next Renewal</label>
                <p className="font-medium text-brand-charcoal">{new Date(profile.subscription_renewal_date).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          <button 
            onClick={handlePortal}
            disabled={portalLoading}
            className="w-full flex items-center justify-center space-x-2 bg-brand-charcoal text-white py-3 rounded-xl font-bold hover:bg-black transition-all"
          >
            {portalLoading ? 'Connecting...' : (
              <>
                <span>Manage Billing in Stripe</span>
                <ExternalLink className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Security / Misc */}
        <div className="lg:col-span-2 card-premium">
           <h3 className="text-xl font-serif font-bold mb-6 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-brand-gold" />
            <span>Platform Privacy</span>
          </h3>
          <p className="text-sm text-brand-muted leading-relaxed mb-6">
            Your scores and identity are handled with strictly regulated privacy standards. We only use your email for critical system updates and draw results.
          </p>
          <div className="flex items-center space-x-4">
             <button className="text-xs font-bold uppercase tracking-widest text-brand-red hover:underline">Download My Data</button>
             <button className="text-xs font-bold uppercase tracking-widest text-brand-red hover:underline">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  )
}
