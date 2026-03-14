'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { usersService } from '@/services/users.service'
import type { User, LoginCredentials, RegisterCredentials } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  const clearAuth = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY)
      if (!token) {
        setUser(null)
        return
      }

      const currentUser = await usersService.getCurrentUser()
      setUser(currentUser)
    } catch {
      clearAuth()
    }
  }, [clearAuth])

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      await refreshUser()
      setIsLoading(false)
    }

    initAuth()
  }, [refreshUser])

  const login = async (credentials: LoginCredentials) => {
    const response = await usersService.login(credentials)

    localStorage.setItem(AUTH_TOKEN_KEY, response.token)
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken)
    setUser(response.user)
  }

  const register = async (credentials: RegisterCredentials) => {
    const response = await usersService.register(credentials)

    localStorage.setItem(AUTH_TOKEN_KEY, response.token)
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken)
    setUser(response.user)
  }

  const logout = async () => {
    try {
      await usersService.logout()
    } catch {
      // Ignore logout errors
    } finally {
      clearAuth()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
