"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NucleoCard } from "./nucleo-card";
import { CreateNucleoModal } from "./nucleo-create-modal";
import { ROUTES } from "@/constants/routes";
import { useNucleos } from "@/hooks/useNucleo";
import type { NucleoComStats } from "@/types/nucleo";
import { ArrowRight } from "lucide-react";

type Props = {
  limit?: number;
  variant?: "all" | "recent";
};

export function NucleosOverview({ limit, variant = "all" }: Props) {
  const { data: nucleos = [], isLoading, remove, isDeleting } = useNucleos();
  const today = new Date();
  let filteredNucleos = [...nucleos];
  // APENAS OS CARDS RECENTES, CRIADOS NO DASHBOARD
  if (variant === "recent") {
    filteredNucleos = filteredNucleos
      .filter((n) => {
        const created = new Date(n.createdAt);
        const usedToday = false;

        const createdRecently =
          created >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        return usedToday || createdRecently;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
  if (limit) {
    filteredNucleos = filteredNucleos.slice(0, limit);
  }
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const router = useRouter();

  const handleNucleoClick = (id: string) => {
    router.push(ROUTES.NUCLEO_DETAIL(id));
  };

  const handleEditNucleo = (id: string) => {
    router.push(ROUTES.NUCLEO_EDIT(id));
  };

  const handleDeleteNucleo = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este Nucleo?")) {
      try {
        await remove(id);
        alert("Nucleo excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir Nucleo. Tente novamente.");
      }
    }
  };

  if (isLoading) {
    return <NucleosGridSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-gradient-to-b from-[#4D7CFF] to-[#00C9A7] rounded-full" />
          <h2 className="text-2xl font-bold tracking-tight">
            Nucleos Recentes
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/nucleos")}
          className="group gap-1.5 text-muted-foreground hover:text-background transition-all duration-300"
        >
          <span>Ver todos</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>

      {nucleos.length === 0 ? (
        <EmptyState onCreateClick={() => setCreateModalOpen(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredNucleos.map((nucleo) => {
            const nucleoComStats = {
              ...nucleo,
              xpTotal: 1,
              level: 1,
              nextLevelXp: 1,
              currentXp: 1,
              conquistas: 1,
              conquistasDesbloqueadas: 0,
              energyTotal: 0,
              xpHoje: 1,
              blocos: nucleo.blocos || [],
              relations: nucleo.relations || [],
            } as NucleoComStats;
            return (
              <NucleoCard
                key={nucleo.id}
                nucleo={nucleoComStats}
                onClick={() => handleNucleoClick(nucleo.id)}
                onEdit={() => handleEditNucleo(nucleo.id)}
                onDelete={() => handleDeleteNucleo(nucleo.id)}
              />
            );
          })}
          <AddNucleoCard onClick={() => setCreateModalOpen(true)} />
        </div>
      )}

      <CreateNucleoModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
}

function AddNucleoCard({ onClick }: { onClick: () => void }) {
  return (
    <Card
      className="group h-full min-h-[280px] cursor-pointer border-2 border-dashed border-muted-foreground/25 bg-muted/20 transition-all hover:border-primary/50 hover:bg-muted/30"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
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
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/20 p-12 text-center">
      <div className="rounded-full bg-primary/10 p-4">
        <Plus className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">Nenhum Nucleo ainda</h3>
      <p className="mt-2 text-muted-foreground">
        Crie seu primeiro Nucleo para começar a organizar suas atividades
      </p>
      <Button onClick={onCreateClick} className="mt-6">
        <Plus className="mr-2 h-4 w-4" />
        Criar primeiro Nucleo
      </Button>
    </div>
  );
}

function NucleosGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="h-[280px] overflow-hidden">
          <div className="h-2 w-full bg-muted" />
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
            <div className="mt-6 space-y-2">
              <Skeleton className="h-2 w-full" />
              <div className="grid grid-cols-3 gap-2 pt-2">
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
