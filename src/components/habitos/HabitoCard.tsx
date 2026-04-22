// components/habitos/HabitoCard.tsx
"use client";

import { useState } from "react";
import {
  Check,
  MoreVertical,
  Pencil,
  Trash2,
  Flame,
  Calendar,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Habito } from "@/types/habitos";

const frequenciaLabels: Record<string, string> = {
  diaria: "Diária",
  semanal: "Semanal",
  personalizada: "Personalizada",
};

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
  isDeleting = false,
}: HabitoCardProps) {
  const meta = habito.metaVezes || 1;
  // TODO: Substituir por dados reais do backend
  const streak = (habito as any).streak || 0;
  const recorde = (habito as any).recorde || 0;
  const isCompletoHoje = (habito as any).isCompletoHoje || false;
  const progresso = isCompletoHoje ? 100 : 0;

  return (
    <Card
      className={cn(
        "group relative transition-all duration-200 hover:shadow-md border-l-4",
        isCompletoHoje
          ? "border-l-green-500 bg-green-50/30 dark:bg-green-950/10"
          : "border-l-transparent",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Button
            variant={isCompletoHoje ? "default" : "outline"}
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full shrink-0 transition-all",
              isCompletoHoje &&
                "bg-green-500 hover:bg-green-600 border-green-500",
              !isCompletoHoje && "hover:border-green-500 hover:text-green-500",
            )}
            onClick={() => !isCompletoHoje && onRegistrar(habito.id)}
            disabled={isRegistering || isCompletoHoje}
          >
            <Check className={cn("h-5 w-5", isCompletoHoje && "text-white")} />
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold text-base truncate">
                  {habito.nome}
                </h4>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {frequenciaLabels[habito.frequencia] || habito.frequencia}
                  </Badge>
                  {habito.frequencia === "semanal" && habito.diasSemana && (
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {habito.diasSemana
                        .map((d) => diasSemanaLabels[d])
                        .join(", ")}
                    </Badge>
                  )}
                  {meta > 1 && (
                    <Badge variant="outline" className="text-xs">
                      Meta: {meta}x
                    </Badge>
                  )}
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Pencil className="mr-2 h-4 w-4" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(habito.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1">
                <Flame
                  className={cn(
                    "h-4 w-4",
                    streak > 0 ? "text-orange-500" : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    streak > 0 && "text-orange-500",
                  )}
                >
                  {streak} dias
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-muted-foreground">
                  Recorde: {recorde}
                </span>
              </div>
            </div>

            <div className="mt-2">
              {isCompletoHoje ? (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <Check className="h-3 w-3" />
                  <span>Concluído hoje</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Pendente hoje</span>
                </div>
              )}
            </div>

            {meta > 1 && (
              <div className="mt-2">
                <Progress value={progresso} className="h-1.5" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
