export const dynamic = 'force-dynamic'

import { createServerSideClient } from '@/lib/supabase-server'
import { Users, CreditCard, Heart, ShieldAlert, ArrowUpRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function AdminOverview() {
  const supabase = createServerSideClient()

  // Fetch summary metrics
  const [userCountRes, paymentsRes, winnersRes] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
    supabase.from('subscription_payments').select('amount, charity_contribution'),
    supabase.from('winners').select('*', { count: 'exact', head: true }).eq('verification_status', 'pending')
  ])

  const activeSubscribers = userCountRes.count || 0
  const pendingVerifications = winnersRes.count || 0
  
  const payments = paymentsRes.data || []
  const totalPrizePool = payments.reduce((acc, curr) => acc + Number(curr.amount) * 0.5, 0)
  const totalCharity = payments.reduce((acc, curr) => acc + Number(curr.charity_contribution), 0)

  const kpis = [
    { label: 'Active Subscribers', value: activeSubscribers, icon: <Users className="w-5 h-5 text-blue-600" />, trend: '+12% this month' },
    { label: 'Total Prize Pool', value: `£${totalPrizePool.toLocaleString()}`, icon: <CreditCard className="w-5 h-5 text-green-600" />, trend: 'Calculated from subs' },
    { label: 'Total Charity Donated', value: `£${totalCharity.toLocaleString()}`, icon: <Heart className="w-5 h-5 text-red-600" />, trend: 'All-time impact' },
    { label: 'Pending Verifications', value: pendingVerifications, icon: <ShieldAlert className="w-5 h-5 text-amber-600" />, trend: 'Action required', urgent: pendingVerifications > 0 }
  ]

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className={`bg-white p-6 rounded-2xl shadow-sm border ${kpi.urgent ? 'border-amber-200 bg-amber-50' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                {kpi.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${kpi.urgent ? 'text-amber-600' : 'text-gray-400'}`}>
                KPI
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{kpi.label}</p>
            <h4 className="text-3xl font-bold text-gray-900 mb-2">{kpi.value}</h4>
            <div className="flex items-center text-xs font-medium text-green-600">
               <TrendingUp className="w-3 h-3 mr-1" />
               <span>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-gray-800">System Controls</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/draws" className="bg-brand-charcoal hover:bg-black p-6 rounded-2xl text-white transition-all group">
              <div className="flex justify-between items-start mb-4">
                <Trophy className="w-8 h-8 text-brand-gold" />
                <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </div>
              <h4 className="text-lg font-bold mb-1">Manage Monthly Draw</h4>
              <p className="text-sm text-gray-400">Simulate results, match winners, and publish payouts.</p>
            </Link>

            <Link href="/admin/winners" className="bg-white border border-gray-200 hover:border-brand-green p-6 rounded-2xl transition-all group">
               <div className="flex justify-between items-start mb-4">
                <ShieldAlert className="w-8 h-8 text-brand-green" />
                <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1 font-serif">Verify Winners</h4>
              <p className="text-sm text-gray-500">Review score proof uploads and approve bank transfers.</p>
            </Link>
          </div>
        </div>

        {/* Recent Events or Logs Placeholder */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
          <h4 className="font-bold text-gray-800 mb-6 flex items-center justify-between">
            <span>Recent Payouts</span>
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase">Live</span>
          </h4>
          <div className="space-y-4 flex-grow">
             <p className="text-sm text-gray-500 italic text-center py-10">No recent payouts to display.</p>
          </div>
          <button className="w-full text-center py-2 text-xs font-bold text-brand-green border-t border-gray-100 mt-4 pt-4 uppercase tracking-widest">
            Full Audit Log
          </button>
        </div>
      </div>
    </div>
  )
}

function Trophy({ className }) { return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v1a4 4 0 004 4v0a4 4 0 004-4v-1M8 14H4M16 14h4m-4-6V6a2 2 0 10-4 0v2H8V6a2 2 0 10-4 0v2h12zM4 14v-2M20 14v-2" /></svg> }
