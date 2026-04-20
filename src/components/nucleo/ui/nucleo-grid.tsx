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

type LayoutMode = "grid" | "list";

// Variantes de animação para os cards
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

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
  const [isAnimating, setIsAnimating] = useState(false);

  const handleEdit = (nucleo: NucleoComStats) => {
    setEditingNucleo(nucleo);
    setIsEditModalOpen(true);
  };

  const handleLayoutChange = (mode: LayoutMode) => {
    if (mode === layoutMode || isAnimating) return;
    setIsAnimating(true);
    setLayoutMode(mode);
    setTimeout(() => setIsAnimating(false), 300);
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
        <div className="hidden sm:flex justify-between items-center gap-2">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-16" />
          </div>
          <Skeleton className="h-9 w-28" />
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-lg"
      >
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
      </motion.div>
    );
  }

  const addCard = (
    <motion.div
      key="add-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/20 p-6 text-center transition-all hover:border-primary/50 hover:bg-muted/30"
      onClick={onAddNucleo}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="rounded-full bg-primary/10 p-3 transition-transform group-hover:scale-110">
          <Plus className="h-6 w-6 text-primary" />
        </div>
        <p className="mt-2 text-sm font-medium">Novo Nucleo</p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-4">
      {/* Header com botões de layout e botão Novo Nucleo */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Botões de layout à esquerda */}
        <div className="flex items-center gap-2">
          <Button
            variant={layoutMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => handleLayoutChange("grid")}
            className="gap-1 transition-all duration-200"
            disabled={isAnimating}
          >
            <LayoutGrid
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                layoutMode === "grid" && "scale-110",
              )}
            />
            <span className="hidden sm:inline">Grid</span>
          </Button>
          <Button
            variant={layoutMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => handleLayoutChange("list")}
            className="gap-1 transition-all duration-200"
            disabled={isAnimating}
          >
            <List
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                layoutMode === "list" && "scale-110",
              )}
            />
            <span className="hidden sm:inline">Lista</span>
          </Button>
        </div>

        {/* Botão Novo Nucleo à direita (apenas desktop) */}
        <div className="hidden sm:block">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={onAddNucleo}
              size="sm"
              className="bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white hover:opacity-90 transition shadow-md shadow-primary/20 gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Nucleo</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile - Sempre lista com animação */}
      <div className="block sm:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key="mobile-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {nucleos.map((nucleo, index) => (
              <motion.div
                key={nucleo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <NucleoCardCompact
                  nucleo={adaptNucleo(nucleo)}
                  onClick={() => onNucleoClick?.(nucleo)}
                  onEdit={() => handleEdit(nucleo)}
                  onDelete={() => onNucleoDelete?.(nucleo)}
                />
              </motion.div>
            ))}
            {addCard}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop - Grid ou Lista com animação suave */}
      <div className="hidden sm:block">
        <AnimatePresence mode="wait">
          {layoutMode === "grid" ? (
            <motion.div
              key="grid-layout"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
                className,
              )}
            >
              {nucleos.map((nucleo) => (
                <motion.div
                  key={nucleo.id}
                  variants={cardVariants}
                  layout
                  transition={{ duration: 0.2 }}
                >
                  <NucleoCard
                    nucleo={adaptNucleo(nucleo)}
                    onClick={() => onNucleoClick?.(nucleo)}
                    onEdit={() => handleEdit(nucleo)}
                    onDelete={() => onNucleoDelete?.(nucleo)}
                  />
                </motion.div>
              ))}
              {addCard}
            </motion.div>
          ) : (
            <motion.div
              key="list-layout"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-2"
            >
              {nucleos.map((nucleo) => (
                <motion.div
                  key={nucleo.id}
                  variants={cardVariants}
                  layout
                  transition={{ duration: 0.2 }}
                >
                  <NucleoCoreCard
                    nucleo={adaptNucleo(nucleo)}
                    onClick={() => onNucleoClick?.(nucleo)}
                    onEdit={() => handleEdit(nucleo)}
                    onDelete={() => onNucleoDelete?.(nucleo)}
                  />
                </motion.div>
              ))}
              <motion.div
                variants={cardVariants}
                layout
                transition={{ duration: 0.2 }}
                className="mt-4"
              >
                {addCard}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
