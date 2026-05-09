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
  return (
    <div className="absolute -top-3 right-2 z-20 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      {onOpenFullPage && (
        <button
          onClick={onOpenFullPage}
          title="Abrir em tela cheia"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-background border border-border/50 text-muted-foreground/60 shadow-[var(--shadow-xs)] hover:text-foreground hover:border-border/80 hover:shadow-[var(--shadow-sm)] transition-all"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      )}

      {onEdit && (
        <button
          onClick={onEdit}
          title="Editar nome"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-background border border-border/50 text-muted-foreground/60 shadow-[var(--shadow-xs)] hover:text-foreground hover:border-border/80 hover:shadow-[var(--shadow-sm)] transition-all"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}

      {onDuplicate && (
        <button
          onClick={onDuplicate}
          title="Duplicar"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-background border border-border/50 text-muted-foreground/60 shadow-[var(--shadow-xs)] hover:text-foreground hover:border-border/80 hover:shadow-[var(--shadow-sm)] transition-all"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      )}

      {onAddBelow && (
        <button
          onClick={onAddBelow}
          title="Adicionar bloco abaixo"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-background border border-border/50 text-muted-foreground/60 shadow-[var(--shadow-xs)] hover:text-foreground hover:border-border/80 hover:shadow-[var(--shadow-sm)] transition-all"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          disabled={isDeleting}
          title="Excluir"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-background border border-border/50 shadow-[var(--shadow-xs)] text-muted-foreground/60 hover:text-destructive hover:border-destructive/40 hover:bg-destructive/5 hover:shadow-[var(--shadow-sm)] transition-all disabled:opacity-40"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
