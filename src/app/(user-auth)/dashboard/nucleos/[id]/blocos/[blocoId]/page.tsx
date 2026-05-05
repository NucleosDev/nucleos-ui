// src/app/(user-auth)/dashboard/nucleos/[id]/blocos/[blocoId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useBloco, useBlocos } from "@/hooks/useBlocos";
import { useNucleo } from "@/hooks/useNucleo";
import { useCanvasBlocks } from "@/hooks/useCanvas";
import Image from "next/image";
import {
  ArrowLeft,
  Loader2,
  Plus,
  CheckSquare,
  CalendarDays,
  Activity,
  ListTodo,
  Timer,
  Layers,
  FileText,
  BookOpen,
  GripVertical,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { CriarBlocoModal } from "@/components/blocos/CriarBlocoModal";
import { NucleoDocument } from "@/components/document";
import { ColecoesBlocoCard } from "@/components/blocos/cruds/ColecoesBlocoCard";
import { TarefasBlocoCard } from "@/components/blocos/cruds/TarefasBlocoCard";
import { ListasBlocoCard } from "@/components/blocos/cruds/ListasBlocoCard";
import { CalendarioBlocoCard } from "@/components/blocos/cruds/CalendarioBlocoCard";
import { TimersBlocoCard } from "@/components/blocos/cruds/TimersBlocoCard";
import { HabitosBlocoCard } from "@/components/blocos/cruds/HabitosBlocoCard";
import { BlocoDeNotas } from "@/components/blocos/cruds/BlocoDeNotas";
import { BLOCO_INITIALIZERS } from "@/lib/bloco-initializers";
import { cn } from "@/lib/utils";
import type { CreateBlocoPayload, Bloco } from "@/types/bloco";

// ── Mapa de ícones de bloco ────────────────────────────────────────────────

const BLOCO_ICONS: Record<string, LucideIcon> = {
  tarefas: CheckSquare,
  calendario: CalendarDays,
  habitos: Activity,
  habito: Activity,
  lista: ListTodo,
  timer: Timer,
  timers: Timer,
  colecoes: Layers,
  notas: BookOpen,
};

const BLOCO_LABELS: Record<string, string> = {
  tarefas: "Tarefas",
  calendario: "Calendário",
  habitos: "Hábitos",
  habito: "Hábito",
  lista: "Lista",
  timer: "Timer",
  timers: "Timers",
  colecoes: "Coleções",
  notas: "Notas",
};

const BLOCO_COLORS: Record<string, string> = {
  tarefas: "#3B82F6",
  calendario: "#6366F1",
  habitos: "#22C55E",
  habito: "#22C55E",
  lista: "#06B6D4",
  timer: "#F97316",
  timers: "#F97316",
  colecoes: "#10B981",
  notas: "#A855F7",
};

function renderConteudo(bloco: Bloco, nucleoId: string) {
  const props = {
    bloco,
    nucleoId,
    onDelete: () => {},
    onEdit: () => {},
    isDeleting: false,
  };
  switch (bloco.tipo) {
    case "tarefas":
      return <TarefasBlocoCard {...props} />;
    case "calendario":
      return <CalendarioBlocoCard {...props} />;
    case "habitos":
    case "habito":
      return <HabitosBlocoCard {...props} />;
    case "lista":
      return <ListasBlocoCard {...props} />;
    case "timer":
    case "timers":
      return <TimersBlocoCard {...props} />;
    case "colecoes":
      return <ColecoesBlocoCard {...props} />;
    case "notas":
      return (
        <BlocoDeNotas bloco={bloco} nucleoId={nucleoId} onDelete={() => {}} />
      );
    default:
      return (
        <p className="text-muted-foreground text-sm p-4">Bloco: {bloco.tipo}</p>
      );
  }
}

// ── Componente principal ───────────────────────────────────────────────────

export default function BlocoDetalhesPage() {
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
  const {
    blocos: subBlocos,
    create: createSub,
    remove: removeSub,
    update: updateSub,
    isCreating,
    isDeleting,
  } = useBlocos(nucleoId, blocoId);

  const [modalAberto, setModalAberto] = useState(false);

  const handleCriarSub = async (payload: CreateBlocoPayload) => {
    try {
      const criado = await createSub({ ...payload, parentId: blocoId });
      const initializer = BLOCO_INITIALIZERS[payload.tipo];
      if (initializer) await initializer(criado.id, payload.titulo);
      toast({ title: "Sub-bloco criado!" });
      setModalAberto(false);
    } catch {
      toast({ title: "Erro ao criar", variant: "destructive" });
    }
  };

  const handleExcluirSub = async (id: string) => {
    if (!confirm("Excluir este sub-bloco?")) return;
    try {
      await removeSub(id);
      toast({ title: "Excluído!" });
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────

  if (blocoLoading || nucleoLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-4">
        <Skeleton className="h-52 w-full rounded-xl" />
        <Skeleton className="h-10 w-1/2 rounded-lg" />
        <Skeleton className="h-32 w-full rounded-xl mt-6" />
      </div>
    );
  }

  if (blocoError || !bloco || !nucleo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-muted-foreground">Bloco não encontrado.</p>
        <Button variant="link" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  const Icon = BLOCO_ICONS[bloco.tipo] ?? GripVertical;
  const cor = BLOCO_COLORS[bloco.tipo] ?? nucleo.corDestaque ?? "#4D7CFF";
  const label = bloco.titulo || BLOCO_LABELS[bloco.tipo] || bloco.tipo;
  const capaUrl =
    nucleo.imagemCapa || `https://picsum.photos/seed/${nucleo.id}/1400/400`;

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative w-full h-[200px] md:h-[240px] overflow-hidden">
        <Image
          src={capaUrl}
          alt={nucleo.nome}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 50"
            preserveAspectRatio="none"
            className="w-full h-10"
            fill="hsl(var(--background))"
          >
            <path d="M0,25 C360,50 720,0 1080,25 C1260,37 1380,15 1440,25 L1440,50 L0,50 Z" />
          </svg>
        </div>

        <div className="absolute top-4 left-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/20 backdrop-blur-md text-white border border-white/20"
            onClick={() => router.push(`/dashboard/nucleos/${nucleoId}`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-white/80 backdrop-blur-sm bg-background/20 px-2 py-1 rounded-full border border-white/20">
            {nucleo.nome}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="mx-auto max-w-3xl px-4 md:px-6 -mt-10 relative z-10 pb-32">
        {/* Ícone e título */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-xl border-4 border-background mb-4"
            style={{ backgroundColor: cor }}
          >
            <Icon className="h-7 w-7" />
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </button>
            <span>/</span>
            <button
              onClick={() => router.push(`/dashboard/nucleos/${nucleoId}`)}
              className="hover:text-foreground transition-colors"
            >
              {nucleo.nome}
            </button>
            <span>/</span>
            <span className="text-foreground font-medium">{label}</span>
          </nav>

          <h1 className="text-3xl font-bold">{label}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {BLOCO_LABELS[bloco.tipo] ?? bloco.tipo}
            {(bloco.depth ?? 0) > 0 && <> · Profundidade {bloco.depth}</>}
          </p>
        </motion.div>

        {/* Conteúdo principal do bloco */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden mb-8">
          {renderConteudo(bloco, nucleoId)}
        </div>

        {/* Canvas de notas do bloco */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 border-t border-border/40" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Notas do bloco
            </span>
            <div className="flex-1 border-t border-border/40" />
          </div>
          <NucleoDocument nucleoId={nucleoId} />
        </div>

        {/* Sub-blocos */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 border-t border-border/40" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Sub-blocos
            </span>
            <div className="flex-1 border-t border-border/40" />
          </div>

          <div className="flex justify-end mb-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setModalAberto(true)}
              className="gap-2"
            >
              <Plus className="h-3.5 w-3.5" />
              Adicionar sub-bloco
            </Button>
          </div>

          {subBlocos.length === 0 ? (
            <div
              onClick={() => setModalAberto(true)}
              className="rounded-xl border-2 border-dashed border-border/50 p-10 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/20 transition-all"
            >
              <Plus className="h-6 w-6 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Nenhum sub-bloco. Clique para adicionar.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {subBlocos.map((sub) => {
                const SubIcon = BLOCO_ICONS[sub.tipo] ?? GripVertical;
                const subCor = BLOCO_COLORS[sub.tipo] ?? "#6366f1";
                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/30 rounded-full" />
                    <div className="ml-4 rounded-xl border border-border/50 bg-card overflow-hidden hover:border-border hover:shadow-sm transition-all">
                      {/* Header sub-bloco */}
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-muted/20">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-6 w-6 rounded-md flex items-center justify-center text-white"
                            style={{ backgroundColor: subCor }}
                          >
                            <SubIcon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm font-medium">
                            {sub.titulo || BLOCO_LABELS[sub.tipo] || sub.tipo}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              router.push(
                                `/dashboard/nucleos/${nucleoId}/blocos/${sub.id}`,
                              )
                            }
                            title="Abrir"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => handleExcluirSub(sub.id)}
                            disabled={isDeleting}
                          >
                            <span className="text-xs">×</span>
                          </Button>
                        </div>
                      </div>
                      <div>{renderConteudo(sub, nucleoId)}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <CriarBlocoModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={handleCriarSub}
        nucleoId={nucleoId}
        isCreating={isCreating}
        parentId={blocoId}
      />
    </div>
  );
}
