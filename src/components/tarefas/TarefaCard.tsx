// src/components/tarefas/TarefaCard.tsx
"use client";

import { useState } from "react";
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
  baixa: { label: "Baixa", color: "bg-green-100 text-green-800", icon: "🟢" },
  media: { label: "Média", color: "bg-yellow-100 text-yellow-800", icon: "🟡" },
  alta: { label: "Alta", color: "bg-red-100 text-red-800", icon: "🔴" },
};

const statusConfig: Record<
  TarefaStatus,
  { label: string; color: string; bgColor: string }
> = {
  pendente: {
    label: "Pendente",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
  },
  atrasada: { label: "Atrasada", color: "text-red-700", bgColor: "bg-red-50" },
  fazendo: { label: "Fazendo", color: "text-blue-700", bgColor: "bg-blue-50" },
  concluida: {
    label: "Concluída",
    color: "text-green-700",
    bgColor: "bg-green-50",
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
  isUpdating?: boolean;
  showStatus?: boolean;
  draggable?: boolean;
}

export function TarefaCard({
  tarefa,
  onToggle,
  onUpdate,
  onDelete,
  onDragStart,
  isUpdating = false,
  showStatus = false,
  draggable = true,
}: TarefaCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(tarefa.titulo);
  const [editPrioridade, setEditPrioridade] = useState<TarefaPrioridade>(
    tarefa.prioridade,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleToggle = async () => {
    if (isUpdating) return;
    // Alternar entre pendente e concluida, ou para próximo status
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

  const handleLocalDragStart = (e: React.DragEvent) => {
    if (!draggable || tarefa.status === "concluida") {
      e.preventDefault();
      return;
    }
    setIsDragging(true);
    if (onDragStart) {
      onDragStart(e, tarefa.id, tarefa.status);
    }
    e.dataTransfer.setData("text/plain", tarefa.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
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

  return (
    <div
      draggable={draggable && !isConcluida}
      onDragStart={handleLocalDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "group flex items-start gap-3 p-3 rounded-lg border transition-all",
        draggable && !isConcluida && "cursor-grab active:cursor-grabbing",
        isConcluida && "opacity-70",
        isAtrasada && "border-red-300 bg-red-50/30",
        isDragging && "opacity-50 shadow-lg",
        !isEditing && "hover:border-border hover:bg-muted/30",
      )}
    >
      {draggable && !isConcluida && (
        <div className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      <Checkbox
        checked={isConcluida}
        onCheckedChange={handleToggle}
        disabled={isUpdating}
        className="mt-0.5 shrink-0"
      />

      <div className="flex-1 space-y-2 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Título da tarefa"
              className="h-9"
              autoFocus
              disabled={isSubmitting}
            />
            <Select
              value={editPrioridade}
              onValueChange={(v) => setEditPrioridade(v as TarefaPrioridade)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">🟢 Baixa</SelectItem>
                <SelectItem value="media">🟡 Média</SelectItem>
                <SelectItem value="alta">🔴 Alta</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                )}
                Salvar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              <p
                className={cn(
                  "text-sm font-medium leading-tight cursor-pointer flex-1",
                  isConcluida && "line-through text-muted-foreground",
                  isAtrasada && "text-red-700",
                )}
                onDoubleClick={() => setIsEditing(true)}
              >
                {tarefa.titulo}
              </p>
              {isRecorrente && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Repeat className="h-3 w-3" />
                  {getRecorrenciaLabel()}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                className={cn(
                  "text-xs font-normal",
                  prioridadeConfig[tarefa.prioridade].color,
                )}
              >
                {prioridadeConfig[tarefa.prioridade].icon}
                <Flag className="mx-1 h-3 w-3" />
                {prioridadeConfig[tarefa.prioridade].label}
              </Badge>
              {tarefa.dataVencimento && (
                <Badge variant="outline" className="text-xs font-normal">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(tarefa.dataVencimento).toLocaleDateString("pt-BR")}
                </Badge>
              )}
              {showStatus && (
                <Badge
                  className={cn(
                    "text-xs",
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

      {!isEditing && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              disabled={isUpdating}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(tarefa.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
