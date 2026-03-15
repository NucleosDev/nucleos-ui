import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { AuthContext } from '@/auth/auth-context'
import authService from '@/services/auth.service'
import type { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth'
import { ROUTES } from '@/constants/routes'

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }

  const router = useRouter()

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials)
      await context.refreshUser() // Atualiza o contexto
      router.push(ROUTES.DASHBOARD)
      return response
    } catch (err) {
      throw err
    }
  }, [router, context])

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await authService.register(data)
      await context.refreshUser() // Atualiza o contexto
      router.push('/verify-email-pending')
      return response
    } catch (err) {
      throw err
    }
  }, [router, context])

  return {
    ...context,
    login,
    register,
  }
}