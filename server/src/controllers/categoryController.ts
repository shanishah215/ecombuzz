import type { Request, Response, NextFunction } from 'express'
import { categoryService } from '@/services/categoryService'
import { successResponse } from '@/utils/apiResponse'
import { p } from '@/utils/params'

export const categoryController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const onlyActive = req.query.all !== 'true'
      const categories = await categoryService.getAll(onlyActive)
      successResponse(res, categories, 'Categories fetched')
    } catch (err) { next(err) }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getBySlug(p(req.params.slug))
      successResponse(res, category, 'Category fetched')
    } catch (err) { next(err) }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.create(req.body)
      successResponse(res, category, 'Category created', 201)
    } catch (err) { next(err) }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.update(p(req.params.id), req.body)
      successResponse(res, category, 'Category updated')
    } catch (err) { next(err) }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.delete(p(req.params.id))
      successResponse(res, null, 'Category deleted')
    } catch (err) { next(err) }
  },
}
