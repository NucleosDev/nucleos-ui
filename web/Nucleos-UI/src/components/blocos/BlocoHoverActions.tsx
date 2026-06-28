// src/components/blocos/BlocoHoverActions.tsx
"use client";

import { ExternalLink, Pencil, Trash2, Copy, Plus } from "lucide-react";
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
  const hasActions =
    onOpenFullPage || onEdit || onDuplicate || onAddBelow || onDelete;

  if (!hasActions) return null;

  return (
    <div className="absolute -top-[-14px] left-[85%] -translate-x-1/2 z-30 [@media(hover:hover)]:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <div className="flex flex-row items-center gap-0.5 px-1 py-1 bg-black/20 backdrop-blur-md rounded-xl border border-/20 shadow-lg">
        {onOpenFullPage && (
          <button
            onClick={onOpenFullPage}
            title="Abrir em tela cheia"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground/60 hover:text-foreground hover:/10 transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        )}

        {onEdit && (
          <button
            onClick={onEdit}
            title="Editar nome"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground/60 hover:text-foreground hover:/10 transition-all"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}

        {onDuplicate && (
          <button
            onClick={onDuplicate}
            title="Duplicar"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground/60 hover:text-foreground hover:/10 transition-all"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}

        {onAddBelow && (
          <button
            onClick={onAddBelow}
            title="Adicionar bloco abaixo"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground/60 hover:text-foreground hover:/10 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            disabled={isDeleting}
            title="Excluir"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
