// src/app/(user-auth)/dashboard/nucleos/[id]/layout.tsx
"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useNucleo } from "@/hooks/useNucleo";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  ArrowLeft,
  ChevronRight,
  Layers,
  Target,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ICONS
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

export default function NucleoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const id = params.id as string;

  // Se estiver em uma rota de bloco, renderiza apenas o children sem o layout
  if (pathname.includes("/blocos/")) {
    return <>{children}</>;
  }

  // Buscar dados do núcleo
  const { data: nucleo, isLoading, error } = useNucleo(id);

  // Estado de carregamento
  if (isLoading) {
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

  // Estado de erro ou núcleo não encontrado
  if (error || !nucleo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Núcleo não encontrado</h2>
          <p className="text-muted-foreground mb-4">
            O núcleo que você procura não existe ou foi removido.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Preparar dados para renderização
  const capaUrl =
    nucleo.imagemCapa || `https://picsum.photos/seed/${nucleo.id}/1200/400`;
  const corDestaque = nucleo.corDestaque;
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
          className="absolute top-4 left-4 bg-background/20 backdrop-blur-sm text-white z-20 hover:bg-background/40"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Header com ícone e título */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pb-15">
        <div className="relative z-30 -mt-16 ml-8">
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-white shadow-xl border-4 border-background"
            style={{ backgroundColor: corDestaque }}
          >
            <IconComponent className="w-8 h-8 md:w-10 md:h-10" />
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2 mt-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="hover:text-foreground transition-colors"
          >
            Dashboard
          </button>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{nucleo.nome}</span>
        </nav>

        {/* Nome e descrição */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">{nucleo.nome}</h1>
          {nucleo.descricao && (
            <p className="text-muted-foreground mt-2">{nucleo.descricao}</p>
          )}
        </div>

        {/* Conteúdo da página */}
        {children}
      </div>
    </div>
  );
}
