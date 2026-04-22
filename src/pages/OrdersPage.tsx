import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { ordersApi } from '@/api/orders'
import { formatPrice, getErrorMessage } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import type { Order, OrderStatus } from '@/types'

const statusVariant: Record<OrderStatus, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
  delivered: 'success',
  shipped: 'info',
  processing: 'info',
  confirmed: 'info',
  pending: 'warning',
  cancelled: 'danger',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ordersApi.getAll()
      .then(({ data }) => setOrders(data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
    </div>
  )

  if (error) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center text-red-500">{error}</div>
  )

  if (orders.length === 0) return (
    <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center gap-4">
      <Package size={64} className="text-gray-300" />
      <h2 className="text-xl font-semibold text-gray-700">No orders yet</h2>
      <Link to="/products" className="text-[#2874f0] hover:underline text-sm">Start Shopping</Link>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">My Orders</h1>
      <div className="flex flex-col gap-3">
        {orders.map((order) => (
          <Link key={order._id} to={`/orders/${order._id}`} className="bg-white rounded-sm shadow-sm p-4 hover:shadow-md transition block">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-400">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <Badge variant={statusVariant[order.status]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {order.items.slice(0, 3).map((item, i) => (
                  <img
                    key={i}
                    src={item.product?.images?.[0] ?? item.image}
                    alt={item.name}
                    className="w-12 h-12 object-contain border border-gray-100 bg-gray-50 rounded"
                  />
                ))}
                {order.items.length > 3 && (
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500 border border-gray-100">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 line-clamp-1">
                  {order.items.map((i) => i.name).join(', ')}
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">{formatPrice(order.total)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
