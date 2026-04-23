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
  Pencil,
  Check,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CriarBlocoModal } from "@/components/blocos/CriarBlocoModal";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import type { CreateBlocoPayload, Bloco } from "@/types/bloco";
import { BLOCO_INITIALIZERS } from "@/lib/bloco-initializers";
import { ColecoesBlocoCard } from "@/components/blocos/cruds/ColecoesBlocoCard";
import { TarefasBlocoCard } from "@/components/blocos/cruds/TarefasBlocoCard";
import { ListasBlocoCard } from "@/components/blocos/cruds/ListasBlocoCard";
import { CalendarioBlocoCard } from "@/components/blocos/cruds/CalendarioBlocoCard";
import { TimersBlocoCard } from "@/components/blocos/cruds/TimersBlocoCard";
import { HabitosBlocoCard } from "@/components/blocos/cruds/HabitosBlocoCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Mapeamento de ícones baseado nos tipos de Nucleo
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

type LayoutMode = "grid" | "list";

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
    update,
    reorder,
    isCreating,
    isDeleting,
  } = useBlocos(id);

  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [blocoEditando, setBlocoEditando] = useState<Bloco | null>(null);
  const [tituloEditando, setTituloEditando] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleEditarBloco = (bloco: Bloco) => {
    setBlocoEditando(bloco);
    setTituloEditando(bloco.titulo || "");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSalvarEdicao = async () => {
    if (!blocoEditando) return;
    try {
      await update({
        id: blocoEditando.id,
        payload: { titulo: tituloEditando.trim() },
      });
      toast({ title: "Bloco atualizado!" });
      setBlocoEditando(null);
    } catch (error) {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  const handleCancelarEdicao = () => {
    setBlocoEditando(null);
    setTituloEditando("");
  };

  const handleDuplicateBloco = async (bloco: Bloco) => {
    try {
      const payload: CreateBlocoPayload = {
        nucleoId: id,
        tipo: bloco.tipo,
        titulo: `${bloco.titulo || ""} (cópia)`.trim(),
        posicao: (bloco.posicao || 0) + 1,
        configuracoes: bloco.configuracoes || undefined,
      };
      await create(payload);
      toast({ title: "Bloco duplicado com sucesso!" });
    } catch (error) {
      console.error("Erro ao duplicar bloco:", error);
      toast({
        title: "Erro ao duplicar bloco",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (e: React.DragEvent) => {
    e.preventDefault();
    const blocoId = e.dataTransfer.getData("text/plain");
    if (!blocoId) return;

    const targetElement = document.elementFromPoint(e.clientX, e.clientY);
    const targetBlocoElement = targetElement?.closest("[data-bloco-id]");
    if (!targetBlocoElement) return;

    const targetId = targetBlocoElement.getAttribute("data-bloco-id");
    if (!targetId || blocoId === targetId) return;

    const blocoIndex = blocos?.findIndex((b) => b.id === blocoId) ?? -1;
    const targetIndex = blocos?.findIndex((b) => b.id === targetId) ?? -1;
    if (blocoIndex === -1 || targetIndex === -1) return;

    const newBlocos = [...(blocos || [])];
    const [movedBloco] = newBlocos.splice(blocoIndex, 1);
    newBlocos.splice(targetIndex, 0, movedBloco);

    const orders = newBlocos.map((b, index) => ({ id: b.id, posicao: index }));

    try {
      await reorder({ nucleoId: id, orders });
      toast({ title: "Blocos reordenados!" });
    } catch (error) {
      console.error("Erro ao reordenar blocos:", error);
      toast({
        title: "Erro ao reordenar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
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

  // Componente wrapper para drag & drop
  const BlocoWrapper = ({
    bloco,
    children,
  }: {
    bloco: Bloco;
    children: React.ReactNode;
  }) => {
    const isEditing = blocoEditando?.id === bloco.id;

    return (
      <div
        data-bloco-id={bloco.id}
        className="group relative"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDragEnd}
      >
        {/* Cabeçalho do bloco com ações */}
        <div className="absolute -top-3 right-2 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 bg-background shadow-sm"
                onClick={handleSalvarEdicao}
              >
                <Check className="h-3.5 w-3.5 text-green-500" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 bg-background shadow-sm"
                onClick={handleCancelarEdicao}
              >
                <X className="h-3.5 w-3.5 text-red-500" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 bg-background shadow-sm"
                onClick={() =>
                  router.push(`/dashboard/nucleos/${id}/blocos/${bloco.id}`)
                }
                title="Abrir em tela cheia"
              >
                <Layers className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 bg-background shadow-sm"
                onClick={() => handleEditarBloco(bloco)}
                title="Renomear"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 bg-background shadow-sm"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDuplicateBloco(bloco)}>
                    Duplicar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setModalCriarAberto(true)}>
                    Adicionar bloco abaixo
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleExcluirBloco(bloco.id)}
                    className="text-destructive"
                    disabled={isDeleting}
                  >
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {/* Drag handle */}
        <div
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", bloco.id);
            e.dataTransfer.effectAllowed = "move";
            e.stopPropagation();
          }}
        >
          <div className="p-1 bg-background/80 backdrop-blur-sm rounded shadow-sm">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="9" cy="6" r="1.5" fill="currentColor" />
              <circle cx="9" cy="12" r="1.5" fill="currentColor" />
              <circle cx="9" cy="18" r="1.5" fill="currentColor" />
              <circle cx="15" cy="6" r="1.5" fill="currentColor" />
              <circle cx="15" cy="12" r="1.5" fill="currentColor" />
              <circle cx="15" cy="18" r="1.5" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Conteúdo do bloco */}
        <div
          className={cn(
            "relative",
            isEditing && "ring-2 ring-primary rounded-lg",
          )}
        >
          {isEditing ? (
            <div className="p-3 bg-background rounded-lg border">
              <Input
                ref={inputRef}
                value={tituloEditando}
                onChange={(e) => setTituloEditando(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSalvarEdicao();
                  if (e.key === "Escape") handleCancelarEdicao();
                }}
                placeholder="Nome do bloco"
                className="text-lg font-medium"
              />
            </div>
          ) : (
            children
          )}
        </div>

        {/* Botão adicionar bloco abaixo (hover no espaço entre blocos) */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            className="h-6 w-6 rounded-full shadow-md"
            onClick={() => setModalCriarAberto(true)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-background"
      onDragOver={(e) => e.preventDefault()}
    >
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
            <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
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
                    Clique para adicionar seu primeiro bloco
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
                className="space-y-6"
              >
                {/* Mobile: sempre lista */}
                <div className="flex flex-col gap-6 sm:hidden">
                  {blocos.map((bloco) => {
                    const commonProps = {
                      bloco,
                      nucleoId: id,
                      onDelete: () => handleExcluirBloco(bloco.id),
                      onEdit: () => handleEditarBloco(bloco),
                      isDeleting,
                    };

                    return (
                      <BlocoWrapper key={bloco.id} bloco={bloco}>
                        {bloco.tipo === "colecoes" && (
                          <ColecoesBlocoCard {...commonProps} />
                        )}
                        {bloco.tipo === "lista" && (
                          <ListasBlocoCard {...commonProps} />
                        )}
                        {bloco.tipo === "tarefas" && (
                          <TarefasBlocoCard {...commonProps} />
                        )}
                        {bloco.tipo === "calendario" && (
                          <CalendarioBlocoCard {...commonProps} />
                        )}
                        {(bloco.tipo === "timer" ||
                          bloco.tipo === "timers") && (
                          <TimersBlocoCard {...commonProps} />
                        )}
                        {(bloco.tipo === "habitos" ||
                          bloco.tipo === "habito") && (
                          <HabitosBlocoCard {...commonProps} />
                        )}
                      </BlocoWrapper>
                    );
                  })}
                </div>

                {/* Desktop: grid ou lista */}
                <div className="hidden sm:block">
                  <div
                    className={cn(
                      "gap-6",
                      layoutMode === "grid"
                        ? "grid sm:grid-cols-2 lg:grid-cols-3"
                        : "flex flex-col",
                    )}
                  >
                    {blocos.map((bloco) => {
                      const commonProps = {
                        bloco,
                        nucleoId: id,
                        onDelete: () => handleExcluirBloco(bloco.id),
                        onEdit: () => handleEditarBloco(bloco),
                        isDeleting,
                      };

                      return (
                        <BlocoWrapper key={bloco.id} bloco={bloco}>
                          {bloco.tipo === "colecoes" && (
                            <ColecoesBlocoCard {...commonProps} />
                          )}
                          {bloco.tipo === "lista" && (
                            <ListasBlocoCard {...commonProps} />
                          )}
                          {bloco.tipo === "tarefas" && (
                            <TarefasBlocoCard {...commonProps} />
                          )}
                          {bloco.tipo === "calendario" && (
                            <CalendarioBlocoCard {...commonProps} />
                          )}
                          {(bloco.tipo === "timer" ||
                            bloco.tipo === "timers") && (
                            <TimersBlocoCard {...commonProps} />
                          )}
                          {(bloco.tipo === "habitos" ||
                            bloco.tipo === "habito") && (
                            <HabitosBlocoCard {...commonProps} />
                          )}
                        </BlocoWrapper>
                      );
                    })}
                  </div>
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
