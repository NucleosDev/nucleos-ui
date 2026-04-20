"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, LayoutGrid, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NucleoCard } from "./nucleo-card";
import { NucleoCardCompact } from "./nucleo-card-mini";
import { NucleoCoreCard } from "./nucleo-core-card";
import { CreateNucleoModal } from "./nucleo-create-modal";
import { EditNucleoModal } from "./edit-nucleo-modal";
import { useNucleos } from "@/hooks/useNucleo";
import type { NucleoComStats } from "@/types/nucleo";

type LayoutMode = "grid" | "list";

export function NucleosResponsive() {
  const { data: nucleos = [], isLoading, remove, update } = useNucleos();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingNucleo, setEditingNucleo] = useState<NucleoComStats | null>(
    null,
  );
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid");
  const router = useRouter();

  const handleNucleoClick = (id: string) => {
    router.push(`/dashboard/nucleos/${id}`);
  };

  const handleEditNucleo = (nucleo: NucleoComStats) => {
    setEditingNucleo(nucleo);
    setEditModalOpen(true);
  };

  const handleUpdateNucleo = async (id: string, payload: any) => {
    await update({ id, payload });
  };

  const handleDeleteNucleo = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este Nucleo?")) {
      try {
        await remove(id);
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir Nucleo. Tente novamente.");
      }
    }
  };

  // Adaptador para garantir compatibilidade de tipos
  const adaptNucleo = (nucleo: any): NucleoComStats => ({
    ...nucleo,
    xpTotal: nucleo.xpTotal ?? 0,
    level: nucleo.level ?? 1,
    nextLevelXp: nucleo.nextLevelXp ?? 1000,
    currentXp: nucleo.currentXp ?? 0,
    conquistas: nucleo.conquistas ?? 0,
    xpHoje: nucleo.xpHoje ?? 0,
    conquistasDesbloqueadas: nucleo.conquistasDesbloqueadas ?? 0,
    blocos:
      nucleo.blocos?.map((b: any) => ({ ...b, titulo: b.titulo ?? null })) ??
      [],
    relations: nucleo.relations ?? [],
  });

  if (isLoading) {
    return <NucleosResponsiveSkeleton />;
  }

  const emptyState = (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
      <div className="rounded-full bg-primary/10 p-4">
        <Plus className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">Nenhum Nucleo ainda</h3>
      <p className="mt-2 text-muted-foreground">
        Crie seu primeiro Nucleo para começar a organizar suas atividades
      </p>
      <Button onClick={() => setCreateModalOpen(true)} className="mt-6">
        <Plus className="mr-2 h-4 w-4" />
        Criar primeiro Nucleo
      </Button>
    </div>
  );

  const addCard = (
    <Card
      className="group cursor-pointer border-2 border-dashed border-muted-foreground/25 bg-muted/20 transition-all hover:border-primary/50 hover:bg-muted/30"
      onClick={() => setCreateModalOpen(true)}
    >
      <CardContent className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-primary/10 p-4 transition-transform group-hover:scale-110">
          <Plus className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-medium">Criar novo Nucleo</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Organize sua vida em áreas específicas
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Seus Nucleos</h2>
        {/* Botões de layout APENAS em desktop */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant={layoutMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setLayoutMode("grid")}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Grid
          </Button>
          <Button
            variant={layoutMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setLayoutMode("list")}
          >
            <List className="h-4 w-4 mr-1" />
            Lista
          </Button>
        </div>
      </div>

      {nucleos.length === 0 && emptyState}

      {/* MOBILE: sempre lista compacta */}
      <div className="block sm:hidden space-y-2">
        {nucleos.map((nucleo) => (
          <NucleoCardCompact
            key={nucleo.id}
            nucleo={adaptNucleo(nucleo)}
            onClick={() => handleNucleoClick(nucleo.id)}
            onEdit={() => handleEditNucleo(adaptNucleo(nucleo))}
            onDelete={() => handleDeleteNucleo(nucleo.id)}
          />
        ))}
        {nucleos.length > 0 && addCard}
      </div>

      {/* DESKTOP: grid ou lista conforme layoutMode */}
      <div className="hidden sm:block">
        {layoutMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {nucleos.map((nucleo) => (
              <NucleoCard
                key={nucleo.id}
                nucleo={adaptNucleo(nucleo)}
                onClick={() => handleNucleoClick(nucleo.id)}
                onEdit={() => handleEditNucleo(adaptNucleo(nucleo))}
                onDelete={() => handleDeleteNucleo(nucleo.id)}
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
                onClick={() => handleNucleoClick(nucleo.id)}
                onEdit={() => handleEditNucleo(adaptNucleo(nucleo))}
                onDelete={() => handleDeleteNucleo(nucleo.id)}
              />
            ))}
            <div className="mt-4">{addCard}</div>
          </div>
        )}
      </div>

      {/* Modais */}
      <CreateNucleoModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />

      <EditNucleoModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        nucleo={editingNucleo}
        onUpdate={handleUpdateNucleo}
      />
    </div>
  );
}

function NucleosResponsiveSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="hidden sm:flex gap-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
      {/* Mobile skeleton */}
      <div className="block sm:hidden space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
      {/* Desktop skeleton */}
      <div className="hidden sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
