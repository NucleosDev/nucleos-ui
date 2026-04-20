"use client";

"use client";

import { MoreHorizontal, CheckCircle2, Circle, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHabitos } from "@/hooks/useHabitos";
import type { HabitoComProgresso } from "@/types/habitos";
import type { Bloco } from "@/types/bloco";

const FREQUENCIA_LABEL = {
  diaria: "Diário",
  semanal: "Semanal",
  personalizada: "Personalizado",
} as const;

interface HabitoCardProps {
  bloco: Bloco;
  habitos: HabitoComProgresso[];
  nucleoId: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function HabitoCard({
  bloco,
  habitos,
  nucleoId,
  onEdit,
  onDelete,
}: HabitoCardProps) {
  const { registrar, isRegistrando } = useHabitos();

  return (
    <Card className="group relative hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-1.5">
            <Flame className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base font-medium">
            {bloco.titulo || "Hábitos"}
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
        {habitos.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Nenhum hábito cadastrado ainda.
          </p>
        ) : (
          habitos.map((habito) => (
            <div
              key={habito.id}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => registrar(habito.id)}
                  disabled={isRegistrando}
                  className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                  title="Registrar conclusão"
                >
                  {habito.completoHoje ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </button>
                <span className="text-sm truncate">{habito.nome}</span>
              </div>
              <Badge variant="secondary" className="shrink-0 text-xs">
                {FREQUENCIA_LABEL[habito.frequencia]}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
