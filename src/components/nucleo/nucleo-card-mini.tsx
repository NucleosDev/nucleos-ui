// src/components/nucleo/ui/nucleo-card-mobile.tsx
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
  const corDestaque = nucleo.corDestaque || "#6366f1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <div
        className={cn(
          "group relative isolate overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300",
          "active:bg-muted/50 cursor-pointer",
          className,
        )}
        onClick={onClick}
      >
        {/* ============ HEADER COM COR DESTAQUE + WAVE ============ */}
        <div className="relative w-full overflow-hidden h-[80px]">
          {/* Fundo com cor de destaque */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${corDestaque}20, ${corDestaque}08, ${corDestaque}25)`,
            }}
          />

          {/* Bolhas decorativas sutis */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute -top-8 right-8 w-16 h-16 rounded-full blur-2xl"
              style={{ background: corDestaque }}
            />
            <div
              className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full blur-2xl"
              style={{ background: corDestaque + "60" }}
            />
          </div>

          {/* Badge do tipo - canto superior direito */}
          <div className="absolute top-2.5 right-2.5 z-30">
            <Badge
              variant="secondary"
              className="px-2 py-0.5 text-[10px] font-medium backdrop-blur-md border border-white/20 bg-foreground/40 text-white capitalize"
            >
              {tipo}
            </Badge>
          </div>

          {/* Hover overlay + botão */}
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-foreground/50 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] px-4 py-1.5 text-xs font-medium text-white shadow-lg"
            >
              <Eye className="h-3.5 w-3.5" />
              Explorar
            </motion.button>
          </div>

          {/* Wave inferior */}
          <div className="absolute bottom-0 left-0 w-full leading-none z-20 pointer-events-none">
            <svg
              viewBox="0 0 500 40"
              preserveAspectRatio="none"
              className="w-full h-[25px] -mb-[2px]"
            >
              <path
                d="M0,10 C150,-20 350,30 500,15 L500,40 L0,40 Z"
                className="fill-card"
              />
            </svg>
          </div>
        </div>

        {/* ============ ÍCONE FLUTUANTE (canto esquerdo) ============ */}
        <div className="absolute z-30 -mt-7 ml-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg">
            <div
              className="absolute inset-0 rounded-xl blur-lg opacity-30"
              style={{ background: corDestaque }}
            />
            <div
              className="relative flex h-full w-full items-center justify-center rounded-lg shadow-md border-2 border-background"
              style={{
                background: `linear-gradient(235deg, ${corDestaque}, ${corDestaque}dd)`,
              }}
            >
              {nucleo.icon?.iconUrl ? (
                <Image
                  src={nucleo.icon.iconUrl}
                  alt={nucleo.nome}
                  width={14}
                  height={14}
                  className="object-contain brightness-0 invert"
                />
              ) : (
                <IconComponent className="h-4 w-4 text-white" />
              )}
            </div>
          </div>
        </div>

        {/* ============ TÍTULO + MENU ============ */}
        <div className="relative px-3 pt-3 pb-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold leading-tight text-foreground line-clamp-1 group-hover:text-[#4D7CFF] transition-colors">
              {nucleo.nome}
            </h3>

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
                    className="h-7 w-7 rounded-full hover:bg-secondary/50 flex-shrink-0"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel className="text-xs">
                    Ações
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {onEdit && (
                    <DropdownMenuItem
                      className="text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                      }}
                    >
                      <Pencil className="mr-2 h-3.5 w-3.5" /> Editar
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
                      <Archive className="mr-2 h-3.5 w-3.5" /> Arquivar
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-xs text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete();
                        }}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Deletar
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
