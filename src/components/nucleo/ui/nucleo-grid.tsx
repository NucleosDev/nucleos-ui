// src/components/nucleo/ui/nucleo-grid.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NucleoCard } from "./nucleo-card";
import { NucleoCardCompact } from "./nucleo-card-mini";
import { NucleoCoreCard } from "./nucleo-core-card";
import { EditNucleoModal } from "./edit-nucleo-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FolderOpen, LayoutGrid, List } from "lucide-react";
import type { NucleoComStats } from "@/types/nucleo";

interface NucleoGridProps {
  nucleos: NucleoComStats[];
  loading?: boolean;
  onNucleoClick?: (nucleo: NucleoComStats) => void;
  onNucleoUpdate?: (id: string, data: any) => Promise<void>;
  onNucleoDelete?: (nucleo: NucleoComStats) => void;
  onAddNucleo?: () => void;
  className?: string;
}

type LayoutMode = "grid" | "list";

export function NucleoGrid({
  nucleos,
  loading = false,
  onNucleoClick,
  onNucleoUpdate,
  onNucleoDelete,
  onAddNucleo,
  className,
}: NucleoGridProps) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid");
  const [editingNucleo, setEditingNucleo] = useState<NucleoComStats | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (nucleo: NucleoComStats) => {
    setEditingNucleo(nucleo);
    setIsEditModalOpen(true);
  };

  const adaptNucleo = (nucleo: any): NucleoComStats => ({
    ...nucleo,
    xpTotal: nucleo.xpTotal ?? 0,
    level: nucleo.level ?? 1,
    nextLevelXp: nucleo.nextLevelXp ?? 1000,
    currentXp: nucleo.currentXp ?? 0,
    conquistas: nucleo.conquistas ?? 0,
    xpHoje: nucleo.xpHoje ?? 0,
    blocos:
      nucleo.blocos?.map((b: any) => ({ ...b, titulo: b.titulo ?? null })) ??
      [],
    relations: nucleo.relations ?? [],
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="hidden sm:flex justify-end gap-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
        </div>
        <div className="block sm:hidden space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
        <div className="hidden sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <NucleoCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (nucleos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <FolderOpen className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhum Nucleo encontrado</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          Crie seu primeiro Nucleo para começar a organizar suas tarefas,
          hábitos e muito mais.
        </p>
        {onAddNucleo && (
          <Button onClick={onAddNucleo}>
            <Plus className="size-4 mr-2" />
            Criar primeiro Nucleo
          </Button>
        )}
      </div>
    );
  }

  const addCard = (
    <div
      key="add-card"
      className="cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/20 p-6 text-center transition-all hover:border-primary/50 hover:bg-muted/30"
      onClick={onAddNucleo}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="rounded-full bg-primary/10 p-3">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <p className="mt-2 text-sm font-medium">Novo Nucleo</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="hidden sm:flex justify-end gap-2">
        <Button
          variant={layoutMode === "grid" ? "default" : "outline"}
          size="sm"
          onClick={() => setLayoutMode("grid")}
        >
          <LayoutGrid className="h-4 w-4 mr-1" /> Grid
        </Button>
        <Button
          variant={layoutMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setLayoutMode("list")}
        >
          <List className="h-4 w-4 mr-1" /> Lista
        </Button>
      </div>

      {/* Mobile */}
      <div className="block sm:hidden space-y-2">
        {nucleos.map((nucleo) => (
          <NucleoCardCompact
            key={nucleo.id}
            nucleo={adaptNucleo(nucleo)}
            onClick={() => onNucleoClick?.(nucleo)}
            onEdit={() => handleEdit(nucleo)}
            onDelete={() => onNucleoDelete?.(nucleo)}
          />
        ))}
        {addCard}
      </div>

      {/* Desktop */}
      <div className="hidden sm:block">
        {layoutMode === "grid" ? (
          <div
            className={cn(
              "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
              className,
            )}
          >
            {nucleos.map((nucleo) => (
              <NucleoCard
                key={nucleo.id}
                nucleo={adaptNucleo(nucleo)}
                onClick={() => onNucleoClick?.(nucleo)}
                onEdit={() => handleEdit(nucleo)}
                onDelete={() => onNucleoDelete?.(nucleo)}
              />
            ))}
            {addCard}
          </div>
        ) : (
          <div className="space-y-2">
            {nucleos.map((nucleo) => (
              <NucleoCoreCard
                key={nucleo.id}
                nucleo={adaptNucleo(nucleo)}
                onClick={() => onNucleoClick?.(nucleo)}
                onEdit={() => handleEdit(nucleo)}
                onDelete={() => onNucleoDelete?.(nucleo)}
              />
            ))}
            <div className="mt-4">{addCard}</div>
          </div>
        )}
      </div>

      <EditNucleoModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        nucleo={editingNucleo}
        onUpdate={onNucleoUpdate || (async () => {})}
      />
    </div>
  );
}

function NucleoCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Skeleton className="h-24 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-2 w-full" />
      </div>
    </div>
  );
}
