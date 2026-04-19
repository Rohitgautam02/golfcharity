'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClientSideClient } from '@/lib/supabase'
import { Menu, X, FlagTriangleRight, User, LayoutDashboard, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const supabase = createClientSideClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)
    }
    
    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-cream/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-brand-green rounded-xl group-hover:rotate-12 transition-transform">
              <FlagTriangleRight className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif text-brand-green font-bold">GolfGives</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/how-it-works" className="text-brand-charcoal hover:text-brand-green transition-colors font-medium">How It Works</Link>
            <Link href="/charities" className="text-brand-charcoal hover:text-brand-green transition-colors font-medium">Charities</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="btn-primary flex items-center space-x-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-brand-muted hover:text-brand-red transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-brand-charcoal hover:text-brand-green transition-colors font-medium">Login</Link>
                <Link href="/auth/signup" className="btn-primary">Start Playing</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-brand-charcoal"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-b border-brand-cream"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link href="/how-it-works" className="block px-3 py-4 text-brand-charcoal font-medium">How It Works</Link>
              <Link href="/charities" className="block px-3 py-4 text-brand-charcoal font-medium">Charities</Link>
              <div className="pt-4 border-t border-brand-cream">
                {user ? (
                  <>
                    <Link href="/dashboard" className="block w-full text-center btn-primary mb-3">Dashboard</Link>
                    <button onClick={handleLogout} className="block w-full text-center text-brand-red font-medium py-3">Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block w-full text-center text-brand-charcoal font-medium py-3">Login</Link>
                    <Link href="/auth/signup" className="block w-full text-center btn-primary">Start Playing</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
