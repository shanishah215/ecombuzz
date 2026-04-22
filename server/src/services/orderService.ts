import { Order } from '@/models/Order'
import { Cart } from '@/models/Cart'
import { Address } from '@/models/Address'
import { Product } from '@/models/Product'
import { AppError } from '@/middleware/errorHandler'
import type { OrderStatus } from '@/models/Order'
import type { Types } from 'mongoose'

const SHIPPING_THRESHOLD = 500   // Free shipping above ₹500
const SHIPPING_CHARGE = 40

interface PopulatedProduct {
  _id: Types.ObjectId
  name: string
  price: number
  images: string[]
  stock: number
  [key: string]: unknown
}

export const orderService = {
  async create(userId: string, addressId: string, paymentMethod: string) {
    // 1. Load cart with populated products
    const cart = await Cart.findOne({ user: userId })
      .populate<{ items: { product: PopulatedProduct; quantity: number }[] }>('items.product')
      .lean()

    if (!cart || cart.items.length === 0) throw new AppError('Cart is empty', 400)

    // 2. Validate address belongs to user
    const address = await Address.findOne({ _id: addressId, user: userId }).lean()
    if (!address) throw new AppError('Address not found', 404)

    // 3. Validate stock + build order items
    const orderItems = []
    let subtotal = 0

    for (const item of cart.items) {
      const product = item.product as PopulatedProduct
      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 400)
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] ?? '',
        price: product.price,
        quantity: item.quantity,
      })
      subtotal += product.price * item.quantity
    }

    // 4. Compute totals
    const shippingCharge = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE
    const total = subtotal + shippingCharge

    // 5. Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        pincode: address.pincode,
        street: address.street,
        city: address.city,
        state: address.state,
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'confirmed',
      subtotal,
      shippingCharge,
      discount: 0,
      total,
    })

    // 6. Decrement stock
    await Promise.all(
      cart.items.map((item) =>
        Product.findByIdAndUpdate((item.product as PopulatedProduct)._id, {
          $inc: { stock: -item.quantity },
        }),
      ),
    )

    // 7. Clear cart
    await Cart.findOneAndUpdate({ user: userId }, { items: [] })

    return order.populate('items.product')
  },

  async getUserOrders(userId: string) {
    return Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images price')
      .lean()
  },

  async getById(userId: string, orderId: string, isAdmin = false) {
    const query = isAdmin ? { _id: orderId } : { _id: orderId, user: userId }
    const order = await Order.findOne(query)
      .populate('items.product', 'name images price slug')
      .lean()
    if (!order) throw new AppError('Order not found', 404)
    return order
  },

  // Admin
  async getAllAdmin(page = 1, limit = 20) {
    const [orders, total] = await Promise.all([
      Order.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user', 'name email')
        .lean(),
      Order.countDocuments(),
    ])
    return { orders, total, page, totalPages: Math.ceil(total / limit) }
  },

  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    )
    if (!order) throw new AppError('Order not found', 404)
    return order
  },
}
