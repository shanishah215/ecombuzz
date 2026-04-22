import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, CreditCard } from 'lucide-react'
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

const STATUS_STEPS: OrderStatus[] = ['confirmed', 'processing', 'shipped', 'delivered']

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    ordersApi.getById(id)
      .then(({ data }) => setOrder(data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-60 w-full" />
    </div>
  )

  if (error || !order) return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center text-red-500">{error || 'Order not found'}</div>
  )

  const stepIndex = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/orders" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-gray-800">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-xs text-gray-400">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Badge variant={statusVariant[order.status]} className="ml-auto">
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      {/* Tracker (only for non-cancelled) */}
      {order.status !== 'cancelled' && order.status !== 'pending' && (
        <div className="bg-white rounded-sm shadow-sm p-5">
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 z-0" />
            <div
              className="absolute left-0 top-4 h-0.5 bg-[#2874f0] z-0 transition-all"
              style={{ width: `${(Math.max(0, stepIndex) / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-1 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i <= stepIndex ? 'bg-[#2874f0] text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {i <= stepIndex ? '✓' : i + 1}
                </div>
                <span className={`text-xs capitalize ${i <= stepIndex ? 'text-[#2874f0] font-medium' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Delivery address */}
        <div className="bg-white rounded-sm shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-[#2874f0]" />
            <h3 className="font-semibold text-gray-700 text-sm">Delivery Address</h3>
          </div>
          <p className="text-sm font-medium text-gray-800">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-gray-500 mt-1 leading-5">
            {order.shippingAddress.street},<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
          </p>
          <p className="text-sm text-gray-500 mt-1">Phone: {order.shippingAddress.phone}</p>
        </div>

        {/* Payment info */}
        <div className="bg-white rounded-sm shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={16} className="text-[#2874f0]" />
            <h3 className="font-semibold text-gray-700 text-sm">Payment</h3>
          </div>
          <p className="text-sm text-gray-700">
            Method: <span className="font-medium capitalize">{order.paymentMethod}</span>
          </p>
          <p className="text-sm text-gray-700 mt-1">
            Status: <Badge variant={order.paymentStatus === 'paid' ? 'success' : order.paymentStatus === 'failed' ? 'danger' : 'warning'}>
              {order.paymentStatus}
            </Badge>
          </p>
          <div className="mt-3 flex flex-col gap-1 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className={order.shippingCharge === 0 ? 'text-green-600' : ''}>
                {order.shippingCharge === 0 ? 'FREE' : formatPrice(order.shippingCharge)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-1 mt-1">
              <span>Total</span><span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-sm shadow-sm p-5">
        <h3 className="font-semibold text-gray-700 text-sm mb-4">
          Items ({order.items.length})
        </h3>
        <div className="flex flex-col divide-y divide-gray-100">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3">
              <img
                src={item.product?.images?.[0] ?? item.image}
                alt={item.name}
                className="w-16 h-16 object-contain bg-gray-50 rounded border border-gray-100"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900 shrink-0">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
