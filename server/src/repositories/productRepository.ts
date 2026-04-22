import { Product } from '@/models/Product'
import type { SortOrder } from 'mongoose'
import type { ProductFilters } from './types'

export class ProductRepository {
  async findAll(filters: ProductFilters = {}) {
    const { category, brand, minPrice, maxPrice, rating, search, sort, page = 1, limit = 20 } = filters
    const query: Record<string, unknown> = { isActive: true }

    if (category) query.category = category
    if (brand) query.brand = brand
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {
        ...(minPrice !== undefined && { $gte: minPrice }),
        ...(maxPrice !== undefined && { $lte: maxPrice }),
      }
    }
    if (rating) query.rating = { $gte: rating }
    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      query.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { brand: { $regex: safeSearch, $options: 'i' } },
        { category: { $regex: safeSearch, $options: 'i' } },
        { tags: { $regex: safeSearch, $options: 'i' } },
      ]
    }

    const sortMap: Record<string, Record<string, SortOrder>> = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 },
      rating: { rating: -1 },
    }
    const sortOption: Record<string, SortOrder> = sort ? sortMap[sort] : { createdAt: -1 }

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ])

    return { products, total, page, totalPages: Math.ceil(total / limit) }
  }

  findBySlug(slug: string) {
    return Product.findOne({ slug, isActive: true }).lean()
  }

  findById(id: string) {
    return Product.findById(id).lean()
  }

  create(data: Partial<InstanceType<typeof Product>>) {
    return Product.create(data)
  }

  update(id: string, data: Partial<InstanceType<typeof Product>>) {
    return Product.findByIdAndUpdate(id, data, { new: true })
  }

  delete(id: string) {
    return Product.findByIdAndDelete(id)
  }

  async findCategories() {
    const categories = await Product.distinct('category', { isActive: true })
    return categories.sort()
  }
}
