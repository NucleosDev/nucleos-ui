// src/components/tarefas/TarefaCard.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Flag,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Repeat,
  GripVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Tarefa, TarefaPrioridade, TarefaStatus } from "@/types/tarefas";

const prioridadeConfig: Record<
  TarefaPrioridade,
  { label: string; color: string; icon: string }
> = {
  baixa: {
    label: "Baixa",
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
    icon: "🟢",
  },
  media: {
    label: "Média",
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    icon: "🟡",
  },
  alta: {
    label: "Alta",
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
    icon: "🔴",
  },
};

const statusConfig: Record<
  TarefaStatus,
  { label: string; color: string; bgColor: string }
> = {
  pendente: {
    label: "Pendente",
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
  },
  atrasada: {
    label: "Atrasada",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/20",
  },
  fazendo: {
    label: "Fazendo",
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  concluida: {
    label: "Concluída",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
};

interface TarefaCardProps {
  tarefa: Tarefa;
  onToggle: (id: string, status: TarefaStatus) => Promise<void>;
  onUpdate: (
    id: string,
    titulo: string,
    prioridade?: TarefaPrioridade,
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDragStart?: (
    e: React.DragEvent,
    taskId: string,
    status: TarefaStatus,
  ) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isUpdating?: boolean;
  showStatus?: boolean;
  draggable?: boolean;
  isDragging?: boolean;
}

export function TarefaCard({
  tarefa,
  onToggle,
  onUpdate,
  onDelete,
  onDragStart,
  onDragEnd,
  isUpdating = false,
  showStatus = false,
  draggable = true,
  isDragging = false,
}: TarefaCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(tarefa.titulo);
  const [editPrioridade, setEditPrioridade] = useState<TarefaPrioridade>(
    tarefa.prioridade,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    if (editTitle === tarefa.titulo && editPrioridade === tarefa.prioridade) {
      setIsEditing(false);
      return;
    }
    setIsSubmitting(true);
    try {
      await onUpdate(tarefa.id, editTitle.trim(), editPrioridade);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditTitle(tarefa.titulo);
      setEditPrioridade(tarefa.prioridade);
    }
  };

  const handleToggle = async () => {
    if (isUpdating) return;

    let newStatus: TarefaStatus;
    if (tarefa.status === "concluida") {
      newStatus = "pendente";
    } else if (tarefa.status === "atrasada") {
      newStatus = "fazendo";
    } else if (tarefa.status === "fazendo") {
      newStatus = "concluida";
    } else {
      newStatus = "concluida";
    }

    await onToggle(tarefa.id, newStatus);
  };

  const isConcluida = tarefa.status === "concluida";
  const isRecorrente = tarefa.metadata?.isRecorrente;
  const recorrenciaTipo = tarefa.metadata?.recorrenciaTipo;
  const isAtrasada = tarefa.status === "atrasada";

  const getRecorrenciaLabel = () => {
    switch (recorrenciaTipo) {
      case "diaria":
        return "Todo dia";
      case "semanal":
        return "Toda semana";
      case "mensal":
        return "Todo mês";
      default:
        return "Recorrente";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) return "Hoje";
    if (date.getTime() === tomorrow.getTime()) return "Amanhã";

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  const isVencendoHoje =
    tarefa.dataVencimento &&
    !isConcluida &&
    (() => {
      const date = new Date(tarefa.dataVencimento);
      const today = new Date();
      date.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    })();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDragging ? 0.5 : 1,
        y: 0,
        scale: isDragging ? 1.02 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
        "bg-card hover:bg-card/80",
        draggable && !isConcluida && "cursor-grab active:cursor-grabbing",
        isConcluida && "opacity-60",
        isAtrasada && "border-destructive/30 bg-destructive/5",
        isVencendoHoje && "border-primary/30 bg-primary/5",
        isDragging && "shadow-lg ring-2 ring-primary/50",
        !isEditing && !isDragging && "hover:border-border/80 hover:shadow-sm",
        isEditing && "ring-2 ring-primary/50",
      )}
    >
      {/* Wrapper div para o drag nativo do HTML5 */}
      <div
        draggable={draggable && !isConcluida}
        onDragStart={(e) => {
          if (!draggable || isConcluida) {
            e.preventDefault();
            return;
          }

          e.dataTransfer.setData("text/plain", tarefa.id);
          e.dataTransfer.effectAllowed = "move";

          if (onDragStart) {
            onDragStart(e, tarefa.id, tarefa.status);
          }
        }}
        onDragEnd={(e) => {
          if (onDragEnd) {
            onDragEnd(e);
          }
        }}
        className="contents"
      >
        {/* Drag handle */}
        {draggable && !isConcluida && (
          <div className="cursor-grab active:cursor-grabbing mt-1">
            <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
          </div>
        )}

        {/* Checkbox */}
        <Checkbox
          checked={isConcluida}
          onCheckedChange={handleToggle}
          disabled={isUpdating}
          className="mt-1 shrink-0 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />

        {/* Content */}
        <div className="flex-1 space-y-2 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Título da tarefa"
                className="h-9 text-sm"
                autoFocus
                disabled={isSubmitting}
              />
              <Select
                value={editPrioridade}
                onValueChange={(v) => setEditPrioridade(v as TarefaPrioridade)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="h-9 w-[140px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">🟢 Baixa</SelectItem>
                  <SelectItem value="media">🟡 Média</SelectItem>
                  <SelectItem value="alta">🔴 Alta</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSubmitting || !editTitle.trim()}
                  className="text-xs"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  )}
                  Salvar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setEditTitle(tarefa.titulo);
                    setEditPrioridade(tarefa.prioridade);
                  }}
                  disabled={isSubmitting}
                  className="text-xs"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Título e badges */}
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium leading-tight break-words",
                      isConcluida && "line-through text-muted-foreground",
                      isAtrasada && "text-destructive",
                      !isConcluida &&
                        "cursor-pointer hover:text-primary transition-colors",
                    )}
                    onDoubleClick={() => !isConcluida && setIsEditing(true)}
                    title="Duplo clique para editar"
                  >
                    {tarefa.titulo}
                  </p>
                </div>

                {/* Badge de recorrência */}
                {isRecorrente && (
                  <Badge
                    variant="outline"
                    className="text-xs gap-1 shrink-0 border-primary/20 text-primary"
                  >
                    <Repeat className="h-3 w-3" />
                    <span className="hidden sm:inline">
                      {getRecorrenciaLabel()}
                    </span>
                  </Badge>
                )}
              </div>

              {/* Metadados */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Prioridade */}
                <Badge
                  className={cn(
                    "text-xs font-normal",
                    prioridadeConfig[tarefa.prioridade].color,
                  )}
                >
                  <Flag className="h-3 w-3 mr-1" />
                  {prioridadeConfig[tarefa.prioridade].label}
                </Badge>

                {/* Data de vencimento */}
                {tarefa.dataVencimento && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-normal",
                      isVencendoHoje && "border-primary/50 text-primary",
                    )}
                  >
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(tarefa.dataVencimento)}
                  </Badge>
                )}

                {/* Status (se showStatus for true) */}
                {showStatus && (
                  <Badge
                    className={cn(
                      "text-xs font-normal",
                      statusConfig[tarefa.status].bgColor,
                      statusConfig[tarefa.status].color,
                    )}
                  >
                    {statusConfig[tarefa.status].label}
                  </Badge>
                )}
              </div>
            </>
          )}
        </div>

        {/* Menu de ações */}
        {!isEditing && (
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 shrink-0 transition-all",
                  menuOpen
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100",
                  "hover:bg-muted",
                )}
                disabled={isUpdating}
                // Prevenir que o clique no menu inicie o drag
                onPointerDown={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => setIsEditing(true)}
                disabled={isConcluida}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(tarefa.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.div>
  );
}
