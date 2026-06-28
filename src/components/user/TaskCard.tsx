"use client"

import { format, isPast, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Trash2, CalendarClock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Tarefa } from "@/types/tarefas"

interface TaskCardProps {
  tarefa: Tarefa
  onConcluir?: (id: string) => void
  onDelete?: (id: string) => void
  className?: string
}

const prioridadeMap = {
  alta: "border-destructive/40 text-destructive bg-destructive/5",
  media: "border-amber-500/40 text-amber-600 bg-amber-500/5",
  baixa: "border-border text-muted-foreground bg-muted",
} as const

const prioridadeLabel = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
} as const

export function TaskCard({ tarefa, onConcluir, onDelete, className }: TaskCardProps) {
  const concluida = tarefa.status === "concluida"
  const vencida =
    tarefa.dataVencimento && !concluida && isPast(parseISO(tarefa.dataVencimento))

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors",
        concluida && "opacity-50",
        vencida && !concluida && "border-destructive/30 bg-destructive/5",
        className
      )}
    >
      <Checkbox
        checked={concluida}
        disabled={concluida}
        onCheckedChange={() => !concluida && onConcluir?.(tarefa.id)}
        aria-label={`Marcar "${tarefa.titulo}" como concluída`}
        className="mt-0.5 shrink-0"
      />

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium leading-snug text-foreground truncate",
            concluida && "line-through text-muted-foreground"
          )}
        >
          {tarefa.titulo}
        </p>

        {tarefa.descricao && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {tarefa.descricao}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          <Badge
            variant="outline"
            className={cn("text-xs h-5 px-1.5", prioridadeMap[tarefa.prioridade])}
          >
            {prioridadeLabel[tarefa.prioridade]}
          </Badge>

          {tarefa.dataVencimento && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs",
                vencida ? "text-destructive font-medium" : "text-muted-foreground"
              )}
            >
              <CalendarClock className="h-3 w-3" />
              {format(parseISO(tarefa.dataVencimento), "dd MMM", { locale: ptBR })}
              {vencida && " (atrasada)"}
            </span>
          )}
        </div>
      </div>

      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          aria-label="Excluir tarefa"
          onClick={() => onDelete(tarefa.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
