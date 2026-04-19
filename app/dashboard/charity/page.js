import { createServerSideClient } from '@/lib/supabase-server'
import CharitySelector from '@/components/dashboard/CharitySelector'

export default async function CharityPage() {
  const supabase = createServerSideClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const { redirect } = await import('next/navigation')
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('charity_id, charity_contribution_percent')
    .eq('id', user.id)
    .single()

  return (
    <div className="space-y-10">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-serif text-brand-charcoal mb-4">Choose Your Impact</h1>
        <p className="text-xl text-brand-muted leading-relaxed">
          Select the charity you want to support with your monthly subscription. You can change this at any time.
        </p>
      </header>

      <CharitySelector 
        initialCharityId={profile?.charity_id} 
        initialPercent={profile?.charity_contribution_percent} 
      />
    </div>
  )
}
