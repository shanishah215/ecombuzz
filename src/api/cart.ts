import apiClient from './client'
import type { ApiResponse, Cart } from '@/types'

export const cartApi = {
  get: () => apiClient.get<ApiResponse<Cart>>('/cart'),
  add: (productId: string, quantity: number) =>
    apiClient.post<ApiResponse<Cart>>('/cart', { productId, quantity }),
  update: (productId: string, quantity: number) =>
    apiClient.put<ApiResponse<Cart>>(`/cart/${productId}`, { quantity }),
  remove: (productId: string) =>
    apiClient.delete<ApiResponse<Cart>>(`/cart/${productId}`),
  clear: () => apiClient.delete<ApiResponse<Cart>>('/cart'),
}
