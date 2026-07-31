import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'

const getApiBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL
  return apiUrl ? `${apiUrl}/api` : '/api'
}

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers = {
      ...(config.headers ?? {}),
      Authorization: `Bearer ${token}`,
    }
  } else {
    config.headers = config.headers ?? {}
    delete config.headers.Authorization
  }
  return config
})

// Handle 401 — attempt token refresh once, but skip auth endpoints.
// This prevents multiple simultaneous refresh attempts from the same user session.
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    const isAuthEndpoint = original?.url?.includes('/auth/') ?? false
    const isUnauthorized = error.response?.status === 401

    if (!original || !isUnauthorized || original._retry || isAuthEndpoint) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          if (token) {
            original.headers = {
              ...(original.headers ?? {}),
              Authorization: `Bearer ${token}`,
            }
          }
          return apiClient(original)
        })
        .catch((queueError) => Promise.reject(queueError))
    }

    original._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post(`${getApiBaseUrl()}/auth/refresh`, {}, { withCredentials: true })
      const newToken = data?.data?.accessToken as string | undefined

      if (!newToken) {
        throw new Error('No access token returned from refresh endpoint')
      }

      localStorage.setItem('accessToken', newToken)
      processQueue(null, newToken)

      original.headers = {
        ...(original.headers ?? {}),
        Authorization: `Bearer ${newToken}`,
      }

      return apiClient(original)
    } catch (refreshError) {
      processQueue(refreshError)
      localStorage.removeItem('accessToken')
      window.location.assign('/login')
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export default apiClient
