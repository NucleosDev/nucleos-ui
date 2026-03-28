"use client";

import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { ROUTES } from "@/constants/routes";
import { AuthProvider } from "@/auth/auth-provider";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-foreground/2">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-accent/15 blur-3xl" />
        </div>

        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          className="mb-8 flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Image
              src="/icon.svg"
              alt="Nucleos"
              width={28}
              height={28}
              className="text-primary"
            />
          </div>
          <span className="text-xl font-semibold text-foreground">Nucleos</span>
        </Link>

        <RegisterForm />

        {/* Terms */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Ao criar uma conta, você concorda com nossos{" "}
          <Link
            href="/termos"
            className="underline hover:text-foreground transition-colors"
          >
            Termos de Serviço
          </Link>{" "}
          e{" "}
          <Link
            href="/privacidade"
            className="underline hover:text-foreground transition-colors"
          >
            Política de Privacidade
          </Link>
          .
        </p>

        {/* Já tem conta? */}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="text-primary hover:underline font-medium"
          >
            Faça login
          </Link>
        </p>
      </div>
    </AuthProvider>
  );
}
