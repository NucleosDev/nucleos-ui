"use client";

import { useParams, useRouter } from "next/navigation";
import { useBloco } from "@/hooks/useBlocos";
import { useNucleo } from "@/hooks/useNucleo";
import Image from "next/image";
import { Loader2, ArrowLeft, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlocoCard } from "@/components/blocos/BlocoCard";
import { ListasBlocoCard } from "@/components/blocos/cruds/ListasBlocoCard";
import { TarefasBlocoCard } from "@/components/blocos/cruds/TarefasBlocoCard";
import { ColecoesBlocoCard } from "@/components/blocos/cruds/ColecoesBlocoCard";
import { CalendarioBlocoCard } from "@/components/blocos/cruds/CalendarioBlocoCard";
import { TimersBlocoCard } from "@/components/blocos/cruds/TimersBlocoCard";
import { HabitosBlocoCard } from "@/components/blocos/cruds/HabitosBlocoCard";
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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

export default function BlocoDetalhesPage() {
  const params = useParams();
  const router = useRouter();

  const nucleoId = params.id as string;
  const blocoId = params.blocoId as string;

  const {
    data: bloco,
    isLoading: blocoLoading,
    error: blocoError,
  } = useBloco(blocoId, nucleoId);
  const { data: nucleo, isLoading: nucleoLoading } = useNucleo(nucleoId);

  const isLoading = blocoLoading || nucleoLoading;

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

  const renderConteudo = () => {
    const commonProps = {
      bloco,
      nucleoId,
      onDelete: () => {
        console.log("Excluir bloco", bloco.id);
      },
      onEdit: () => {
        console.log("Editar bloco", bloco.id);
      },
    };

    switch (bloco.tipo) {
      case "lista":
        return <ListasBlocoCard {...commonProps} />;
      case "tarefas":
        return <TarefasBlocoCard {...commonProps} />;
      case "colecoes":
        return <ColecoesBlocoCard {...commonProps} />;
      case "calendario":
        return <CalendarioBlocoCard {...commonProps} />;
      case "timer":
      case "timers":
        return <TimersBlocoCard {...commonProps} />;
      case "habitos":
      case "habito":
        return <HabitosBlocoCard {...commonProps} />;
      default:
        return (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              Conteúdo para <strong>{bloco.tipo}</strong> em desenvolvimento.
            </p>
          </div>
        );
    }
  };

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
  const IconComponent = getNucleoIcon(nucleo.tipo, nucleo.iconId);
  const corDestaque = nucleo.corDestaque || "#6366f1";

  return (
    <div className="min-h-screen bg-background">
      {/* Banner de capa */}
      <div className="relative w-full h-[20vh] min-h-[100px] max-h-[150px]">
        <Image
          src={capaUrl}
          alt={`Capa de ${nucleo.nome}`}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Botão de voltar com ícone e nome do núcleo */}
        <Button
          variant="ghost"
          className="absolute top-6 left-6 bg-background/20 backdrop-blur bg-background/40 text-background group"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <div className="flex items-center gap-2">
            <span>Voltar para seu nucleo</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/20 rounded-md">
              <IconComponent
                className="h-3.5 w-3.5"
                style={{ color: corDestaque }}
              />
              <span className="font-medium">{nucleo.nome}</span>
            </div>
          </div>
        </Button>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-12">
        {/* Cabeçalho com informações do bloco */}
        <div className="mb-6 mt-6">
          <BlocoCard
            bloco={bloco}
            nucleoId={nucleoId}
            compact={false}
            onEdit={() => console.log("Editar bloco", bloco.id)}
            onDelete={() => console.log("Excluir bloco", bloco.id)}
          />
        </div>

        {/* Conteúdo específico do bloco */}
        <div className="mt-6">{renderConteudo()}</div>
      </div>
    </div>
  );
}
