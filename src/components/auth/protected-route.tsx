'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { Loading } from '@/components/ui/loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string | string[]
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  fallback 
}: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Se ainda está carregando, não faz nada
    if (isLoading) return

    // Se não está autenticado, redireciona para login
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN)
      return
    }

    // Se tem role requerida e não tem permissão, redireciona para dashboard
    if (requiredRole && !hasPermission(requiredRole)) {
      router.push(ROUTES.DASHBOARD)
      return
    }
  }, [isAuthenticated, isLoading, requiredRole, hasPermission, router])

  // Loading state
  if (isLoading) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    return <Loading fullScreen text="Verificando autenticação..." />
  }

  // Se não está autenticado, não renderiza nada
  if (!isAuthenticated) {
    return null
  }

  // Se tem role requerida e não tem permissão, não renderiza nada
  if (requiredRole && !hasPermission(requiredRole)) {
    return null
  }

  // Tudo ok, renderiza os children
  return <>{children}</>
}