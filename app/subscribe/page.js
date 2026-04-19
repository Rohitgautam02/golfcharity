'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, ShieldCheck, Heart, Trophy } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SubscribePage() {
  const [loadingPlan, setLoadingPlan] = useState(null)

  const handleSubscribe = async (planId) => {
    setLoadingPlan(planId)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      })
      
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to start checkout')
      }
    } catch (error) {
      toast.error(error.message)
      setLoadingPlan(null)
    }
  }

  const plans = [
    {
      id: 'monthly',
      name: "Monthly",
      price: "9.99",
      period: "per month",
      impact: "Best for starters",
      features: [
        "Enter 5 scores monthly",
        "Prize draw entry",
        "Select your charity",
        "Cancel anytime"
      ],
      cta: "Join Monthly",
    },
    {
      id: 'yearly',
      name: "Yearly",
      price: "99.99",
      period: "per year",
      impact: "Maximum impact",
      features: [
        "All Monthly features",
        "2 months free",
        "Yearly impact report",
        "Legacy badge"
      ],
      cta: "Join Yearly",
      featured: true
    }
  ]

  return (
    <div className="min-h-screen bg-brand-cream py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-serif text-brand-charcoal mb-4"
          >
            Start Your Journey
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-brand-muted max-w-2xl mx-auto"
          >
            Choose the plan that fits your impact goals. 50% of your subscription funds the prize pool.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-[2.5rem] p-10 flex flex-col justify-between h-full bg-white shadow-xl relative overflow-hidden ${
                plan.featured ? 'border-4 border-brand-green' : 'border border-brand-cream-dark'
              }`}
            >
              {plan.featured && (
                <div className="absolute top-8 right-[-35px] rotate-45 bg-brand-green text-white text-[10px] font-bold uppercase tracking-widest px-10 py-1 shadow-md">
                  Best Value
                </div>
              )}

              <div>
                <h3 className="text-2xl font-serif font-bold text-brand-charcoal mb-2">{plan.name}</h3>
                <p className="text-brand-green text-xs font-bold uppercase tracking-widest mb-6">{plan.impact}</p>
                <div className="flex items-baseline space-x-2 mb-8">
                  <span className="text-6xl font-serif font-bold">£{plan.price}</span>
                  <span className="text-brand-muted">{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-10">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-center space-x-3 text-sm text-brand-charcoal">
                      <div className="bg-brand-green/10 p-1 rounded-full text-brand-green">
                        <Check className="w-4 h-4" />
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loadingPlan !== null}
                className={`w-full py-4 rounded-full font-bold transition-all active:scale-95 flex items-center justify-center space-x-2 ${
                  plan.featured ? 'bg-brand-green text-white hover:bg-brand-green-light' : 'bg-brand-charcoal text-white hover:bg-black'
                }`}
              >
                <span>{loadingPlan === plan.id ? 'Processing...' : plan.cta}</span>
                {loadingPlan !== plan.id && <ArrowRight className="w-4 h-4" />}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="flex flex-col items-center text-center p-6">
              <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                 <ShieldCheck className="w-8 h-8 text-brand-blue" />
              </div>
              <h4 className="font-bold mb-2">Secure Payments</h4>
              <p className="text-xs text-brand-muted">Fully encrypted Stripe checkout processes all transactions.</p>
           </div>
           <div className="flex flex-col items-center text-center p-6">
              <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                 <Heart className="w-8 h-8 text-brand-red" />
              </div>
              <h4 className="font-bold mb-2">Charity Guarantee</h4>
              <p className="text-xs text-brand-muted">Minimum 10% of every penny goes directly to your charity.</p>
           </div>
           <div className="flex flex-col items-center text-center p-6">
              <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                 <Trophy className="w-8 h-8 text-brand-gold" />
              </div>
              <h4 className="font-bold mb-2">Fair Draw</h4>
              <p className="text-xs text-brand-muted">Independent draw mechanism ensures everyone a fair chance.</p>
           </div>
        </div>
      </div>
    </div>
  )
}
function Link({ href, children, className }) { return <a href={href} className={className}>{children}</a> }
