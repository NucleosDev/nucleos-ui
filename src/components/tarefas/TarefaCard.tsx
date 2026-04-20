"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Flag,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Tarefa, TarefaPrioridade } from "@/types/tarefas";

const prioridadeConfig: Record<
  TarefaPrioridade,
  { label: string; color: string }
> = {
  baixa: { label: "Baixa", color: "bg-green-100 text-green-800" },
  media: { label: "Média", color: "bg-yellow-100 text-yellow-800" },
  alta: { label: "Alta", color: "bg-red-100 text-red-800" },
};

interface TarefaCardProps {
  tarefa: Tarefa;
  onToggle: (id: string) => Promise<void>;
  onUpdate: (
    id: string,
    titulo: string,
    prioridade?: TarefaPrioridade,
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isUpdating?: boolean;
}

export function TarefaCard({
  tarefa,
  onToggle,
  onUpdate,
  onDelete,
  isUpdating = false,
}: TarefaCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(tarefa.titulo);
  const [editPrioridade, setEditPrioridade] = useState<TarefaPrioridade>(
    tarefa.prioridade,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } catch (error) {
      // Erro já tratado no componente pai
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async () => {
    if (isUpdating) return;
    await onToggle(tarefa.id);
  };

  const isConcluida = tarefa.status === "concluida";

  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all",
        isConcluida && "opacity-70",
      )}
    >
      <Checkbox
        checked={isConcluida}
        onCheckedChange={handleToggle}
        disabled={isUpdating}
        className="mt-0.5"
      />

      <div className="flex-1 space-y-2">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Título da tarefa"
              className="h-9"
              autoFocus
              disabled={isSubmitting}
            />
            <Select
              value={editPrioridade}
              onValueChange={(v) => setEditPrioridade(v as TarefaPrioridade)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-9 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                )}
                Salvar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "text-sm font-medium leading-tight cursor-pointer",
                isConcluida && "line-through text-muted-foreground",
              )}
              onDoubleClick={() => setIsEditing(true)}
            >
              {tarefa.titulo}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                className={cn(
                  "text-xs font-normal",
                  prioridadeConfig[tarefa.prioridade].color,
                )}
              >
                <Flag className="mr-1 h-3 w-3" />
                {prioridadeConfig[tarefa.prioridade].label}
              </Badge>
              {tarefa.dataVencimento && (
                <Badge variant="outline" className="text-xs font-normal">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(tarefa.dataVencimento).toLocaleDateString("pt-BR")}
                </Badge>
              )}
            </div>
          </>
        )}
      </div>

      {!isEditing && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              disabled={isUpdating}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(tarefa.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
