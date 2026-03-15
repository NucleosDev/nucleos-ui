import api from './api'
import { API_ROUTES } from '@/constants/routes'
import type { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth'  // ✅ Importa dos types

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials)
      
      if (response.data.token) {
        this.setSession(response.data)
      }
      
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(API_ROUTES.AUTH.REGISTER, data)
      
      if (response.data.token) {
        this.setSession(response.data)
      }
      
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post(API_ROUTES.AUTH.LOGOUT)
    } finally {
      this.clearSession()
    }
  }

  async refreshToken(): Promise<AuthResponse | null> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return null

    try {
      const response = await api.post<AuthResponse>(API_ROUTES.AUTH.REFRESH, {
        refreshToken
      })
      this.setSession(response.data)
      return response.data
    } catch {
      this.clearSession()
      return null
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    const response = await api.post(API_ROUTES.AUTH.VERIFY_EMAIL, { token })
    return response.data.success
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email })
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post(API_ROUTES.AUTH.RESET_PASSWORD, { token, newPassword })
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post(API_ROUTES.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword
    })
  }

  async getCurrentUser() {
    const response = await api.get(API_ROUTES.USERS.ME)
    return response.data
  }

  private setSession(authResponse: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', authResponse.token)
      if (authResponse.refreshToken) {
        localStorage.setItem('refresh_token', authResponse.refreshToken)
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${authResponse.token}`
    }
  }

  private clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      delete api.defaults.headers.common['Authorization']
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token')
    }
    return null
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token')
    }
    return null
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message)
    }
    if (error.message) {
      return new Error(error.message)
    }
    return new Error('Ocorreu um erro inesperado')
  }
}

export default new AuthService()