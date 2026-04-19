'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal, Star } from 'lucide-react'

export default function DrawMechanicsSection() {
  const tiers = [
    {
      match: "5 Numbers",
      title: "The Jackpot",
      benefit: "40% Prize Pool",
      icon: <Trophy className="w-10 h-10 text-brand-gold" />,
      color: "border-brand-gold bg-brand-gold/5"
    },
    {
      match: "4 Numbers",
      title: "Silver Tier",
      benefit: "35% Prize Pool",
      icon: <Medal className="w-10 h-10 text-brand-blue" />,
      color: "border-brand-blue bg-brand-blue/5"
    },
    {
      match: "3 Numbers",
      title: "Bronze Tier",
      benefit: "25% Prize Pool",
      icon: <Star className="w-10 h-10 text-brand-red" />,
      color: "border-brand-red bg-brand-red/5"
    }
  ]

  const exampleNumbers = [7, 14, 23, 31, 42]

  return (
    <section className="py-24 bg-brand-charcoal text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8 leading-tight">
              Fair, transparent, <br/>and <span className="text-brand-gold italic">rewarding.</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-lg">
              Our monthly draw is calculated based on the numbers you enter. The more people that match, the more impact we make. 50% of all subscription revenue goes straight into the monthly prize pool.
            </p>

            <div className="space-y-6">
              {tiers.map((tier, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className={`border-l-4 ${tier.color} p-6 rounded-r-2xl flex items-center justify-between group hover:translate-x-2 transition-transform`}
                >
                  <div className="flex items-center space-x-6">
                    <div className="bg-white/10 p-3 rounded-xl">
                      {tier.icon}
                    </div>
                    <div>
                      <h4 className="text-2xl font-serif font-bold">{tier.match}</h4>
                      <p className="text-gray-400">{tier.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-brand-gold">{tier.benefit}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 lg:p-16">
              <h3 className="text-2xl font-serif text-center mb-10 text-gray-300 tracking-widest uppercase">Example Draw Results</h3>
              
              <div className="flex flex-wrap justify-center gap-4 lg:gap-6 mb-16">
                {exampleNumbers.map((num, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                    className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-brand-gold to-brand-gold/60 rounded-full flex items-center justify-center text-brand-charcoal text-2xl lg:text-3xl font-bold shadow-[0_0_30px_rgba(201,168,76,0.3)] border-4 border-white/20"
                  >
                    {num}
                  </motion.div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm text-gray-500 uppercase tracking-widest">
                  <span>Entry Snapshot</span>
                  <span>Impact Created</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-medium">Monthly Pool</p>
                    <p className="text-gray-400">Total participants</p>
                  </div>
                  <p className="text-3xl font-serif font-bold text-brand-gold">£12,450.00</p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-medium">To Charity</p>
                    <p className="text-gray-400">Min 10% guarantee</p>
                  </div>
                  <p className="text-3xl font-serif font-bold text-brand-green-light">£2,490.00</p>
                </div>
              </div>
            </div>

            {/* Floating decoration */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-10 -right-10 opacity-20 pointer-events-none"
            >
              <GolfBallPattern />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function GolfBallPattern() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="1" strokeDasharray="8 8" />
    </svg>
  )
}
