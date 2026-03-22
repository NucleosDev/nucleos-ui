"use client"

import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { ROUTES } from '@/constants/routes'
import { AuthProvider } from '@/auth/auth-provider'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <AuthProvider>
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Logo */}
      <Link href={ROUTES.HOME} className="mb-8 flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-lg border border-primary">
            <span className="text-sm font-bold text-primary-foreground">
              <Image src="/icon.svg" alt="Nucleos" width={32} height={32} />
                
              
            </span>
        </div>
        <span className="text-xl font-semibold text-foreground">Nucleos</span>
      </Link>

      {/* Login Form */}
      <LoginForm />

      {/* Terms */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Ao continuar, você concorda com nossos{' '}
        <Link href="#" className="underline hover:text-foreground">
          Termos de Serviço
        </Link>{' '}
        e{''}
        <Link href="#" className="underline hover:text-foreground">
          Política de Privacidade
        </Link>
        .
      </p>
    </div>
    </AuthProvider>
  )
}