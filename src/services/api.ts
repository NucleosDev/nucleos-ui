import axios from 'axios'
import { env } from '@/config/env'

const api = axios.create({
  baseURL: env.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const authService = (await import('@/services/auth.service')).default
        const response = await authService.refreshToken()
        
        if (response?.token) {
          originalRequest.headers.Authorization = `Bearer ${response.token}`
          return api(originalRequest)
        }
      } catch {
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api