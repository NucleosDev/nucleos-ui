"use client";

import {
  CheckSquare,
  Repeat,
  StickyNote,
  List,
  Calendar,
  Calculator,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Bloco, BlocoTipo } from "@/src/types/bloco";

interface BlocoCardProps {
  bloco: Bloco;
  selected?: boolean;
  onClick?: (id: string) => void;
  onEdit?: (bloco: Bloco) => void;
  onDelete?: (id: string) => void;
}

const tipoIcone: Record<
  BlocoTipo,
  React.ComponentType<{ className?: string }>
> = {
  tarefas: CheckSquare,
  habitos: Repeat,
  notas: StickyNote,
  lista: List,
  calendario: Calendar,
  calculo: Calculator,
};

const tipoLabel: Record<BlocoTipo, string> = {
  tarefas: "Tarefas",
  habitos: "Hábitos",
  notas: "Notas",
  lista: "Lista",
  calendario: "Calendário",
  calculo: "Cálculo",
};

export function BlocoCard({
  bloco,
  selected,
  onClick,
  onEdit,
  onDelete,
}: BlocoCardProps) {
  const Icon = tipoIcone[bloco.tipo] ?? List;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-selected={selected}
      onClick={() => onClick?.(bloco.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.(bloco.id);
      }}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "bg-accent text-accent-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />

      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium leading-none truncate text-foreground">
          {bloco.titulo}
        </span>
        <span className="text-xs text-muted-foreground">
          {tipoLabel[bloco.tipo]}
        </span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground"
                aria-label="Opções do bloco"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {onEdit && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(bloco);
                  }}
                >
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  Editar
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(bloco.id);
                  }}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Excluir
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
    </div>
  );
}
