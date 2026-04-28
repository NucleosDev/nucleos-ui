"use client";

import { Button } from "@/components/ui/button";
import { Layers, Pencil, Trash2, Copy, Plus } from "lucide-react";
import type { Bloco } from "@/types/bloco";

interface BlocoHoverActionsProps {
  bloco: Bloco;
  nucleoId: string;
  onOpenFullPage?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onAddBelow?: () => void;
  onEdit?: () => void;
  isDeleting?: boolean;
}

export function BlocoHoverActions({
  onOpenFullPage,
  onDelete,
  onDuplicate,
  onAddBelow,
  onEdit,
  isDeleting = false,
}: BlocoHoverActionsProps) {
  return (
    <div className="absolute -top-3 right-2 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {/* Abrir em tela cheia */}
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 bg-background shadow-sm hover:bg-accent"
        onClick={onOpenFullPage}
        title="Abrir em tela cheia"
      >
        <Layers className="h-3.5 w-3.5" />
      </Button>

      {/* Editar - abre edição inline no card */}
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 bg-background shadow-sm hover:bg-accent"
        onClick={onEdit}
        title="Editar nome"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>

      {/* Duplicar */}
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 bg-background shadow-sm hover:bg-accent"
        onClick={onDuplicate}
        title="Duplicar"
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>

      {/* Adicionar bloco abaixo */}
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 bg-background shadow-sm hover:bg-accent"
        onClick={onAddBelow}
        title="Adicionar bloco abaixo"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>

      {/* Excluir */}
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 bg-background shadow-sm text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={onDelete}
        disabled={isDeleting}
        title="Excluir"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
