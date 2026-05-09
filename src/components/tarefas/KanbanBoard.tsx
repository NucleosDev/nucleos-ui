// src/components/tarefas/KanbanBoard.tsx
"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { TarefaCard } from "./TarefaCard";
import { ClipboardList, AlertTriangle, Zap, CheckCircle2 } from "lucide-react";
import type { Tarefa, TarefaPrioridade, TarefaStatus } from "@/types/tarefas";

interface KanbanBoardProps {
  tasks: Tarefa[];
  onTaskMove: (taskId: string, newStatus: TarefaStatus) => Promise<void>;
  onTaskEdit: (id: string, titulo: string, prioridade?: TarefaPrioridade) => Promise<void>;
  onTaskDelete: (id: string) => Promise<void>;
  isUpdating?: boolean;
}

const COLUMNS: Array<{
  id: TarefaStatus;
  title: string;
  icon: React.ElementType;
  accent: string;
}> = [
  { id: "pendente",  title: "Pendente",  icon: ClipboardList,  accent: "#3b82f6" },
  { id: "atrasada",  title: "Atrasada",  icon: AlertTriangle,  accent: "#ef4444" },
  { id: "fazendo",   title: "Fazendo",   icon: Zap,            accent: "#8b5cf6" },
  { id: "concluida", title: "Concluída", icon: CheckCircle2,   accent: "#22c55e" },
];

export function KanbanBoard({
  tasks,
  onTaskMove,
  onTaskEdit,
  onTaskDelete,
  isUpdating = false,
}: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TarefaStatus | null>(null);
  const dragSourceColumn = useRef<TarefaStatus | null>(null);

  const getColumnTasks = (status: TarefaStatus) => tasks.filter((t) => t.status === status);

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string, status: TarefaStatus) => {
    setDraggedTaskId(taskId);
    dragSourceColumn.current = status;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/task-id", taskId);
  }, []);

  const handleDragEnd = useCallback((_e: React.DragEvent) => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
    dragSourceColumn.current = null;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: TarefaStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== columnId) setDragOverColumn(columnId);
  }, [dragOverColumn]);

  const handleDrop = useCallback(async (e: React.DragEvent, columnId: TarefaStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("application/task-id");
    if (taskId && dragSourceColumn.current !== columnId) {
      await onTaskMove(taskId, columnId);
    }
    setDragOverColumn(null);
    setDraggedTaskId(null);
  }, [onTaskMove]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 min-h-[300px]">
      {COLUMNS.map((col) => {
        const columnTasks = getColumnTasks(col.id);
        const isOver = dragOverColumn === col.id;
        const Icon = col.icon;

        return (
          <div
            key={col.id}
            className={cn(
              "flex flex-col rounded-xl border overflow-hidden transition-all duration-200",
              "bg-card/40 backdrop-blur-sm",
              isOver
                ? "border-primary/40 ring-2 ring-primary/20 scale-[1.01]"
                : "border-border/50",
            )}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column header */}
            <div
              className="flex items-center gap-2 px-3 py-2 border-b border-border/30"
              style={{ background: `${col.accent}0a` }}
            >
              <div
                className="flex h-5 w-5 items-center justify-center rounded-md"
                style={{ background: `${col.accent}18` }}
              >
                <Icon className="h-3 w-3" style={{ color: col.accent }} />
              </div>
              <span className="text-xs font-semibold flex-1" style={{ color: col.accent }}>
                {col.title}
              </span>
              <span
                className="text-[10px] font-medium tabular-nums px-1.5 py-0.5 rounded-md"
                style={{ background: `${col.accent}18`, color: col.accent }}
              >
                {columnTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="flex-1 p-2 space-y-1.5 overflow-y-auto max-h-[400px]">
              <AnimatePresence mode="popLayout">
                {columnTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <TarefaCard
                      tarefa={task}
                      onToggle={onTaskMove}
                      onUpdate={onTaskEdit}
                      onDelete={onTaskDelete}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      isUpdating={isUpdating}
                      isDragging={draggedTaskId === task.id}
                      draggable={task.status !== "concluida"}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {columnTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Icon className="h-6 w-6 mb-2 opacity-15" style={{ color: col.accent }} />
                  <p className="text-[11px] text-muted-foreground/50">Nenhuma tarefa</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
