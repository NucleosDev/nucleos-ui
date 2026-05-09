"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MoreHorizontal,
  Calendar,
  Layers,
  Link as LinkIcon,
  Trophy,
  Flame,
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
  Sparkles,
  Zap,
  Award,
  Pencil,
  Trash2,
  Archive,
  Eye,
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
import { EditNucleoModal } from "./edit-nucleo-modal";
import { getTypeStyles, formatXp } from "./utils/nucleo-helpers";
import type { NucleoCardProps } from "./nucleo-components.types";

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

export function NucleoCard({
  nucleo,
  variant = "default",
  onClick,
  onEdit: externalOnEdit,
  onDelete,
  onArchive,
  className,
}: NucleoCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    id,
    nome,
    descricao,
    tipo,
    corDestaque = "#4D7CFF",
    imagemCapa,
    icon,
    blocos = [],
    relations = [],
    createdAt,
    level = 1,
    conquistasDesbloqueadas = 0,
  } = nucleo;

  const typeStyles = getTypeStyles(tipo);
  const IconComponent = tipoIcons[tipo] || Layers;

  const capaUrl = imagemCapa || (nucleo as any).imagem_capa || null;

  const getLevelColor = () => {
    if (level >= 100) return "from-purple-500 to-pink-500";
    if (level >= 80) return "from-indigo-500 to-purple-500";
    if (level >= 60) return "from-blue-500 to-indigo-500";
    if (level >= 40) return "from-cyan-500 to-blue-500";
    if (level >= 20) return "from-emerald-500 to-teal-500";
    return "from-[#4D7CFF] to-[#00C9A7]";
  };

  // Formatar data relativa
  const getRelativeDate = () => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  // Abre o modal local de edição
  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  // Callback após salvar a edição
  const handleUpdateComplete = () => {
    // Fecha o modal
    setIsEditModalOpen(false);
    // Se houver um callback externo, chama ele
    if (externalOnEdit) {
      externalOnEdit();
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (
      confirm(
        "Tem certeza que deseja excluir este Nucleo? Esta ação não pode ser desfeita.",
      )
    ) {
      setIsDeleting(true);
      try {
        await onDelete();
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive();
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <div
          className={cn(
            "group relative isolate overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:shadow-[var(--shadow-lg)]",
            className,
          )}
          onClick={onClick}
        >
          {/* Image / Gradient Section */}
          <div className="relative w-full overflow-hidden h-[200px]">
            {capaUrl ? (
              <Image
                src={capaUrl}
                alt={nome}
                fill
                className="z-0 object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
              />
            ) : (
              /* Gradient aura when no real image */
              <div
                className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${corDestaque}30 0%, ${corDestaque}18 40%, oklch(0.115 0.018 245 / 0.4) 100%)`,
                }}
              >
                {/* Radial glow */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse 70% 70% at 30% 40%, ${corDestaque}25 0%, transparent 70%)`,
                  }}
                />
                {/* Faint grid texture */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: `repeating-linear-gradient(0deg, oklch(1 0 0) 0px, oklch(1 0 0) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, oklch(1 0 0) 0px, oklch(1 0 0) 1px, transparent 1px, transparent 28px)`,
                  }}
                />
              </div>
            )}

            {/* Multi-layer gradient overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-card/95 via-card/50 to-transparent" />
            <div
              className="absolute inset-0 z-10 opacity-30"
              style={{
                background: `radial-gradient(ellipse 60% 80% at 80% 20%, ${corDestaque}44 0%, transparent 70%)`,
              }}
            />

            {/* Liquid glass type badge */}
            <div className="absolute top-3 right-3 z-30">
              <div
                className="px-2.5 py-1 rounded-full text-xs font-medium text-white capitalize"
                style={{
                  background: `${corDestaque}55`,
                  backdropFilter: "blur(10px) saturate(140%)",
                  WebkitBackdropFilter: "blur(10px) saturate(140%)",
                  border: `1px solid ${corDestaque}66`,
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.18), 0 2px 6px rgba(0,0,0,0.12)",
                }}
              >
                {tipo}
              </div>
            </div>

            {/* Liquid glass hover overlay */}
            <div
              className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: "rgba(0,0,0,0.28)",
                backdropFilter: "blur(4px) saturate(120%)",
                WebkitBackdropFilter: "blur(4px) saturate(120%)",
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  backdropFilter: "blur(14px) saturate(160%)",
                  WebkitBackdropFilter: "blur(14px) saturate(160%)",
                  border: "1px solid rgba(255,255,255,0.30)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.30), 0 4px 16px rgba(0,0,0,0.18)",
                }}
              >
                <Eye className="h-4 w-4" />
                Explorar Nucleo
              </motion.button>
            </div>

            {/* Wave transition */}
            <div className="absolute bottom-0 left-0 w-full leading-none z-20 pointer-events-none">
              <svg
                viewBox="0 0 500 80"
                preserveAspectRatio="none"
                className="w-full h-[60px] -mb-px"
                fill="var(--card)"
              >
                <path d="M0,20 C150,-40 340,80 500,40 L500,80 L0,80 Z" />
              </svg>
            </div>
          </div>

          {/* Floating liquid glass icon - Posição consistente */}
          <div className="absolute z-30 left-12" style={{ top: "122px" }}>
            <div className="relative inline-flex">
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-2xl blur-xl opacity-55"
                style={{ background: corDestaque }}
              />
              {/* Glass icon container */}
              <div
                className="relative flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  background: `linear-gradient(145deg, ${corDestaque}ee, ${corDestaque}bb)`,
                  border: "1.5px solid rgba(255,255,255,0.28)",
                  boxShadow:
                    "inset 0 1.5px 0 rgba(255,255,255,0.40), 0 8px 20px rgba(0,0,0,0.22)",
                }}
              >
                {icon?.iconUrl ? (
                  <Image
                    src={icon.iconUrl}
                    alt={nome}
                    width={18}
                    height={18}
                    className="object-contain brightness-0 invert"
                  />
                ) : (
                  <IconComponent className="h-7 w-7 text-white" />
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="relative p-5 transition-all duration-300">
            {/* Cabeçalho com nome e menu */}
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-lg font-bold leading-tight tracking-tight text-foreground line-clamp-1 group-hover:text-[#4D7CFF] transition-colors">
                  {nome}
                </h3>
                {variant === "detailed" && descricao && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {descricao}
                  </p>
                )}
              </div>

              {/* Menu de ações - SEMPRE usa o modal local */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-secondary/50 hover:bg-secondary"
                    disabled={isDeleting}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Ações do Nucleo</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar Nucleo
                  </DropdownMenuItem>
                  {onArchive && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchive();
                      }}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Arquivar Nucleo
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete();
                        }}
                        className="text-destructive"
                        disabled={isDeleting}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isDeleting ? "Deletando..." : "Deletar Nucleo"}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Stats Section */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {/* Conquistas */}
              {conquistasDesbloqueadas > 0 && (
                <div className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5">
                  <Trophy className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                    {conquistasDesbloqueadas} conquistas
                  </span>
                </div>
              )}

              {/* Relações */}
              {relations.length > 0 && (
                <div className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5">
                  <LinkIcon className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {relations.length} conexões
                  </span>
                </div>
              )}

              {/* Blocos */}
              {blocos.length > 0 && (
                <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5">
                  <Layers className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {blocos.length} blocos
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Criado {getRelativeDate()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">Ativo</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal de Edição Local */}
      <EditNucleoModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        nucleo={nucleo}
        onSuccess={handleUpdateComplete}
      />
    </>
  );
}
