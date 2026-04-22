import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Heart, User, Search, LogOut, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useCartStore } from '@/features/cart/store/cartStore'
import { useWishlistStore } from '@/features/wishlist/store/wishlistStore'
import { authApi } from '@/api/auth'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore()
  const { itemCount } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')

  // Sync search input with URL param
  const urlSearch = new URLSearchParams(location.search).get('search') ?? ''
  useEffect(() => {
    setSearch(urlSearch)
  }, [urlSearch])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = search.trim()
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`)
    } else {
      navigate('/products')
    }
  }

  async function handleLogout() {
    await authApi.logout().catch(() => null)
    clearAuth()
    toast.success('Logged out')
    navigate('/')
  }

  return (
    <header className="bg-[#2874f0] sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link to="/home" className="flex flex-col leading-none mr-2 shrink-0">
          <span className="text-white font-bold text-xl tracking-tight">EcomBuzz</span>
          <span className="text-[#ffe500] text-[10px] italic font-medium">
            Explore <span className="text-white">Plus</span>
          </span>
        </Link>

        {/* Search */}
        {location.pathname !== '/login' && (
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative flex items-center">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products, brands and more"
                className="w-full h-9 pl-4 pr-10 bg-white rounded text-sm outline-none text-gray-800"
              />
              <button
                type="submit"
                className="absolute right-0 h-9 w-10 flex items-center justify-center text-[#2874f0] hover:text-[#1a5dc8]"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
        )}

        {/* Nav actions */}
        <nav className="flex items-center gap-1 ml-auto shrink-0">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1 px-3 py-1.5 text-white text-sm font-medium hover:bg-white/10 rounded"
                >
                  <LayoutDashboard size={16} />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}
              {/* Wishlist with badge */}
              <Link
                to="/wishlist"
                className="relative flex items-center gap-1 px-3 py-1.5 text-white text-sm font-medium hover:bg-white/10 rounded"
              >
                <Heart size={16} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                  </span>
                )}
                <span className="hidden sm:inline">Wishlist</span>
              </Link>

              {/* Cart with badge */}
              <Link
                to="/cart"
                className="relative flex items-center gap-1 px-3 py-1.5 text-white text-sm font-medium hover:bg-white/10 rounded"
              >
                <ShoppingCart size={16} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#fb641b] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
                <span className="hidden sm:inline">Cart</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-1 px-3 py-1.5 text-white text-sm font-medium hover:bg-white/10 rounded"
              >
                <User size={16} />
                <span className="hidden sm:inline max-w-[80px] truncate">{user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 text-white text-sm font-medium hover:bg-white/10 rounded"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
