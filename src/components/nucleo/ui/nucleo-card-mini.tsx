// /components/nucleo/ui/nucleo-card-compact.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MoreHorizontal,
  Layers,
  Trophy,
  Flame,
  Image as ImageIcon,
  BookOpen,
  Heart,
  Briefcase,
  Wallet,
  Dumbbell,
  Coffee,
  Users,
  Home,
  Target,
  Code,
  Music,
  Camera,
  Palette,
  Globe,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatXp } from "../utils/nucleo-helpers";
import type { NucleoCardProps } from "../types/nucleo-components.types";

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

export function NucleoCardCompact({
  nucleo,
  onClick,
  onEdit,
  onDelete,
  onArchive,
  className,
}: NucleoCardProps) {
  const {
    nome,
    tipo,
    cor_destaque = "#4D7CFF",
    icon,
    xpTotal = 0,
    level = 1,
    nextLevelXp = 1000,
    conquistasDesbloqueadas = 0,
  } = nucleo;

  const IconComponent = tipoIcons[tipo] || Layers;
  const progress = (xpTotal / nextLevelXp) * 100;

  return (
    <motion.div
      whileHover={{ x: 4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg border bg-card p-2 transition-all",
        "hover:shadow-md hover:shadow-[#4D7CFF]/5 hover:border-[#4D7CFF]/30",
        "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {/* Ícone */}
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-lg overflow-hidden"
        style={{ backgroundColor: `${cor_destaque}20` }}
      >
        {icon?.icon_url ? (
          <Image
            src={icon.icon_url}
            alt={nome}
            width={20}
            height={20}
            className="object-contain"
          />
        ) : (
          <IconComponent className="size-5" style={{ color: cor_destaque }} />
        )}
      </div>

      {/* Informações principais */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm truncate">{nome}</h4>
          <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
            {tipo}
          </Badge>
        </div>

        {/* Barra de progresso compacta */}
        <div className="mt-1 flex items-center gap-2">
          <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            Nv.{level}
          </span>
        </div>

        {/* Stats mini */}
        <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
          {xpTotal > 0 && (
            <span>{formatXp(xpTotal)} XP</span>
          )}
          {conquistasDesbloqueadas > 0 && (
            <span className="flex items-center gap-0.5">
              <Trophy className="size-3 text-[#FFD700]" />
              {conquistasDesbloqueadas}
            </span>
          )}
          {nucleo.xpHoje !== undefined && nucleo.xpHoje > 0 && (
            <span className="flex items-center gap-0.5">
              <Flame className="size-3 text-[#FF8C42]" />
              +{formatXp(nucleo.xpHoje)}
            </span>
          )}
        </div>
      </div>

      {/* Menu de ações mini */}
      {(onEdit || onDelete || onArchive) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="size-6 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-xs">
            <DropdownMenuLabel className="text-xs">Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {onEdit && (
              <DropdownMenuItem
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                Editar
              </DropdownMenuItem>
            )}
            {onArchive && (
              <DropdownMenuItem
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive();
                }}
              >
                Arquivar
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                className="text-xs text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                Deletar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </motion.div>
  );
}