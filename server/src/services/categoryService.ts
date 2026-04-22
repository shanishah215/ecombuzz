import { CategoryRepository } from '@/repositories/categoryRepository'
import { AppError } from '@/middleware/errorHandler'

const repo = new CategoryRepository()

export const categoryService = {
  async getAll(onlyActive = true) {
    return repo.findAll(onlyActive)
  },

  async getBySlug(slug: string) {
    const category = await repo.findBySlug(slug)
    if (!category) throw new AppError('Category not found', 404)
    return category
  },

  async create(data: any) {
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
    return repo.create(data)
  },

  async update(id: string, data: any) {
    if (data.name && !data.slug) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
    const category = await repo.update(id, data)
    if (!category) throw new AppError('Category not found', 404)
    return category
  },

  async delete(id: string) {
    const category = await repo.delete(id)
    if (!category) throw new AppError('Category not found', 404)
    return category
  },
}
