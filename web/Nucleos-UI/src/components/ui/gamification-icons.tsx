// src/components/ui/gamification-icons.tsx
import * as LucideIcons from "lucide-react";

// Mapeamento de nomes de ícones para componentes do Lucide React
const iconMap: Record<string, React.ElementType> = {
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
};

interface GamificationIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function GamificationIcon({
  name,
  className,
  size = 16,
}: GamificationIconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    return <LucideIcons.Sparkles className={className} size={size} />;
  }
  return <IconComponent className={className} size={size} />;
}

// Função para usar em componentes que precisam do ícone diretamente
export function getIconComponent(name: string): React.ElementType {
  return iconMap[name] || LucideIcons.Sparkles;
}
