"use client"

import { ProtectedRoute } from '@/components/auth/protected-route'
import App from '@/components/ui/testimonial-v2'
import { useAuth } from '@/hooks/useAuth'


export default function userProfile() {
    return (
        <ProtectedRoute>
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Perfil do Usuário</h1>
                <p>Esta é a página de perfil do usuário. Aqui você pode ver e editar suas informações pessoais.</p>
            </div>
        </ProtectedRoute>
    )
}