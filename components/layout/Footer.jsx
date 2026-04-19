import { FlagTriangleRight, Instagram, Twitter, Facebook } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <FlagTriangleRight className="w-8 h-8 text-brand-gold" />
              <span className="text-3xl font-serif font-bold text-white">GolfGives</span>
            </Link>
            <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
              We're the UK's first golf subscription platform that connects the game you love with the causes you care about. Play more, win big, and give back.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="hover:text-brand-gold transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand-gold transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand-gold transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link href="/charities" className="hover:text-white transition-colors">Charities</Link></li>
              <li><Link href="/prizes" className="hover:text-white transition-colors">Prize Draw</Link></li>
              <li><Link href="/impact" className="hover:text-white transition-colors">Our Impact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="/responsible-gaming" className="hover:text-white transition-colors">Responsible Gaming</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} GolfGives Ltd. No. 12345678. Registered in England & Wales.</p>
          <p className="mt-4 md:mt-0 text-center md:text-right italic max-w-md">
            GolfGives is regulated and licensed as a non-profit prize draw platform. 50% of all subscriptions fund the prize pool.
          </p>
        </div>
      </div>
    </footer>
  )
}
