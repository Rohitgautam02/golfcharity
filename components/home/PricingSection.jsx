'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function PricingSection() {
  const plans = [
    {
      name: "Monthly Impact",
      price: "9.99",
      period: "/month",
      description: "Perfect for casual golfers who want to support their charity monthly.",
      features: [
        "Enter up to 5 scores per month",
        "Monthly prize draw entry",
        "Charity contribution tracking",
        "Digital winner certificates",
        "Cancel anytime"
      ],
      cta: "Start Monthly",
      isFeatured: false,
      href: "/auth/signup?plan=monthly"
    },
    {
      name: "Yearly Legacy",
      price: "99.99",
      period: "/year",
      description: "Best value. Two months free and a long-term commitment to impact.",
      features: [
        "All Monthly features included",
        "2 months free (£19.90 saving)",
        "Priority winner verification",
        "Exclusive yearly impact report",
        "Legacy member badge"
      ],
      cta: "Start Yearly",
      isFeatured: true,
      href: "/auth/signup?plan=yearly"
    }
  ]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-brand-charcoal mb-4">Transparent Pricing</h2>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto">
            50% of your subscription goes directly to the monthly prize pool. Another 10% (min) goes to your chosen charity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className={`relative rounded-3xl p-10 flex flex-col h-full ${
                plan.isFeatured 
                  ? 'bg-brand-charcoal text-white shadow-2xl scale-105 z-10' 
                  : 'bg-brand-cream border border-brand-cream-dark'
              }`}
            >
              {plan.isFeatured && (
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-brand-gold text-brand-charcoal px-4 py-1.5 rounded-full text-sm font-bold flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Best Value</span>
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-2xl font-serif font-bold mb-4 ${plan.isFeatured ? 'text-brand-gold' : 'text-brand-charcoal'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-5xl font-bold font-serif">£{plan.price}</span>
                  <span className={plan.isFeatured ? 'text-gray-400' : 'text-brand-muted'}>{plan.period}</span>
                </div>
                <p className={`mt-4 text-sm leading-relaxed ${plan.isFeatured ? 'text-gray-300' : 'text-brand-muted'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-5 mb-10 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm">
                    <div className={`mt-0.5 p-0.5 rounded-full ${plan.isFeatured ? 'bg-brand-gold/20 text-brand-gold' : 'bg-brand-green/10 text-brand-green'}`}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href={plan.href}
                className={`block w-full text-center py-4 rounded-full font-bold transition-all active:scale-95 ${
                  plan.isFeatured 
                    ? 'bg-brand-gold text-brand-charcoal hover:bg-brand-gold-light' 
                    : 'bg-brand-green text-white hover:bg-brand-green-light'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-12 opacity-60">
           <div className="flex items-center space-x-2 grayscale opacity-50">
             <span className="text-xs uppercase tracking-widest font-bold">Secure Payments by</span>
             <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6" />
           </div>
           <p className="text-sm text-brand-muted max-w-sm text-center md:text-left">
             Prices include all applicable platform fees and regulatory contributions.
           </p>
        </div>
      </div>
    </section>
  )
}
