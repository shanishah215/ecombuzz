import type { Request, Response, NextFunction } from 'express'
import { orderService } from '@/services/orderService'
import { successResponse } from '@/utils/apiResponse'
import { p } from '@/utils/params'
import type { OrderStatus } from '@/models/Order'

export const orderController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { addressId, paymentMethod } = req.body as { addressId: string; paymentMethod: string }
      const order = await orderService.create(String(req.user!._id), addressId, paymentMethod)
      successResponse(res, order, 'Order placed successfully', 201)
    } catch (err) { next(err) }
  },

  async getUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getUserOrders(String(req.user!._id))
      successResponse(res, orders, 'Orders fetched')
    } catch (err) { next(err) }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getById(String(req.user!._id), p(req.params.id))
      successResponse(res, order, 'Order fetched')
    } catch (err) { next(err) }
  },

  // ─── Admin ────────────────────────────────────────────────────────────────
  async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1
      const data = await orderService.getAllAdmin(page)
      successResponse(res, data, 'Orders fetched')
    } catch (err) { next(err) }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body as { status: OrderStatus }
      const order = await orderService.updateStatus(p(req.params.id), status)
      successResponse(res, order, 'Order status updated')
    } catch (err) { next(err) }
  },
}
