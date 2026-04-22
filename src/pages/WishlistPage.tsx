import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import { useWishlistStore } from '@/features/wishlist/store/wishlistStore'
import { useCartStore } from '@/features/cart/store/cartStore'
import { useAuthStore } from '@/features/auth/store/authStore'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function WishlistPage() {
  const { items, toggle } = useWishlistStore()
  const { addItem, addLocal } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center gap-4">
        <Heart size={64} className="text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-700">Your wishlist is empty</h2>
        <p className="text-sm text-gray-400">Save items you love here</p>
        <Link to="/products">
          <Button>Explore Products</Button>
        </Link>
      </div>
    )
  }

  function moveToCart(product: (typeof items)[0]) {
    if (isAuthenticated) addItem(product)
    else addLocal(product)
    toggle(product)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        My Wishlist <span className="text-base font-normal text-gray-500">({items.length} items)</span>
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((product) => (
          <div key={product._id} className="bg-white rounded-sm shadow-sm overflow-hidden flex flex-col">
            <Link to={`/products/${product.slug}`} className="flex-1">
              <div className="h-48 flex items-center justify-center p-4 bg-gray-50">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-3">
                <p className="text-sm text-gray-800 font-medium line-clamp-2 mb-1">{product.name}</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-gray-900 text-sm">{formatPrice(product.price)}</span>
                  {product.discount > 0 && (
                    <span className="text-xs text-green-600">{product.discount}% off</span>
                  )}
                </div>
              </div>
            </Link>
            <div className="flex border-t border-gray-100">
              <button
                onClick={() => toggle(product)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-gray-500 hover:text-red-500 hover:bg-gray-50 transition"
              >
                <Heart size={14} className="fill-red-400 text-red-400" />
                Remove
              </button>
              <div className="w-px bg-gray-100" />
              <button
                onClick={() => moveToCart(product)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-[#2874f0] hover:bg-blue-50 transition font-medium"
              >
                <ShoppingCart size={14} />
                Move to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
