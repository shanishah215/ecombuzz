export interface ProductFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  search?: string
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating'
  page?: number
  limit?: number
}
