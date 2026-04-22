import { lazy, Suspense, type ReactElement } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import PageLoader from '@/components/ui/PageLoader'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import AdminRoute from '@/components/shared/AdminRoute'
import GuestRoute from '@/components/shared/GuestRoute'

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/HomePage'))
const ProductListPage = lazy(() => import('@/pages/ProductListPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const CartPage = lazy(() => import('@/pages/CartPage'))
const WishlistPage = lazy(() => import('@/pages/WishlistPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const OrdersPage = lazy(() => import('@/pages/OrdersPage'))
const OrderDetailPage = lazy(() => import('@/pages/OrderDetailPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'))
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'))
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'))
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'))

const wrap = (element: ReactElement) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      {
        element: <GuestRoute />,
        children: [
          { path: 'login', element: wrap(<LoginPage />) },
          { path: 'register', element: wrap(<RegisterPage />) },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'home', element: wrap(<HomePage />) },
          { path: 'products', element: wrap(<ProductListPage />) },
          { path: 'products/:slug', element: wrap(<ProductDetailPage />) },
          { path: 'cart', element: wrap(<CartPage />) },
          { path: 'wishlist', element: wrap(<WishlistPage />) },
          { path: 'checkout', element: wrap(<CheckoutPage />) },
          { path: 'orders', element: wrap(<OrdersPage />) },
          { path: 'orders/:id', element: wrap(<OrderDetailPage />) },
          { path: 'profile', element: wrap(<ProfilePage />) },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: wrap(<AdminDashboard />) },
      { path: 'products', element: wrap(<AdminProducts />) },
      { path: 'categories', element: wrap(<AdminCategories />) },
      { path: 'orders', element: wrap(<AdminOrders />) },
      { path: 'users', element: wrap(<AdminUsers />) },
    ],
  },
  { path: '*', element: wrap(<NotFoundPage />) },
])
