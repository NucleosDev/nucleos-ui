"use client";

import { useState } from "react";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  CheckSquare,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { TarefaCard } from "@/components/tarefas/TarefaCard";
import { useTarefas } from "@/hooks/useTarefas";
import { toast } from "@/hooks/use-toast";
import type { Bloco } from "@/types/bloco";
import type { TarefaPrioridade } from "@/types/tarefas";

interface TarefasBlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete: (blocoId: string) => void;
  onEdit: (blocoId: string) => void;
  isDeleting?: boolean;
}

export function TarefasBlocoCard({
  bloco,
  onDelete,
  onEdit,
  isDeleting,
}: TarefasBlocoCardProps) {
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

  const [novaTarefaTitulo, setNovaTarefaTitulo] = useState("");
  const [novaTarefaPrioridade, setNovaTarefaPrioridade] =
    useState<TarefaPrioridade>("media");

  const handleAddTarefa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaTarefaTitulo.trim()) return;
    try {
      await criar({
        blocoId: bloco.id,
        titulo: novaTarefaTitulo.trim(),
        prioridade: novaTarefaPrioridade,
      });
      setNovaTarefaTitulo("");
      setNovaTarefaPrioridade("media");
      toast({ title: "Tarefa adicionada!" });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar tarefa",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await concluir(id);
    } catch (error: any) {
      toast({ title: "Erro ao concluir tarefa", variant: "destructive" });
    }
  };

  const handleUpdate = async (
    id: string,
    titulo: string,
    prioridade?: TarefaPrioridade,
  ) => {
    try {
      await atualizar({ id, payload: { titulo, prioridade } });
      toast({ title: "Tarefa atualizada!" });
    } catch (error: any) {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta tarefa?")) return;
    try {
      await excluir(id);
      toast({ title: "Tarefa excluída!" });
    } catch (error: any) {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  return (
    <Card className="group relative hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">
              {bloco.titulo || "Tarefas"}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(bloco.id)}>
                <Pencil className="mr-2 h-4 w-4" /> Editar bloco
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(bloco.id)}
                className="text-destructive"
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Excluir bloco
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleAddTarefa} className="flex gap-2">
          <Input
            placeholder="Nova tarefa..."
            value={novaTarefaTitulo}
            onChange={(e) => setNovaTarefaTitulo(e.target.value)}
            className="h-9 flex-1"
            disabled={isCreating}
          />
          <Select
            value={novaTarefaPrioridade}
            onValueChange={(v) =>
              setNovaTarefaPrioridade(v as TarefaPrioridade)
            }
            disabled={isCreating}
          >
            <SelectTrigger className="h-9 w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="submit"
            size="sm"
            disabled={isCreating || !novaTarefaTitulo.trim()}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Plus className="h-4 w-4 mr-1" />
            )}
            Adicionar
          </Button>
        </form>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : tarefas.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            Nenhuma tarefa ainda.
          </div>
        ) : (
          <div className="space-y-1">
            {tarefas.map((tarefa) => (
              <TarefaCard
                key={tarefa.id}
                tarefa={tarefa}
                onToggle={handleToggle}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
