"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth";
import { NucleoGrid } from "@/components/nucleo/nucleo-grid";
import { CreateNucleoModal } from "@/components/nucleo/nucleo-create-modal";
import { useNucleos } from "@/hooks/useNucleo";
import { adaptNucleoToComStats } from "@/utils/nucleo-adapter";
import { useMediaQuery } from "@/hooks/use-media-query";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import type { NucleoComStats } from "@/types/nucleo";
import { LiquidGlass } from "@/components/ui/liquid-glass";

export default function Nucleos() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: nucleos, isLoading, remove, update } = useNucleos();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const nucleosComStats: NucleoComStats[] =
    nucleos?.map(adaptNucleoToComStats) ?? [];

  const handleNucleoClick = (nucleo: NucleoComStats) =>
    router.push(`/dashboard/nucleos/${nucleo.id}`);

  const handleUpdate = async (id: string, payload: any): Promise<void> => {
    await update({ id, payload });
  };

  const handleDelete = async (nucleo: NucleoComStats) => {
    if (confirm(`Excluir "${nucleo.nome}"? Esta ação não pode ser desfeita.`)) {
      try {
        await remove(nucleo.id);
      } catch {}
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Page header */}
      <div className="px-5 md:px-7 pt-7 pb-5 flex items-end justify-between gap-4 border-b border-border/40">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">
            Núcleos
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {user?.fullName?.split(" ")[0]
              ? `Olá, ${user.fullName.split(" ")[0]}`
              : "Meus Núcleos"}
          </h1>
        </div>

        <LiquidGlass
          variant="button"
          radius="var(--radius-md)"
          onClick={() => setIsCreateModalOpen(true)}
          className="hidden sm:inline-flex text-sm font-medium text-"
        >
          <span className="flex items-center gap-2 px-3.5 py-2">
            <Plus className="h-3.5 w-3.5" />
            Novo Núcleo
          </span>
        </LiquidGlass>
      </div>

      {/* Grid */}
      <div className="px-5 md:px-7 py-6">
        <NucleoGrid
          nucleos={nucleosComStats}
          loading={isLoading}
          onNucleoClick={handleNucleoClick}
          onNucleoUpdate={handleUpdate}
          onNucleoDelete={handleDelete}
          onAddNucleo={() => setIsCreateModalOpen(true)}
        />
      </div>

      {/* Mobile FAB */}
      <AnimatePresence>
        {isMobile && (
          <LiquidGlass
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full text-foreground shadow-[var(--shadow-lg)] text-sm font-medium active:scale-95 transition-transform"
          >
            <Plus className="h-4 w-4 shrink-0" />
            Novo
          </LiquidGlass>
        )}
      </AnimatePresence>

      <CreateNucleoModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
