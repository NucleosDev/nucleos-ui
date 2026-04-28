// src/components/tarefas/TaskListView.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Calendar, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tarefa, TarefaPrioridade, TarefaStatus } from "@/types/tarefas";

interface TaskListViewProps {
  tasks: Tarefa[];
  onTaskToggle: (taskId: string, status: TarefaStatus) => void;
  onTaskEdit: (
    taskId: string,
    titulo: string,
    prioridade?: TarefaPrioridade,
  ) => void;
  onTaskDelete: (taskId: string) => void;
  isUpdating?: boolean;
}

const prioridadeConfig: Record<
  TarefaPrioridade,
  { label: string; color: string; icon: string }
> = {
  baixa: { label: "Baixa", color: "text-green-600", icon: "🟢" },
  media: { label: "Média", color: "text-yellow-600", icon: "🟡" },
  alta: { label: "Alta", color: "text-red-600", icon: "🔴" },
};

export function TaskListView({
  tasks,
  onTaskToggle,
  onTaskEdit,
  onTaskDelete,
  isUpdating,
}: TaskListViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrioridade, setEditPrioridade] =
    useState<TarefaPrioridade>("media");

  const handleEditStart = (task: Tarefa) => {
    setEditingId(task.id);
    setEditTitle(task.titulo);
    setEditPrioridade(task.prioridade);
  };

  const handleEditSave = (taskId: string) => {
    if (editTitle.trim()) {
      onTaskEdit(taskId, editTitle.trim(), editPrioridade);
    }
    setEditingId(null);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return dateStr;
    }
  };

  const getStatusText = (status: TarefaStatus): string => {
    switch (status) {
      case "pendente":
        return "Pending";
      case "fazendo":
        return "In Progress";
      case "concluida":
        return "Completed";
      default:
        return "Pending";
    }
  };

  const getStatusBgColor = (status: TarefaStatus): string => {
    switch (status) {
      case "pendente":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
      case "fazendo":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
      case "concluida":
        return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
    }
  };

  const TaskRow = ({ task, index }: { task: Tarefa; index: number }) => (
    <motion.tr
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "border-b transition-colors hover:bg-muted/50",
        task.status === "concluida" && "opacity-60",
      )}
    >
      <TableCell className="font-medium text-muted-foreground w-12 align-top">
        {index + 1}
      </TableCell>

      <TableCell className="align-top">
        {editingId === task.id ? (
          <div className="flex gap-2 items-center flex-wrap">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="h-8 flex-1 min-w-[200px]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditSave(task.id);
                if (e.key === "Escape") setEditingId(null);
              }}
            />
            <select
              value={editPrioridade}
              onChange={(e) =>
                setEditPrioridade(e.target.value as TarefaPrioridade)
              }
              className="h-8 text-sm rounded-md border bg-background px-2"
            >
              <option value="baixa">🟢 Baixa</option>
              <option value="media">🟡 Média</option>
              <option value="alta">🔴 Alta</option>
            </select>
            <Button size="sm" onClick={() => handleEditSave(task.id)}>
              Salvar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditingId(null)}
            >
              Cancelar
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Checkbox
              checked={task.status === "concluida"}
              onCheckedChange={() =>
                onTaskToggle(
                  task.id,
                  task.status === "concluida" ? "pendente" : "concluida",
                )
              }
              disabled={isUpdating}
              className="mt-0.5"
            />
            <div className="flex-1">
              <span
                className={cn(
                  "text-sm",
                  task.status === "concluida" &&
                    "line-through text-muted-foreground",
                )}
              >
                {task.titulo}
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    prioridadeConfig[task.prioridade].color,
                  )}
                >
                  {prioridadeConfig[task.prioridade].icon}{" "}
                  {prioridadeConfig[task.prioridade].label}
                </span>
                {task.dataVencimento && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(task.dataVencimento)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </TableCell>

      <TableCell className="align-top">
        <Badge
          variant="outline"
          className={cn("font-normal", getStatusBgColor(task.status))}
        >
          {getStatusText(task.status)}
        </Badge>
      </TableCell>

      <TableCell className="text-muted-foreground align-top">
        {task.dataVencimento ? formatDate(task.dataVencimento) : "—"}
      </TableCell>

      {/* <TableCell className="align-top">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleEditStart(task)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-700"
            onClick={() => onTaskDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell> */}
    </motion.tr>
  );

  return (
    <div className="space-y-6">
      {/* Header com progresso */}
      <div className="bg-gradient-to-r from-primary/5 to-transparent rounded-lg p-4 border border-primary/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Progresso Geral</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {tasks.filter((t) => t.status === "concluida").length}/
            {tasks.length} concluídas
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
            style={{
              width: `${tasks.length > 0 ? (tasks.filter((t) => t.status === "concluida").length / tasks.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Tabela de tarefas */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12">No</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <TaskRow key={task.id} task={task} index={index} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="text-center text-muted-foreground">
                      <p className="text-sm">Nenhuma tarefa ainda.</p>
                      <p className="text-xs mt-1">
                        Clique em "Nova tarefa" para começar.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
