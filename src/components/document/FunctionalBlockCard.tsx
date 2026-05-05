// src/components/document/FunctionalBlockCard.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Trash2,
  Pencil,
  CheckSquare,
  CalendarDays,
  Activity,
  ListTodo,
  Timer,
  Layers,
  FileText,
  Copy,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColecoesBlocoCard } from "@/components/blocos/cruds/ColecoesBlocoCard";
import { TarefasBlocoCard } from "@/components/blocos/cruds/TarefasBlocoCard";
import { ListasBlocoCard } from "@/components/blocos/cruds/ListasBlocoCard";
import { CalendarioBlocoCard } from "@/components/blocos/cruds/CalendarioBlocoCard";
import { TimersBlocoCard } from "@/components/blocos/cruds/TimersBlocoCard";
import { HabitosBlocoCard } from "@/components/blocos/cruds/HabitosBlocoCard";
import { BlocoDeNotas } from "@/components/blocos/cruds/BlocoDeNotas";
import type { DocumentBlock } from "./document-types";
import type { Bloco } from "@/types/bloco";

interface FunctionalBlockCardProps {
  block: DocumentBlock;
  nucleoId: string;
  isDeleting?: boolean;
  onOpenFullPage: () => void;
  onDelete: () => void;
  onEditTitle: (titulo: string) => void;
  onDuplicate?: () => void;
  onAddBelow?: () => void;
}

const BLOCK_META: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    gradient: string;
  }
> = {
  tarefas: {
    label: "Tarefas",
    icon: CheckSquare,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    gradient: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
  },
  calendario: {
    label: "Calendário",
    icon: CalendarDays,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    gradient: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20",
  },
  habitos: {
    label: "Hábitos",
    icon: Activity,
    color: "text-green-500",
    bg: "bg-green-500/10",
    gradient: "from-green-500/10 to-green-500/5 border-green-500/20",
  },
  habito: {
    label: "Hábito",
    icon: Activity,
    color: "text-green-500",
    bg: "bg-green-500/10",
    gradient: "from-green-500/10 to-green-500/5 border-green-500/20",
  },
  lista: {
    label: "Lista",
    icon: ListTodo,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    gradient: "from-cyan-500/10 to-cyan-500/5 border-cyan-500/20",
  },
  timer: {
    label: "Timer",
    icon: Timer,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    gradient: "from-orange-500/10 to-orange-500/5 border-orange-500/20",
  },
  timers: {
    label: "Timers",
    icon: Timer,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    gradient: "from-orange-500/10 to-orange-500/5 border-orange-500/20",
  },
  colecoes: {
    label: "Coleções",
    icon: Layers,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    gradient: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
  },
  notas: {
    label: "Notas",
    icon: FileText,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    gradient: "from-purple-500/10 to-purple-500/5 border-purple-500/20",
  },
};

function renderContent(bloco: Bloco, nucleoId: string, onDelete: () => void) {
  const common = {
    bloco,
    nucleoId,
    onDelete,
    onEdit: () => {},
    isDeleting: false,
  };
  switch (bloco.tipo) {
    case "tarefas":
      return <TarefasBlocoCard {...common} />;
    case "calendario":
      return <CalendarioBlocoCard {...common} />;
    case "habitos":
    case "habito":
      return <HabitosBlocoCard {...common} />;
    case "lista":
      return <ListasBlocoCard {...common} />;
    case "timer":
    case "timers":
      return <TimersBlocoCard {...common} />;
    case "colecoes":
      return <ColecoesBlocoCard {...common} />;
    case "notas":
      return (
        <BlocoDeNotas bloco={bloco} nucleoId={nucleoId} onDelete={onDelete} />
      );
    default:
      return (
        <p className="text-sm text-muted-foreground p-4">Bloco: {bloco.tipo}</p>
      );
  }
}

export function FunctionalBlockCard({
  block,
  nucleoId,
  isDeleting = false,
  onOpenFullPage,
  onDelete,
  onEditTitle,
  onDuplicate,
  onAddBelow,
}: FunctionalBlockCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [titleValue, setTitleValue] = useState(block.titulo ?? "");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const meta = BLOCK_META[block.tipo] ?? {
    label: block.tipo,
    icon: Layers,
    color: "text-muted-foreground",
    bg: "bg-muted/40",
    gradient: "from-muted/20 to-muted/10 border-border",
  };
  const Icon = meta.icon;
  const bloco = block.blocoRef as Bloco;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSaveTitle = () => {
    setIsEditing(false);
    if (titleValue !== block.titulo) {
      onEditTitle(titleValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setTitleValue(block.titulo ?? "");
      setIsEditing(false);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", block.id);
    e.dataTransfer.effectAllowed = "move";
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group relative my-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Drag Handle - alinhado com BlocoCard */}
      <div
        className={cn(
          "absolute -left-8 top-1/2 -translate-y-1/2 transition-all duration-200",
          "md:-left-10",
          isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1",
          "z-10",
        )}
      >
        <div
          className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-accent/50 transition-colors"
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          title="Arraste para reordenar"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Card Principal */}
      <div
        className={cn(
          "relative rounded-xl border transition-all duration-200",
          meta.gradient,
          isDragging && "opacity-50 shadow-lg ring-2 ring-primary scale-[1.02]",
          isHovered && "shadow-md border-border",
        )}
      >
        {/* Header do card - estilo BlocoCard */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Ícone com gradiente */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 blur-sm" />
                <div className={cn("relative rounded-lg p-2", meta.bg)}>
                  <Icon className={cn("h-4 w-4", meta.color)} />
                </div>
              </div>

              {/* Título editável */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    onBlur={handleSaveTitle}
                    onKeyDown={handleKeyDown}
                    className="font-semibold text-sm md:text-base bg-transparent border-b border-primary outline-none w-full max-w-[300px] px-0 py-0.5"
                    placeholder={meta.label}
                  />
                ) : (
                  <h3
                    className="font-semibold text-sm md:text-base truncate cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setIsEditing(true)}
                    title="Clique para editar"
                  >
                    {block.titulo || meta.label}
                  </h3>
                )}
              </div>
            </div>

            {/* Menu de Ações - Dropdown alinhado com BlocoCard */}
            <div className="relative z-10 shrink-0" data-no-nav="true">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "p-1.5 rounded-lg transition-all duration-200",
                      "hover:bg-accent/50",
                      isHovered ? "opacity-100" : "opacity-0 md:opacity-0",
                    )}
                    disabled={isDeleting}
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={onOpenFullPage} className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Abrir em tela cheia</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsEditing(true)}
                    className="gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    <span>Editar título</span>
                  </DropdownMenuItem>
                  {onDuplicate && (
                    <DropdownMenuItem onClick={onDuplicate} className="gap-2">
                      <Copy className="h-4 w-4" />
                      <span>Duplicar</span>
                    </DropdownMenuItem>
                  )}
                  {onAddBelow && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onAddBelow} className="gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Adicionar abaixo</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="gap-2 text-destructive focus:text-destructive"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{isDeleting ? "Excluindo..." : "Excluir"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Botão de expandir/recolher e botão "+" rápido - como no BlocoCard */}
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              <span>{isCollapsed ? "Expandir" : "Recolher"}</span>
            </button>

            {/* Botão "+" flutuante no hover - alinhado com BlocoCard */}
            <AnimatePresence>
              {isHovered && onAddBelow && !isCollapsed && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={onAddBelow}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  title="Adicionar bloco abaixo"
                >
                  <Plus className="h-3.5 w-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Conteúdo colapsável */}
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-border/50 bg-muted/5 px-4 pb-4">
                {bloco ? (
                  renderContent(bloco, nucleoId, onDelete)
                ) : (
                  <div className="py-8 text-center">
                    <Icon
                      className={cn(
                        "h-8 w-8 mx-auto mb-2 opacity-40",
                        meta.color,
                      )}
                    />
                    <p className="text-sm text-muted-foreground">
                      {meta.label}
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={onOpenFullPage}
                      className="mt-2"
                    >
                      Abrir para gerenciar
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Indicador de ação rápida (hover) - botão + flutuante no final */}
      <AnimatePresence>
        {isHovered && onAddBelow && !isCollapsed && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.15 }}
            onClick={onAddBelow}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20"
          >
            <div className="bg-background border border-border rounded-full shadow-md hover:shadow-lg transition-shadow">
              <div className="p-1">
                <Plus className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Import necessário para o MoreHorizontal
import { MoreHorizontal } from "lucide-react";
