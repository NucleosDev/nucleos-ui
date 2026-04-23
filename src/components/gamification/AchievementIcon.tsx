// src/components/gamification/AchievementIcon.tsx
"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

interface AchievementIconProps {
  type: string;
  size?: number;
  className?: string;
}

// Mapeamento de tipos para ícones do Lucide React
const iconMap: Record<string, React.ElementType> = {
  nucleo: LucideIcons.Layers,
  tarefa: LucideIcons.CheckSquare,
  habito: LucideIcons.Zap,
  especial: LucideIcons.Trophy,
  // Fallbacks
  creation: LucideIcons.Rocket,
  progress: LucideIcons.TrendingUp,
  streak: LucideIcons.Flame,
  level: LucideIcons.Star,
  default: LucideIcons.Sparkles,
};

export function AchievementIcon({
  type,
  size = 24,
  className = "",
}: AchievementIconProps) {
  const IconComponent = iconMap[type] || iconMap.default;
  return <IconComponent size={size} className={className} />;
}

// Versão com nome do ícone (para quando o nome vem do service)
interface AchievementIconByNameProps {
  name: string;
  size?: number;
  className?: string;
}

const nameIconMap: Record<string, React.ElementType> = {
  Rocket: LucideIcons.Rocket,
  CheckCircle: LucideIcons.CheckCircle,
  Flame: LucideIcons.Flame,
  Star: LucideIcons.Star,
  Target: LucideIcons.Target,
  Zap: LucideIcons.Zap,
  Award: LucideIcons.Award,
  Crown: LucideIcons.Crown,
  Sparkles: LucideIcons.Sparkles,
  FlameKindling: LucideIcons.FlameKindling,
  Flames: LucideIcons.Flame,
  Sprout: LucideIcons.Sprout,
  Layers: LucideIcons.Layers,
  CheckSquare: LucideIcons.CheckSquare,
  TrendingUp: LucideIcons.TrendingUp,
  Trophy: LucideIcons.Trophy,
};

export function AchievementIconByName({
  name,
  size = 24,
  className = "",
}: AchievementIconByNameProps) {
  const IconComponent = nameIconMap[name] || LucideIcons.Sparkles;
  return <IconComponent size={size} className={className} />;
}
