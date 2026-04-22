import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { useProducts } from '@/features/products/hooks/useProducts'
import { useDebounce } from '@/hooks/useDebounce'
import ProductCard from '@/features/products/components/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import type { ProductFilters } from '@/types'

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Top Rated', value: 'rating' },
]

const CATEGORIES = ['electronics', 'fashion', 'home', 'beauty', 'sports', 'books']

export default function ProductListPage() {
  const [searchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const debouncedSearch = useDebounce(search, 400)

  const [filters, setFilters] = useState<ProductFilters>({
    category: searchParams.get('category') ?? undefined,
    sort: (searchParams.get('sort') ?? '') as ProductFilters['sort'],
    page: 1,
  })

  const { data, isLoading } = useProducts({ ...filters, search: debouncedSearch || undefined })

  useEffect(() => {
    setFilters((f) => ({ ...f, page: 1 }))
  }, [debouncedSearch])

  function setFilter(key: keyof ProductFilters, value: unknown) {
    setFilters((f) => ({ ...f, [key]: value || undefined, page: 1 }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Top bar */}
      <div className="bg-white shadow-sm rounded-sm px-4 py-3 flex flex-wrap items-center gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="flex-1 min-w-[200px] border border-gray-200 rounded px-3 py-1.5 text-sm outline-none focus:border-[#2874f0]"
        />
        <select
          value={filters.sort ?? ''}
          onChange={(e) => setFilter('sort', e.target.value)}
          className="border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-[#2874f0]"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters((v) => !v)}
          className="sm:hidden flex items-center gap-1"
        >
          <SlidersHorizontal size={14} /> Filters
        </Button>
      </div>

      <div className="flex gap-4">
        {/* Sidebar filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} sm:block w-full sm:w-56 shrink-0`}>
          <div className="bg-white rounded-sm shadow-sm p-4 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="sm:hidden text-gray-400">
                <X size={16} />
              </button>
            </div>

            {/* Category */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Category</p>
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === cat}
                    onChange={() => setFilter('category', cat)}
                    className="accent-[#2874f0]"
                  />
                  <span className="text-sm capitalize text-gray-700">{cat}</span>
                </label>
              ))}
              {filters.category && (
                <button onClick={() => setFilter('category', '')} className="text-xs text-[#2874f0] mt-1">
                  Clear
                </button>
              )}
            </div>

            {/* Price range */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Price Range</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full border border-gray-200 rounded px-2 py-1 text-xs outline-none"
                  onBlur={(e) => setFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full border border-gray-200 rounded px-2 py-1 text-xs outline-none"
                  onBlur={(e) => setFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Min Rating</p>
              {[4, 3, 2].map((r) => (
                <label key={r} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.rating === r}
                    onChange={() => setFilter('rating', r)}
                    className="accent-[#2874f0]"
                  />
                  <span className="text-sm text-gray-700">{r}★ & above</span>
                </label>
              ))}
              {filters.rating && (
                <button onClick={() => setFilter('rating', '')} className="text-xs text-[#2874f0] mt-1">
                  Clear
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200">
              {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : !data?.products.length ? (
            <div className="bg-white rounded-sm p-12 text-center text-gray-500">
              <p className="text-xl mb-2">No products found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-3">{data.total} products found</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
                {data.products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={data.page <= 1}
                    onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {data.page} of {data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={data.page >= data.totalPages}
                    onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
