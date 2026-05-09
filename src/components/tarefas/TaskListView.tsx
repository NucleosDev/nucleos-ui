// src/components/tarefas/TaskListView.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Pencil, Trash2, Calendar, Flame, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tarefa, TarefaPrioridade, TarefaStatus } from "@/types/tarefas";

const PRIORIDADE_CONFIG: Record<TarefaPrioridade, { label: string; dot: string }> = {
  baixa: { label: "Baixa", dot: "bg-emerald-500" },
  media: { label: "Média", dot: "bg-amber-500" },
  alta:  { label: "Alta",  dot: "bg-red-500" },
};

interface TaskListViewProps {
  tasks: Tarefa[];
  onTaskToggle: (taskId: string, status: TarefaStatus) => void;
  onTaskEdit: (taskId: string, titulo: string, prioridade?: TarefaPrioridade) => void;
  onTaskDelete: (taskId: string) => void;
  isUpdating?: boolean;
}

export function TaskListView({ tasks, onTaskToggle, onTaskEdit, onTaskDelete, isUpdating }: TaskListViewProps) {
  const [editingId,      setEditingId]      = useState<string | null>(null);
  const [editTitle,      setEditTitle]      = useState("");
  const [editPrioridade, setEditPrioridade] = useState<TarefaPrioridade>("media");

  const done  = tasks.filter((t) => t.status === "concluida").length;
  const total = tasks.length;
  const pct   = total > 0 ? (done / total) * 100 : 0;

  const handleEditStart = (task: Tarefa) => {
    setEditingId(task.id);
    setEditTitle(task.titulo);
    setEditPrioridade(task.prioridade);
  };

  const handleEditSave = (taskId: string) => {
    if (editTitle.trim()) onTaskEdit(taskId, editTitle.trim(), editPrioridade);
    setEditingId(null);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try { return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }); }
    catch { return dateStr; }
  };

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="flex items-center gap-3 px-1">
        <Flame className="h-3.5 w-3.5 text-orange-500 shrink-0" />
        <div className="flex-1 h-1.5 rounded-full bg-muted/60 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[11px] tabular-nums text-muted-foreground/60 shrink-0">
          {done}/{total}
        </span>
      </div>

      {/* Task list */}
      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-muted-foreground/50">Nenhuma tarefa ainda.</p>
              <p className="text-xs text-muted-foreground/40 mt-1">Clique em "Nova tarefa" para começar.</p>
            </div>
          ) : (
            tasks.map((task, idx) => {
              const isConcluida = task.status === "concluida";
              const pConfig = PRIORIDADE_CONFIG[task.prioridade];
              const isEditing = editingId === task.id;

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className={cn(
                    "group relative flex items-start gap-2.5 px-3 py-2.5 rounded-xl border transition-all",
                    "bg-card/60 backdrop-blur-sm",
                    isConcluida
                      ? "border-border/30 opacity-60"
                      : "border-border/50 hover:border-border/80",
                    isEditing && "ring-2 ring-blue-500/30 border-blue-500/30",
                  )}
                >
                  {/* Left strip */}
                  <div className={cn(
                    "absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full",
                    isConcluida ? "bg-emerald-500/60" : "bg-border/40",
                  )} />

                  {/* Index */}
                  <span className="text-[11px] tabular-nums text-muted-foreground/30 mt-0.5 w-4 shrink-0 text-center">
                    {idx + 1}
                  </span>

                  {/* Checkbox */}
                  <button
                    onClick={() => onTaskToggle(task.id, isConcluida ? "pendente" : "concluida")}
                    disabled={isUpdating}
                    className={cn(
                      "mt-0.5 shrink-0 flex h-4 w-4 items-center justify-center rounded border-2 transition-all",
                      isConcluida
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-border/60 hover:border-border",
                    )}
                  >
                    {isConcluida && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                  </button>

                  {/* Content */}
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditSave(task.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                        className={cn(
                          "flex-1 px-2 py-1 text-sm rounded-lg bg-muted/40 border border-border/50",
                          "focus:outline-none focus:ring-1 focus:ring-blue-500/40",
                        )}
                      />
                      <select
                        value={editPrioridade}
                        onChange={(e) => setEditPrioridade(e.target.value as TarefaPrioridade)}
                        className="px-2 py-1 text-xs rounded-lg bg-muted/40 border border-border/50 focus:outline-none"
                      >
                        <option value="baixa">Baixa</option>
                        <option value="media">Média</option>
                        <option value="alta">Alta</option>
                      </select>
                      <button
                        onClick={() => handleEditSave(task.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/50 hover:bg-accent transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        "text-sm font-medium break-words",
                        isConcluida && "line-through text-muted-foreground/60",
                      )}>
                        {task.titulo}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={cn("inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground/60")}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", pConfig.dot)} />
                          {pConfig.label}
                        </span>
                        {task.dataVencimento && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/50">
                            <Calendar className="h-2.5 w-2.5" />
                            {formatDate(task.dataVencimento)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {!isEditing && (
                    <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditStart(task)}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onTaskDelete(task.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
