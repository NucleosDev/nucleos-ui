// src/components/tarefas/KanbanBoard.tsx
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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

const columns: { id: TarefaStatus; title: string; color: string }[] = [
  {
    id: "pendente",
    title: "Pendente",
    color: "bg-slate-500/20 border-slate-500/30",
  },
  {
    id: "atrasada",
    title: "Atrasada",
    color: "bg-red-500/20 border-red-500/30",
  },
  {
    id: "concluida",
    title: "Concluída",
    color: "bg-emerald-500/20 border-emerald-500/30",
  },
];

const prioridadeConfig: Record<
  TarefaPrioridade,
  { label: string; color: string; icon: string }
> = {
  baixa: {
    label: "Baixa",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: "🔵",
  },
  media: {
    label: "Média",
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    icon: "🟡",
  },
  alta: {
    label: "Alta",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: "🔴",
  },
};

export function KanbanBoard({
  tasks,
  onTaskMove,
  onTaskEdit,
  onTaskDelete,
  isUpdating,
}: KanbanBoardProps) {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrioridade, setEditPrioridade] =
    useState<TarefaPrioridade>("media");
  const dragItemRef = useRef<string | null>(null);

  // 👇 GAMBIARRA: usar os eventos nativos do HTML
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string,
  ) => {
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

  const handleEditStart = (task: Tarefa) => {
    setEditingTask(task.id);
    setEditTitle(task.titulo);
    setEditPrioridade(task.prioridade);
  };

  const handleEditSave = (taskId: string) => {
    if (editTitle.trim()) {
      onTaskEdit(taskId, editTitle.trim(), editPrioridade);
    }
    setEditingTask(null);
  };

  const getTasksByStatus = (status: TarefaStatus) =>
    tasks.filter((t) => t.status === status);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const isDragging = (taskId: string) => draggedTaskId === taskId;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        return (
          <div
            key={column.id}
            className={cn(
              "rounded-xl border p-3 transition-colors min-h-[300px]",
              column.color,
              draggedTaskId && "ring-2 ring-primary/50",
            )}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <Badge variant="outline" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {columnTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={cn(
                      "group bg-background rounded-lg border p-3 transition-all",
                      task.status === "concluida" && "opacity-70",
                      isDragging(task.id) && "opacity-50",
                    )}
                  >
                    {/* 👇 div separada para drag, SEM motion.direct */}
                    <div
                      draggable={!isUpdating && task.status !== "concluida"}
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      {editingTask === task.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="h-8 text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleEditSave(task.id);
                              if (e.key === "Escape") setEditingTask(null);
                            }}
                          />
                          <select
                            value={editPrioridade}
                            onChange={(e) =>
                              setEditPrioridade(
                                e.target.value as TarefaPrioridade,
                              )
                            }
                            className="w-full h-8 text-sm rounded-md border bg-background px-2"
                          >
                            <option value="baixa">Baixa</option>
                            <option value="media">Média</option>
                            <option value="alta">Alta</option>
                          </select>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleEditSave(task.id)}
                            >
                              Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingTask(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={cn(
                                "text-sm font-medium flex-1",
                                task.status === "concluida" &&
                                  "line-through text-muted-foreground",
                              )}
                            >
                              {task.titulo}
                            </p>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleEditStart(task)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={() => onTaskDelete(task.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              className={cn(
                                "text-xs",
                                prioridadeConfig[task.prioridade].color,
                              )}
                            >
                              {prioridadeConfig[task.prioridade].icon}{" "}
                              {prioridadeConfig[task.prioridade].label}
                            </Badge>
                            {task.dataVencimento && (
                              <span className="text-xs text-muted-foreground">
                                📅 {formatDate(task.dataVencimento)}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
