// src/app/(user-auth)/dashboard/nucleos/[id]/blocos/[blocoId]/layout.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useBloco } from "@/hooks/useBlocos";
import { useNucleo } from "@/hooks/useNucleo";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Loader2,
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
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ICONS
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

function getBlocoIcon(tipo: string): LucideIcon {
  return blocoIconMap[tipo] || GripVertical;
}

function getBlocoTitle(tipo: string): string {
  const titles: Record<string, string> = {
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
  return titles[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1);
}

export default function BlocoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

  // Loading
  if (blocoLoading || nucleoLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-[240px] md:h-[300px] w-full" />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
    );
  }

  // Error - Bloco não encontrado
  if (blocoError || !bloco) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Bloco não encontrado</h2>
          <p className="text-muted-foreground mb-4">
            O bloco que você procura não existe ou foi removido.
          </p>
          <Button onClick={() => router.back()}>Voltar</Button>
        </div>
      </div>
    );
  }

  // Error - Núcleo não encontrado
  if (!nucleo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Núcleo não encontrado</h2>
          <p className="text-muted-foreground mb-4">
            O núcleo associado a este bloco não foi encontrado.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Preparar dados
  const capaUrl =
    nucleo.imagemCapa || `https://picsum.photos/seed/${nucleo.id}/1200/400`;
  const corDestaque = nucleo.corDestaque || "#6366f1";
  const IconComponentBloco = getBlocoIcon(bloco.tipo);
  const blocoTitle = bloco.titulo || getBlocoTitle(bloco.tipo);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative w-full h-[240px] md:h-[300px] overflow-hidden">
        <Image
          src={capaUrl}
          alt={nucleo.nome}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 w-full text-background">
          <svg
            viewBox="0 0 500 100"
            preserveAspectRatio="none"
            className="w-full h-[60px]"
            fill="hsl(var(--background))"
          >
            <path
              d="M0,40 C150,-20 350,120 500,60 L500,100 L0,100 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Botão voltar */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-background/20 backdrop-blur-sm text-white z-20 hover:bg-background/40"
          onClick={() => router.push(`/dashboard/nucleos/${nucleoId}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Badge do tipo de bloco */}
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20 z-20">
          <IconComponentBloco className="h-4 w-4 text-white" />
          <span className="text-sm font-medium text-white">{blocoTitle}</span>
        </div>
      </div>

      {/* Header — alinhado ao mesmo grid do canvas */}
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="relative z-30 -mt-22 mb-4 pb-5">
          <div
            className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-white shadow-xl border-4 border-background"
            style={{ backgroundColor: corDestaque }}
          >
            <IconComponentBloco className="w-7 h-7 md:w-8 md:h-8" />
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <button
            onClick={() => router.push(`/dashboard/nucleos/${nucleoId}`)}
            className="hover:text-foreground transition-colors"
          >
            {nucleo.nome}
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{blocoTitle}</span>
        </nav>

        <div className="mb-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {blocoTitle}
          </h1>
        </div>
      </div>

      {children}
    </div>
  );
}
