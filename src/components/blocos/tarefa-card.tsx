"use client"

import { MoreHorizontal, CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTarefas } from "@/hooks/use-tarefas";
import type { Tarefa } from "@/types/tarefa";
import type { Bloco } from "@/types/bloco";

interface TarefaCardProps {
  bloco: Bloco;
  tarefas: Tarefa[];
  nucleoId: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TarefaCard({
  bloco,
  tarefas,
  nucleoId,
  onEdit,
  onDelete,
}: TarefaCardProps) {
  const { concluir, isUpdating } = useTarefas(bloco.id);

  return (
    <Card className="group relative hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-1.5">
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base font-medium">
            {bloco.titulo || "Tarefas"}
          </CardTitle>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative z-10 h-8 w-8"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-20">
            <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-2">
        {tarefas.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Nenhuma tarefa cadastrada ainda.
          </p>
        ) : (
          tarefas.map((tarefa) => (
            <div
              key={tarefa.id}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => concluir(tarefa.id)}
                  disabled={isUpdating}
                  className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                  title="Marcar como concluída"
                >
                  {tarefa.concluida ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </button>

                <span
                  className={`text-sm truncate ${
                    tarefa.concluida ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {tarefa.nome}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}