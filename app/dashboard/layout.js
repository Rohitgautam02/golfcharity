import DashboardSidebar from '@/components/layout/DashboardSidebar'
import { createServerSideClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import SubscriptionStatusBanner from '@/components/dashboard/SubscriptionStatusBanner'

export default async function DashboardLayout({ children }) {
  const supabase = createServerSideClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, role')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex min-h-screen bg-brand-cream/30">
      <DashboardSidebar user={user} profile={profile} />
      
      <div className="flex-grow flex flex-col">
        {/* Top Banner (Conditional) */}
        <SubscriptionStatusBanner status={profile?.subscription_status} />
        
        <main className="p-4 md:p-8 flex-grow">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
