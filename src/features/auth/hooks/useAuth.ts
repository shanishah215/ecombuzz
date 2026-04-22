import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getErrorMessage } from '@/lib/utils'
import type { LoginPayload, RegisterPayload } from '@/types'

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'

  async function login(payload: LoginPayload) {
    setIsLoading(true)
    try {
      const { data } = await authApi.login(payload)
      localStorage.setItem('accessToken', data.data.accessToken)
      setAuth(data.data.user, data.data.accessToken)
      toast.success(`Welcome back, ${data.data.user.name}!`)
      navigate(from, { replace: true })
    } catch (err) {
      console.error('[Login error]', err)
      toast.error(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading }
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  async function register(payload: RegisterPayload) {
    setIsLoading(true)
    try {
      const { data } = await authApi.register(payload)
      localStorage.setItem('accessToken', data.data.accessToken)
      setAuth(data.data.user, data.data.accessToken)
      toast.success('Account created successfully!')
      navigate('/')
    } catch (err) {
      console.error('[Register error]', err)
      toast.error(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return { register, isLoading }
}
