// src/components/tarefas/TarefaCard.tsx
"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Repeat,
  GripVertical,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tarefa, TarefaPrioridade, TarefaStatus } from "@/types/tarefas";

const PRIORIDADE_CONFIG: Record<
  TarefaPrioridade,
  { label: string; color: string; dot: string }
> = {
  baixa: { label: "Baixa", color: "text-emerald-500", dot: "bg-emerald-500" },
  media: { label: "Média", color: "text-amber-500", dot: "bg-amber-500" },
  alta: { label: "Alta", color: "text-red-500", dot: "bg-red-500" },
};

const STATUS_CONFIG: Record<
  TarefaStatus,
  { label: string; bg: string; text: string }
> = {
  pendente: { label: "Pendente", bg: "bg-blue-500/12", text: "text-blue-500" },
  atrasada: { label: "Atrasada", bg: "bg-red-500/12", text: "text-red-500" },
  fazendo: {
    label: "Fazendo",
    bg: "bg-violet-500/12",
    text: "text-violet-500",
  },
  concluida: {
    label: "Concluída",
    bg: "bg-emerald-500/12",
    text: "text-emerald-500",
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
  onDelete: (id: string) => void | Promise<void>;
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
  const menuRef = useRef<HTMLDivElement>(null);

  const isConcluida = tarefa.status === "concluida";
  const isAtrasada = tarefa.status === "atrasada";
  const isRecorrente = tarefa.metadata?.isRecorrente;
  const recorrenciaTipo = tarefa.metadata?.recorrenciaTipo;

  const isVencendoHoje =
    tarefa.dataVencimento &&
    !isConcluida &&
    (() => {
      const d = new Date(tarefa.dataVencimento);
      const today = new Date();
      d.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    })();

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
    } catch {
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
    const newStatus: TarefaStatus =
      tarefa.status === "concluida"
        ? "pendente"
        : tarefa.status === "atrasada"
          ? "fazendo"
          : "concluida";
    await onToggle(tarefa.id, newStatus);
  };

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
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const pConfig = PRIORIDADE_CONFIG[tarefa.prioridade];
  const sConfig = STATUS_CONFIG[tarefa.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: isDragging ? 0.5 : isConcluida ? 0.6 : 1,
        y: 0,
        scale: isDragging ? 1.02 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "group relative flex items-start gap-2.5 px-3 py-2.5 rounded-xl transition-all",
        "bg-card/60 backdrop-blur-sm",
        isAtrasada ? "border-red-500/25 bg-red-500/5" : "",
        isVencendoHoje && !isAtrasada ? "border-blue-500/25 bg-blue-500/5" : "",
        !isAtrasada && !isVencendoHoje
          ? "border-border/50 hover:border-border/80"
          : "",
        isDragging && "shadow-lg ring-2 ring-blue-500/30",
        isEditing && "ring-2 ring-blue-500/30",
        draggable && !isConcluida && "cursor-grab active:cursor-grabbing",
      )}
    >
      {/* Accent strip */}
      <div
        className={cn(
          "absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full",
          isConcluida ? "bg-emerald-500/60" : isAtrasada ? "bg-red-500" : "",
        )}
      />

      <div
        draggable={draggable && !isConcluida}
        onDragStart={(e) => {
          if (!draggable || isConcluida) {
            e.preventDefault();
            return;
          }
          e.dataTransfer.setData("text/plain", tarefa.id);
          e.dataTransfer.effectAllowed = "move";
          onDragStart?.(e, tarefa.id, tarefa.status);
        }}
        onDragEnd={(e) => onDragEnd?.(e)}
        className="contents"
      >
        {/* Drag handle */}
        {draggable && !isConcluida && (
          <div className="mt-0.5 shrink-0">
            <GripVertical className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
          </div>
        )}

        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isUpdating}
          className={cn(
            "mt-0.5 shrink-0 flex h-4 w-4 items-center justify-center rounded border-2 transition-all",
            isConcluida
              ? "border-emerald-500 bg-emerald-500"
              : "border-border/60 hover:border-border",
          )}
        >
          {isConcluida && (
            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {isEditing ? (
            <div className="space-y-2">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                disabled={isSubmitting}
                className={cn(
                  "w-full px-2 py-1 text-sm rounded-lg bg-muted/40 border border-border/50",
                  "focus:outline-none focus:ring-1 focus:ring-blue-500/40",
                )}
              />
              <div className="flex items-center gap-2">
                <select
                  value={editPrioridade}
                  onChange={(e) =>
                    setEditPrioridade(e.target.value as TarefaPrioridade)
                  }
                  disabled={isSubmitting}
                  className="flex-1 px-2 py-1 text-xs rounded-lg bg-muted/40 border border-border/50 focus:outline-none"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting || !editTitle.trim()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/12 text-blue-500 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Check className="h-3 w-3" />
                  )}
                  Salvar
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditTitle(tarefa.titulo);
                    setEditPrioridade(tarefa.prioridade);
                  }}
                  disabled={isSubmitting}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
                >
                  <X className="h-3 w-3" />
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-2">
                <p
                  className={cn(
                    "text-sm font-medium leading-tight flex-1 break-words",
                    isConcluida && "line-through text-muted-foreground/60",
                    isAtrasada && !isConcluida && "text-red-500",
                    !isConcluida && "cursor-pointer",
                  )}
                  onDoubleClick={() => !isConcluida && setIsEditing(true)}
                >
                  {tarefa.titulo}
                </p>
                {isRecorrente && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-500 shrink-0">
                    <Repeat className="h-2.5 w-2.5" />
                    {getRecorrenciaLabel()}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Priority */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[10px] font-medium",
                    pConfig.color,
                  )}
                >
                  <span
                    className={cn("h-1.5 w-1.5 rounded-full", pConfig.dot)}
                  />
                  {pConfig.label}
                </span>

                {/* Due date */}
                {tarefa.dataVencimento && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md",
                      isVencendoHoje
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-muted/60 text-muted-foreground/60",
                    )}
                  >
                    <Calendar className="h-2.5 w-2.5" />
                    {formatDate(tarefa.dataVencimento)}
                  </span>
                )}

                {/* Status */}
                {showStatus && (
                  <span
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-md",
                      sConfig.bg,
                      sConfig.text,
                    )}
                  >
                    {sConfig.label}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Menu */}
        {!isEditing && (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              onPointerDown={(e) => e.stopPropagation()}
              disabled={isUpdating}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg transition-all",
                "text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent",
                menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              )}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div
                  className="absolute right-0 top-full mt-1 z-50 w-36 overflow-hidden rounded-xl"
                  style={{
                    background: "var(--popover)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow:
                      "0 8px 24px -4px oklch(0.18 0.02 250 / 0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
                    backdropFilter: "blur(16px) saturate(160%)",
                  }}
                >
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setMenuOpen(false);
                      }}
                      disabled={isConcluida}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm hover:bg-accent/70 transition-colors text-left disabled:opacity-40"
                    >
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground/60" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        onDelete(tarefa.id);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm hover:bg-destructive/10 text-destructive transition-colors text-left"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Excluir
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
