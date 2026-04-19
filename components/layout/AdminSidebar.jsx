'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Users, 
  Settings, 
  Trophy, 
  Heart, 
  BarChart3, 
  ShieldCheck,
  LayoutDashboard,
  ArrowLeft
} from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Overview', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Users', href: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { name: 'Draw Management', href: '/admin/draws', icon: <Trophy className="w-5 h-5" /> },
    { name: 'Charities', href: '/admin/charities', icon: <Heart className="w-5 h-5" /> },
    { name: 'Winners', href: '/admin/winners', icon: <ShieldCheck className="w-5 h-5" /> },
    { name: 'Reports', href: '/admin/reports', icon: <BarChart3 className="w-5 h-5" /> },
  ]

  return (
    <aside className="w-64 bg-brand-charcoal text-white flex flex-col">
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center space-x-3 text-brand-gold mb-6">
          <ShieldCheck className="w-8 h-8" />
          <span className="font-serif font-bold text-2xl tracking-tight">AdminUI</span>
        </div>
        <Link href="/dashboard" className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-widest font-bold">
          <ArrowLeft className="w-3 h-3" />
          <span>Exit to Dashboard</span>
        </Link>
      </div>

      <nav className="flex-grow p-6 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-brand-gold text-brand-charcoal font-bold shadow-lg shadow-brand-gold/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={isActive ? 'text-brand-charcoal' : 'text-gray-500'}>
                {item.icon}
              </div>
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-8 border-t border-white/10">
        <div className="bg-brand-gold/10 rounded-2xl p-4 border border-brand-gold/20">
          <p className="text-[10px] text-brand-gold uppercase tracking-[0.2em] font-bold mb-1">Status</p>
          <p className="text-sm font-medium">Production Environment</p>
        </div>
      </div>
    </aside>
  )
}
