// components/habitos/HabitoCard.tsx
"use client";

import { Check, MoreVertical, Pencil, Trash2, Flame, Trophy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Habito } from "@/types/habitos";

const diasSemanaLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface HabitoCardProps {
  habito: Habito;
  onRegistrar: (id: string) => Promise<void>;
  onEdit: () => void;
  onDelete: (id: string) => Promise<void>;
  isRegistering?: boolean;
  isDeleting?: boolean;
}

export function HabitoCard({
  habito,
  onRegistrar,
  onEdit,
  onDelete,
  isRegistering = false,
}: HabitoCardProps) {
  const streak      = habito.streakAtual    ?? 0;
  const recorde     = habito.streakMaximo   ?? 0;
  const done        = habito.completoHoje   ?? false;
  const diasSemana  = Array.isArray(habito.diasSemana) ? habito.diasSemana : [];

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 px-4 py-3 rounded-xl",
        "border transition-all duration-200",
        "bg-card/60 backdrop-blur-sm",
        done
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-border/50 hover:border-border hover:shadow-[var(--shadow-xs)]",
      )}
    >
      {/* Accent strip */}
      <div
        className={cn(
          "absolute left-0 top-3 bottom-3 w-[3px] rounded-full transition-colors duration-300",
          done ? "bg-emerald-500" : "bg-border/60",
        )}
      />

      {/* Check button */}
      <button
        onClick={() => !done && onRegistrar(habito.id)}
        disabled={isRegistering || done}
        className={cn(
          "shrink-0 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200",
          done
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-border hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600",
          "disabled:cursor-default",
        )}
      >
        <Check className="h-4 w-4" strokeWidth={done ? 2.5 : 2} />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <p
            className={cn(
              "text-sm font-semibold truncate transition-colors",
              done && "text-emerald-700 dark:text-emerald-400",
            )}
          >
            {habito.nome}
          </p>
          {habito.frequencia === "semanal" && diasSemana.length > 0 && (
            <span className="text-[10px] text-muted-foreground shrink-0">
              {diasSemana.map((d) => diasSemanaLabels[d]).join(" · ")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1">
          {streak > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium text-orange-500">
              <Flame className="h-3 w-3" />
              {streak}d
            </span>
          )}
          {recorde > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground/70">
              <Trophy className="h-3 w-3 text-amber-400/80" />
              {recorde}
            </span>
          )}
          <span
            className={cn(
              "text-xs",
              done ? "text-emerald-600 dark:text-emerald-500" : "text-muted-foreground/50",
            )}
          >
            {done ? "Feito hoje" : "Pendente"}
          </span>
        </div>
      </div>

      {/* Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent opacity-0 group-hover:opacity-100 transition-all duration-[var(--duration-fast)] shrink-0">
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36 text-sm">
          <DropdownMenuItem onClick={onEdit} className="gap-2">
            <Pencil className="h-3.5 w-3.5" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(habito.id)}
            className="gap-2 text-destructive focus:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" /> Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
