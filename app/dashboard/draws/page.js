import { createServerSideClient } from '@/lib/supabase-server'
import { Trophy, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import { format } from 'date-fns'

export default async function DrawsPage() {
  const supabase = createServerSideClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const { redirect } = await import('next/navigation')
    redirect('/auth/login')
  }

  // Fetch published draws and the user's entries for those draws
  const { data: draws } = await supabase
    .from('draws')
    .select('*, draw_entries(*)')
    .eq('status', 'published')
    .order('draw_year', { ascending: false })
    .order('draw_month', { ascending: false })

  const { data: userEntries } = await supabase
    .from('draw_entries')
    .select('*')
    .eq('user_id', user.id)

  // Map entries to draws for easier display
  const entryMap = userEntries?.reduce((acc, curr) => {
    acc[curr.draw_id] = curr
    return acc
  }, {})

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-serif text-brand-charcoal mb-2">Draw History</h1>
        <p className="text-brand-muted">Review past results and see how your scores performed.</p>
      </header>

      <div className="space-y-6">
        {draws?.map((draw) => {
          const entry = entryMap[draw.id]
          const isWinner = entry?.is_winner

          return (
            <div key={draw.id} className={`card-premium overflow-hidden ${isWinner ? 'border-brand-gold bg-brand-gold/5' : ''}`}>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Draw Info */}
                <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-brand-cream-dark pr-8 pb-8 md:pb-0">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="w-5 h-5 text-brand-muted" />
                    <span className="text-sm font-bold uppercase tracking-widest text-brand-muted">
                      {format(new Date(draw.draw_year, draw.draw_month - 1), 'MMMM yyyy')}
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-6">Official Result</h3>
                  <div className="flex flex-wrap gap-2">
                    {draw.winning_numbers.map((n, i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-brand-charcoal text-white flex items-center justify-center font-bold text-sm shadow-inner">
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Entry Info */}
                <div className="flex-grow flex flex-col justify-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-4">Your Entry Snapshot</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {entry?.scores_snapshot.map((n, i) => {
                      const isMatch = draw.winning_numbers.includes(n)
                      return (
                        <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                          isMatch ? 'bg-brand-green text-white border-brand-green ring-4 ring-brand-green/10' : 'bg-brand-cream border-brand-cream-dark text-brand-muted'
                        }`}>
                          {n}
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-brand-muted">Matched:</span>
                      <span className="text-lg font-bold text-brand-charcoal">{entry?.matched_count || 0}</span>
                    </div>
                    <div className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold ${
                      isWinner ? 'bg-brand-gold text-brand-charcoal' : 'bg-brand-cream text-brand-muted'
                    }`}>
                      {isWinner ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span>{isWinner ? 'WINNER' : 'NO MATCH'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {(!draws || draws.length === 0) && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
            <Trophy className="w-12 h-12 text-brand-cream-dark mx-auto mb-4" />
            <p className="text-brand-muted italic">The first draw hasn't happened yet. Good luck!</p>
          </div>
        )}
      </div>
    </div>
  )
}
