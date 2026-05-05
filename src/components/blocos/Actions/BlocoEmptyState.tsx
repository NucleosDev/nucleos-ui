"use client";

import { Button } from "@/components/ui/button";
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
  icon,
  title,
  description,
  actionLabel = "Adicionar",
  onAction,
}: BlocoEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-muted-foreground mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
