import type { Request, Response, NextFunction } from 'express'
import { wishlistService } from '@/services/wishlistService'
import { successResponse } from '@/utils/apiResponse'
import { p } from '@/utils/params'

export const wishlistController = {
  async getWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await wishlistService.getWishlist(String(req.user!._id))
      successResponse(res, items, 'Wishlist fetched')
    } catch (err) { next(err) }
  },

  async addProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.body as { productId: string }
      const items = await wishlistService.addProduct(String(req.user!._id), productId)
      successResponse(res, items, 'Added to wishlist')
    } catch (err) { next(err) }
  },

  async removeProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await wishlistService.removeProduct(
        String(req.user!._id),
        p(req.params.productId),
      )
      successResponse(res, items, 'Removed from wishlist')
    } catch (err) { next(err) }
  },
}
