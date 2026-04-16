"use client";

import Link from "next/link";
import { MoreHorizontal, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TIPO_BLOCO_META } from "@/lib/bloco-utils";
import type { Bloco } from "@/types/bloco";

interface BlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete?: () => void;
  onEdit?: () => void;
  isDeleting?: boolean;
}

export function BlocoCard({
  bloco,
  nucleoId,
  onDelete,
  onEdit,
  isDeleting,
}: BlocoCardProps) {
  const { icon: IconComponent, rotulo } = TIPO_BLOCO_META[bloco.tipo];
  const tituloExibicao = bloco.titulo || rotulo;

  return (
    <Card className="group relative hover:shadow-md transition-shadow">
      <Link
        href={`/dashboard/nucleos/${nucleoId}/blocos/${bloco.id}`}
        className="absolute inset-0 z-0"
        aria-label={`Abrir bloco ${tituloExibicao}`}
      />
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div
            className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
            title="Arraste para reordenar"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="rounded-md bg-primary/10 p-1.5">
            <IconComponent className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-base font-medium">
            {tituloExibicao}
          </CardTitle>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative z-10 h-8 w-8"
              disabled={isDeleting}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-20">
            <DropdownMenuItem onClick={onEdit}>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive"
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          {TIPO_BLOCO_META[bloco.tipo].descricao}
        </p>
        {/* Aqui futuramente pode exibir uma prévia (ex: 3 tarefas pendentes) */}
      </CardContent>
    </Card>
  );
}
