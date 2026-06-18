// src/lib/nucleo-icons.ts
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
  Layers,
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

export function getNucleoIcon(
  tipo: string,
  iconId?: string | null,
): LucideIcon {
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
