import { createServerSideClient } from '@/lib/supabase-server'
import ScoreEntryForm from '@/components/dashboard/ScoreEntryForm'
import ScoreHistory from '@/components/dashboard/ScoreHistory'
import { Info } from 'lucide-react'

export default async function ScoresPage() {
  const supabase = createServerSideClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const { redirect } = await import('next/navigation')
    redirect('/auth/login')
  }

  const { data: scores } = await supabase
    .from('golf_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('score_date', { ascending: false })

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-serif text-brand-charcoal mb-2">My Golf Scores</h1>
        <p className="text-brand-muted">Enter your recent round scores to participate in the upcoming draw.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: Input */}
        <div className="space-y-6">
          <ScoreEntryForm />
          
          <div className="bg-brand-blue/5 border border-brand-blue/20 rounded-2xl p-6 flex items-start space-x-4">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Info className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-blue mb-1">Rolling Score System</p>
              <p className="text-xs text-brand-muted leading-relaxed">
                We only retain your latest 5 rounds for the draw. Adding a sixth score will automatically archive and remove your oldest entry from the active list.
              </p>
            </div>
          </div>
        </div>

        {/* Right: History */}
        <div className="space-y-6">
          <h3 className="text-xl font-serif font-bold">Entry History</h3>
          <ScoreHistory scores={scores || []} />
        </div>
      </div>
    </div>
  )
}
