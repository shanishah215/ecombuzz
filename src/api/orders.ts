import apiClient from './client'
import type { ApiResponse, Address, Order } from '@/types'

export interface PaginatedOrders {
  orders: Order[]
  total: number
  page: number
  totalPages: number
}

export const ordersApi = {
  create: (payload: { addressId: string; paymentMethod: string }) =>
    apiClient.post<ApiResponse<Order>>('/orders', payload),
  getAll: () => apiClient.get<ApiResponse<Order[]>>('/orders'),
  getById: (id: string) => apiClient.get<ApiResponse<Order>>(`/orders/${id}`),
  // Admin
  updateStatus: (id: string, status: string) =>
    apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status }),
  getAllAdmin: (page = 1) =>
    apiClient.get<ApiResponse<PaginatedOrders>>('/orders/admin/all', { params: { page } }),
}

export const addressApi = {
  get: () => apiClient.get<ApiResponse<Address[]>>('/addresses'),
  add: (data: Omit<Address, '_id'>) =>
    apiClient.post<ApiResponse<Address>>('/addresses', data),
  update: (id: string, data: Partial<Address>) =>
    apiClient.put<ApiResponse<Address>>(`/addresses/${id}`, data),
  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/addresses/${id}`),
}
