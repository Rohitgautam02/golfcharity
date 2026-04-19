import { createServerSideClient } from '@/lib/supabase-server'
import { Plus, Trophy, Heart, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function DashboardOverview() {
  const supabase = createServerSideClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const { redirect } = await import('next/navigation')
    redirect('/auth/login')
  }

  // Parallel data fetching
  const [profileRes, scoresRes, winningRes, drawRes] = await Promise.all([
    supabase.from('profiles').select('*, charities(*)').eq('id', user.id).single(),
    supabase.from('golf_scores').select('*').eq('user_id', user.id).order('score_date', { ascending: false }).limit(5),
    supabase.from('winners').select('prize_amount').eq('user_id', user.id),
    supabase.from('draws').select('*').eq('status', 'published').order('published_at', { ascending: false }).limit(3)
  ])

  const profile = profileRes.data
  const scores = scoresRes.data || []
  const winners = winningRes.data || []
  const recentDraws = drawRes.data || []
  
  const totalWon = winners.reduce((acc, curr) => acc + Number(curr.prize_amount), 0)

  const stats = [
    { 
      label: 'Your Scores', 
      value: `${scores.length} / 5`, 
      icon: <Calendar className="w-6 h-6 text-brand-blue" />, 
      sub: 'Entries in next draw',
      link: '/dashboard/scores'
    },
    { 
      label: 'Your Charity', 
      value: profile?.charities?.name || 'Not Selected', 
      icon: <Heart className="w-6 h-6 text-brand-red" />, 
      sub: `${profile?.charity_contribution_percent || 10}% contribution`,
      link: '/dashboard/charity'
    },
    { 
      label: 'Subscription', 
      value: profile?.subscription_status === 'active' ? 'Active' : 'Inactive', 
      icon: <Trophy className="w-6 h-6 text-brand-gold" />, 
      sub: profile?.subscription_plan || 'No plan',
      link: '/dashboard/settings'
    },
    { 
      label: 'Total Won', 
      value: `£${totalWon.toFixed(2)}`, 
      icon: <Plus className="w-6 h-6 text-brand-green" />, 
      sub: 'Verified prizes',
      link: '/dashboard/winnings'
    }
  ]

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-brand-charcoal mb-2">Welcome back, {user.user_metadata.full_name}</h1>
          <p className="text-brand-muted">Here's what's happening with your impact and entries.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/scores" className="btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Score</span>
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.link} className="card-premium group">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-brand-cream p-3 rounded-2xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <ArrowRight className="w-4 h-4 text-brand-muted opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </div>
            <p className="text-sm font-medium text-brand-muted uppercase tracking-wider mb-1">{stat.label}</p>
            <h4 className="text-2xl font-serif font-bold text-brand-charcoal mb-1">{stat.value}</h4>
            <p className="text-xs text-brand-muted">{stat.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Scores */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif font-bold">Your Latest Rounds</h3>
            <Link href="/dashboard/scores" className="text-brand-green font-bold text-sm hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {scores.length > 0 ? scores.map((score) => (
              <div key={score.id} className="card-premium flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-cream flex items-center justify-center font-bold text-lg text-brand-green border border-brand-cream-dark">
                    {score.score}
                  </div>
                  <div>
                    <p className="font-bold text-brand-charcoal">{format(new Date(score.score_date), 'EEE do MMM')}</p>
                    <p className="text-xs text-brand-muted uppercase">Verified round</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="card-premium p-12 text-center text-brand-muted italic">
                No scores entered yet. Add your first score to enter the draw!
              </div>
            )}
          </div>
        </div>

        {/* Recent Draws */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif font-bold">Recent Draws</h3>
            <Link href="/dashboard/draws" className="text-brand-green font-bold text-sm hover:underline">History</Link>
          </div>
          <div className="space-y-4">
            {recentDraws.map((draw) => (
              <div key={draw.id} className="card-premium p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-brand-charcoal capitalize">Draw {draw.draw_month}/{draw.draw_year}</p>
                    <p className="text-xs text-brand-muted">{format(new Date(draw.published_at), 'MMM do, yyyy')}</p>
                  </div>
                  <Trophy className="w-5 h-5 text-brand-gold" />
                </div>
                <div className="flex space-x-2">
                  {draw.winning_numbers.map((n, i) => (
                    <span key={i} className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-xs font-bold text-brand-gold">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
