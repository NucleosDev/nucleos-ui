// src/components/tarefas/DailyTrackerDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { CheckCircleIcon, PlusCircleIcon, Flame, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
  ) => Promise<boolean>;
}

const prioridadeConfig: Record<
  TarefaPrioridade,
  { label: string; color: string; icon: string }
> = {
  baixa: { label: "Baixa", color: "text-green-500", icon: "🟢" },
  media: { label: "Média", color: "text-yellow-500", icon: "🟡" },
  alta: { label: "Alta", color: "text-red-500", icon: "🔴" },
};

export function DailyTrackerDialog({
  open,
  onClose,
  tasks,
  onTaskToggle,
  onAddTask,
}: DailyTrackerDialogProps) {
  const [newTask, setNewTask] = useState("");
  const [newTaskPrioridade, setNewTaskPrioridade] =
    useState<TarefaPrioridade>("media");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todayTasks, setTodayTasks] = useState<Tarefa[]>([]);

  useEffect(() => {
    if (open) {
      const today = new Date().toDateString();
      const todayFiltered = tasks.filter((t) => {
        const taskDate = t.createdAt
          ? new Date(t.createdAt).toDateString()
          : "";
        return taskDate === today || t.status === "pendente";
      });
      setTodayTasks(todayFiltered.slice(0, 10));
    }
  }, [open, tasks]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    setIsSubmitting(true);
    const success = await onAddTask(newTask.trim(), newTaskPrioridade);
    if (success) {
      setNewTask("");
      setNewTaskPrioridade("media");
    }
    setIsSubmitting(false);
  };

  const handleToggle = (task: Tarefa) => {
    onTaskToggle(
      task.id,
      task.status === "concluida" ? "pendente" : "concluida",
    );
  };

  const completedCount = todayTasks.filter(
    (t) => t.status === "concluida",
  ).length;
  const totalCount = todayTasks.length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md !rounded-xl p-0 gap-0 overflow-hidden">
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
            Acompanhe suas tarefas diárias e mantenha o foco.
          </DialogDescription>

          {/* Progress Ring */}
          <div className="flex items-center justify-between mt-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted/20"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#4D7CFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPercentage / 100)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {completedCount}/{totalCount}
              </p>
              <p className="text-xs text-muted-foreground">
                tarefas concluídas
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 pt-2">
          {/* Task List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {todayTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Nenhuma tarefa para hoje. Adicione uma abaixo!
              </div>
            ) : (
              todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group"
                  onClick={() => handleToggle(task)}
                >
                  <CheckCircleIcon
                    size={20}
                    className={cn(
                      "transition-colors shrink-0",
                      task.status === "concluida"
                        ? "text-emerald-500"
                        : "text-muted-foreground",
                    )}
                  />
                  <span
                    className={cn(
                      "flex-1 text-sm",
                      task.status === "concluida" &&
                        "line-through text-muted-foreground",
                    )}
                  >
                    {task.titulo}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      prioridadeConfig[task.prioridade].color,
                    )}
                  >
                    {prioridadeConfig[task.prioridade].icon}{" "}
                    {prioridadeConfig[task.prioridade].label}
                  </Badge>
                </div>
              ))
            )}
          </div>

          {/* Add Task */}
          <div className="mt-4 flex gap-2">
            <Input
              placeholder="Nova tarefa..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              className="flex-1"
              disabled={isSubmitting}
            />
            <select
              value={newTaskPrioridade}
              onChange={(e) =>
                setNewTaskPrioridade(e.target.value as TarefaPrioridade)
              }
              className="h-9 px-2 text-sm rounded-md border bg-background"
              disabled={isSubmitting}
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
            <Button
              onClick={handleAddTask}
              disabled={isSubmitting || !newTask.trim()}
              size="icon"
            >
              <PlusCircleIcon size={20} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
