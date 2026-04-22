import { Wishlist } from '@/models/Wishlist'
import { Product } from '@/models/Product'
import { AppError } from '@/middleware/errorHandler'

async function getPopulated(userId: string) {
  const wishlist = await Wishlist.findOne({ user: userId })
    .populate('products')
    .lean()
  return wishlist?.products ?? []
}

export const wishlistService = {
  async getWishlist(userId: string) {
    return getPopulated(userId)
  },

  async addProduct(userId: string, productId: string) {
    const product = await Product.findById(productId)
    if (!product) throw new AppError('Product not found', 404)

    let wishlist = await Wishlist.findOne({ user: userId })
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] })
    }

    const alreadyIn = wishlist.products.some((id) => id.toString() === productId)
    if (!alreadyIn) {
      wishlist.products.push(product._id)
      await wishlist.save()
    }

    return getPopulated(userId)
  },

  async removeProduct(userId: string, productId: string) {
    const wishlist = await Wishlist.findOne({ user: userId })
    if (!wishlist) throw new AppError('Wishlist not found', 404)

    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId)
    await wishlist.save()

    return getPopulated(userId)
  },
}
