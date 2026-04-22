import { useState } from 'react'
import { User, Mail, Shield, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import { authApi } from '@/api/auth'
import { useCartStore } from '@/features/cart/store/cartStore'
import { useWishlistStore } from '@/features/wishlist/store/wishlistStore'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, clearAuth } = useAuthStore()
  const { items: cartItems } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await authApi.logout().catch(() => null)
    clearAuth()
    toast.success('Logged out')
    navigate('/')
  }

  if (!user) return null

  const stats = [
    { label: 'Cart Items', value: cartItems.length },
    { label: 'Wishlist', value: wishlistItems.length },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4">
      {/* Profile card */}
      <div className="bg-white rounded-sm shadow-sm p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[#2874f0] flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-gray-800">{user.name}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
            <Mail size={13} /> {user.email}
          </div>
          {user.role === 'admin' && (
            <div className="flex items-center gap-1 mt-1">
              <Shield size={13} className="text-[#2874f0]" />
              <span className="text-xs text-[#2874f0] font-medium">Admin</span>
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
          My Orders
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-white rounded-sm shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-[#2874f0]">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Account info */}
      <div className="bg-white rounded-sm shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">Account Details</h2>
        <div className="flex flex-col gap-3">
          {[
            { icon: User, label: 'Name', value: user.name },
            { icon: Mail, label: 'Email', value: user.email },
            { icon: Shield, label: 'Role', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <Icon size={16} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-500 w-16 shrink-0">{label}</span>
              <span className="text-sm text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-sm shadow-sm divide-y divide-gray-50">
        {[
          { label: 'My Orders', path: '/orders' },
          { label: 'My Wishlist', path: '/wishlist' },
          { label: 'My Cart', path: '/cart' },
          ...(user.role === 'admin' ? [{ label: 'Admin Panel', path: '/admin/dashboard' }] : []),
        ].map(({ label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-50 text-left"
          >
            {label}
            <span className="text-gray-300">›</span>
          </button>
        ))}
      </div>

      {/* Logout */}
      <Button
        variant="danger"
        onClick={handleLogout}
        isLoading={loggingOut}
        className="w-full flex items-center gap-2 justify-center"
      >
        <LogOut size={16} /> Logout
      </Button>
    </div>
  )
}
