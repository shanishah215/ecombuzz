import type { Request, Response, NextFunction } from 'express'
import { cartService } from '@/services/cartService'
import { successResponse } from '@/utils/apiResponse'
import { p } from '@/utils/params'

export const cartController = {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.getCart(String(req.user!._id))
      successResponse(res, cart, 'Cart fetched')
    } catch (err) { next(err) }
  },

  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, quantity = 1 } = req.body as { productId: string; quantity?: number }
      const cart = await cartService.addItem(String(req.user!._id), productId, quantity)
      successResponse(res, cart, 'Item added to cart')
    } catch (err) { next(err) }
  },

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { quantity } = req.body as { quantity: number }
      const cart = await cartService.updateItem(String(req.user!._id), p(req.params.productId), quantity)
      successResponse(res, cart, 'Cart updated')
    } catch (err) { next(err) }
  },

  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.removeItem(String(req.user!._id), p(req.params.productId))
      successResponse(res, cart, 'Item removed from cart')
    } catch (err) { next(err) }
  },

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.clearCart(String(req.user!._id))
      successResponse(res, cart, 'Cart cleared')
    } catch (err) { next(err) }
  },
}
