// src/components/nucleo/ui/nucleo-core-card.tsx
"use client";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
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
  Users,
  Target,
  Wallet,
  Layers,
  Pencil,
  Trash2,
  Archive,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { NucleoComStats } from "@/types/nucleo";

interface NucleoCoreCardProps {
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
  hobby: Star,
};

// Derive a soft palette from any hex/hsl accent color for the card gradient
function buildCardGradient(accent: string) {
  return `radial-gradient(ellipse 80% 60% at 20% 10%, ${accent}22 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 80% 90%, ${accent}14 0%, transparent 70%)`;
}

export function NucleoCoreCard({
  nucleo,
  index = 0,
  onClick,
  onEdit,
  onDelete,
  onArchive,
  className,
}: NucleoCoreCardProps) {
  const tipo = nucleo.tipo?.toLowerCase() || "pessoal";
  const IconComponent = tipoIcons[tipo] || Layers;
  const accent = nucleo.corDestaque || "#6366f1";

  const level = nucleo.level ?? 1;
  const currentXp = nucleo.currentXp ?? 0;
  const nextLevelXp = nucleo.nextLevelXp ?? 100;
  const blocos = (nucleo as any).blocos?.length ?? 0;

  const progressPct =
    nextLevelXp > 0
      ? Math.min(Math.round((currentXp / nextLevelXp) * 100), 100)
      : 0;

  const hasMenu = !!(onEdit || onDelete || onArchive);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full"
    >
      <div
        className={cn(
          "group relative overflow-hidden rounded-[var(--radius-xl)] border border-border/60 bg-card",
          "cursor-pointer select-none",
          "transition-[box-shadow,transform,border-color] duration-[var(--duration-base)]",
          "hover:shadow-[var(--shadow-md)] hover:-translate-y-1 hover:border-border",
          className,
        )}
        style={{ background: `var(--surface-raised)` }}
        onClick={onClick}
      >
        {/* Gradient aura — derived from accent color, no images */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-[var(--duration-slow)] opacity-60 group-hover:opacity-100"
          style={{ background: buildCardGradient(accent) }}
          aria-hidden
        />

        {/* Top strip — colored accent bar */}
        <div
          className="h-0.5 w-full"
          style={{
            background: `linear-gradient(90deg, ${accent}88, ${accent}22)`,
          }}
        />

        {/* Body */}
        <div className="relative p-4">
          {/* Header row */}
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] border border-/20"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
              }}
            >
              {nucleo.icon?.iconUrl ? (
                <Image
                  src={nucleo.icon.iconUrl}
                  alt=""
                  width={16}
                  height={16}
                  className="object-contain brightness-0 invert"
                />
              ) : (
                <IconComponent className="h-5 w-5 text-" />
              )}
            </div>

            {/* Title + type */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold leading-snug text-foreground truncate pr-6">
                {nucleo.nome}
              </h3>
              <p className="text-[11px] text-muted-foreground capitalize mt-0.5">
                {tipo}
              </p>
            </div>

            {/* Actions menu */}
            {hasMenu && (
              <div
                className="absolute top-3 right-3"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-md",
                        "text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent",
                        "opacity-0 group-hover:opacity-100 transition-all duration-[var(--duration-fast)]",
                      )}
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 text-sm">
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

          {/* Description */}
          {nucleo.descricao && (
            <p className="mt-2.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {nucleo.descricao}
            </p>
          )}

          {/* XP progress bar */}
          <div className="mt-3.5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                Nível {level}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
                {progressPct}%
              </span>
            </div>
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-[var(--duration-slow)]"
                style={{
                  width: `${progressPct}%`,
                  background: `linear-gradient(90deg, ${accent}, ${accent}99)`,
                }}
              />
            </div>
          </div>

          {/* Footer stats */}
          {blocos > 0 && (
            <div className="mt-3 flex items-center gap-1">
              <Layers className="h-3 w-3 text-muted-foreground/60" />
              <span className="text-[10px] text-muted-foreground">
                {blocos} {blocos === 1 ? "bloco" : "blocos"}
              </span>
            </div>
          )}
        </div>

        {/* Subtle edge highlight on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[var(--radius-xl)] border opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-base)]"
          style={{ borderColor: `${accent}40` }}
          aria-hidden
        />
      </div>
    </motion.div>
  );
}
