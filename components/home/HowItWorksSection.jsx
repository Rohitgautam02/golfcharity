'use client'

import { motion } from 'framer-motion'
import { CreditCard, ClipboardCheck, Trophy } from 'lucide-react'

export default function HowItWorksSection() {
  const steps = [
    {
      title: "Subscribe",
      description: "Join for just £9.99/mo. 50% goes to the prize pool, and at least 10% goes directly to your chosen charity.",
      icon: <CreditCard className="w-8 h-8 text-brand-green" />,
      number: "01"
    },
    {
      title: "Enter Your Scores",
      description: "Submit up to 5 golf scores per month. We automatically snapshot your latest entries for the monthly draw.",
      icon: <ClipboardCheck className="w-8 h-8 text-brand-green" />,
      number: "02"
    },
    {
      title: "Match & Win",
      description: "Match 3, 4, or all 5 numbers to win! Winners are notified instantly, and prizes are paid out directly.",
      icon: <Trophy className="w-8 h-8 text-brand-green" />,
      number: "03"
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-brand-charcoal mb-4"
          >
            How it works
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            viewport={{ once: true }}
            className="h-1.5 bg-brand-gold mx-auto rounded-full"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative group h-full"
            >
              <div className="card-premium h-full flex flex-col items-center text-center pt-12">
                <div className="absolute top-0 right-8 transform -translate-y-1/2 text-5xl font-serif text-brand-cream-dark opacity-10 group-hover:opacity-20 transition-opacity">
                  {step.number}
                </div>
                
                <div className="bg-brand-cream p-5 rounded-2xl mb-8 group-hover:bg-brand-green transition-colors">
                  {step.icon}
                  {/* Note: Icon color change would need custom logic for the SVG inside, 
                      but this provides the base structure */}
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-brand-charcoal mb-4">
                  {step.title}
                </h3>
                
                <p className="text-brand-muted leading-relaxed">
                  {step.description}
                </p>
                
                <div className="mt-8 w-12 h-1 bg-brand-cream group-hover:bg-brand-gold group-hover:w-full transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
