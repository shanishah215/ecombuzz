import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/features/cart/store/cartStore'
import { useAuthStore } from '@/features/auth/store/authStore'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function CartPage() {
  const { items, total, itemCount, removeItem, updateQuantity, removeLocal, updateLocal, isLoading } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  const remove = isAuthenticated ? removeItem : removeLocal
  const update = isAuthenticated
    ? (id: string, qty: number) => updateQuantity(id, qty)
    : updateLocal

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center gap-4">
        <ShoppingBag size={64} className="text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400 text-sm">Add items to get started</p>
        <Link to="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        My Cart <span className="text-base font-normal text-gray-500">({itemCount} items)</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Cart items */}
        <div className="flex-1 flex flex-col gap-3">
          {items.map(({ product, quantity }) => (
            <div key={product._id} className="bg-white rounded-sm shadow-sm p-4 flex gap-4">
              <Link to={`/products/${product.slug}`} className="shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-20 h-20 object-contain"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${product.slug}`} className="text-sm font-medium text-gray-800 hover:text-[#2874f0] line-clamp-2">
                  {product.name}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">{product.brand}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
                  {product.discount > 0 && (
                    <span className="text-xs text-green-600">{product.discount}% off</span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-3">
                  {/* Qty stepper */}
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => quantity > 1 ? update(product._id, quantity - 1) : remove(product._id)}
                      className="px-2.5 py-1 hover:bg-gray-100 text-gray-600"
                    >−</button>
                    <span className="px-3 py-1 border-x border-gray-200 text-sm">{quantity}</span>
                    <button
                      onClick={() => update(product._id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="px-2.5 py-1 hover:bg-gray-100 text-gray-600 disabled:opacity-40"
                    >+</button>
                  </div>
                  <button
                    onClick={() => remove(product._id)}
                    className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-sm shadow-sm p-5 sticky top-20">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">Price Details</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Price ({itemCount} items)</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Charges</span>
                <span className={total >= 500 ? 'text-green-600 font-medium' : ''}>
                  {total >= 500 ? 'FREE' : formatPrice(40)}
                </span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-base">
                <span>Total Amount</span>
                <span>{formatPrice(total >= 500 ? total : total + 40)}</span>
              </div>
              {total >= 500 && (
                <p className="text-xs text-green-600 font-medium">
                  You save {formatPrice(40)} on delivery!
                </p>
              )}
            </div>
            <Button
              onClick={() => navigate(isAuthenticated ? '/checkout' : '/login')}
              isLoading={isLoading}
              size="lg"
              className="w-full mt-5"
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
