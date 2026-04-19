'use client'

import { AlertTriangle, CreditCard, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SubscriptionStatusBanner({ status }) {
  if (status === 'active') return null

  const config = {
    inactive: {
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      title: 'Subscription Inactive',
      message: 'You need an active subscription to enter this month\'s prize draw.',
      btn: { label: 'Subscribe Now', href: '/subscribe', icon: <CreditCard className="w-4 h-4" /> }
    },
    lapsed: {
      color: 'bg-red-50 border-red-200 text-red-800',
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      title: 'Payment Failed',
      message: 'We couldn\'t process your recent payment. Update your payment method to stay in the draw.',
      btn: { label: 'Update Payment', href: '/dashboard/settings', icon: <RefreshCw className="w-4 h-4" /> }
    },
    cancelled: {
      color: 'bg-gray-50 border-gray-200 text-gray-800',
      icon: <AlertTriangle className="w-5 h-5 text-gray-600" />,
      title: 'Subscription Cancelled',
      message: 'Your subscription is cancelled. Re-subscribe to continue supporting your charity and entering draws.',
      btn: { label: 'Re-subscribe', href: '/subscribe', icon: <CreditCard className="w-4 h-4" /> }
    }
  }

  const current = config[status] || config.inactive

  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      className={`border-b ${current.color}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            {current.icon}
            <div>
              <span className="font-bold mr-2">{current.title}:</span>
              <span className="text-sm opacity-90">{current.message}</span>
            </div>
          </div>
          <Link 
            href={current.btn.href}
            className="flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            {current.btn.icon}
            <span>{current.btn.label}</span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
