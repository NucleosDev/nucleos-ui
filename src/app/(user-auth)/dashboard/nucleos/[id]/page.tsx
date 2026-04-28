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
  ChevronRight,
  Layers,
  Target,
  Wallet,
  Pencil,
  Trash2,
  Copy,
  CornerDownRight,
  GripVertical,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CriarBlocoModal } from "@/components/blocos/CriarBlocoModal";
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
import { BlocoHoverActions } from "@/components/blocos/BlocoHoverActions";
import { NucleoCanvas } from "@/components/nucleo/NucleoCanvas";
import { cn } from "@/lib/utils";

//  ICONS
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
  return tipoIcons[tipo?.toLowerCase() || ""] || Layers;
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

//  PÁGINA
export default function NucleoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [editingBloco, setEditingBloco] = useState<Bloco | null>(null);
  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">ID inválido.</p>
          <Button variant="link" onClick={() => router.push("/dashboard")}>
            Voltar
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
    isCreating,
    isDeleting,
  } = useBlocos(id);

  const [modalCriarAberto, setModalCriarAberto] = useState(false);

  const handleCriarBloco = async (payload: CreateBlocoPayload) => {
    try {
      const blocoCriado = await create(payload);
      const initializer = BLOCO_INITIALIZERS[payload.tipo];
      if (initializer) await initializer(blocoCriado.id, payload.titulo);
      toast({ title: "Bloco criado!" });
      setModalCriarAberto(false);
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  const handleExcluirBloco = async (blocoId: string) => {
    if (!confirm("Excluir este bloco?")) return;
    try {
      await remove(blocoId);
      toast({ title: "Bloco excluído!" });
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const handleDuplicateBloco = async (bloco: Bloco) => {
    try {
      await create({
        nucleoId: id,
        tipo: bloco.tipo,
        titulo: `${bloco.titulo || ""} (cópia)`,
        posicao: (bloco.posicao || 0) + 1,
        configuracoes: bloco.configuracoes || undefined,
      });
      toast({ title: "Bloco duplicado!" });
    } catch {
      toast({ title: "Erro ao duplicar", variant: "destructive" });
    }
  };

  if (nucleoLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !nucleo) notFound();

  const capaUrl =
    nucleo.imagemCapa || `https://picsum.photos/seed/${nucleo.id}/1200/400`;
  const corDestaque = nucleo.corDestaque || "#6366f1";
  const IconComponent = getNucleoIcon(nucleo.tipo, nucleo.iconId);

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
          size="icon"
          className="absolute top-4 left-4 bg-background/20 backdrop-blur-sm text-white z-20"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-15">
        {/* Ícone + Título */}
        <div className="relative z-30 -mt-21 ml-8 top--10">
          {" "}
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-white shadow-xl border-4 border-background"
            style={{ backgroundColor: corDestaque }}
          >
            <IconComponent className="w-8 h-8 md:w-10 md:h-10" />
          </div>
        </div>
        <nav className="flex items-left gap-1.5 text-sm text-muted-foreground mb-2 p-5">
          <button
            onClick={() => router.push("/dashboard")}
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{nucleo.nome}</span>
        </nav>
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">{nucleo.nome}</h1>
          {nucleo.descricao && (
            <p className="text-muted-foreground mt-2">{nucleo.descricao}</p>
          )}
        </div>

        {/*  CANVAS (Editor de texto Notion-like)  */}
        <NucleoCanvas
          nucleoId={id}
          onAddFunctionalBlock={() => setModalCriarAberto(true)}
        />

        {/*  BLOCOS FUNCIONAIS  */}
        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 border-t border-border/50" />
          <span className="text-xs text-muted-foreground font-medium">
            BLOCOS FUNCIONAIS
          </span>
          <div className="flex-1 border-t border-border/50" />
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          {blocosLoading ? (
            [...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl" />
            ))
          ) : blocos.length === 0 ? (
            <div
              onClick={() => setModalCriarAberto(true)}
              className="rounded-xl border-2 border-dashed border-border p-12 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/20 transition-all"
            >
              <div className="rounded-full bg-primary/10 p-3 w-fit mx-auto mb-3">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <p className="font-medium">Nenhum bloco funcional ainda</p>
              <p className="text-sm text-muted-foreground mt-1">
                Clique para adicionar tarefas, calendário, listas e muito mais
              </p>
            </div>
          ) : (
            blocos.map((bloco) => (
              <div key={bloco.id} className="group relative">
                {/*  AÇÕES DE HOVER (BlocoHoverActions)  */}
                <BlocoHoverActions
                  bloco={bloco}
                  nucleoId={id}
                  onOpenFullPage={() =>
                    router.push(`/dashboard/nucleos/${id}/blocos/${bloco.id}`)
                  }
                  onEdit={() => {
                    const novoTitulo = prompt(
                      "Novo título:",
                      bloco.titulo || "",
                    );
                    if (novoTitulo !== null) {
                      update({ id: bloco.id, payload: { titulo: novoTitulo } });
                    }
                  }}
                  onDuplicate={() => handleDuplicateBloco(bloco)}
                  onAddBelow={() => setModalCriarAberto(true)}
                  onDelete={() => handleExcluirBloco(bloco.id)}
                  isDeleting={isDeleting}
                />

                {/* Conteúdo do bloco */}
                <div className="rounded-xl border border-border/50 bg-card hover:border-border hover:shadow-sm transition-all p-4">
                  {renderBlocoContent(bloco, id)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/*  MODAL DE CRIAÇÃO  */}
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
