// src/components/tarefas/DailyTrackerDialog.tsx
"use client";

import { useState } from "react";
import {
  PlusCircleIcon,
  Flame,
  X,
  Repeat,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TarefaCard } from "./TarefaCard";
import type { Tarefa, TarefaPrioridade, TarefaStatus } from "@/types/tarefas";

interface DailyTrackerDialogProps {
  open: boolean;
  onClose: () => void;
  tasks: Tarefa[];
  onTaskToggle: (taskId: string, status: TarefaStatus) => void;
  onAddTask: (
    titulo: string,
    prioridade: TarefaPrioridade,
    dataVencimento?: string,
    metadata?: {
      isRecorrente?: boolean;
      recorrenciaTipo?: "diaria" | "semanal" | "mensal";
    },
  ) => Promise<boolean>;
  onUpdateTaskStatus?: (taskId: string, status: TarefaStatus) => void;
  onTaskEdit?: (
    taskId: string,
    titulo: string,
    prioridade?: TarefaPrioridade,
  ) => Promise<void>;
  onTaskDelete?: (taskId: string) => Promise<void>;
}

const prioridadeConfig: Record<
  TarefaPrioridade,
  { label: string; color: string; icon: string }
> = {
  baixa: {
    label: "Baixa",
    color: "text-green-600",
    icon: "🟢",
  },
  media: {
    label: "Média",
    color: "text-yellow-600",
    icon: "🟡",
  },
  alta: {
    label: "Alta",
    color: "text-red-600",
    icon: "🔴",
  },
};

// Configuração das colunas
const columns: { id: TarefaStatus; title: string; icon: string }[] = [
  { id: "pendente", title: "Pendente", icon: "📋" },
  { id: "atrasada", title: "Atrasada", icon: "⚠️" },
  { id: "fazendo", title: "Fazendo", icon: "⚡" },
  { id: "concluida", title: "Concluída", icon: "✅" },
];

export function DailyTrackerDialog({
  open,
  onClose,
  tasks,
  onTaskToggle,
  onAddTask,
  onUpdateTaskStatus,
  onTaskEdit,
  onTaskDelete,
}: DailyTrackerDialogProps) {
  const [newTask, setNewTask] = useState("");
  const [newTaskPrioridade, setNewTaskPrioridade] =
    useState<TarefaPrioridade>("media");
  const [newTaskDataVencimento, setNewTaskDataVencimento] = useState("");
  const [newTaskIsRecorrente, setNewTaskIsRecorrente] = useState(false);
  const [newTaskRecorrencia, setNewTaskRecorrencia] = useState<
    "diaria" | "semanal" | "mensal"
  >("diaria");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Agrupar tarefas por status
  const groupTasksByStatus = () => {
    const groups: Record<TarefaStatus, Tarefa[]> = {
      pendente: [],
      atrasada: [],
      fazendo: [],
      concluida: [],
    };

    tasks.forEach((task) => {
      groups[task.status].push(task);
    });

    return groups;
  };

  const groupedTasks = groupTasksByStatus();

  // Filtrar tarefas recorrentes
  const recorrentTasks = tasks.filter((t) => t.metadata?.isRecorrente === true);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    setIsSubmitting(true);

    const metadata = newTaskIsRecorrente
      ? { isRecorrente: true, recorrenciaTipo: newTaskRecorrencia }
      : undefined;

    const success = await onAddTask(
      newTask.trim(),
      newTaskPrioridade,
      newTaskDataVencimento || undefined,
      metadata,
    );

    if (success) {
      setNewTask("");
      setNewTaskPrioridade("media");
      setNewTaskDataVencimento("");
      setNewTaskIsRecorrente(false);
    }
    setIsSubmitting(false);
  };

  const handleTaskToggle = async (taskId: string, newStatus: TarefaStatus) => {
    if (onUpdateTaskStatus) {
      onUpdateTaskStatus(taskId, newStatus);
    } else {
      onTaskToggle(taskId, newStatus);
    }
  };

  const handleDragStart = (
    e: React.DragEvent,
    taskId: string,
    fromStatus: TarefaStatus,
  ) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, toStatus: TarefaStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, toStatus: TarefaStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const task = tasks.find((t) => t.id === taskId);

    if (task && task.status !== toStatus && toStatus !== "concluida") {
      handleTaskToggle(taskId, toStatus);
    }
  };

  const totalTasks = tasks.length;
  const completedCount = groupedTasks.concluida.length;
  const atrasadasCount = groupedTasks.atrasada.length;
  const progressPercentage =
    totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl !rounded-xl p-0 gap-0 overflow-hidden max-h-[90vh]">
        <div className="p-6 pb-4 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <DialogTitle>Daily Tracker</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="mt-1">
            Arraste as tarefas entre as colunas para organizar seu dia
          </DialogDescription>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Progresso do dia</span>
                {atrasadasCount > 0 && (
                  <div className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle className="h-3 w-3" />
                    <span>{atrasadasCount} tarefa(s) atrasada(s)</span>
                  </div>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {completedCount}/{totalTasks} concluídas
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="tasks" className="flex-1">
          <TabsList className="mx-6 mt-4 w-full justify-start">
            <TabsTrigger value="tasks">Tarefas</TabsTrigger>
            <TabsTrigger value="recurring">
              <Repeat className="h-3 w-3 mr-2" />
              Recorrentes ({recorrentTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="p-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {columns.map((column) => {
                const columnTasks = groupedTasks[column.id];
                const columnConfig = {
                  pendente: { bgColor: "bg-gray-50", color: "text-gray-600" },
                  atrasada: { bgColor: "bg-red-50", color: "text-red-600" },
                  fazendo: {
                    bgColor: "bg-primary-50",
                    color: "text-primary-600",
                  },
                  concluida: {
                    bgColor: "bg-green-50",
                    color: "text-green-600",
                  },
                }[column.id];

                return (
                  <div
                    key={column.id}
                    onDragOver={(e) => handleDragOver(e, column.id)}
                    onDrop={(e) => handleDrop(e, column.id)}
                    className={cn(
                      "rounded-lg p-3 transition-all min-h-[400px]",
                      columnConfig.bgColor,
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{column.icon}</span>
                        <h3
                          className={cn(
                            "text-sm font-semibold",
                            columnConfig.color,
                          )}
                        >
                          {column.title}
                        </h3>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {columnTasks.length}
                      </Badge>
                    </div>

                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {columnTasks.map((task) => (
                        <TarefaCard
                          key={task.id}
                          tarefa={task}
                          onToggle={handleTaskToggle}
                          onUpdate={onTaskEdit || (async () => {})}
                          onDelete={onTaskDelete || (async () => {})}
                          onDragStart={handleDragStart}
                          isUpdating={isSubmitting}
                          draggable={column.id !== "concluida"}
                        />
                      ))}
                      {columnTasks.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          Nenhuma tarefa
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Task */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex gap-2 flex-wrap">
                <Input
                  placeholder="Nova tarefa..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                  className="flex-1 min-w-[200px]"
                  disabled={isSubmitting}
                />
                <Input
                  type="date"
                  value={newTaskDataVencimento}
                  onChange={(e) => setNewTaskDataVencimento(e.target.value)}
                  className="w-36"
                  disabled={isSubmitting}
                  placeholder="Data vencimento"
                />
                <select
                  value={newTaskPrioridade}
                  onChange={(e) =>
                    setNewTaskPrioridade(e.target.value as TarefaPrioridade)
                  }
                  className="h-9 px-3 text-sm rounded-md border bg-background"
                  disabled={isSubmitting}
                >
                  <option value="baixa">🟢 Baixa</option>
                  <option value="media">🟡 Média</option>
                  <option value="alta">🔴 Alta</option>
                </select>
                <Button
                  variant="outline"
                  onClick={() => setNewTaskIsRecorrente(!newTaskIsRecorrente)}
                  className={cn(newTaskIsRecorrente && "bg-primary/10")}
                >
                  <Repeat className="h-4 w-4 mr-2" />
                  Recorrente
                </Button>
                {newTaskIsRecorrente && (
                  <select
                    value={newTaskRecorrencia}
                    onChange={(e) =>
                      setNewTaskRecorrencia(
                        e.target.value as "diaria" | "semanal" | "mensal",
                      )
                    }
                    className="h-9 px-3 text-sm rounded-md border bg-background"
                  >
                    <option value="diaria">Todo dia</option>
                    <option value="semanal">Toda semana</option>
                    <option value="mensal">Todo mês</option>
                  </select>
                )}
                <Button
                  onClick={handleAddTask}
                  disabled={isSubmitting || !newTask.trim()}
                >
                  <PlusCircleIcon size={20} className="mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recurring" className="p-6 pt-4">
            <div className="space-y-3">
              {recorrentTasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Repeat className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Nenhuma tarefa recorrente</p>
                  <p className="text-xs mt-1">
                    Crie tarefas recorrentes na aba "Tarefas" marcando a opção
                    "Recorrente"
                  </p>
                </div>
              ) : (
                recorrentTasks.map((tarefa) => (
                  <div
                    key={tarefa.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Repeat className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          {tarefa.titulo}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {prioridadeConfig[tarefa.prioridade].icon}{" "}
                          {prioridadeConfig[tarefa.prioridade].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {tarefa.metadata?.recorrenciaTipo === "diaria" &&
                            "Todo dia"}
                          {tarefa.metadata?.recorrenciaTipo === "semanal" &&
                            "Toda semana"}
                          {tarefa.metadata?.recorrenciaTipo === "mensal" &&
                            "Todo mês"}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onAddTask(
                          tarefa.titulo,
                          tarefa.prioridade,
                          undefined,
                          undefined,
                        );
                      }}
                    >
                      Adicionar hoje
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
