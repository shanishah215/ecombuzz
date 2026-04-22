import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import RatingStars from '@/components/ui/RatingStars'
import { useWishlistStore } from '@/features/wishlist/store/wishlistStore'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggle, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product._id)

  return (
    <div className="bg-white hover:shadow-lg transition-shadow duration-200 group relative flex flex-col">
      {/* Wishlist toggle */}
      <button
        onClick={(e) => {
          e.preventDefault()
          toggle(product)
        }}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow"
        aria-label="Toggle wishlist"
      >
        <Heart
          size={16}
          className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
        />
      </button>

      <Link to={`/products/${product.slug}`} className="flex flex-col h-full p-4">
        {/* Image */}
        <div className="h-48 flex items-center justify-center mb-3 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1 flex-1">
          <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-snug">
            {product.name}
          </p>

          {product.rating > 0 && (
            <RatingStars rating={product.rating} count={product.reviewCount} />
          )}

          <div className="flex items-baseline gap-2 mt-1 flex-wrap">
            <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="text-xs text-green-600 font-semibold">{product.discount}% off</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
