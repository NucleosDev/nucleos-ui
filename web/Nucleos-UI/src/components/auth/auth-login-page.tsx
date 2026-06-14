"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";
import { useAuth } from "@/auth/auth-context";

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
        <p className="text-xl font-semibold">Nucleos</p>
        <Image
          src="/lettermark-nucleos.svg"
          alt="logo nucleos"
          width={600}
          height={600}
          priority
          className="relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] "
        />
        <div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
        <div className="z-10 flex items-center justify-end w-full gap-2 text-right"></div>

        <div className="z-10 mt-auto w-full text-left">
          <blockquote className="space-y-1">
            <p className="text-xl leading-relaxed">
              &ldquo;É melhor tentar, ver não funcionar e aprender, do que não
              fazer nada.&rdquo;
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
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[50%] w-[520px] h-[520px] rounded-full bg-primary/10 blur-[80px]" />
          <div className="absolute top-[25%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#00C9A7]/12 blur-[64px]" />
          <div className="absolute bottom-[20%] left-[15%] w-[260px] h-[260px] rounded-full bg-[#5B7FFF]/10 blur-[64px]" />
          <div className="absolute top-[60%] right-[10%] w-[200px] h-[200px] rounded-full bg-[#1FBFA8]/8 blur-[48px]" />
        </div>

        {/* Back button */}
        <Button
          variant="ghost"
          size="lg"
          className="absolute top-5 left-5 z-10 text-muted-foreground hover:text-foreground text-lg"
          asChild
        >
          <Link href="/">
            <ChevronLeftIcon className="size-5 me-1 " />
            Voltar
          </Link>
        </Button>

        {/* Mobile logo */}
        <div className="lg:hidden mb-7 relative z-10">
          <p className="bg-gradient-to-r from-primary via-[#00C9A7] to-primary bg-clip-text text-2xl font-bold text-transparent bg-[length:200%_auto] animate-gradient">
            Nucleos
          </p>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Preencha os dados abaixo para fazer login.
        </p>
        <div className="w-full max-w-md z-10">
          <div className="bg-background rounded-2xl border border-white/20 p-8">
            <LoginForm />

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-[11px] text-muted-foreground/60 uppercase tracking-wider">
                ou
              </span>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            {/* Google login */}
            <button
              // onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-x-2.5 py-2.5 px-4 border border-border/70 rounded-xl text-sm font-medium text-foreground bg-background/40 backdrop-blur-sm hover:bg-background/60 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <GoogleSVG className="w-4.5 h-4.5" />
              Continue com o Google
            </button>
          </div>
        </div>
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

// ── Google SVG ─────────────────────────────────────────────────────────────────

function GoogleSVG(props: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 533.5 544.3"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.2H272v95h146.9c-6.3 33.9-25 62.5-53.2 81.8v68.1h85.8c50.2-46.3 82-114.6 82-194.7z"
        fill="#4285F4"
      />
      <path
        d="M272 544.3c71.6 0 131.7-23.7 175.7-64.2l-85.8-68.1c-23.8 16-54.1 25.4-89.9 25.4-69.1 0-127.6-46.6-148.4-109.3h-89.6v68.9C77.7 480.5 168.5 544.3 272 544.3z"
        fill="#34A853"
      />
      <path
        d="M123.6 328.1c-10.8-32.1-10.8-66.9 0-99l-89.6-68.9c-39.1 77.6-39.1 168.3 0 245.9l89.6-68z"
        fill="#FBBC05"
      />
      <path
        d="M272 107.7c37.4-.6 73.5 13.2 101.1 38.7l75.4-75.4C403.4 24.5 341.4 0 272 0 168.5 0 77.7 63.8 34 159.2l89.6 68.9C144.4 154.3 202.9 107.7 272 107.7z"
        fill="#EA4335"
      />
    </svg>
  );
}
