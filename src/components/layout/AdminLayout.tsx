import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Package, Tag, ShoppingBag, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Users', icon: Users },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-14 flex items-center px-5 border-b border-gray-200">
          <span className="font-bold text-[#2874f0] text-lg">EcomBuzz Admin</span>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition',
                  isActive
                    ? 'bg-blue-50 text-[#2874f0]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
