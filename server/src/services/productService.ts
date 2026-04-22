import { ProductRepository } from '@/repositories/productRepository'
import { cacheGet, cacheSet, cacheDel } from '@/config/redis'
import { AppError } from '@/middleware/errorHandler'
import type { ProductFilters } from '@/repositories/types'

const repo = new ProductRepository()

// Cache TTLs (seconds)
const TTL_LIST = 120   // 2 min — product lists change often
const TTL_DETAIL = 300 // 5 min — individual products change less

function listKey(filters: ProductFilters) {
  return `products:list:${JSON.stringify(filters)}`
}

function detailKey(slug: string) {
  return `products:detail:${slug}`
}

export const productService = {
  async getAll(filters: ProductFilters) {
    const key = listKey(filters)
    const cached = await cacheGet(key)
    if (cached) return cached

    const result = await repo.findAll(filters)
    await cacheSet(key, result, TTL_LIST)
    return result
  },

  async getBySlug(slug: string) {
    const key = detailKey(slug)
    const cached = await cacheGet(key)
    if (cached) return cached

    const product = await repo.findBySlug(slug)
    if (!product) throw new AppError('Product not found', 404)

    await cacheSet(key, product, TTL_DETAIL)
    return product
  },

  async getById(id: string) {
    const product = await repo.findById(id)
    if (!product) throw new AppError('Product not found', 404)
    return product
  },

  async create(data: Record<string, unknown>) {
    // Auto-generate slug from name if not provided
    if (!data.slug && data.name) {
      data.slug = (data.name as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }
    const product = await repo.create(data as Parameters<typeof repo.create>[0])
    return product
  },

  async update(id: string, data: Record<string, unknown>) {
    if (data.name && !data.slug) {
      data.slug = (data.name as string)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }
    const product = await repo.update(id, data as Parameters<typeof repo.update>[1])
    if (!product) throw new AppError('Product not found', 404)

    // Invalidate cache for this product
    await cacheDel(detailKey(product.slug))
    return product
  },

  async delete(id: string) {
    const product = await repo.delete(id)
    if (!product) throw new AppError('Product not found', 404)
    await cacheDel(detailKey(product.slug))
    return product
  },
}
