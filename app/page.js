import HeroSection from '@/components/home/HeroSection'
import HowItWorksSection from '@/components/home/HowItWorksSection'
import CharitySpotlightSection from '@/components/home/CharitySpotlightSection'
import DrawMechanicsSection from '@/components/home/DrawMechanicsSection'
import PricingSection from '@/components/home/PricingSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <CharitySpotlightSection />
      <DrawMechanicsSection />
      <PricingSection />
      
      {/* Testimonials or additional social proof could go here */}
      <section className="py-24 bg-brand-cream border-t border-brand-cream-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif text-brand-charcoal mb-12 italic opacity-60">"The easiest way to make a difference while playing the game I love."</h2>
          <p className="font-bold text-brand-green">— James T., Kent</p>
        </div>
      </section>
    </>
  )
}
