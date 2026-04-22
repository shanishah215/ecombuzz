import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useProducts } from '@/features/products/hooks/useProducts'
import ProductCard from '@/features/products/components/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'

const CATEGORIES = [
  { label: 'Electronics', icon: '💻', value: 'electronics' },
  { label: 'Fashion', icon: '👗', value: 'fashion' },
  { label: 'Home', icon: '🏠', value: 'home' },
  { label: 'Beauty', icon: '💄', value: 'beauty' },
  { label: 'Sports', icon: '⚽', value: 'sports' },
  { label: 'Books', icon: '📚', value: 'books' },
]

export default function HomePage() {
  const { data, isLoading } = useProducts({ limit: 8, sort: 'newest' })
  const { data: topRated, isLoading: topLoading } = useProducts({ limit: 8, sort: 'rating' })

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#2874f0] to-[#0057d1] rounded-sm p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
        <div>
          <p className="text-sm uppercase tracking-widest text-blue-200 mb-1">Limited Time Deals</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">
            Mega Sale — Up to 70% Off
          </h1>
          <p className="text-blue-100 mb-5 text-sm">On electronics, fashion, home & more</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 bg-[#fb641b] hover:bg-[#e5571a] text-white font-semibold px-6 py-2.5 rounded transition"
          >
            Shop Now <ChevronRight size={18} />
          </Link>
        </div>
        <div className="text-8xl hidden sm:block">🛍️</div>
      </div>

      {/* Categories */}
      <section className="bg-white rounded-sm p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Shop by Category</h2>
          <Link to="/products" className="text-sm text-[#2874f0] hover:underline flex items-center">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              to={`/products?category=${cat.value}`}
              className="flex flex-col items-center gap-2 p-3 rounded hover:bg-blue-50 transition"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs text-gray-700 font-medium text-center">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-white rounded-sm p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">New Arrivals</h2>
          <Link to="/products?sort=newest" className="text-sm text-[#2874f0] hover:underline flex items-center">
            See all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100 border border-gray-100">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : data?.products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* Top Rated */}
      <section className="bg-white rounded-sm p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Top Rated</h2>
          <Link to="/products?sort=rating" className="text-sm text-[#2874f0] hover:underline flex items-center">
            See all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-100 border border-gray-100">
          {topLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : topRated?.products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>
    </div>
  )
}
