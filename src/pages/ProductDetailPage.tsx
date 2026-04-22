import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Shield, RotateCcw, Truck } from 'lucide-react'
import { useProduct } from '@/features/products/hooks/useProducts'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useCartStore } from '@/features/cart/store/cartStore'
import { useWishlistStore } from '@/features/wishlist/store/wishlistStore'
import { formatPrice } from '@/lib/utils'
import RatingStars from '@/components/ui/RatingStars'
import Button from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { product, isLoading, error } = useProduct(slug ?? '')
  const { isAuthenticated } = useAuthStore()
  const { addItem, addLocal, isLoading: cartLoading } = useCartStore()
  const { toggle, isInWishlist } = useWishlistStore()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <p className="text-red-500 text-lg">{error}</p>
    </div>
  )

  async function handleAddToCart() {
    if (!product) return
    if (isAuthenticated) {
      await addItem(product, quantity)
    } else {
      addLocal(product, quantity)
    }
  }

  async function handleBuyNow() {
    await handleAddToCart()
    navigate(isAuthenticated ? '/checkout' : '/login')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-white rounded-sm shadow-sm">
        {isLoading || !product ? (
          <div className="flex flex-col sm:flex-row gap-8 p-6">
            <Skeleton className="w-full sm:w-80 h-80" />
            <div className="flex-1 flex flex-col gap-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-0">
            {/* Image panel */}
            <div className="sm:w-80 lg:w-96 shrink-0 border-b sm:border-b-0 sm:border-r border-gray-100 p-6 flex flex-col gap-3 sm:sticky top-20 self-start">
              <div className="w-full h-72 flex items-center justify-center overflow-hidden">
                <img
                  src={product.images[selectedImage] ?? product.images[0]}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 flex-wrap justify-center">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-12 h-12 border-2 rounded overflow-hidden transition ${i === selectedImage ? 'border-[#2874f0]' : 'border-gray-200'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
              {/* CTA */}
              <div className="flex gap-2 mt-2">
                <Button
                  onClick={handleAddToCart}
                  isLoading={cartLoading}
                  className="flex-1 bg-[#ff9f00] hover:bg-[#e8900a] text-white flex items-center gap-2 justify-center"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </Button>
                <Button onClick={handleBuyNow} className="flex-1">
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Details panel */}
            <div className="flex-1 p-6 flex flex-col gap-4">
              {/* Brand + wishlist */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                  <h1 className="text-xl font-semibold text-gray-800 leading-snug">{product.name}</h1>
                </div>
                <button
                  onClick={() => {
                    toggle(product)
                  }}
                  className="p-2 border border-gray-200 rounded hover:bg-gray-50"
                  aria-label="Wishlist"
                >
                  <Heart
                    size={20}
                    className={isInWishlist(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                  />
                </button>
              </div>

              {product.rating > 0 && (
                <RatingStars rating={product.rating} count={product.reviewCount} size={13} />
              )}

              <hr />

              {/* Pricing */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-base text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                    <span className="text-base text-green-600 font-semibold">{product.discount}% off</span>
                  </>
                )}
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-lg hover:bg-gray-100"
                  >−</button>
                  <span className="px-4 py-1 border-x border-gray-300 text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-1 text-lg hover:bg-gray-100"
                  >+</button>
                </div>
                <span className={`text-xs ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                  {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                </span>
              </div>

              <hr />

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">About this product</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                {[
                  { icon: Truck, label: 'Free Delivery', sub: 'On orders above ₹500' },
                  { icon: RotateCcw, label: '7 Day Return', sub: 'Easy return policy' },
                  { icon: Shield, label: 'Secure Payment', sub: '100% safe & secure' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3 border border-gray-100 rounded p-3">
                    <Icon size={20} className="text-[#2874f0] shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-500">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {product.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
