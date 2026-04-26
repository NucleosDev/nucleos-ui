// src/app/(user-auth)/dashboard/nucleos/[id]/blocos/[blocoId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useBloco, useSubBlocos } from "@/hooks/useBlocos";
import { useNucleo } from "@/hooks/useNucleo";
import Image from "next/image";
import { Loader2, ArrowLeft, Layers, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlocoCard } from "@/components/blocos/BlocoCard";
import { ListasBlocoCard } from "@/components/blocos/cruds/ListasBlocoCard";
import { TarefasBlocoCard } from "@/components/blocos/cruds/TarefasBlocoCard";
import { ColecoesBlocoCard } from "@/components/blocos/cruds/ColecoesBlocoCard";
import { CalendarioBlocoCard } from "@/components/blocos/cruds/CalendarioBlocoCard";
import { TimersBlocoCard } from "@/components/blocos/cruds/TimersBlocoCard";
import { HabitosBlocoCard } from "@/components/blocos/cruds/HabitosBlocoCard";
import { CanvasEditor } from "@/components/canvas/CanvasEditor";
import { BlockRenderer } from "@/components/canvas/BlockRenderer";
import type { CanvasBlock } from "@/components/canvas/types";
import type { CreateBlocoPayload, Bloco } from "@/types/bloco";
import {
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
import { useState, useEffect, useCallback } from "react";
import { CriarBlocoModal } from "@/components/blocos/CriarBlocoModal";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Mapeamento de ícones para tipos de bloco
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

const tipoIcons: Record<string, LucideIcon> = {
  estudo: BookOpen,
  hobby: Heart,
  profissional: Briefcase,
  pessoal: Home,
  projeto: Target,
  fitness: Dumbbell,
  bemestar: Coffee,
  social: Users,
  programacao: Code,
  musica: Music,
  fotografia: Camera,
  arte: Palette,
  idiomas: Globe,
  financas: Wallet,
  trabalho: Briefcase,
  saude: Heart,
  educacao: GraduationCap,
};

const iconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  heart: Heart,
  briefcase: Briefcase,
  home: Home,
  dumbbell: Dumbbell,
  palette: Palette,
  music: Music,
  code: Code,
  star: Star,
  globe: Globe,
  coffee: Coffee,
  camera: Camera,
  plane: Plane,
  "shopping-bag": ShoppingBag,
  users: Users,
  mic: Mic,
  "gamepad-2": Gamepad2,
  leaf: Leaf,
  "graduation-cap": GraduationCap,
};

function getNucleoIcon(tipo: string, iconId?: string | null): LucideIcon {
  if (iconId && iconMap[iconId]) return iconMap[iconId];
  const tipoLower = tipo?.toLowerCase() || "";
  const icon = tipoIcons[tipoLower];
  if (icon) return icon;
  return Layers;
}

function getBlocoIcon(tipo: string): LucideIcon {
  const icon = blocoIconMap[tipo];
  if (icon) return icon;
  return GripVertical;
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

export default function BlocoDetalhesPage() {
  const params = useParams();
  const router = useRouter();

  const nucleoId = params.id as string;
  const blocoId = params.blocoId as string;
  const [modalCriarAberto, setModalCriarAberto] = useState(false);

  // Buscar bloco atual
  const {
    bloco,
    isLoading: blocoLoading,
    error: blocoError,
    update: updateBloco,
  } = useBloco(blocoId, nucleoId);

  // Buscar núcleo
  const { data: nucleo, isLoading: nucleoLoading } = useNucleo(nucleoId);

  // Buscar sub-blocos - CORRIGIDO: useSubBlocos requer 2 argumentos
  const subBlocosResult = useSubBlocos(blocoId, nucleoId);

  // Garantir que temos os valores mesmo se o hook falhar
  const subBlocos = subBlocosResult?.subBlocos ?? [];
  const subBlocosLoading = subBlocosResult?.isLoading ?? false;
  const createSubBloco = subBlocosResult?.create ?? (async () => {});
  const removeSubBloco = subBlocosResult?.remove ?? (async () => {});

  // Canvas blocks do bloco
  const [canvasBlocks, setCanvasBlocks] = useState<CanvasBlock[]>([
    { id: "welcome-1", type: "paragraph", content: "" },
  ]);

  // Carregar canvas blocks do bloco
  useEffect(() => {
    if (bloco?.configuracoes?.canvasBlocks) {
      setCanvasBlocks(bloco.configuracoes.canvasBlocks);
    }
  }, [bloco]);

  const handleCanvasChange = useCallback(
    async (blocks: CanvasBlock[]) => {
      setCanvasBlocks(blocks);
      if (bloco && updateBloco) {
        try {
          await updateBloco({
            payload: {
              configuracoes: { ...bloco.configuracoes, canvasBlocks: blocks },
            },
          });
        } catch (error) {
          console.error("Erro ao salvar canvas:", error);
        }
      }
    },
    [bloco, updateBloco],
  );

  const handleAddSubBloco = async (payload: CreateBlocoPayload) => {
    try {
      await createSubBloco(payload);
      toast({ title: "Sub-bloco criado com sucesso!" });
      setModalCriarAberto(false);
    } catch (error) {
      toast({ title: "Erro ao criar sub-bloco", variant: "destructive" });
    }
  };

  const handleDeleteSubBloco = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este sub-bloco?")) {
      try {
        await removeSubBloco(id);
        toast({ title: "Sub-bloco excluído!" });
      } catch (error) {
        toast({ title: "Erro ao excluir", variant: "destructive" });
      }
    }
  };

  const isLoading = blocoLoading || nucleoLoading || subBlocosLoading;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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

  const randomImageUrl = `https://picsum.photos/seed/${nucleo.id}/1200/400`;
  const capaUrl = nucleo.imagemCapa || randomImageUrl;
  const IconComponentBloco = getBlocoIcon(bloco.tipo);
  const corDestaque = nucleo.corDestaque || "#6366f1";
  const blocoTitle = bloco.titulo || getBlocoTitle(bloco.tipo);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner de capa */}
      <div className="relative w-full h-[340px] overflow-hidden">
        {/* CAPA */}
        <Image
          src={capaUrl}
          alt={`Capa de ${nucleo.nome}`}
          fill
          className="object-cover scale-105"
          priority
        />

        {/* OVERLAY GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

        {/* WAVE */}
        <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none text-background">
          <svg
            viewBox="0 0 500 100"
            preserveAspectRatio="none"
            className="w-full h-[110px]"
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
          className="absolute top-12 left-6 bg-foreground/20 backdrop-blur text-background group"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-6 w-4 transition-transform group-hover:-translate-x-0.5" />
          <div className="flex items-center gap-2">
            <span>Voltar</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-foreground/20 rounded-md">
              <Layers className="h-3.5 w-3.5" />
              <span className="font-medium">{blocoTitle}</span>
            </div>
          </div>
        </Button>
        <div className="absolute top-12 right-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
            <IconComponentBloco className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">
              {getBlocoTitle(bloco.tipo)}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-12">
        <div
          className=" relative left-8 -mt-27 mb-10 z-30
        sm:relative sm:left-5 sm:-mt-26 sm:mb-12 sm:z-30 "
        >
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-white shadow-lg border-4 border-background"
            style={{ backgroundColor: corDestaque }}
          >
            <IconComponentBloco className="w-8 h-8 md:w-10 md:h-10" />
          </div>
        </div>

        {/* Bloco Card */}
        <div className="mb-6">
          <BlocoCard
            bloco={bloco}
            nucleoId={nucleoId}
            compact={false}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>

        {/* CANVAS EDITOR */}
        <div className="mb-12">
          <CanvasEditor
            blocks={canvasBlocks}
            onBlocksChange={handleCanvasChange}
            placeholder="Digite '/' para comandos..."
          />
        </div>

        {/* Separador */}
        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 border-t border-border/50" />
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            SUB-BLOCOS
          </span>
          <div className="flex-1 border-t border-border/50" />
        </div>

        {/* Sub-blocos */}
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setModalCriarAberto(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" /> Adicionar sub-bloco
            </Button>
          </div>

          {subBlocos.length === 0 ? (
            <div
              className="rounded-xl border-2 border-dashed p-12 text-center cursor-pointer hover:border-primary/40 transition-all"
              onClick={() => setModalCriarAberto(true)}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Nenhum sub-bloco ainda</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Clique para adicionar
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {subBlocos.map((subBloco: Bloco) => (
                <motion.div
                  key={subBloco.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="ml-6 border-l-2 border-primary/30 pl-4"
                >
                  <BlockRenderer
                    bloco={subBloco}
                    nucleoId={nucleoId}
                    isSubBloco
                    onDelete={() => handleDeleteSubBloco(subBloco.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CriarBlocoModal
        open={modalCriarAberto}
        onClose={() => setModalCriarAberto(false)}
        onConfirm={handleAddSubBloco}
        nucleoId={nucleoId}
        isCreating={false}
      />
    </div>
  );
}
