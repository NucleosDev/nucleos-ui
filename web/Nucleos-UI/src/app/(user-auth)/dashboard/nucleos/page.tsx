"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NucleoGrid } from "@/components/nucleo/nucleo-grid";
import { CreateNucleoModal } from "@/components/nucleo/nucleo-create-modal";
import { Button } from "@/components/ui/button";
import { Plus, Aperture, Sparkles, Layers, Zap } from "lucide-react";
import { useNucleos } from "@/hooks/useNucleo";
import { adaptNucleoToComStats } from "@/utils/nucleo-adapter";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion, AnimatePresence } from "framer-motion";
import type { NucleoComStats } from "@/types/nucleo";
import { useGamificationDerived } from "@/hooks/useGamificationDerived";
import { computeXpStats } from "@/services/gamificacao.service";

export default function Nucleos() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: nucleos, isLoading, remove, update } = useNucleos();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { xpPerNucleo } = useGamificationDerived();

  const nucleosComStats: NucleoComStats[] =
    nucleos?.map((n) => {
      const base = adaptNucleoToComStats(n);
      const xpTotal = xpPerNucleo[n.id] ?? 0;
      const { level, currentXp, nextLevelXp } = computeXpStats(xpTotal);
      return { ...base, xpTotal, level, currentXp, nextLevelXp };
    }) ?? [];

  const handleNucleoClick = (nucleo: NucleoComStats) =>
    router.push(`/dashboard/nucleos/${nucleo.id}`);

  const handleUpdate = async (id: string, payload: any): Promise<void> => {
    await update({ id, payload });
  };

  const handleDelete = async (nucleo: NucleoComStats) => {
    try {
      await remove(nucleo.id);
    } catch {}
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-5 md:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8">
            <Aperture className="h-3.5 w-3.5 text-primary" />
          </div>
          <h1 className="text-sm font-semibold tracking-tight">Núcleos</h1>
          {nucleosComStats.length > 0 && (
            <span className="text-xs text-muted-foreground/50 tabular-nums">
              {nucleosComStats.length}
            </span>
          )}
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Novo Núcleo
        </button>
      </div>

      {/* Grid */}
      <div className="px-5 md:px-6 py-6">
        {isLoading ? (
          <NucleoGridSkeleton />
        ) : nucleosComStats.length === 0 ? (
          <EmptyState onCreateClick={() => setIsCreateModalOpen(true)} />
        ) : (
          <NucleoGrid
            nucleos={nucleosComStats}
            loading={isLoading}
            onNucleoClick={handleNucleoClick}
            onNucleoUpdate={handleUpdate}
            onNucleoDelete={handleDelete}
            onAddNucleo={() => setIsCreateModalOpen(true)}
          />
        )}
      </div>

      {/* Mobile FAB */}
      <AnimatePresence>
        {isMobile && nucleosComStats.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-transform"
          >
            <Plus className="h-4 w-4 shrink-0" />
            Novo
          </motion.button>
        )}
      </AnimatePresence>

      <CreateNucleoModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}

function NucleoGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border/30 bg-card/50 animate-pulse overflow-hidden"
        >
          <div className="h-[140px] bg-muted/50" />
          <div className="p-5 space-y-3">
            <div className="h-5 w-3/4 bg-muted/50 rounded" />
            <div className="h-3 w-1/2 bg-muted/50 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 md:py-24 text-center px-4"
    >
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <Layers className="h-10 w-10 text-primary/40" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold mb-2">Nenhum Núcleo ainda</h2>
      <p className="text-muted-foreground text-sm md:text-base max-w-md mb-8">
        Crie seu primeiro Núcleo para começar a organizar suas tarefas, hábitos e
        projetos.
      </p>

      <Button
        onClick={onCreateClick}
        size="lg"
        className="rounded-xl shadow-lg"
      >
        <Plus className="h-5 w-5 mr-2" />
        Criar meu primeiro Núcleo
      </Button>

      <div className="mt-12 grid gap-4 sm:grid-cols-3 max-w-lg w-full">
        {[
          { icon: Layers, title: "Blocos", desc: "Tarefas, listas, calendário e mais" },
          { icon: Zap, title: "Gamificação", desc: "Ganhe XP e desbloqueie conquistas" },
          { icon: Sparkles, title: "AI Insights", desc: "Sugestões inteligentes para você" },
        ].map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-border/30 bg-card/50 text-center"
          >
            <item.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
