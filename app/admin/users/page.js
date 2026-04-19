'use client'

import { useState, useEffect } from 'react'
import { Search, Mail, Filter, MoreVertical, Shield, ChevronLeft, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, limit: 20 })

  useEffect(() => {
    fetch(`/api/admin/users?page=${page}&limit=20`)
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || [])
        setPagination(data.pagination)
        setLoading(false)
      })
  }, [page])

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-500">Monitor subscribers, roles, and platform activity.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-green bg-white w-64 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">User</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Plan</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Scores</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400">Joined</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-gray-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-brand-cream border border-brand-cream-dark flex items-center justify-center font-bold text-brand-green">
                        {user.full_name?.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-gray-900 text-sm">{user.full_name}</p>
                          {user.role === 'admin' && <Shield className="w-3 h-3 text-brand-gold" title="Admin" />}
                        </div>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                      user.subscription_status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.subscription_status}
                    </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600 capitalize">
                    {user.subscription_plan || 'None'}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-600">
                    {user.golf_scores?.[0]?.count || 0} rounds
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(user.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-right">
                    <button className="p-2 text-gray-400 hover:text-brand-charcoal">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="font-bold text-gray-900">{filteredUsers.length}</span> of <span className="font-bold text-gray-900">{pagination.total}</span> users
          </p>
          <div className="flex items-center space-x-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              disabled={page * pagination.limit >= pagination.total}
              onClick={() => setPage(p => p + 1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
