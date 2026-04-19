'use client'

import { useState } from 'react'
import { createClientSideClient } from '@/lib/supabase'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FlagTriangleRight, Mail, Lock, LogIn, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const supabase = createClientSideClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success("Welcome back!")
      router.push(redirectTo)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="p-2 bg-brand-green rounded-xl">
              <FlagTriangleRight className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif text-brand-green font-bold">GolfGives</span>
          </Link>
          <h1 className="text-4xl font-serif text-brand-charcoal mb-2">Welcome Back</h1>
          <p className="text-brand-muted">Log in to manage your scores and impact.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-brand-cream-dark">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-brand-charcoal">Password</label>
                <Link href="/auth/reset" className="text-xs text-brand-green hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center space-x-2 py-4"
            >
              <span>{loading ? 'Logging in...' : 'Login'}</span>
              {!loading && <LogIn className="w-5 h-5" />}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-brand-muted">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-brand-green font-bold hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
