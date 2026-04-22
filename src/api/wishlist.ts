import apiClient from './client'
import type { ApiResponse, WishlistItem } from '@/types'

export const wishlistApi = {
  get: () => apiClient.get<ApiResponse<WishlistItem[]>>('/wishlist'),
  add: (productId: string) =>
    apiClient.post<ApiResponse<WishlistItem[]>>('/wishlist', { productId }),
  remove: (productId: string) =>
    apiClient.delete<ApiResponse<WishlistItem[]>>(`/wishlist/${productId}`),
}
