// src/app/(user-auth)/dashboard/nucleos/[id]/components/FunctionalBlocksList.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, LayoutGrid, List, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BlocoCard } from "@/components/blocos/BlocoCard";
import { BlocoDeNotas } from "@/components/blocos/cruds/BlocoDeNotas";
import { CalendarioBlocoCard } from "@/components/blocos/cruds/CalendarioBlocoCard";
import { ColecoesBlocoCard } from "@/components/blocos/cruds/ColecoesBlocoCard";
import { HabitosBlocoCard } from "@/components/blocos/cruds/HabitosBlocoCard";
import { ListasBlocoCard } from "@/components/blocos/cruds/ListasBlocoCard";
import { TarefasBlocoCard } from "@/components/blocos/cruds/TarefasBlocoCard";
import { TimersBlocoCard } from "@/components/blocos/cruds/TimersBlocoCard";
import type { Bloco } from "@/types/bloco";

interface FunctionalBlocksListProps {
  blocos: Bloco[];
  isLoading: boolean;
  nucleoId: string;
  onEdit: (bloco: Bloco) => void;
  onDelete: (id: string) => Promise<void>;
  onAddBlock: () => void;
}

export function FunctionalBlocksList({
  blocos,
  isLoading,
  nucleoId,
  onEdit,
  onDelete,
  onAddBlock,
}: FunctionalBlocksListProps) {
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const renderBloco = (bloco: Bloco) => {
    const commonProps = {
      bloco,
      nucleoId,
      onDelete: () => onDelete(bloco.id),
      onEdit: () => onEdit(bloco),
      isDeleting: false,
    };
    const types: Record<string, React.ReactNode> = {
      colecoes: <ColecoesBlocoCard {...commonProps} />,
      lista: <ListasBlocoCard {...commonProps} />,
      tarefas: <TarefasBlocoCard {...commonProps} />,
      calendario: <CalendarioBlocoCard {...commonProps} />,
      timer: <TimersBlocoCard {...commonProps} />,
      timers: <TimersBlocoCard {...commonProps} />,
      habitos: <HabitosBlocoCard {...commonProps} />,
      habito: <HabitosBlocoCard {...commonProps} />,
      notas: (
        <BlocoDeNotas
          bloco={bloco}
          nucleoId={nucleoId}
          onDelete={() => onDelete(bloco.id)}
        />
      ),
    };
    return types[bloco.tipo] || <BlocoCard {...commonProps} />;
  };

  if (blocos.length === 0) {
    return (
      <div
        className="rounded-xl border-2 border-dashed p-12 text-center cursor-pointer hover:border-primary/40 transition-all"
        onClick={onAddBlock}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-primary/10 p-3">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium">Nenhum bloco funcional ainda</p>
            <p className="text-sm text-muted-foreground mt-1">
              Clique para adicionar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Blocos Funcionais
        </h2>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center border rounded-md">
            <Button
              variant={layoutMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => setLayoutMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={layoutMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => setLayoutMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={onAddBlock} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "gap-4",
          layoutMode === "grid"
            ? "grid sm:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col",
        )}
      >
        {blocos.map((bloco) => (
          <motion.div key={bloco.id} layout>
            {renderBloco(bloco)}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
