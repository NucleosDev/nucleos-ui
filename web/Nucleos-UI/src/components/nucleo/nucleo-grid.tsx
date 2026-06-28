// src/components/nucleo/nucleo-grid.tsx
"use client";

import { cn } from "@/lib/utils";
import { NucleoCard } from "./nucleo-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

function AddCard({ onClick }: { onClick?: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full h-full min-h-[180px] rounded-2xl",
        "border border-dashed border-border hover:border-primary/40",
        "flex flex-col items-center justify-center gap-2",
        "bg-transparent hover:bg-primary/[0.03]",
        "transition-[background,border-color] duration-[var(--duration-base)]",
        "cursor-pointer group",
      )}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-primary/8 group-hover:bg-primary/12 transition-colors">
        <Plus className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors" />
      </div>
      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        Novo Núcleo
      </span>
    </motion.button>
  );
}

export function NucleoGrid({
  nucleos,
  loading = false,
  onNucleoClick,
  onNucleoDelete,
  onAddNucleo,
  className,
}: NucleoGridProps) {

  /* ── Loading ─────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <NucleoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  /* ── Empty state ─────────────────────────────────────────────────────── */
  if (nucleos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center py-20 px-6"
      >
        <div className="h-14 w-14 rounded-[var(--radius-xl)] bg-muted/60 flex items-center justify-center mb-5">
          <FolderOpen className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1.5">
          Nenhum Núcleo ainda
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed mb-6">
          Crie seu primeiro Núcleo para começar a organizar suas ideias, projetos e hábitos.
        </p>
        {onAddNucleo && (
          <button
            onClick={onAddNucleo}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)]",
              "bg-primary text-primary-foreground text-sm font-medium",
              "hover:opacity-90 transition-opacity",
            )}
          >
            <Plus className="h-4 w-4" />
            Criar primeiro Núcleo
          </button>
        )}
      </motion.div>
    );
  }

  /* ── Grid ────────────────────────────────────────────────────────────── */
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="grid"
        variants={container}
        initial="hidden"
        animate="show"
        className={cn(
          "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          className,
        )}
      >
        {nucleos.map((nucleo) => (
          <NucleoCard
            key={nucleo.id}
            nucleo={nucleo}
            onClick={() => onNucleoClick?.(nucleo)}
            onDelete={onNucleoDelete ? () => onNucleoDelete(nucleo) : undefined}
          />
        ))}
        {onAddNucleo && <AddCard onClick={onAddNucleo} />}
      </motion.div>
    </AnimatePresence>
  );
}

function NucleoCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/50 overflow-hidden bg-card">
      <Skeleton className="h-[180px] w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}
