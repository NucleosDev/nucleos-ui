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
import { Badge } from "@/components/ui/badge";
import { EditNucleoModal } from "./edit-nucleo-modal";
import { getTypeStyles, formatXp } from "../utils/nucleo-helpers";
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

  const randomImageUrl = `https://picsum.photos/seed/${id}/400/200`;
  const capaUrl = imagemCapa || (nucleo as any).imagem_capa || randomImageUrl;

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
            "group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/80 transition-all duration-300",
            "hover:border-[#4D7CFF]/40 hover:shadow-xl hover:shadow-[#4D7CFF]/10 hover:-translate-y-1",
            "cursor-pointer",
            className,
          )}
          onClick={onClick}
        >
          {/* Image Section - Occupies full width top */}
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={capaUrl}
              alt={nome}
              fill
              unoptimized
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Logo no pontoghttrfrhfgjuiiu6ur5remkjru.  AIIIIII MEUUUUU CUUUUU   AIIII. BOTAAAAAAAA  mais alto da curva esquerdo */}
            <div className="absolute top-30 left-8 z-50">
              <div
                className="flex h-17 opacity-95 w-17 items-center justify-center rounded-xl shadow-lg transition-all duration-300 group-hover:hidden z-100"
                style={{
                  background: `linear-gradient(135deg, ${corDestaque}, ${corDestaque}dd)`,
                  boxShadow: `0 0 20px ${corDestaque}40`,
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
                  <IconComponent className="h-8 w-8 text-white" />
                )}
              </div>
            </div>

            {/* Badge do tipo - canto superior direito */}
            <div className="absolute top-3 right-3 z-10">
              <Badge
                variant="secondary"
                className={cn(
                  "px-2 py-1 text-xs font-medium backdrop-blur-md border border-white/20",
                  typeStyles,
                  "bg-black/40 text-white hover:bg-black/60",
                )}
              >
                <IconComponent className="mr-1 h-3 w-3" />
                {tipo}
              </Badge>
            </div>

            {/* XP Hoje - canto inferior esquerdo
            {xpHoje !== undefined && xpHoje > 0 && (
              <div className="absolute bottom-3 left-3 z-10">
                <div className="flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-2 py-1">
                  <Flame className="h-3 w-3 text-orange-400" />
                  <span className="text-xs font-bold text-orange-400">
                    +{formatXp(xpHoje)}
                  </span>
                </div>
              </div>
            )} */}

            {/* Hover Overlay com botão */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] px-6 py-2.5 text-sm font-medium text-background shadow-lg shadow-[#4D7CFF]/30"
              >
                <Eye className="h-4 w-4" />
                Explorar Nucleo
              </motion.button>
            </div>

            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
              <svg
                viewBox="0 0 500 80"
                preserveAspectRatio="none"
                className="w-full h-[60px]"
              >
                <path
                  d="M0,10 C150,-40 340,80 500,40 L500,80 L0,80 Z"
                  className="fill-card"
                />
              </svg>
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
                  {/* Editar - SEMPRE abre o modal local */}
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

            {/* Barra de Progresso XP */}
            {/* <div className="mb-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium text-foreground">
                  {formatXp(xpTotal)} / {formatXp(nextLevelXp)} XP
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((xpTotal / nextLevelXp) * 100, 100)}%`,
                  }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r",
                    getLevelColor(),
                  )}
                />
              </div>
            </div> */}

            {/* Footer com data de criação */}
            <div className="flex items-center justify-between border-t border-border/50 pt-3">
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
        onSuccess={handleUpdateComplete} // ← mudado de onUpdate para onSuccess
      />
    </>
  );
}
