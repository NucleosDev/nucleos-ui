"use client";

import { Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableEmptyStateProps {
  onAddClick: () => void;
}

export function TableEmptyState({ onAddClick }: TableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 rounded-full bg-primary/10 mb-4">
        <Zap className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Tabela vazia
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Comece adicionando seu primeiro item à tabela. Clique no botão abaixo ou
        use o botão &quot;+&quot; no topo.
      </p>
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        Adicionar item
      </Button>
    </div>
  );
}
