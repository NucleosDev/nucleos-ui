"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";

export default function LoginPage() {
  return (
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
            width={64}
            height={64}
            className="text-primary"
          />
        </div>
        <span className="text-xl font-semibold text-foreground">Nucleos</span>
      </Link>

      {/* Login Form - Passando callbackUrl */}
      <LoginForm />

      {/* Esqueceu a senha? */}
      <div className="mt-4 text-center">
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Esqueceu sua senha?
        </Link>
      </div>

      {/* Terms */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Ao continuar, você concorda com nossos{" "}
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

      {/* Não tem conta? */}
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Não tem uma conta?{" "}
        <Link
          href={ROUTES.REGISTER}
          className="text-primary hover:underline font-medium"
        >
          Cadastre-se gratuitamente
        </Link>
      </p>
    </div>
  );
}
