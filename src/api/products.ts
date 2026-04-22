import apiClient from './client'
import type { ApiResponse, PaginatedProducts, Product, ProductFilters } from '@/types'

export const productsApi = {
  getAll: (filters?: ProductFilters) =>
    apiClient.get<ApiResponse<PaginatedProducts>>('/products', { params: filters }),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Product>>(`/products/${slug}`),

  getCategories: () =>
    apiClient.get<ApiResponse<string[]>>('/products/categories'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Product>>(`/products/id/${id}`),

  // Admin
  create: (data: FormData) =>
    apiClient.post<ApiResponse<Product>>('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: string, data: FormData) =>
    apiClient.put<ApiResponse<Product>>(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/products/${id}`),
}
