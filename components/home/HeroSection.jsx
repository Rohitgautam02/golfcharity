'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Trophy, Heart, Users } from 'lucide-react'

export default function HeroSection() {
  const stats = [
    { icon: <Heart className="w-5 h-5 text-brand-red" />, label: "£42,000 donated", delay: 0.2 },
    { icon: <Users className="w-5 h-5 text-brand-blue" />, label: "3,847 members", delay: 0.4 },
    { icon: <Trophy className="w-5 h-5 text-brand-gold" />, label: "Next draw: £12,500", delay: 0.6 }
  ]

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-brand-cream py-20 lg:py-0">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,100 C30,80 70,80 100,100 L100,0 L0,0 Z" fill="currentColor" className="text-brand-green" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-6xl md:text-7xl lg:text-8xl font-serif text-brand-charcoal mb-8 leading-[1.1]"
            >
              Play Golf. <br/>
              <span className="text-brand-green italic">Give Back.</span> <br/>
              Win Big.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-brand-muted mb-12 max-w-lg leading-relaxed"
            >
              The UK's first golf subscription that turns your scores into monthly prizes — while funding charities that matter to you.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link href="/auth/signup" className="btn-primary w-full sm:w-auto text-center flex items-center justify-center space-x-2 text-lg">
                <span>Start Playing</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/how-it-works" className="w-full sm:w-auto text-center px-8 py-3 rounded-full border-2 border-brand-green text-brand-green font-medium hover:bg-brand-green hover:text-white transition-all">
                See How It Works
              </Link>
            </motion.div>

            {/* Stats badges */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: stat.delay, duration: 0.5 }}
                  className="bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl p-4 flex items-center space-x-3 shadow-sm"
                >
                  <div className="bg-white p-2 rounded-lg shadow-inner">
                    {stat.icon}
                  </div>
                  <span className="font-medium text-brand-charcoal">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hidden lg:block relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2070" 
                alt="Emotional Charity Impact" 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <p className="font-serif text-3xl mb-2">"It's more than a draw."</p>
                <p className="opacity-80">Join 3,000+ golfers making an impact.</p>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 bg-brand-gold text-white p-8 rounded-full shadow-lg"
            >
              <Trophy className="w-8 h-8" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
