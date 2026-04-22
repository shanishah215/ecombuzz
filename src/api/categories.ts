import apiClient from './client'
import type { ApiResponse } from '@/types'

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
}

export const categoriesApi = {
  getAll: (all = false) =>
    apiClient.get<ApiResponse<Category[]>>('/categories', { params: { all } }),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Category>>(`/categories/${slug}`),

  create: (data: Partial<Category>) =>
    apiClient.post<ApiResponse<Category>>('/categories', data),

  update: (id: string, data: Partial<Category>) =>
    apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/categories/${id}`),
}
