// src/components/tarefas/KanbanBoard.tsx
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TarefaCard } from "./TarefaCard";
import type { Tarefa, TarefaPrioridade, TarefaStatus } from "@/types/tarefas";

interface KanbanBoardProps {
  tasks: Tarefa[];
  onTaskMove: (taskId: string, status: TarefaStatus) => void;
  onTaskEdit: (
    taskId: string,
    titulo: string,
    prioridade?: TarefaPrioridade,
  ) => void;
  onTaskDelete: (taskId: string) => void;
  isUpdating?: boolean;
}

const columns: {
  id: TarefaStatus;
  title: string;
  color: string;
  icon: string;
}[] = [
  {
    id: "pendente",
    title: "Pendente",
    color: "bg-gray-500/20 border-gray-500/30",
    icon: "📋",
  },
  {
    id: "atrasada",
    title: "Atrasada",
    color: "bg-red-500/20 border-red-500/30",
    icon: "⚠️",
  },
  {
    id: "fazendo",
    title: "Fazendo",
    color: "bg-blue-500/20 border-blue-500/30",
    icon: "⚡",
  },
  {
    id: "concluida",
    title: "Concluída",
    color: "bg-emerald-500/20 border-emerald-500/30",
    icon: "✅",
  },
];

export function KanbanBoard({
  tasks,
  onTaskMove,
  onTaskEdit,
  onTaskDelete,
  isUpdating,
}: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const dragItemRef = useRef<string | null>(null);

  const handleDragStart = (
    e: React.DragEvent,
    taskId: string,
    fromStatus: TarefaStatus,
  ) => {
    // Permitir drag apenas para tarefas não concluídas
    if (fromStatus === "concluida") {
      e.preventDefault();
      return;
    }
    setDraggedTaskId(taskId);
    dragItemRef.current = taskId;
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    dragItemRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    status: TarefaStatus,
  ) => {
    e.preventDefault();
    const taskId = dragItemRef.current;
    if (taskId) {
      const draggedTask = tasks.find((t) => t.id === taskId);
      if (draggedTask && draggedTask.status !== status) {
        onTaskMove(taskId, status);
      }
    }
    setDraggedTaskId(null);
    dragItemRef.current = null;
  };

  const getTasksByStatus = (status: TarefaStatus) =>
    tasks.filter((t) => t.status === status);

  const handleTaskToggle = async (taskId: string, newStatus: TarefaStatus) => {
    onTaskMove(taskId, newStatus);
  };

  const handleTaskEdit = async (
    taskId: string,
    titulo: string,
    prioridade?: TarefaPrioridade,
  ) => {
    onTaskEdit(taskId, titulo, prioridade);
  };

  const handleTaskDelete = async (taskId: string) => {
    onTaskDelete(taskId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        const isDragOverColumn = draggedTaskId && column.id !== "concluida";

        return (
          <div
            key={column.id}
            className={cn(
              "rounded-xl border p-3 transition-all min-h-[300px]",
              column.color,
              isDragOverColumn && "ring-2 ring-primary/50 ring-inset",
            )}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-lg">{column.icon}</span>
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <Badge variant="outline" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-1">
              <AnimatePresence mode="popLayout">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <TarefaCard
                      key={task.id}
                      tarefa={task}
                      onToggle={handleTaskToggle}
                      onUpdate={handleTaskEdit}
                      onDelete={handleTaskDelete}
                      onDragStart={handleDragStart}
                      isUpdating={isUpdating}
                      draggable={column.id !== "concluida"}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-muted-foreground text-sm"
                  >
                    Nenhuma tarefa
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
