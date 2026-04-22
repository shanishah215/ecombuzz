import { useEffect, useState } from 'react'
import { ordersApi } from '@/api/orders'
import { formatPrice, getErrorMessage } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'
import toast from 'react-hot-toast'
import type { Order, OrderStatus } from '@/types'

const ALL_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  function load(p = 1) {
    setIsLoading(true)
    ordersApi.getAllAdmin(p)
      .then(({ data }) => { setOrders(data.data.orders); setTotal(data.data.total) })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => { load(page) }, [page])

  async function changeStatus(orderId: string, status: OrderStatus) {
    try {
      await ordersApi.updateStatus(orderId, status)
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o))
      toast.success('Status updated')
    } catch (err) { toast.error(getErrorMessage(err)) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Orders <span className="text-sm font-normal text-gray-400">({total})</span></h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Order ID</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Customer</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Total</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-4 py-3"><Skeleton className="h-5 w-full" /></td></tr>
              ))
              : orders.map((order) => {
                const user = (order as unknown as { user?: { name: string; email: string } }).user
                return (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {user ? (
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => changeStatus(order._id, e.target.value as OrderStatus)}
                        className="text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:border-[#2874f0] bg-white"
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        {Math.ceil(total / 20) > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 text-sm border border-gray-200 rounded disabled:opacity-40"
            >Previous</button>
            <span className="text-sm text-gray-500 self-center">Page {page} of {Math.ceil(total / 20)}</span>
            <button
              disabled={page >= Math.ceil(total / 20)}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 text-sm border border-gray-200 rounded disabled:opacity-40"
            >Next</button>
          </div>
        )}
      </div>
    </div>
  )
}
