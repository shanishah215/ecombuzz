import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 — attempt token refresh, but SKIP auth endpoints
// (e.g. /auth/login returning 401 for wrong password must NOT trigger a redirect)
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const isAuthEndpoint = (original?.url as string | undefined)?.includes('/auth/')
    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true
      try {
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true })
        const newToken: string = data.data.accessToken
        localStorage.setItem('accessToken', newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return apiClient(original)
      } catch {
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default apiClient
