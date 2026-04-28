// src/components/nucleo/ui/nucleo-core-card.tsx
"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Trophy,
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
  Calendar,
  Pencil,
  Trash2,
  Archive,
  Eye,
  Award,
  Sparkles,
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

// Mapeamento de ícones por tipo
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
  const corDestaque = nucleo.corDestaque || "#6366f1";

  const xpTotal = nucleo.xpTotal ?? 0;
  const level = nucleo.level ?? 1;
  const nextLevelXp = nucleo.nextLevelXp ?? 100;
  const currentXp = nucleo.currentXp ?? 0;
  const conquistas = nucleo.conquistas ?? 0;
  const xpHoje = nucleo.xpHoje ?? 0;

  const progressoXp =
    nextLevelXp > 0 ? Math.min((currentXp / nextLevelXp) * 100, 100) : 0;

  // Imagem de capa aleatória baseada no ID
  const capaUrl =
    (nucleo as any).imagemCapa ||
    `https://picsum.photos/seed/${nucleo.id}/400/200`;

  // Data relativa
  const getRelativeDate = () => {
    const date = nucleo.createdAt ? new Date(nucleo.createdAt) : new Date();
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const getLevelGradient = () => {
    if (level >= 100) return "from-purple-500 to-pink-500";
    if (level >= 80) return "from-indigo-500 to-purple-500";
    if (level >= 60) return "from-blue-500 to-indigo-500";
    if (level >= 40) return "from-cyan-500 to-blue-500";
    if (level >= 20) return "from-emerald-500 to-teal-500";
    return "from-[#4D7CFF] to-[#00C9A7]";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="w-full"
    >
      <div
        className={cn(
          "group relative isolate overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 transition-all duration-300",
          "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
          className,
        )}
        onClick={onClick}
      >
        {/* ============ IMAGE SECTION ============ */}
        <div className="relative w-full overflow-hidden h-[140px] sm:h-[160px]">
          <Image
            src={capaUrl}
            alt={nucleo.nome}
            fill
            className="z-0 object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-card via-card/60 to-transparent opacity-90" />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-foreground/20 via-transparent to-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badge do tipo - canto superior direito */}
          <div className="absolute top-3 right-3 z-30">
            <Badge
              variant="secondary"
              className={cn(
                "px-2 py-1 text-xs font-medium backdrop-blur-md border border-white/20 capitalize",
                "bg-foreground/40 text-white hover:bg-foreground/60",
              )}
            >
              {nucleo.icon?.iconUrl ? (
                <Image
                  src={nucleo.icon.iconUrl}
                  alt=""
                  width={12}
                  height={12}
                  className="mr-1 inline-block brightness-0 invert"
                />
              ) : (
                <IconComponent className="h-3 w-3 mr-1 inline-block" />
              )}
              {tipo}
            </Badge>
          </div>

          {/* Hover Overlay com botão */}
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-foreground/60 dark:bg-white/20 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] px-6 py-2.5 text-sm font-medium text-background shadow-lg shadow-[#4D7CFF]/30"
            >
              <Eye className="h-4 w-4" />
              Explorar Nucleo
            </motion.button>
          </div>

          {/* Wave na parte inferior */}
          <div className="absolute bottom-0 left-0 w-full leading-none z-20 pointer-events-none">
            <svg
              viewBox="0 0 500 80"
              preserveAspectRatio="none"
              className="w-full h-[60px] -mb-[2px]"
            >
              <path
                d="M0,20 C150,-40 340,80 500,40 L500,80 L0,80 Z"
                className="fill-card"
              />
            </svg>
          </div>
        </div>

        {/* ============ ÍCONE FLUTUANTE (canto esquerdo, sobrepondo a wave) ============ */}
        <div className="absolute z-30 -mt-10 ml-5">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-xl">
            <div
              className="absolute inset-0 rounded-2xl blur-2xl opacity-40"
              style={{ background: corDestaque }}
            />
            <div
              className="relative flex h-full w-full items-center justify-center rounded-xl shadow-lg border-2 border-background"
              style={{
                background: `linear-gradient(235deg, ${corDestaque}, ${corDestaque}dd)`,
              }}
            >
              {nucleo.icon?.iconUrl ? (
                <Image
                  src={nucleo.icon.iconUrl}
                  alt={nucleo.nome}
                  width={18}
                  height={18}
                  className="object-contain brightness-0 invert"
                />
              ) : (
                <IconComponent className="h-6 w-6 text-background" />
              )}
            </div>
          </div>
        </div>

        {/* ============ CONTEÚDO ============ */}
        <div className="relative p-5 pt-4">
          {/* Cabeçalho com nome e menu */}
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold leading-tight tracking-tight text-foreground line-clamp-1 group-hover:text-[#4D7CFF] transition-colors">
                {nucleo.nome}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className={cn(
                    "font-bold text-xs bg-clip-text text-transparent",
                    getLevelGradient(),
                  )}
                >
                  <Trophy className="size-3 mr-1 text-amber-500" /> Nv. {level}
                </Badge>
                {conquistas > 0 && (
                  <span className="text-[11px] text-muted-foreground">
                    {conquistas} conquista{conquistas !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            {/* Menu de ações */}
            {(onEdit || onDelete || onArchive) && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-secondary/50 hover:bg-secondary flex-shrink-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel>Ações do Nucleo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {onEdit && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                  )}
                  {onArchive && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive();
                      }}
                    >
                      <Archive className="mr-2 h-4 w-4" /> Arquivar
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
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Deletar
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Descrição */}
          {nucleo.descricao && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
              {nucleo.descricao}
            </p>
          )}

          {/* Barra de progresso XP */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Progresso do Nível</span>
              <span className="font-medium tabular-nums">
                {currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP
              </span>
            </div>
            <Progress value={progressoXp} className="h-1.5" />
          </div>

          {/* Stats em grid */}
          <div className="grid grid-cols-3 gap-1.5">
            <div className="text-center p-2 rounded-lg bg-muted/40">
              <p className="text-sm font-bold text-primary tabular-nums">
                {xpTotal.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">XP Total</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/40">
              <p className="text-sm font-bold text-amber-500 tabular-nums">
                {conquistas}
              </p>
              <p className="text-[10px] text-muted-foreground">Conquistas</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/40">
              <p className="text-sm font-bold text-emerald-500 tabular-nums">
                +{xpHoje}
              </p>
              <p className="text-[10px] text-muted-foreground">XP Hoje</p>
            </div>
          </div>

          {/* Rodapé */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">
                Criado {getRelativeDate()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-3 w-3 text-primary" />
              <span className="text-[11px] font-medium text-primary">
                Ativo
              </span>
            </div>
          </div>
        </div>

        {/* Efeito hover radial */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${corDestaque}, transparent 70%)`,
          }}
        />
      </div>
    </motion.div>
  );
}
