import apiClient from './client'
import type { ApiResponse, AuthResponse, LoginPayload, RegisterPayload, User } from '@/types'

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload),

  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload),

  logout: () => apiClient.post<ApiResponse<null>>('/auth/logout'),

  refreshToken: () =>
    apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh'),

  getMe: () => apiClient.get<ApiResponse<User>>('/auth/me'),
}
