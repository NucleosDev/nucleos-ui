// src/components/blocos/cruds/TarefasBlocoCard.tsx
"use client";

import { useState } from "react";
import { Plus, LayoutGrid, List, Flame, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTarefas } from "@/hooks/useTarefas";
import { toast } from "@/hooks/use-toast";
import type { Bloco } from "@/types/bloco";
import type { TarefaPrioridade, TarefaStatus } from "@/types/tarefas";
import { KanbanBoard } from "@/components/tarefas/KanbanBoard";
import { TaskListView } from "@/components/tarefas/TaskListView";
import { DailyTrackerDialog } from "@/components/tarefas/DailyTrackerDialog";
import { AddTaskDialog } from "@/components/tarefas/AddTaskDialog";

interface TarefasBlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete?: () => void;
  onEdit?: () => void;
  isDeleting?: boolean;
}

export function TarefasBlocoCard({ bloco }: TarefasBlocoCardProps) {
  const [viewMode, setViewMode]             = useState<"kanban" | "list">("kanban");
  const [dailyTrackerOpen, setDailyTrackerOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen]       = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const {
    tarefas = [],
    isLoading,
    criar,
    atualizar,
    concluir,
    excluir,
    isCreating,
    isUpdating,
  } = useTarefas(bloco.id);

  const handleAddTask = async (
    titulo: string,
    prioridade: TarefaPrioridade,
    dataVencimento?: string,
  ) => {
    try {
      await criar({ blocoId: bloco.id, titulo: titulo.trim(), prioridade, dataVencimento });
      toast({ title: "Tarefa adicionada!" });
      return true;
    } catch {
      toast({ title: "Erro ao adicionar tarefa", variant: "destructive" });
      return false;
    }
  };

  const handleUpdateTask = async (id: string, titulo: string, prioridade?: TarefaPrioridade) => {
    try {
      await atualizar({ id, payload: { titulo, prioridade } });
    } catch {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  const handleToggleStatus = async (id: string, status: TarefaStatus) => {
    try {
      if (status === "concluida") {
        await concluir(id);
      } else {
        await atualizar({ id, payload: { status } });
      }
    } catch {
      toast({ title: "Erro ao mover tarefa", variant: "destructive" });
    }
  };

  const handleDeleteTask = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    try {
      await excluir(id);
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const completed = tarefas.filter((t) => t.status === "concluida").length;
  const total     = tarefas.length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2">
          {/* View toggle — glass segment */}
          <div
            className="flex items-center rounded-lg border border-border/50 bg-muted/30 p-0.5"
            style={{ backdropFilter: "blur(8px)" }}
          >
            {(["kanban", "list"] as const).map((mode) => {
              const Icon = mode === "kanban" ? LayoutGrid : List;
              return (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "flex items-center justify-center h-7 w-7 rounded-md transition-all duration-[var(--duration-fast)]",
                    viewMode === mode
                      ? "bg-background shadow-[var(--shadow-xs)] text-foreground"
                      : "text-muted-foreground/60 hover:text-muted-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              );
            })}
          </div>

          {/* Progress */}
          {total > 0 && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="h-1 flex-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[11px] tabular-nums text-muted-foreground shrink-0">
                {completed}/{total}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setDailyTrackerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent border border-border/40 transition-colors"
            >
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              Diário
            </button>
            <button
              onClick={() => setAddTaskOpen(true)}
              disabled={isCreating}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/8 border border-primary/25 transition-colors"
            >
              {isCreating
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Plus className="h-3.5 w-3.5" />
              }
              Nova
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === "kanban" ? (
          <KanbanBoard
            tasks={tarefas}
            onTaskMove={handleToggleStatus}
            onTaskEdit={handleUpdateTask}
            onTaskDelete={handleDeleteTask}
            isUpdating={isUpdating}
          />
        ) : (
          <TaskListView
            tasks={tarefas}
            onTaskToggle={handleToggleStatus}
            onTaskEdit={handleUpdateTask}
            onTaskDelete={handleDeleteTask}
            isUpdating={isUpdating}
          />
        )}
      </div>

      <AddTaskDialog
        open={addTaskOpen}
        onClose={() => setAddTaskOpen(false)}
        onAdd={handleAddTask}
        isSubmitting={isCreating}
      />
      <DailyTrackerDialog
        open={dailyTrackerOpen}
        onClose={() => setDailyTrackerOpen(false)}
        tasks={tarefas}
        onTaskToggle={handleToggleStatus}
        onAddTask={handleAddTask}
      />

      <AlertDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => { if (!open) setDeleteTargetId(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
