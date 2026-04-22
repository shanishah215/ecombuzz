import { useEffect, useState } from 'react'
import apiClient from '@/api/client'
import Badge from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import type { User } from '@/types'

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    apiClient.get(`/users?page=${page}`)
      .then(({ data }) => { setUsers(data.data.users); setTotal(data.data.total) })
      .finally(() => setIsLoading(false))
  }, [page])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Users <span className="text-sm font-normal text-gray-400">({total})</span></h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Role</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}><td colSpan={4} className="px-4 py-3"><Skeleton className="h-5 w-full" /></td></tr>
              ))
              : users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2874f0] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.role === 'admin' ? 'info' : 'default'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                    {new Date(user.createdAt).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        {Math.ceil(total / 20) > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 text-sm border border-gray-200 rounded disabled:opacity-40">Previous</button>
            <span className="text-sm text-gray-500 self-center">Page {page} of {Math.ceil(total / 20)}</span>
            <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 text-sm border border-gray-200 rounded disabled:opacity-40">Next</button>
          </div>
        )}
      </div>
    </div>
  )
}
