'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowRight, ExternalLink } from 'lucide-react'

export default function CharitySpotlightSection() {
  const [charities, setCharities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/charities')
      .then(res => res.json())
      .then(data => {
        // Handle potential error object from API
        if (Array.isArray(data)) {
          setCharities(data)
        } else {
          console.error("Failed to fetch charities:", data.error || data)
          setCharities([])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error("Fetch error:", err)
        setCharities([])
        setLoading(false)
      })
  }, [])

  if (loading) return null

  return (
    <section className="py-24 bg-brand-cream relative overflow-hidden">
      {/* Decorative leaf/organic shape */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-charcoal mb-6">Every subscription <br/>supports change</h2>
            <p className="text-xl text-brand-muted leading-relaxed">
              We partner with verified UK charities making a real impact on the ground. When you play, they win.
            </p>
          </div>
          <Link href="/charities" className="text-brand-green font-bold flex items-center space-x-2 hover:translate-x-1 transition-transform">
            <span>View All Charities</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Featured Charity (if exists) */}
        {Array.isArray(charities) && charities.filter(c => c.is_featured).slice(0, 1).map((featured) => (
          <motion.div
            key={featured.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl mb-16 flex flex-col lg:flex-row"
          >
            <div className="lg:w-1/2 h-80 lg:h-auto overflow-hidden">
              <img 
                src={featured.image_url} 
                alt={featured.name} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
              />
            </div>
            <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
              <span className="inline-block px-4 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-sm font-bold mb-6 tracking-wider uppercase">
                Featured Spotlight
              </span>
              <h3 className="text-4xl font-serif text-brand-charcoal mb-6">{featured.name}</h3>
              <p className="text-lg text-brand-muted mb-10 leading-relaxed">
                {featured.description}
              </p>
              <div className="flex items-center space-x-6">
                <Link href={`/charities/${featured.id}`} className="btn-primary">Learn More</Link>
                {featured.website_url && (
                  <a href={featured.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-brand-muted hover:text-brand-charcoal transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    <span className="font-medium">Visit Website</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Charity Carousel (Horizontal Scroll) */}
        <div className="flex space-x-8 overflow-x-auto pb-8 scrollbar-hide -mx-4 px-4 mask-fade-edges">
          {Array.isArray(charities) && charities.filter(c => !c.is_featured).map((charity, i) => (
            <motion.div
              key={charity.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex-shrink-0 w-80 group cursor-pointer"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-brand-cream group-hover:shadow-lg transition-all p-4">
                <div className="h-48 rounded-2xl overflow-hidden mb-6 relative">
                  <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-brand-charcoal shadow-sm">
                      {charity.category}
                    </span>
                  </div>
                </div>
                <h4 className="text-xl font-serif font-bold text-brand-charcoal mb-2 group-hover:text-brand-green transition-colors">
                  {charity.name}
                </h4>
                <p className="text-brand-muted text-sm line-clamp-2 mb-4">
                  {charity.description}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-brand-cream/50">
                   <Link href={`/charities/${charity.id}`} className="text-brand-green text-sm font-bold">Discover More</Link>
                   <ArrowRight className="w-4 h-4 text-brand-green opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Separate component for Link to avoid issues if used inside spotlight
function Link({ href, children, className }) {
  return <a href={href} className={className}>{children}</a>
}
