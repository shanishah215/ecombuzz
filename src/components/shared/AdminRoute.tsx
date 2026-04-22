import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import PageLoader from '@/components/ui/PageLoader'

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) return <PageLoader />
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}
