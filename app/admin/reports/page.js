'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts'
import { Download, Filter, TrendingUp, Heart, Trophy, Users } from 'lucide-react'

export default function AdminReportsPage() {
  const [data, setData] = useState({
    growth: [
      { month: 'Jan', users: 120, revenue: 1200 },
      { month: 'Feb', users: 150, revenue: 1500 },
      { month: 'Mar', users: 200, revenue: 2000 },
      { month: 'Apr', users: 400, revenue: 4000 },
      { month: 'May', users: 450, revenue: 4500 },
      { month: 'Jun', users: 600, revenue: 6000 },
    ],
    charitySplit: [
      { name: 'Children First', value: 450 },
      { name: 'Green Earth', value: 300 },
      { name: 'Hunger Free', value: 200 },
      { name: 'Veterans', value: 150 },
    ]
  })

  const COLORS = ['#1a5c38', '#c9a84c', '#1c1c1e', '#6b7280']

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-gray-900 mb-2">Platform Reports</h1>
          <p className="text-gray-500">Visualizing growth, impact, and pool distributions.</p>
        </div>
        <button className="flex items-center space-x-2 bg-white border border-gray-200 px-6 py-2 rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Growth Chart */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-bold text-gray-800">User Growth</h4>
              <p className="text-xs text-brand-muted">Total active subscribers over time</p>
            </div>
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <TrendingUp className="w-3 h-3" />
              <span>+45% Growth</span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.growth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#1a5c38', strokeWidth: 2 }}
                />
                <Line type="monotone" dataKey="users" stroke="#1a5c38" strokeWidth={4} dot={{ r: 6, fill: '#1a5c38', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Impact Distribution */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-bold text-gray-800">Charity Impact Distribution</h4>
              <p className="text-xs text-brand-muted">Where the donations are going</p>
            </div>
            <Heart className="w-5 h-5 text-brand-red" />
          </div>
          <div className="h-80 w-full flex flex-col md:flex-row items-center">
            <div className="h-full w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.charitySplit}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.charitySplit.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4 px-8">
               {data.charitySplit.map((item, i) => (
                 <div key={i} className="flex items-center justify-between text-sm">
                   <div className="flex items-center space-x-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                     <span className="text-gray-600">{item.name}</span>
                   </div>
                   <span className="font-bold">£{item.value}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h4 className="font-bold text-gray-800 mb-8">Revenue vs Payouts</h4>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.growth}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#1a5c38" radius={[6, 6, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-brand-charcoal text-white rounded-[2rem] p-8 flex flex-col justify-between">
           <div>
              <Trophy className="w-12 h-12 text-brand-gold mb-6" />
              <h4 className="text-3xl font-serif mb-4">The Payout Ratio</h4>
              <p className="text-gray-400 leading-relaxed italic border-l-2 border-brand-gold pl-4">
                "We maintain a consistent 50% payout ratio to ensure the prize pool remains enticing while scaling impact."
              </p>
           </div>
           
           <div className="mt-12 space-y-2">
              <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Target Payout</span>
                 <span className="text-brand-gold font-bold">50.0%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-brand-gold w-1/2" />
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
