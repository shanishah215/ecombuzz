import { useEffect, useState } from 'react'
import { ShoppingBag, Package, Users, TrendingUp } from 'lucide-react'
import { ordersApi } from '@/api/orders'
import { productsApi } from '@/api/products'
import apiClient from '@/api/client'
import { formatPrice } from '@/lib/utils'
import { Skeleton } from '@/components/ui/Skeleton'

interface Stats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalUsers: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      ordersApi.getAllAdmin(1),
      productsApi.getAll({ limit: 1 }),
      apiClient.get('/users?limit=1'),
    ]).then(([ordersRes, productsRes, usersRes]) => {
      const paginated = ordersRes.data.data
      const revenue = paginated.orders.reduce((sum, o) => sum + o.total, 0)
      setStats({
        totalOrders: paginated.total,
        totalRevenue: revenue,
        totalProducts: productsRes.data.data.total ?? 0,
        totalUsers: usersRes.data.data.total ?? 0,
      })
    }).finally(() => setIsLoading(false))
  }, [])

  const cards = [
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: ShoppingBag, color: 'bg-blue-500', format: 'number' },
    { label: 'Total Revenue', value: stats?.totalRevenue ?? 0, icon: TrendingUp, color: 'bg-green-500', format: 'currency' },
    { label: 'Products', value: stats?.totalProducts ?? 0, icon: Package, color: 'bg-purple-500', format: 'number' },
    { label: 'Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'bg-orange-500', format: 'number' },
  ] as const

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, format }) => (
          <div key={label} className="bg-white rounded-lg shadow-sm p-5 flex items-center gap-4">
            <div className={`${color} text-white p-3 rounded-lg shrink-0`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              {isLoading
                ? <Skeleton className="h-6 w-20 mt-1" />
                : <p className="text-xl font-bold text-gray-800">
                    {format === 'currency' ? formatPrice(value) : value.toLocaleString('en-IN')}
                  </p>
              }
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-400 mt-8 text-center">
        Use the sidebar to manage products, orders, and users.
      </p>
    </div>
  )
}
