// /components/nucleo/ui/nucleo-core-card.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Flame,
  TrendingUp,
  BookOpen,
  Heart,
  Briefcase,
  Home,
  Target,
  Coffee,
  Dumbbell,
  Code,
  Users,
  Music,
  Camera,
  Palette,
  Globe,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { NucleoWithStats } from "../types/nucleo-components.types";
import { Layers } from "lucide-react";
interface NucleoCoreCardProps {
  nucleo: NucleoWithStats;
  index?: number;
  onClick?: () => void;
  className?: string;
}

const tipoIcons: Record<string, React.ElementType> = {
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
};

export function NucleoCoreCard({
  nucleo,
  index = 0,
  onClick,
  className,
}: NucleoCoreCardProps) {
  const {
    nome,
    tipo,
    descricao,
    corDestaque = "#4D7CFF",
    icon,
    xpTotal = 0,
    level = 1,
    nextLevelXp = 1000,
    conquistasDesbloqueadas = 0,
    xpHoje = 0,
  } = nucleo;

  const IconComponent = tipoIcons[tipo] || Layers;
  const progress = (xpTotal / nextLevelXp) * 100;
  const xpRestante = nextLevelXp - xpTotal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card p-5 transition-all",
        "hover:shadow-lg hover:shadow-[#4D7CFF]/10 hover:border-[#4D7CFF]/30",
        "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Header com ícone e título */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Ícone com fundo colorido */}
          <div
            className="flex size-12 items-center justify-center rounded-xl overflow-hidden"
            style={{ backgroundColor: `${corDestaque}15` }}
          >
            {icon?.iconUrl ? (
              <Image
                src={icon.iconUrl}
                alt={nome}
                width={24}
                height={24}
                className="object-contain"
              />
            ) : (
              <IconComponent
                className="size-6"
                style={{ color: corDestaque }}
              />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg leading-none tracking-tight">
              {nome}
            </h3>
            {descricao && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {descricao}
              </p>
            )}
          </div>
        </div>

        {/* Badge de nível */}
        <Badge
          variant="outline"
          className="h-7 px-2.5"
          style={{
            backgroundColor: `${corDestaque}10`,
            borderColor: `${corDestaque}30`,
            color: corDestaque,
          }}
        >
          <TrendingUp className="size-3 mr-1" />
          Nv. {level}
        </Badge>
      </div>

      {/* Barra de progresso principal */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium" style={{ color: corDestaque }}>
            {Math.round(progress)}%
          </span>
        </div>
        <Progress
          value={progress}
          className="h-2 bg-secondary"
          style={
            {
              "--progress-background": corDestaque,
            } as React.CSSProperties
          }
        />
      </div>

      {/* Stats em grid */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* XP Total */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
          <Trophy className="size-4 text-[#FFD700]" />
          <div>
            <p className="text-xs text-muted-foreground">XP Total</p>
            <p className="text-sm font-semibold">{xpTotal.toLocaleString()}</p>
          </div>
        </div>

        {/* XP Restante */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
          <Flame className="size-4 text-[#FF8C42]" />
          <div>
            <p className="text-xs text-muted-foreground">Faltam</p>
            <p className="text-sm font-semibold">
              {xpRestante.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Footer com badges */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        {/* Conquistas */}
        {conquistasDesbloqueadas > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Trophy className="size-3.5 text-[#FFD700]" />
            <span>{conquistasDesbloqueadas} conquistas</span>
          </div>
        )}

        {/* XP hoje */}
        {xpHoje > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Flame className="size-3.5 text-[#FF8C42]" />
            <span>+{xpHoje} hoje</span>
          </div>
        )}

        {/* Tipo do núcleo */}
        <Badge
          variant="outline"
          className="text-[10px] px-2 py-0 h-5"
          style={{
            backgroundColor: `${corDestaque}10`,
            borderColor: `${corDestaque}20`,
            color: corDestaque,
          }}
        >
          {tipo}
        </Badge>
      </div>
    </motion.div>
  );
}
