import { api } from './api'
import { API_ROUTES } from '@/constants/routes'
import type { User, AuthResponse, LoginCredentials, RegisterCredentials } from '@/types'

export const usersService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials)
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse>(API_ROUTES.AUTH.REGISTER, credentials)
  },

  async logout(): Promise<void> {
    return api.post(API_ROUTES.AUTH.LOGOUT)
  },

  async refreshToken(): Promise<AuthResponse> {
    return api.post<AuthResponse>(API_ROUTES.AUTH.REFRESH)
  },

  async getCurrentUser(): Promise<User> {
    return api.get<User>(API_ROUTES.USERS.ME)
  },

  async updateUser(data: Partial<User>): Promise<User> {
    return api.put<User>(API_ROUTES.USERS.UPDATE, data)
  },
}
