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
  onTaskEdit: (
    id: string,
    titulo: string,
    prioridade?: TarefaPrioridade,
  ) => Promise<void>;
  onTaskDelete: (id: string) => Promise<void>;
  isUpdating?: boolean;
}

const COLUMNS: Array<{
  id: TarefaStatus;
  title: string;
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
  borderColor: string;
  iconColor: string;
}> = [
  {
    id: "pendente",
    title: "Pendente",
    icon: ClipboardList,
    bgColor: "bg-[#4D7CFF]/5",
    textColor: "text-[#4D7CFF]",
    borderColor: "border-[#4D7CFF]/20",
    iconColor: "text-[#4D7CFF]",
  },
  {
    id: "atrasada",
    title: "Atrasada",
    icon: AlertTriangle,
    bgColor: "bg-[#00C9A7]/5",
    textColor: "text-[#00C9A7]",
    borderColor: "border-[#00C9A7]/20",
    iconColor: "text-[#00C9A7]",
  },
  {
    id: "fazendo",
    title: "Fazendo",
    icon: Zap,
    bgColor: "bg-[#5B7FFF]/5",
    textColor: "text-[#5B7FFF]",
    borderColor: "border-[#5B7FFF]/20",
    iconColor: "text-[#5B7FFF]",
  },
  {
    id: "concluida",
    title: "Concluída",
    icon: CheckCircle2,
    bgColor: "bg-[#1FBFA8]/5",
    textColor: "text-[#1FBFA8]",
    borderColor: "border-[#1FBFA8]/20",
    iconColor: "text-[#1FBFA8]",
  },
];

export function KanbanBoard({
  tasks,
  onTaskMove,
  onTaskEdit,
  onTaskDelete,
  isUpdating = false,
}: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TarefaStatus | null>(
    null,
  );
  const dragSourceColumn = useRef<TarefaStatus | null>(null);

  const getColumnTasks = (status: TarefaStatus) =>
    tasks.filter((t) => t.status === status);

  const handleDragStart = useCallback(
    (e: React.DragEvent, taskId: string, status: TarefaStatus) => {
      setDraggedTaskId(taskId);
      dragSourceColumn.current = status;

      // Criar uma imagem fantasma transparente (usamos o próprio elemento)
      const dragImage = e.currentTarget.querySelector(
        '[draggable="true"]',
      ) as HTMLElement;
      if (dragImage) {
        e.dataTransfer.setDragImage(dragImage, 20, 20);
      }

      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("application/task-id", taskId);
    },
    [],
  );

  const handleDragEnd = useCallback(
    async (e: React.DragEvent) => {
      const taskId = draggedTaskId;
      const targetColumn = dragOverColumn;

      setDraggedTaskId(null);
      setDragOverColumn(null);

      if (!taskId || !targetColumn) return;
      if (dragSourceColumn.current === targetColumn) return;

      await onTaskMove(taskId, targetColumn);
    },
    [draggedTaskId, dragOverColumn, onTaskMove],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, columnId: TarefaStatus) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragOverColumn !== columnId) {
        setDragOverColumn(columnId);
      }
    },
    [dragOverColumn],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent, columnId: TarefaStatus) => {
      if (dragOverColumn === columnId) {
        setDragOverColumn(null);
      }
    },
    [dragOverColumn],
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent, columnId: TarefaStatus) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData("application/task-id");
      if (taskId && dragSourceColumn.current !== columnId) {
        await onTaskMove(taskId, columnId);
      }
      setDragOverColumn(null);
      setDraggedTaskId(null);
    },
    [onTaskMove],
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-h-[300px]">
      {COLUMNS.map((col) => {
        const columnTasks = getColumnTasks(col.id);
        const isOver = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            className={cn(
              "flex flex-col rounded-xl border transition-all duration-200",
              col.borderColor,
              col.bgColor,
              isOver && "ring-2 ring-primary/40 scale-[1.02] shadow-lg",
            )}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={(e) => handleDragLeave(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Cabeçalho da coluna */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/30">
              <col.icon className={cn("h-4 w-4", col.iconColor)} />
              <span className={cn("text-xs font-semibold", col.textColor)}>
                {col.title}
              </span>
              <span
                className={cn(
                  "ml-auto text-xs rounded-full px-2 py-0.5 font-medium",
                  col.bgColor,
                  col.textColor,
                )}
              >
                {columnTasks.length}
              </span>
            </div>

            {/* Lista de tarefas */}
            <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[400px]">
              <AnimatePresence mode="popLayout">
                {columnTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
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
                  <col.icon
                    className={cn("h-8 w-8 mb-2 opacity-20", col.iconColor)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nenhuma tarefa
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
