import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import PageLoader from '@/components/ui/PageLoader'

export default function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) return <PageLoader />
  if (isAuthenticated) return <Navigate to="/home" replace />
  return <Outlet />
}
