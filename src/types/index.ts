// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  avatar?: string
  createdAt: string
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// ─── Product ─────────────────────────────────────────────────────────────────
export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice: number
  discount: number
  images: string[]
  category: string
  brand: string
  stock: number
  rating: number
  reviewCount: number
  tags: string[]
  isActive: boolean
  createdAt: string
}

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

export interface PaginatedProducts {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

// ─── Wishlist ────────────────────────────────────────────────────────────────
export interface WishlistItem {
  _id: string
  product: Product
  addedAt: string
}

// ─── Address ─────────────────────────────────────────────────────────────────
export interface Address {
  _id?: string
  fullName: string
  phone: string
  pincode: string
  street: string
  city: string
  state: string
  isDefault?: boolean
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  product: Product
  quantity: number
  price: number
  name: string
  image: string
}

export interface Order {
  _id: string
  items: OrderItem[]
  shippingAddress: Address
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  status: OrderStatus
  subtotal: number
  shippingCharge: number
  discount: number
  total: number
  createdAt: string
  updatedAt: string
}

// ─── API ─────────────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string>
}
