"use client";

import { Plus } from "lucide-react";
import { ReactNode } from "react";

interface BlocoEmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function BlocoEmptyState({
  icon, title, description, actionLabel = "Adicionar", onAction,
}: BlocoEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4 text-muted-foreground/40">{icon}</div>
      <h3 className="text-sm font-semibold text-foreground/80 text-center mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground/60 text-center mb-5 max-w-xs">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Plus className="h-3 w-3" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
