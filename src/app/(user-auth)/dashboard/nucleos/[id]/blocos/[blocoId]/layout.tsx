// src/app/(user-auth)/dashboard/nucleos/[id]/blocos/[blocoId]/layout.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useBloco } from "@/hooks/useBlocos";
import { useNucleo } from "@/hooks/useNucleo";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import {
  ArrowLeft,
  Layers,
  BookOpen,
  CheckSquare,
  ListTodo,
  CalendarDays,
  Timer,
  Activity,
  GripVertical,
  Calculator,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LiquidGlass } from "@/components/ui/liquid-glass";

const blocoIconMap: Record<string, LucideIcon> = {
  tarefas: CheckSquare,
  habitos: Activity,
  habito: Activity,
  timer: Timer,
  timers: Timer,
  notas: BookOpen,
  lista: ListTodo,
  calendario: CalendarDays,
  calculo: Calculator,
  colecoes: Layers,
};

const blocoAccent: Record<string, string> = {
  tarefas: "#3b82f6",
  habitos: "#22c55e",
  habito: "#22c55e",
  timer: "#f97316",
  timers: "#f97316",
  notas: "#a855f7",
  lista: "#06b6d4",
  calendario: "#6366f1",
  calculo: "#ec4899",
  colecoes: "#10b981",
};

const blocoLabels: Record<string, string> = {
  tarefas: "Tarefas",
  habitos: "Hábitos",
  habito: "Hábito",
  timer: "Timer",
  timers: "Timers",
  notas: "Notas",
  lista: "Lista",
  calendario: "Calendário",
  calculo: "Calculadora",
  colecoes: "Coleções",
};

export default function BlocoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const params = useParams();
  const router = useRouter();
  const nucleoId = params.id as string;
  const blocoId = params.blocoId as string;

  const {
    bloco,
    isLoading: blocoLoading,
    error: blocoError,
  } = useBloco(blocoId, nucleoId);
  const { data: nucleo, isLoading: nucleoLoading } = useNucleo(nucleoId);

  if (blocoLoading || nucleoLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-[200px] md:h-[240px] w-full" />
        <div className="max-w-3xl mx-auto px-6 pt-6 space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    );
  }

  if (blocoError || !bloco) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-base font-semibold mb-2">Bloco não encontrado</p>
          <p className="text-sm text-muted-foreground mb-5">
            O bloco foi removido ou não existe.
          </p>
          <LiquidGlass
            variant="button"
            radius="var(--radius-md)"
            onClick={() => router.back()}
            className="text-sm font-medium text-"
          >
            <span className="px-4 py-2 block">Voltar</span>
          </LiquidGlass>
        </div>
      </div>
    );
  }

  if (!nucleo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-base font-semibold mb-2">Núcleo não encontrado</p>
          <LiquidGlass
            variant="button"
            radius="var(--radius-md)"
            onClick={() => router.push("/dashboard/nucleos")}
            className="mt-4 text-sm font-medium text-"
          >
            <span className="px-4 py-2 block">Ver Núcleos</span>
          </LiquidGlass>
        </div>
      </div>
    );
  }

  const accent = blocoAccent[bloco.tipo] ?? nucleo.corDestaque ?? "#6366f1";
  const corDestaque = nucleo.corDestaque || "#6366f1";
  const BlocoIcon = blocoIconMap[bloco.tipo] ?? GripVertical;
  const blocoTitle = bloco.titulo || blocoLabels[bloco.tipo] || bloco.tipo;
  const capaUrl =
    nucleo.imagemCapa || `https://picsum.photos/seed/${nucleo.id}/1200/400`;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Liquid glass banner ── */}
      <div className="relative w-full h-[200px] md:h-[240px] overflow-hidden">
        <Image
          src={capaUrl}
          alt={nucleo.nome}
          fill
          className="object-cover scale-[1.04] transition-transform duration-700"
          priority
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
        <div
          className="absolute inset-0 opacity-35"
          style={{
            background: `radial-gradient(ellipse 60% 80% at 80% 20%, ${corDestaque}44 0%, transparent 70%)`,
          }}
        />
        {/* Bloco accent tint */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse 50% 70% at 10% 80%, ${accent}55 0%, transparent 65%)`,
          }}
        />

        {/* Wave transition */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10">
          <svg
            viewBox="0 0 500 80"
            preserveAspectRatio="none"
            className="w-full h-[50px] -mb-px"
            fill="var(--background)"
          >
            <path d="M0,30 C120,-20 370,80 500,40 L500,80 L0,80 Z" />
          </svg>
        </div>

        {/* Glass back button */}
        <LiquidGlass
          variant="button"
          radius="999px"
          onClick={() => router.push(`/dashboard/nucleos/${nucleoId}`)}
          className="absolute top-4 left-4 z-20 text-sm font-medium text-"
        >
          <span className="flex items-center gap-2 px-3 py-1.5">
            <ArrowLeft className="h-4 w-4" />
            {nucleo.nome}
          </span>
        </LiquidGlass>

        {/* Glass bloco type badge */}
        <div
          className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full text-xs font-medium text- capitalize"
          style={{
            background: `${accent}55`,
            backdropFilter: "blur(10px) saturate(140%)",
            WebkitBackdropFilter: "blur(10px) saturate(140%)",
            border: `1px solid ${accent}66`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 6px rgba(0,0,0,0.12)`,
          }}
        >
          {blocoLabels[bloco.tipo] || bloco.tipo}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 md:px-4 pb-4">
        {/* Floating liquid glass icon */}
        <div
          className="relative z-30 -mt-8 mb-5 "
          style={{ top: "-25px", left: "18px" }}
        >
          <div className="relative inline-flex">
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-xl blur-lg opacity-50"
              style={{ background: accent }}
            />
            {/* Glass icon container */}
            <div
              className="relative flex h-12 w-12 items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(145deg, ${accent}ee, ${accent}bb)`,
                border: "1.5px solid rgba(255,255,255,0.28)",
                boxShadow:
                  "inset 0 1.5px 0 rgba(255,255,255,0.40), 0 6px 18px rgba(0,0,0,0.20)",
              }}
            >
              <BlocoIcon className="h-6 w-6 text-" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {blocoTitle}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">
            {bloco.tipo}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}
