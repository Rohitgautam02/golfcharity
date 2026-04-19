import { createServerSideClient } from '@/lib/supabase-server'
import { Heart, Globe, Users, Trophy } from 'lucide-react'
import Link from 'next/link'

export default async function CharitiesDirectory() {
  const supabase = createServerSideClient()
  const { data: charities } = await supabase.from('charities').select('*') || { data: [] }

  return (
    <div className="bg-brand-cream min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="bg-brand-green/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <Heart className="w-10 h-10 text-brand-green" />
          </div>
          <h1 className="text-6xl font-serif text-brand-charcoal mb-6">Our Charity Partners</h1>
          <p className="text-xl text-brand-muted leading-relaxed">
            Every score you enter is a contribution to a cause that matters. We partner with transparent, high-impact organizations across the UK.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {charities?.map((charity) => (
            <div key={charity.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl hover:translate-y-[-8px] transition-all duration-500 group">
              <div className="h-64 relative">
                <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] bg-brand-green px-3 py-1 rounded-full mb-3 inline-block">
                    {charity.category}
                  </span>
                  <h3 className="text-2xl font-serif font-bold">{charity.name}</h3>
                </div>
              </div>
              <div className="p-8">
                <p className="text-brand-muted text-sm leading-relaxed mb-8 line-clamp-3">
                  {charity.description}
                </p>
                <div className="grid grid-cols-2 gap-4 border-t border-brand-cream-dark pt-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-1">Impact Level</span>
                    <span className="text-sm font-bold text-brand-charcoal">High Efficiency</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-muted mb-1">UK Registered</span>
                    <span className="text-sm font-bold text-brand-charcoal">#SC04235</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-brand-charcoal rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
           {/* Decorative patterns could go here */}
           <div className="relative z-10">
              <h2 className="text-white text-4xl font-serif mb-6 italic">Want to nominate a charity?</h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-10">We are always looking for new partners making a difference in the local golf community and beyond.</p>
              <Link href="/contact" className="inline-flex items-center space-x-3 bg-brand-gold text-brand-charcoal px-10 py-4 rounded-full font-bold hover:bg-white transition-all">
                <span>Contact Partnerships</span>
                <Trophy className="w-4 h-4" />
              </Link>
           </div>
        </div>
      </div>
    </div>
  )
}
