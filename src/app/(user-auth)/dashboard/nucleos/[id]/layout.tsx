// src/app/(user-auth)/dashboard/nucleos/[id]/layout.tsx
"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useNucleo } from "@/hooks/useNucleo";
import Image from "next/image";
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
}: Readonly<{ children: React.ReactNode }>) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const id = params.id as string;

  if (pathname.includes("/blocos/")) return <>{children}</>;

  const { data: nucleo, isLoading, error } = useNucleo(id);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-[240px] md:h-[300px] w-full" />
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
    );
  }

  if (error || !nucleo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Núcleo não encontrado</h2>
          <p className="text-sm text-muted-foreground mb-5">
            O núcleo que você procura não existe ou foi removido.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 rounded-[var(--radius-md)] bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  const capaUrl =
    nucleo.imagemCapa || `https://picsum.photos/seed/${nucleo.id}/1200/400`;
  const corDestaque = nucleo.corDestaque || "#6366f1";
  const IconComponent = getNucleoIcon(nucleo.tipo, nucleo.iconId);

  return (
    <div className="bg-background">
      {/* ── Liquid glass banner ── */}
      <div className="relative w-full h-[240px] md:h-[300px] overflow-hidden">
        <Image
          src={capaUrl}
          alt={nucleo.nome}
          fill
          className="object-cover scale-[1.04] transition-transform duration-700"
          priority
        />

        {/* Multi-layer gradient — creates depth without killing the photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse 60% 80% at 80% 20%, ${corDestaque}44 0%, transparent 70%)`,
          }}
        />

        {/* Wave transition */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10">
          <svg
            viewBox="0 0 500 100"
            preserveAspectRatio="none"
            className="w-full h-[60px] -mb-px"
            fill="var(--background)"
          >
            <path d="M0,40 C150,-20 350,120 500,60 L500,100 L0,100 Z" />
          </svg>
        </div>

        {/* Glass back button */}
        <button
          onClick={() => router.push("/dashboard/nucleos")}
          className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white transition-all duration-[var(--duration-fast)]"
          style={{
            background: "rgba(0,0,0,0.22)",
            backdropFilter: "blur(12px) saturate(160%)",
            WebkitBackdropFilter: "blur(12px) saturate(160%)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.15)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(0,0,0,0.32)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(0,0,0,0.22)")
          }
        >
          <ArrowLeft className="h-4 w-4" />
          Nucleos
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-8 md:px-4 pb-4">
        {/* Floating liquid glass icon */}
        <div
          className="relative z-30 -mt-8 mb-5 "
          style={{ top: "-45px", left: "18px" }}
        >
          <div className="relative inline-flex">
            {/* Glass icon container */}
            <div
              className="relative flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: `linear-gradient(145deg, ${corDestaque}ee, ${corDestaque}bb)`,
                border: "1.5px solid rgba(255,255,255,0.28)",
                boxShadow:
                  "inset 0 1.5px 0 rgba(255,255,255,0.40), 0 8px 24px rgba(0,0,0,0.22)",
              }}
            >
              {nucleo.icon?.iconUrl ? (
                <Image
                  src={nucleo.icon.iconUrl}
                  alt=""
                  width={20}
                  height={20}
                  className="object-contain brightness-0 invert"
                />
              ) : (
                <IconComponent className="w-8 h-8 text-white" />
              )}
            </div>
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
          <span className="text-foreground font-medium">{nucleo.nome}</span>
        </nav>

        {/* Title */}
        <div className="mb-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {nucleo.nome}
          </h1>
          {nucleo.descricao && (
            <p className="text-muted-foreground mt-1.5">{nucleo.descricao}</p>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
