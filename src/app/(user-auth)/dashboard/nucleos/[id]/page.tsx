// src/app/(user-auth)/dashboard/nucleos/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useNucleo } from "@/hooks/useNucleo";
import { useBlocos } from "@/hooks/useBlocos";
import Image from "next/image";
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
  Loader2,
  Plus,
  ArrowLeft,
  Layers,
  LayoutGrid,
  List,
  Target,
  Wallet,
  Timer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CriarBlocoModal } from "@/components/blocos/CriarBlocoModal";
import { BlocoCard } from "@/components/blocos/bloco-card";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import type { CreateBlocoPayload } from "@/types/bloco";
import { BLOCO_INITIALIZERS } from "@/lib/bloco-initializers";
import { ColecoesBlocoCard } from "@/components/blocos/cruds/ColecoesBlocoCard";
import { TarefasBlocoCard } from "@/components/blocos/cruds/TarefasBlocoCard";
import { ListasBlocoCard } from "@/components/blocos/cruds/ListasBlocoCard";
import { CalendarioBlocoCard } from "@/components/blocos/cruds/CalendarioBlocoCard";
import { TimersBlocoCard } from "@/components/blocos/cruds/TimersBlocoCard";
import { motion, AnimatePresence } from "framer-motion";

// Mapeamento de ícones baseado nos tipos de núcleo
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

// Mapeamento de ícones por iconId
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

type LayoutMode = "grid" | "list";

// Componente para renderizar o card correto baseado no tipo do bloco
function BlocoCardRenderer({
  bloco,
  nucleoId,
  onDeleteBloco,
  onEditBloco,
  isDeleting,
}: {
  bloco: any;
  nucleoId: string;
  onDeleteBloco: (blocoId: string) => void;
  onEditBloco: (blocoId: string) => void;
  isDeleting: boolean;
}) {
  const commonProps = {
    bloco,
    nucleoId,
    onDelete: () => onDeleteBloco(bloco.id),
    onEdit: () => onEditBloco(bloco.id),
    isDeleting,
  };

  switch (bloco.tipo) {
    case "colecoes":
      return <ColecoesBlocoCard {...commonProps} />;
    case "lista":
      return <ListasBlocoCard {...commonProps} />;
    case "tarefas":
      return <TarefasBlocoCard {...commonProps} />;
    case "calendario":
      return <CalendarioBlocoCard {...commonProps} />;
    case "timer":
    case "timers":
      return <TimersBlocoCard {...commonProps} />;
    default:
      return <BlocoCard {...commonProps} />;
  }
}

export default function NucleoDetailPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = params.id;
  const id = typeof rawId === "string" ? rawId : (rawId as any)?.id;

  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nucleo-detail-layout-mode");
      return (saved as LayoutMode) || "grid";
    }
    return "grid";
  });

  useEffect(() => {
    localStorage.setItem("nucleo-detail-layout-mode", layoutMode);
  }, [layoutMode]);

  if (!id || typeof id !== "string") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">ID do Nucleo inválido.</p>
          <Button variant="link" onClick={() => router.push("/dashboard")}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { data: nucleo, isLoading: nucleoLoading, error } = useNucleo(id);
  const {
    blocos,
    isLoading: blocosLoading,
    create,
    remove,
    isCreating,
    isDeleting,
  } = useBlocos(id);

  const [modalCriarAberto, setModalCriarAberto] = useState(false);

  const handleCriarBloco = async (payload: CreateBlocoPayload) => {
    try {
      const blocoCriado = await create(payload);
      const initializer = BLOCO_INITIALIZERS[payload.tipo];
      if (initializer) {
        await initializer(blocoCriado.id, payload.titulo);
      }
      toast({
        title: "Bloco criado com sucesso!",
        description: `Bloco do tipo "${payload.tipo}" adicionado.`,
      });
      setModalCriarAberto(false);
    } catch (error) {
      console.error("Erro ao criar bloco:", error);
      toast({
        title: "Erro ao criar bloco",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleExcluirBloco = async (blocoId: string) => {
    if (!confirm("Tem certeza que deseja excluir este bloco?")) return;
    try {
      await remove(blocoId);
      toast({ title: "Bloco excluído com sucesso!" });
    } catch (error) {
      console.error("Erro ao excluir bloco:", error);
      toast({
        title: "Erro ao excluir bloco",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleEditarBloco = (blocoId: string) => {
    console.log("Editar bloco:", blocoId);
    toast({ title: "Edição em desenvolvimento", description: "Em breve!" });
  };

  if (nucleoLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !nucleo) {
    notFound();
  }

  const randomImageUrl = `https://picsum.photos/seed/${nucleo.id}/1200/400`;
  const capaUrl = nucleo.imagemCapa || randomImageUrl;
  const corDestaque = nucleo.corDestaque || "#6366f1";
  const IconComponent = getNucleoIcon(nucleo.tipo, nucleo.iconId);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner de capa */}
      <div className="relative w-full h-[20vh] min-h-[200px] max-h-[350px]">
        <Image
          src={capaUrl}
          alt={`Capa de ${nucleo.nome}`}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-background/20 backdrop-blur-sm hover:bg-background/40 text-white"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-12">
        <div className="relative -mt-12 mb-8">
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-white shadow-lg border-4 border-background"
            style={{ backgroundColor: corDestaque }}
          >
            <IconComponent className="w-8 h-8 md:w-10 md:h-10" />
          </div>
        </div>

        <div className="space-y-2 max-w-3xl mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {nucleo.nome}
          </h1>
          {nucleo.descricao && (
            <p className="text-muted-foreground text-base md:text-lg">
              {nucleo.descricao}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="capitalize">{nucleo.tipo}</span>
            <span>•</span>
            <span>
              Criado em{" "}
              {new Date(nucleo.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Lista de blocos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Blocos
            </h2>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center border rounded-md">
                <Button
                  variant={layoutMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-r-none"
                  onClick={() => setLayoutMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={layoutMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-l-none"
                  onClick={() => setLayoutMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={() => setModalCriarAberto(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar bloco
              </Button>
            </div>
          </div>

          {blocosLoading ? (
            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          ) : blocos.length === 0 ? (
            <div
              onClick={() => setModalCriarAberto(true)}
              className="rounded-xl border-2 border-dashed border-border p-12 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/20 transition-all"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Nenhum bloco ainda</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Adicione tarefas, listas, calendário e muito mais
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={layoutMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4 sm:block"
              >
                {/* Mobile: sempre lista */}
                <div className="flex flex-col gap-4 sm:hidden">
                  {blocos.map((bloco) => (
                    <BlocoCardRenderer
                      key={bloco.id}
                      bloco={bloco}
                      nucleoId={id}
                      onDeleteBloco={handleExcluirBloco}
                      onEditBloco={handleEditarBloco}
                      isDeleting={isDeleting}
                    />
                  ))}
                </div>

                {/* Desktop: grid ou lista */}
                <div className="hidden sm:block">
                  {layoutMode === "grid" ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {blocos.map((bloco) => (
                        <BlocoCardRenderer
                          key={bloco.id}
                          bloco={bloco}
                          nucleoId={id}
                          onDeleteBloco={handleExcluirBloco}
                          onEditBloco={handleEditarBloco}
                          isDeleting={isDeleting}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {blocos.map((bloco) => (
                        <BlocoCardRenderer
                          key={bloco.id}
                          bloco={bloco}
                          nucleoId={id}
                          onDeleteBloco={handleExcluirBloco}
                          onEditBloco={handleEditarBloco}
                          isDeleting={isDeleting}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <CriarBlocoModal
        open={modalCriarAberto}
        onClose={() => setModalCriarAberto(false)}
        onConfirm={handleCriarBloco}
        nucleoId={id}
        isCreating={isCreating}
      />
    </div>
  );
}
