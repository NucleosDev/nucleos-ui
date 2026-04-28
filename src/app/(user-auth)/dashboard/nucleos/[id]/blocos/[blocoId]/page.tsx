// src/app/(user-auth)/dashboard/nucleos/[id]/blocos/[blocoId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useBloco, useBlocos } from "@/hooks/useBlocos";
import { useNucleo } from "@/hooks/useNucleo";
import Image from "next/image";
import {
  Loader2,
  ArrowLeft,
  Layers,
  Plus,
  BookOpen,
  Heart,
  Briefcase,
  Home,
  Dumbbell,
  Palette,
  Music,
  Code,
  Star,
  Globe,
  Coffee,
  Camera,
  Plane,
  ShoppingBag,
  Users,
  Mic,
  Gamepad2,
  Leaf,
  GraduationCap,
  Target,
  Wallet,
  CheckSquare,
  ListTodo,
  CalendarDays,
  Timer,
  Activity,
  GripVertical,
  Calculator,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CriarBlocoModal } from "@/components/blocos/CriarBlocoModal";
import { BlocoHoverActions } from "@/components/blocos/BlocoHoverActions";
import { NucleoCanvas } from "@/components/nucleo/NucleoCanvas";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import type { CreateBlocoPayload, Bloco } from "@/types/bloco";
import { BLOCO_INITIALIZERS } from "@/lib/bloco-initializers";
import { ColecoesBlocoCard } from "@/components/blocos/cruds/ColecoesBlocoCard";
import { TarefasBlocoCard } from "@/components/blocos/cruds/TarefasBlocoCard";
import { ListasBlocoCard } from "@/components/blocos/cruds/ListasBlocoCard";
import { CalendarioBlocoCard } from "@/components/blocos/cruds/CalendarioBlocoCard";
import { TimersBlocoCard } from "@/components/blocos/cruds/TimersBlocoCard";
import { HabitosBlocoCard } from "@/components/blocos/cruds/HabitosBlocoCard";
import { BlocoDeNotas } from "@/components/blocos/cruds/BlocoDeNotas";
import { motion } from "framer-motion";

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

function renderBlocoContent(bloco: Bloco, nucleoId: string) {
  const props = {
    bloco,
    nucleoId,
    onDelete: () => {},
    onEdit: () => {},
    isDeleting: false,
  };
  switch (bloco.tipo) {
    case "colecoes":
      return <ColecoesBlocoCard {...props} />;
    case "lista":
      return <ListasBlocoCard {...props} />;
    case "tarefas":
      return <TarefasBlocoCard {...props} />;
    case "calendario":
      return <CalendarioBlocoCard {...props} />;
    case "timer":
    case "timers":
      return <TimersBlocoCard {...props} />;
    case "habitos":
    case "habito":
      return <HabitosBlocoCard {...props} />;
    case "notas":
      return (
        <BlocoDeNotas bloco={bloco} nucleoId={nucleoId} onDelete={() => {}} />
      );
    default:
      return (
        <p className="text-muted-foreground text-sm">Bloco: {bloco.tipo}</p>
      );
  }
}

// PÁGINA
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

  const [modalCriarAberto, setModalCriarAberto] = useState(false);

  const handleCriarSubBloco = async (payload: CreateBlocoPayload) => {
    try {
      const blocoCriado = await createSub({ ...payload, parentId: blocoId });
      const initializer = BLOCO_INITIALIZERS[payload.tipo];
      if (initializer) await initializer(blocoCriado.id, payload.titulo);
      toast({ title: "Sub-bloco criado!" });
      setModalCriarAberto(false);
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  const handleExcluirSubBloco = async (id: string) => {
    if (!confirm("Excluir este sub-bloco?")) return;
    try {
      await removeSub(id);
      toast({ title: "Excluído!" });
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  if (blocoLoading || nucleoLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (blocoError || !bloco) {
    return (
      <div className="container py-8 text-center">
        <p className="text-muted-foreground">Bloco não encontrado.</p>
        <Button variant="link" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  if (!nucleo) {
    return (
      <div className="container py-8 text-center">
        <p className="text-muted-foreground">Núcleo não encontrado.</p>
        <Button variant="link" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  const capaUrl =
    nucleo.imagemCapa || `https://picsum.photos/seed/${nucleo.id}/1200/400`;
  const IconComponentBloco = getBlocoIcon(bloco.tipo);
  const corDestaque = nucleo.corDestaque || "#6366f1";
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
        <Button
          variant="ghost"
          className="absolute top-6 left-6 bg-background/20 backdrop-blur text-white"
          onClick={() => router.push(`/dashboard/nucleos/${nucleoId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para {nucleo.nome}
        </Button>
        <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
          <IconComponentBloco className="h-4 w-4 text-white" />
          <span className="text-sm font-medium text-white">{blocoTitle}</span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-15">
        <div className="relative z-30 -mt-21 ml-8 top--10">
          {" "}
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-white shadow-xl border-4 border-background"
            style={{ backgroundColor: corDestaque }}
          >
            <IconComponentBloco className="w-8 h-8 md:w-10 md:h-10" />
          </div>
        </div>

        <div className="max-w-3xl mb-8 pt-8">
          <h1 className="text-3xl font-bold">{blocoTitle}</h1>
          <p className="text-muted-foreground mt-1">
            Tipo: {bloco.tipo} • Profundidade: {bloco.depth || 0}
          </p>
        </div>

        {/* CANVAS (Substitui o CanvasEditor) */}
        <NucleoCanvas
          nucleoId={nucleoId}
          onAddFunctionalBlock={() => setModalCriarAberto(true)}
        />

        {/* CONTEÚDO DO BLOCO */}
        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 border-t border-border/50" />
          <span className="text-xs text-muted-foreground font-medium">
            CONTEÚDO
          </span>
          <div className="flex-1 border-t border-border/50" />
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-4">
          {renderBlocoContent(bloco, nucleoId)}
        </div>

        {/* SUB-BLOCOS */}
        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 border-t border-border/50" />
          <span className="text-xs text-muted-foreground font-medium">
            SUB-BLOCOS
          </span>
          <div className="flex-1 border-t border-border/50" />
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="flex justify-end">
            <Button onClick={() => setModalCriarAberto(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" /> Sub-bloco
            </Button>
          </div>

          {subBlocos.length === 0 ? (
            <div
              onClick={() => setModalCriarAberto(true)}
              className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer hover:border-primary/40"
            >
              <Plus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="font-medium">Nenhum sub-bloco</p>
            </div>
          ) : (
            subBlocos.map((subBloco) => (
              <motion.div
                key={subBloco.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative ml-6 border-l-2 border-primary/30 pl-4"
              >
                <BlocoHoverActions
                  bloco={subBloco}
                  nucleoId={nucleoId}
                  onOpenFullPage={() =>
                    router.push(
                      `/dashboard/nucleos/${nucleoId}/blocos/${subBloco.id}`,
                    )
                  }
                  onEdit={() => {
                    const novoTitulo = prompt(
                      "Novo título:",
                      subBloco.titulo || "",
                    );
                    if (novoTitulo !== null && novoTitulo.trim()) {
                      updateSub({
                        id: subBloco.id,
                        payload: { titulo: novoTitulo.trim() },
                      });
                    }
                  }}
                  onDelete={() => handleExcluirSubBloco(subBloco.id)}
                  isDeleting={isDeleting}
                />
                <div className="rounded-xl border border-border/50 bg-card p-4 hover:border-border transition-all">
                  {renderBlocoContent(subBloco, nucleoId)}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <CriarBlocoModal
        open={modalCriarAberto}
        onClose={() => setModalCriarAberto(false)}
        onConfirm={handleCriarSubBloco}
        nucleoId={nucleoId}
        isCreating={isCreating}
        parentId={blocoId}
      />
    </div>
  );
}
