import { Cart } from '@/models/Cart'
import { Product } from '@/models/Product'
import { AppError } from '@/middleware/errorHandler'
import type { Types } from 'mongoose'

interface PopulatedProduct {
  _id: Types.ObjectId
  price: number
  name: string
  images: string[]
  [key: string]: unknown
}

interface LeanCartItem {
  product: PopulatedProduct | Types.ObjectId
  quantity: number
}

interface LeanCart {
  _id: Types.ObjectId
  user: Types.ObjectId
  items: LeanCartItem[]
  [key: string]: unknown
}

function computeTotals(cart: LeanCart) {
  const total = cart.items.reduce((sum, item) => {
    const price =
      typeof item.product === 'object' && 'price' in item.product
        ? (item.product as PopulatedProduct).price
        : 0
    return sum + price * item.quantity
  }, 0)
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  return { ...cart, total, itemCount }
}

async function getPopulatedCart(userId: string) {
  const cart = await Cart.findOne({ user: userId })
    .populate<{ items: { product: PopulatedProduct; quantity: number }[] }>('items.product')
    .lean<LeanCart>()
  if (!cart) return { items: [], total: 0, itemCount: 0 }
  return computeTotals(cart)
}

export const cartService = {
  async getCart(userId: string) {
    return getPopulatedCart(userId)
  },

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await Product.findById(productId)
    if (!product) throw new AppError('Product not found', 404)
    if (!product.isActive) throw new AppError('Product is not available', 400)
    if (product.stock < quantity) throw new AppError('Insufficient stock', 400)

    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] })
    }

    const existingIdx = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    )

    if (existingIdx > -1) {
      const newQty = cart.items[existingIdx].quantity + quantity
      if (product.stock < newQty) throw new AppError('Insufficient stock', 400)
      cart.items[existingIdx].quantity = newQty
    } else {
      cart.items.push({ product: product._id, quantity })
    }

    await cart.save()
    return getPopulatedCart(userId)
  },

  async updateItem(userId: string, productId: string, quantity: number) {
    if (quantity < 1) throw new AppError('Quantity must be at least 1', 400)

    const product = await Product.findById(productId)
    if (!product) throw new AppError('Product not found', 404)
    if (product.stock < quantity) throw new AppError('Insufficient stock', 400)

    const cart = await Cart.findOne({ user: userId })
    if (!cart) throw new AppError('Cart not found', 404)

    const item = cart.items.find((i) => i.product.toString() === productId)
    if (!item) throw new AppError('Item not in cart', 404)

    item.quantity = quantity
    await cart.save()
    return getPopulatedCart(userId)
  },

  async removeItem(userId: string, productId: string) {
    const cart = await Cart.findOne({ user: userId })
    if (!cart) throw new AppError('Cart not found', 404)

    cart.items = cart.items.filter((i) => i.product.toString() !== productId)
    await cart.save()
    return getPopulatedCart(userId)
  },

  async clearCart(userId: string) {
    await Cart.findOneAndUpdate({ user: userId }, { items: [] })
    return { items: [], total: 0, itemCount: 0 }
  },
}
