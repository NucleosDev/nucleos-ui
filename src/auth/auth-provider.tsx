'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthContext } from './auth-context'
import type { AuthContextType } from './auth-context'
import authService from '@/services/auth.service'
import type { User } from '@/types/user'
import { useToast } from '@/hooks/use-toast'

// Tipo para erro da API
interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

// Rotas públicas que não precisam de verificação
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password', '/']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  
  const { warning, success, error: toastError, info } = useToast()

  /**
   * Helper para extrair mensagem de erro
   */
  const getErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (error && typeof error === 'object') {
      if ('response' in error) {
        const apiError = error as ApiError
        return apiError.response?.data?.message || defaultMessage
      }
      if ('message' in error && typeof (error as any).message === 'string') {
        return (error as any).message
      }
    }
    if (typeof error === 'string') return error
    return defaultMessage
  }

  /**
   * Verifica se o usuário está autenticado e carrega seus dados
   */
  const checkAuth = useCallback(async () => {
    try {
      if (!authService.isAuthenticated()) {
        setUser(null)
        return
      }

      const userData = await authService.getCurrentUser()
      
      if (userData) {
        setUser(userData)
        
        if (!userData.email_verified && !PUBLIC_ROUTES.includes(pathname)) {
          warning({
            title: '📧 Email não verificado',
            description: 'Por favor, verifique seu email para ativar sua conta.',
          })
        }
      } else {
        await authService.logout()
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      await authService.logout()
      setUser(null)
    } finally {
      setIsLoading(false)
      setIsInitialized(true)
    }
  }, [pathname, warning])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  /**
   * Login do usuário
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await authService.login({ email, password })
      
      setUser(response.user)
      
      success({
        title: '✨ Login realizado com sucesso!',
        description: `Bem-vindo de volta, ${response.user.profile?.full_name || response.user.email}!`,
      })
      
      const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl')
      router.push(callbackUrl || '/dashboard')
      
      return response
    } catch (error) {
      const message = getErrorMessage(error, 'Credenciais inválidas')
      
      toastError({
        title: '❌ Erro no login',
        description: message,
      })
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router, success, toastError])

  /**
   * Registro de novo usuário
   */
  const register = useCallback(async (data: any) => {
    try {
      setIsLoading(true)
      const response = await authService.register(data)
      
      setUser(response.user)
      
      success({
        title: '🎉 Conta criada com sucesso!',
        description: 'Verifique seu email para ativar sua conta.',
      })
      
      router.push('/verify-email-pending')
      
      return response
    } catch (error) {
      const message = getErrorMessage(error, 'Não foi possível criar a conta')
      
      toastError({
        title: '❌ Erro no registro',
        description: message,
      })
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router, success, toastError])

  /**
   * Logout do usuário
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      await authService.logout()
      
      setUser(null)
      
      info({
        title: '👋 Logout realizado',
        description: 'Você saiu da sua conta com sucesso.',
      })
      
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }, [router, info])

  /**
   * Verificar email
   */
  const verifyEmail = useCallback(async (token: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const verified = await authService.verifyEmail(token)
      
      if (verified && user) {
        setUser(prev => prev ? { ...prev, email_verified: true } : null)
        
        success({
          title: '✅ Email verificado!',
          description: 'Sua conta está agora ativa. Aproveite todos os recursos!',
        })
        
        router.push('/dashboard')
      }
      
      return verified
    } catch (error) {
      const message = getErrorMessage(error, 'Link de verificação inválido ou expirado')
      
      toastError({
        title: '❌ Erro na verificação',
        description: message,
      })
      
      return false
    } finally {
      setIsLoading(false)
    }
  }, [user, router, success, toastError])

  /**
   * Solicitar reset de senha - CORRIGIDO: authService.forgotPassword
   */
  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      setIsLoading(true)
      await authService.forgotPassword(email)  // 👈 Mudado de requestPasswordReset para forgotPassword
      
      info({
        title: '📧 Email enviado!',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      })
    } catch (error) {
      const message = getErrorMessage(error, 'Não foi possível enviar o email')
      
      toastError({
        title: '❌ Erro',
        description: message,
      })
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [info, toastError])

  /**
   * Resetar senha com token
   */
  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      setIsLoading(true)
      await authService.resetPassword(token, newPassword)
      
      success({
        title: '🔐 Senha alterada!',
        description: 'Sua senha foi redefinida com sucesso. Faça login com sua nova senha.',
      })
      
      router.push('/login')
    } catch (error) {
      const message = getErrorMessage(error, 'Não foi possível redefinir sua senha')
      
      toastError({
        title: '❌ Erro',
        description: message,
      })
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router, success, toastError])

  /**
   * Alterar senha (usuário logado)
   */
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true)
      await authService.changePassword(currentPassword, newPassword)
      
      success({
        title: '🔐 Senha alterada!',
        description: 'Sua senha foi atualizada com sucesso.',
      })
    } catch (error) {
      const message = getErrorMessage(error, 'Senha atual incorreta')
      
      toastError({
        title: '❌ Erro',
        description: message,
      })
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [success, toastError])

  /**
   * Atualizar dados do usuário
   */
  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser)
    
    success({
      title: '✅ Perfil atualizado',
      description: 'Suas informações foram salvas com sucesso.',
    })
  }, [success])

  /**
   * Refresh manual do usuário
   */
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getCurrentUser()
      if (userData) {
        setUser(userData)
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }, [])

  /**
   * Verificar se usuário tem permissão - CORRIGIDO: type assertion
   */
  const hasPermission = useCallback((requiredRole?: string | string[]): boolean => {
    if (!user) return false
    
    if (!requiredRole) return true
    
    // Garantir que as roles são do tipo esperado
    const userRoles = user.roles?.map(r => r.role as string) || []
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.some(role => userRoles.includes(role))
    }
    
    return userRoles.includes(requiredRole)
  }, [user])

  /**
   * Verificar se email foi verificado
   */
  const isEmailVerified = useCallback((): boolean => {
    return user?.email_verified || false
  }, [user])

  /**
   * Valores memoizados para o contexto
   */
  const value = useMemo<AuthContextType>(() => ({
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    isEmailVerified,
    hasPermission,
    login,
    register,
    logout,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    changePassword,
    updateUser,
    refreshUser,
  }), [
    user,
    isLoading,
    isInitialized,
    isEmailVerified,
    hasPermission,
    login,
    register,
    logout,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    changePassword,
    updateUser,
    refreshUser,
  ])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}