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
import { LiquidGlass } from "../ui/liquid-glass";
import { motion } from "framer-motion";
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
        <LiquidGlass
          variant="button"
          radius="var(--radius-md)"
          onClick={() => router.push("/dashboard/nucleos")}
          className="hidden sm:inline-flex text-sm p-1.2 font-medium text-"
        >
          <span className="flex items-center gap-2 px-3.5 py-2">
            <ArrowRight className="h-3.5 w-3.5" />
            Ver todos
          </span>
        </LiquidGlass>
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
          <CreateNucleoCard onClick={() => setCreateModalOpen(true)} />
        </div>
      )}

      <CreateNucleoModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
}

function CreateNucleoCard({ onClick }: { onClick: () => void }) {
  return (
    <LiquidGlass
      radius="26px"
      variant="default"
      className="w-full rounded-2xl cursor-pointer"
      onClick={onClick}
    >
      <div className="group relative isolate overflow-hidden rounded-2xl transition-all duration-300 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
        <svg
          width="0"
          height="0"
          className="absolute pointer-events-none"
          aria-hidden="true"
        >
          <defs>
            <clipPath
              id="nucleo-wave-clip-create"
              clipPathUnits="objectBoundingBox"
            >
              <path d="M 0 0 L 1 0 L 1 0.85 C 0.68 1, 0.30 0.55, 0 0.775 Z" />
            </clipPath>
          </defs>
        </svg>

        {/* Image area */}
        <div
          className="relative w-full overflow-hidden h-[200px]"
          style={{
            clipPath: "url(#nucleo-wave-clip-create)",
            WebkitClipPath: "url(#nucleo-wave-clip-create)",
          }}
        >
          <div
            className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, rgba(107,114,128,0.22) 0%, rgba(75,85,99,0.15) 40%, rgba(31,41,55,0.30) 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, oklch(1 0 0) 0px, oklch(1 0 0) 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, oklch(1 0 0) 0px, oklch(1 0 0) 1px, transparent 1px, transparent 28px)`,
              }}
            />
          </div>

          {/* Overlay gradiente — igual ao NucleoCard */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-card/95 via-card/50 to-transparent" />

          {/* Hover overlay — IDÊNTICO ao NucleoCard */}
          <div
            className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: "rgba(0,0,0,0.28)",
              backdropFilter: "blur(4px) saturate(120%)",
              WebkitBackdropFilter: "blur(4px) saturate(120%)",
            }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium"
              style={{
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(14px) saturate(160%)",
                WebkitBackdropFilter: "blur(14px) saturate(160%)",
                border: "1px solid rgba(255,255,255,0.30)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.30), 0 4px 16px rgba(0,0,0,0.18)",
              }}
            >
              <Plus className="h-4 w-4" />
              Criar novo Núcleo
            </motion.button>
          </div>
        </div>

        {/* Floating "?" icon — mesma posição do NucleoCard */}
        <div className="absolute z-30 left-12" style={{ top: "122px" }}>
          <div className="relative inline-flex">
            <div
              className="absolute inset-0 rounded-2xl blur-xl opacity-55"
              style={{ background: "rgba(107,114,128,0.5)" }}
            />
            <div
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background:
                  "linear-gradient(145deg, rgba(107,114,128,0.55), rgba(75,85,99,0.40))",
                border: "1.5px solid rgba(255,255,255,0.12)",
                boxShadow:
                  "inset 0 1.5px 0 rgba(255,255,255,0.18), 0 8px 20px rgba(0,0,0,0.14)",
              }}
            >
              <span className="text-2xl font-bold text-foreground/35 select-none">
                ?
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold leading-tight tracking-tight text-foreground/25 line-clamp-1 blur-[3px] select-none pointer-events-none">
              Novo Núcleo
            </h3>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2 blur-sm opacity-20 select-none pointer-events-none">
            <div className="flex items-center gap-1 rounded-full bg-muted/40 px-2.5 py-0.5">
              <span className="text-xs font-medium">● ● ●</span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-muted/40 px-2.5 py-0.5">
              <span className="text-xs font-medium">● ●</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-2.5">
              <Plus className="h-4 w-4 text-foreground/40 group-hover:text-primary transition-colors duration-300" />
              <span className="text-sm font-semibold text-foreground/40 group-hover:text-primary transition-colors duration-300"></span>
            </div>
          </div>
        </div>
      </div>
    </LiquidGlass>
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
      <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2s">
        <button
          onClick={onCreateClick}
          className="mt-6 flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity shadow-[var(--shadow-xs)]"
        >
          <Plus className="h-4 w-4" />
          Criar primeiro Nucleo
        </button>
      </div>
    </div>
  );
}

function NucleosGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-[200px] rounded-[var(--radius-lg)] overflow-hidden border border-border/40"
        >
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
