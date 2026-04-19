'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  FlagTriangleRight, 
  Heart, 
  Trophy, 
  Settings, 
  Wallet,
  LogOut,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { createClientSideClient } from '@/lib/supabase'
import { useState } from 'react'

export default function DashboardSidebar({ user, profile }) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const supabase = createClientSideClient()

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    ...(profile?.role === 'admin' ? [{ 
      name: 'Admin Panel', 
      href: '/admin', 
      icon: <Settings className="w-5 h-5 text-brand-gold" /> 
    }] : []),
    { name: 'My Scores', href: '/dashboard/scores', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'My Charity', href: '/dashboard/charity', icon: <Heart className="w-5 h-5" /> },
    { name: 'Draw History', href: '/dashboard/draws', icon: <Trophy className="w-5 h-5" /> },
    { name: 'Winnings', href: '/dashboard/winnings', icon: <Wallet className="w-5 h-5" /> },
    { name: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <aside className={`bg-white border-r border-brand-cream-dark transition-all duration-300 flex flex-col relative ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Toggle button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-white border border-brand-cream-dark rounded-full p-1 text-brand-muted hover:text-brand-green shadow-sm z-50"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Brand Header */}
      <div className={`p-6 border-b border-brand-cream-dark flex items-center ${isCollapsed ? 'justify-center' : 'space-x-4'}`}>
        <div className="bg-brand-green p-2 rounded-lg">
          <FlagTriangleRight className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && <span className="font-serif font-bold text-xl text-brand-green">GolfGives</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-brand-green text-white shadow-md' 
                  : 'text-brand-charcoal hover:bg-brand-cream'
              } ${isCollapsed ? 'justify-center' : 'space-x-4'}`}
            >
              <div className={isActive ? 'text-white' : 'text-brand-muted group-hover:text-brand-green'}>
                {item.icon}
              </div>
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
              
              {isActive && !isCollapsed && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-6 bg-white/40 rounded-full"
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-brand-cream-dark">
        {!isCollapsed && (
          <div className="mb-4 flex items-center space-x-3 px-2">
            <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center border border-brand-cream-dark text-brand-green font-bold">
              {user?.user_metadata?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-brand-charcoal truncate">{user?.user_metadata?.full_name}</p>
              <p className="text-xs text-brand-muted truncate">{user?.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-4 py-3 rounded-xl text-brand-red hover:bg-red-50 transition-all ${isCollapsed ? 'justify-center' : 'space-x-4'}`}
        >
          <LogOut className="w-5 h-5 font-bold" />
          {!isCollapsed && <span className="font-bold">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
