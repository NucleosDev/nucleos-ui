// src/components/nucleo/nucleo-card-mini.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MoreHorizontal,
  Layers,
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
  Star,
  Pencil,
  Trash2,
  Archive,
} from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { NucleoComStats } from "@/types/nucleo";

interface NucleoCardMobileProps {
  nucleo: NucleoComStats;
  index?: number;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onArchive?: () => void;
  className?: string;
}

const tipoIcons: Record<string, React.ElementType> = {
  estudo: BookOpen,
  hobby: Star,
  saude: Heart,
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

export function NucleoCardMobile({
  nucleo,
  index = 0,
  onClick,
  onEdit,
  onDelete,
  onArchive,
  className,
}: NucleoCardMobileProps) {
  const tipo = nucleo.tipo?.toLowerCase() || "pessoal";
  const IconComponent = tipoIcons[tipo] || Layers;
  const accent = nucleo.corDestaque || "#6366f1";

  const hasMenu = !!(onEdit || onDelete || onArchive);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.28,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileTap={{ scale: 0.97 }}
      className="w-full"
    >
      <div
        className={cn(
          "group relative overflow-hidden rounded-[var(--radius-xl)] border border-border/60",
          "cursor-pointer select-none bg-card active:bg-accent/30",
          "transition-[box-shadow,border-color] duration-[var(--duration-fast)]",
          "active:shadow-none shadow-[var(--shadow-xs)]",
          className,
        )}
        onClick={onClick}
      >
        {/* Accent aura */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: `radial-gradient(ellipse 120% 80% at 10% 0%, ${accent}1A 0%, transparent 65%)`,
          }}
          aria-hidden
        />

        {/* Top color strip */}
        <div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${accent}99, ${accent}22)`,
          }}
        />

        {/* Content */}
        <div className="relative flex items-center gap-3 p-3">
          {/* Icon */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] shadow-[var(--shadow-xs)]"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
            }}
          >
            {nucleo.icon?.iconUrl ? (
              <Image
                src={nucleo.icon.iconUrl}
                alt=""
                width={14}
                height={14}
                className="object-contain brightness-0 invert"
              />
            ) : (
              <IconComponent className="h-4 w-4 text-" />
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-500 truncate leading-snug">
              {nucleo.nome}
            </p>
            <p className="text-[10px] text-muted-foreground capitalize">
              {tipo}
            </p>
          </div>

          {/* Actions */}
          {hasMenu && (
            <div onClick={(e) => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent transition-colors">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 text-sm">
                  {onEdit && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                      }}
                      className="gap-2"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </DropdownMenuItem>
                  )}
                  {onArchive && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive();
                      }}
                      className="gap-2"
                    >
                      <Archive className="h-3.5 w-3.5" /> Arquivar
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete();
                        }}
                        className="gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Excluir
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
