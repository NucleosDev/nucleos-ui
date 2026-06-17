"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";
import Image from "next/image";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { useAuth } from "@/auth/auth-context";
import { ROUTES } from "@/constants/routes";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthPage />
    </div>
  );
}

export function AuthPage() {
  const { loginWithGoogle } = useAuth();

  return (
    <main className="relative min-h-screen overflow-hidden lg:grid lg:grid-cols-2">
      {/* ── Left panel — desktop only ─────────────────────────────────────── */}
      <div
        className="
          relative hidden flex-col border-r p-10 lg:flex
          bg-gradient-to-b
          from-[#00C9A7]/70
          via-[#4D7CFF]/30
          to-background
        "
      >
        <Image
          src="/logo-full.svg"
          alt="logo nucleos"
          width={600}
          height={600}
          className="absolute left-15 top-50 z-[1] opacity-40"
        />
        <div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
        <div className="z-10 flex items-center gap-2">
          <p className="text-xl font-semibold">Nucleos</p>
        </div>
        <div className="z-10 mt-auto">
          <blockquote className="space-y-1">
            <p className="text-xl leading-relaxed">
              &ldquo;É melhor você tentar, ver não funcionar e aprender com
              isso, do que não fazer nada.&rdquo;
            </p>
            <footer className="font-mono text-sm font-semibold text-muted-foreground">
              ~ Mark Zuckerberg
            </footer>
          </blockquote>
        </div>
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────────────── */}
      <div className="relative flex min-h-screen flex-col items-center justify-center p-6">
        {/* Ambient gradient orbs */}
        <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[50%] w-[520px] h-[520px] rounded-full bg-primary/10 blur-[80px]" />
          <div className="absolute top-[25%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#00C9A7]/12 blur-[64px]" />
          <div className="absolute bottom-[20%] left-[15%] w-[260px] h-[260px] rounded-full bg-[#5B7FFF]/10 blur-[64px]" />
          <div className="absolute top-[60%] right-[10%] w-[200px] h-[200px] rounded-full bg-[#1FBFA8]/8 blur-[48px]" />
        </div>

        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-5 left-5 z-10 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link href="/">
            <ChevronLeftIcon className="size-3.5 me-1" />
            Voltar
          </Link>
        </Button>

        {/* Mobile logo */}
        <div className="lg:hidden mb-7 relative z-10">
          <p className="bg-gradient-to-r from-primary via-[#00C9A7] to-primary bg-clip-text text-2xl font-bold text-transparent bg-[length:200%_auto] animate-gradient">
            Nucleos
          </p>
        </div>

        {/* ── Glass form card ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md"
        >
          <LiquidGlass
            variant="default"
            radius="24px"
            interactive={false}
            className="p-8"
          >
            <p className="text-sm text-muted-foreground mb-6">
              Preencha os dados abaixo para se cadastrar.
            </p>

            <RegisterForm />
          </LiquidGlass>
        </motion.div>
      </div>
    </main>
  );
}

// ── FloatingPaths ──────────────────────────────────────────────────────────────

function FloatingPaths({ position }: { position: number }) {
  const COLORS = ["#4D7CFF", "#00C9A7", "#5B7FFF", "#1FBFA8"];

  const paths = Array.from({ length: 36 }, (_, i) => {
    const color = COLORS[i % COLORS.length];
    return {
      id: i,
      d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
      stroke: color,
      width: 0.5 + i * 0.03,
      opacity: 0.12 + i * 0.02,
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg className="h-full w-full" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={path.stroke}
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            initial={{ pathLength: 0.2, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.7, 0.9, 0.7],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 18 + Math.random() * 12,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
