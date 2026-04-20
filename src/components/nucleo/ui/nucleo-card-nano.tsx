// src/components/nucleo/ui/nucleo-card-nano.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Layers,
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
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface NucleoCardMiniProps {
  id: string;
  nome: string;
  tipo?: string;
  iconId?: string | null;
  iconUrl?: string | null;
  nivel?: number;
  corDestaque?: string;
}

// Mapeamento de ícones baseado nos tipos de núcleo (mesmo do NucleoCard)
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
  game: Gamepad2,
  viagem: Plane,
  compras: ShoppingBag,
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

function getNucleoIcon(tipo?: string, iconId?: string | null): LucideIcon {
  // Prioriza iconId se existir
  if (iconId && iconMap[iconId]) {
    return iconMap[iconId];
  }

  // Fallback para o tipo do núcleo
  const tipoLower = tipo?.toLowerCase() || "";
  const icon = tipoIcons[tipoLower];

  // Se encontrou ícone baseado no tipo, usa ele
  if (icon) {
    return icon;
  }

  // Fallback final
  return Layers;
}

export function NucleoCardMini({
  id,
  nome,
  tipo,
  iconId,
  iconUrl,
  nivel,
  corDestaque = "#4D7CFF",
}: NucleoCardMiniProps) {
  const IconComponent = getNucleoIcon(tipo, iconId);

  return (
    <Link
      href={`/dashboard/nucleos/${id}`}
      className={cn(
        "flex items-center gap-2 px-2 py-2 rounded-md",
        "hover:bg-accent/50 transition-all group",
      )}
    >
      {/* Ícone */}
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center overflow-hidden shrink-0"
        style={{ backgroundColor: `${corDestaque}20` }}
      >
        {iconUrl ? (
          <Image
            src={iconUrl}
            alt={nome}
            width={16}
            height={16}
            className="w-4 h-4 object-contain"
          />
        ) : (
          <IconComponent className="w-4 h-4" style={{ color: corDestaque }} />
        )}
      </div>

      {/* Nome */}
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium truncate">{nome}</span>
        {nivel && (
          <span className="text-[10px] text-muted-foreground">Nv. {nivel}</span>
        )}
      </div>
    </Link>
  );
}

