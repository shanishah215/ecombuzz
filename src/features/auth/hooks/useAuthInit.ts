import { useEffect } from 'react'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/features/auth/store/authStore'

// Runs once on app mount — rehydrates auth state from the stored token.
export function useAuthInit() {
  const { accessToken, setAuth, clearAuth, setLoading } = useAuthStore()

  useEffect(() => {
    if (!accessToken) {
      setLoading(false)
      return
    }
    authApi
      .getMe()
      .then(({ data }) => setAuth(data.data, accessToken))
      .catch(() => clearAuth())
      .finally(() => setLoading(false))
  }, []) // intentionally empty — runs once on mount
}
