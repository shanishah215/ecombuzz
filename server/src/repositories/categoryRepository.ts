import { Category } from '@/models/Category'

export class CategoryRepository {
  async findAll(onlyActive = true) {
    const query = onlyActive ? { isActive: true } : {}
    return Category.find(query).sort({ name: 1 }).lean()
  }

  async findBySlug(slug: string) {
    return Category.findOne({ slug }).lean()
  }

  async findById(id: string) {
    return Category.findById(id).lean()
  }

  async create(data: any) {
    return Category.create(data)
  }

  async update(id: string, data: any) {
    return Category.findByIdAndUpdate(id, data, { new: true })
  }

  async delete(id: string) {
    return Category.findByIdAndDelete(id)
  }
}
