"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          Bem-vindo, {user?.profile?.full_name || 'Usuário'}!
        </h1>
        <p>Email: {user?.email}</p>
        <p>Email verificado: {user?.email_verified ? '✅' : '❌'}</p>a
        <p>Plano: {user?.subscription?.plan?.name || 'free'}</p>
      </div>
    </ProtectedRoute>
  )
}