"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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

export function NucleosOverview({ limit }: Props) {
  const { data: nucleos = [], isLoading, remove } = useNucleos();
  let filteredNucleos = [...nucleos].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
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
        <button
          onClick={() => router.push("/dashboard/nucleos")}
          className="group flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-[var(--duration-fast)]"
        >
          <span>Ver todos</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
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
    <button
      onClick={onClick}
      className="group h-full min-h-[200px] w-full cursor-pointer rounded-[var(--radius-lg)] border-2 border-dashed border-border/40 bg-muted/10 hover:border-primary/40 hover:bg-muted/20 transition-all duration-[var(--duration-base)] flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="rounded-full bg-primary/10 p-4 transition-transform duration-[var(--duration-base)] group-hover:scale-110">
        <Plus className="h-7 w-7 text-primary" />
      </div>
      <p className="mt-4 text-sm font-medium text-foreground/70">Criar novo Nucleo</p>
      <p className="mt-1 text-xs text-muted-foreground/50">Organize sua vida em áreas específicas</p>
    </button>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border-2 border-dashed border-border/40 bg-muted/10 p-12 text-center">
      <div className="rounded-full bg-primary/10 p-4">
        <Plus className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mt-6 text-xl font-semibold">Nenhum Nucleo ainda</h3>
      <p className="mt-2 text-sm text-muted-foreground/60">
        Crie seu primeiro Nucleo para começar a organizar suas atividades
      </p>
      <button
        onClick={onCreateClick}
        className="mt-6 flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shadow-[var(--shadow-xs)]"
      >
        <Plus className="h-4 w-4" />
        Criar primeiro Nucleo
      </button>
    </div>
  );
}

function NucleosGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-[200px] rounded-[var(--radius-lg)] overflow-hidden border border-border/40">
          <div className="h-1.5 w-full bg-muted" />
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
