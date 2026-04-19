import { CheckCircle2, Trophy, Heart, ShieldCheck, Gamepad2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HowItWorksPage() {
  const steps = [
    {
      title: "1. Join the Club",
      description: "Subscribe to our platform for £9.99/month. Half of your subscription powers the massive monthly prize pool.",
      icon: <Users className="w-8 h-8 text-brand-green" />,
    },
    {
      title: "2. Play & Log",
      description: "Go play your usual round of golf. Simply enter your score (1-45) in your dashboard afterwards. You can enter up to 5 scores per month to increase your odds.",
      icon: <Gamepad2 className="w-8 h-8 text-brand-blue" />,
    },
    {
      title: "3. Choose Your Impact",
      description: "Select which of our partner charities you want your contribution to support. You decide where the good goes.",
      icon: <Heart className="w-8 h-8 text-brand-red" />,
    },
    {
      title: "4. The Grand Monthly Draw",
      description: "At the end of every month, we draw 5 winning numbers. We match your logged scores against these numbers to find winners.",
      icon: <Trophy className="w-8 h-8 text-brand-gold" />,
    }
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-brand-cream/50 py-24 border-b border-brand-cream-dark">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl font-serif text-brand-charcoal mb-6">How It Works</h1>
          <p className="text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Changing the game of charity giving through the game of golf. Simple steps, massive impact.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative group p-10 bg-white rounded-[2.5rem] border border-brand-cream-dark shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="mb-8 p-4 bg-brand-cream inline-block rounded-2xl group-hover:bg-brand-green group-hover:text-white transition-colors duration-500">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold text-brand-charcoal mb-4">{step.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{step.description}</p>
                {i < 3 && (
                   <div className="hidden lg:block absolute top-1/2 -right-4 translate-y-[-50%] text-brand-cream-dark">
                      <ArrowRight className="w-6 h-6" />
                   </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification & Transparency */}
      <section className="bg-brand-charcoal py-24 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
           <div className="max-w-3xl mb-16">
              <h2 className="text-5xl font-serif mb-6 italic">Built on Transparency</h2>
              <p className="text-gray-400 text-lg">We take our commitment to fairness and charity as seriously as you take your handicap.</p>
           </div>

           <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4 border-l-2 border-brand-gold/30 pl-8">
                 <ShieldCheck className="w-10 h-10 text-brand-gold mb-4" />
                 <h4 className="text-xl font-bold">Proof of Score</h4>
                 <p className="text-gray-500 text-sm italic">Every winner must upload their official golf club score record. Our admins verify every claim before a single penny is paid out.</p>
              </div>
              <div className="space-y-4 border-l-2 border-brand-green/30 pl-8">
                 <CheckCircle2 className="w-10 h-10 text-brand-green mb-4" />
                 <h4 className="text-xl font-bold">Audited Pool</h4>
                 <p className="text-gray-500 text-sm italic">The monthly prize pool is calculated transparently based on 50% of the active subscription revenue. No hidden fees.</p>
              </div>
              <div className="space-y-4 border-l-2 border-brand-blue/30 pl-8">
                 <Heart className="w-10 h-10 text-brand-blue mb-4" />
                 <h4 className="text-xl font-bold">Direct impact</h4>
                 <p className="text-gray-500 text-sm italic">Your chosen charity receives its funds directly via our automated platform partners. You can see your impact in your personal dashboard.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
         <div className="max-w-3xl mx-auto px-4">
            <h3 className="text-4xl font-serif text-brand-charcoal mb-8">Ready to play for a purpose?</h3>
            <Link href="/auth/signup" className="btn-primary px-12 py-5 text-lg">
               Start Today
            </Link>
         </div>
      </section>
    </div>
  )
}

function Users({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> }
