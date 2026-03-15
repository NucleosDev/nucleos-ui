'use client'

import { createContext, useContext } from 'react'
import type { User } from '@/types/user'

export interface AuthContextType {
  // Estado
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  isAuthenticated: boolean
  isEmailVerified: () => boolean
  
  // Permissões
  hasPermission: (requiredRole?: string | string[]) => boolean
  
  // Autenticação
  login: (email: string, password: string) => Promise<any>
  register: (data: any) => Promise<any>
  logout: () => Promise<void>
  
  // Email
  verifyEmail: (token: string) => Promise<boolean>
  
  // Senha
  requestPasswordReset: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  
  // Usuário
  updateUser: (user: User) => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  
  return context
}