import type { Request, Response, NextFunction } from 'express'
import { productService } from '@/services/productService'
import { successResponse } from '@/utils/apiResponse'
import type { ProductFilters } from '@/repositories/types'
import { p } from '@/utils/params'

export const productController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        category, brand, minPrice, maxPrice, rating, search, sort, page, limit,
      } = req.query as Record<string, string | undefined>

      const filters: ProductFilters = {
        ...(category && { category }),
        ...(brand && { brand }),
        ...(minPrice && { minPrice: Number(minPrice) }),
        ...(maxPrice && { maxPrice: Number(maxPrice) }),
        ...(rating && { rating: Number(rating) }),
        ...(search && { search }),
        ...(sort && { sort: sort as ProductFilters['sort'] }),
        page: page ? Number(page) : 1,
        limit: limit ? Math.min(Number(limit), 100) : 20,
      }

      const data = await productService.getAll(filters)
      successResponse(res, data, 'Products fetched')
    } catch (err) { next(err) }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getBySlug(p(req.params.slug))
      successResponse(res, product, 'Product fetched')
    } catch (err) { next(err) }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getById(p(req.params.id))
      successResponse(res, product, 'Product fetched')
    } catch (err) { next(err) }
  },

  // ─── Admin ────────────────────────────────────────────────────────────────
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.create(req.body as Record<string, unknown>)
      successResponse(res, product, 'Product created', 201)
    } catch (err) { next(err) }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.update(
        p(req.params.id),
        req.body as Record<string, unknown>,
      )
      successResponse(res, product, 'Product updated')
    } catch (err) { next(err) }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.delete(p(req.params.id))
      successResponse(res, null, 'Product deleted')
    } catch (err) { next(err) }
  },

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await productService.getCategories()
      successResponse(res, categories, 'Categories fetched')
    } catch (err) { next(err) }
  },
}
