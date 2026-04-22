import type { Request, Response, NextFunction } from 'express'
import { addressService } from '@/services/addressService'
import { successResponse } from '@/utils/apiResponse'
import { p } from '@/utils/params'

export const addressController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const addresses = await addressService.getAll(String(req.user!._id))
      successResponse(res, addresses, 'Addresses fetched')
    } catch (err) { next(err) }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const address = await addressService.create(String(req.user!._id), req.body as Record<string, unknown>)
      successResponse(res, address, 'Address added', 201)
    } catch (err) { next(err) }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const address = await addressService.update(
        String(req.user!._id),
        p(req.params.id),
        req.body as Record<string, unknown>,
      )
      successResponse(res, address, 'Address updated')
    } catch (err) { next(err) }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await addressService.delete(String(req.user!._id), p(req.params.id))
      successResponse(res, null, 'Address deleted')
    } catch (err) { next(err) }
  },
}
