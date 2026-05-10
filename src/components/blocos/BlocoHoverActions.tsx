// src/components/blocos/BlocoHoverActions.tsx
"use client";

import { ExternalLink, Pencil, Trash2, Copy, Plus } from "lucide-react";
import { LiquidGlass } from "@/components/ui/liquid-glass";
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
    <div className="absolute -top-[-30] right-2 z-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <LiquidGlass
        variant="floating"
        radius="12px"
        interactive={false}
        className="flex items-center gap-0.5 px-1 py-1"
      >
        {onOpenFullPage && (
          <button
            onClick={onOpenFullPage}
            title="Abrir em tela cheia"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-white/10 transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        )}

        {onEdit && (
          <button
            onClick={onEdit}
            title="Editar nome"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-white/10 transition-all"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}

        {onDuplicate && (
          <button
            onClick={onDuplicate}
            title="Duplicar"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-white/10 transition-all"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        )}

        {onAddBelow && (
          <button
            onClick={onAddBelow}
            title="Adicionar bloco abaixo"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-white/10 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}

        {onDelete && (
          <button
            onClick={onDelete}
            disabled={isDeleting}
            title="Excluir"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </LiquidGlass>
    </div>
  );
}
