"use client";

import { useState } from "react";
import { CalendarioCard } from "@/components/calendario/CalendarioCard";
import { useCalendario } from "@/hooks/useCalendario";
import { useNucleos } from "@/hooks/useNucleo";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { Nucleo } from "@/types/nucleo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CalendarioPage() {
  const { data: nucleos = [], isLoading: nucleosLoading } = useNucleos();
  const [selectedNucleoId, setSelectedNucleoId] = useState<string | null>(null);

  const {
    eventos,
    isLoading: eventosLoading,
    criar,
    atualizar,
    excluir,
    isCreating,
    isUpdating,
  } = useCalendario(selectedNucleoId ?? undefined);

  const handleAddEvento = async (
    data: Date,
    titulo: string,
    descricao?: string,
    duracaoMinutos?: number,
  ) => {
    if (!selectedNucleoId) {
      toast({ title: "Selecione um Núcleo primeiro", variant: "destructive" });
      return;
    }
    try {
      await criar({
        nucleoId: selectedNucleoId,
        titulo,
        descricao,
        dataEvento: data.toISOString(),
        duracaoMinutos,
      });
      toast({ title: "Evento criado!" });
    } catch (e: any) {
      toast({ title: "Erro ao criar evento", description: e?.message, variant: "destructive" });
      throw e;
    }
  };

  const handleUpdateEvento = async (
    id: string,
    titulo: string,
    descricao?: string,
    duracaoMinutos?: number,
    dataEvento?: Date,
  ) => {
    try {
      const payload: any = { titulo, descricao, duracaoMinutos };
      if (dataEvento) payload.dataEvento = dataEvento.toISOString();
      await atualizar({ id, payload });
      toast({ title: "Evento atualizado!" });
    } catch (e: any) {
      toast({ title: "Erro ao atualizar evento", description: e?.message, variant: "destructive" });
      throw e;
    }
  };

  const handleDeleteEvento = async (id: string) => {
    try {
      await excluir(id);
      toast({ title: "Evento excluído!" });
    } catch (e: any) {
      toast({ title: "Erro ao excluir evento", description: e?.message, variant: "destructive" });
      throw e;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-5 md:px-6 h-14 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
          </div>
          <h1 className="text-sm font-semibold tracking-tight">Calendário</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-8 max-w-4xl mx-auto">
        {!selectedNucleoId ? (
          <EmptyCalendarState
            nucleosCount={(nucleos as Nucleo[]).length}
            nucleos={nucleos as Nucleo[]}
            nucleosLoading={nucleosLoading}
            onSelect={setSelectedNucleoId}
          />
        ) : (
          <motion.div
            key={selectedNucleoId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[var(--radius-lg)] border border-border/50 bg-card/60 backdrop-blur-sm p-5 md:p-7"
          >
            <CalendarioCard
              eventos={eventos ?? []}
              isLoading={eventosLoading}
              onAddEvento={handleAddEvento}
              onUpdateEvento={handleUpdateEvento}
              onDeleteEvento={handleDeleteEvento}
              isSubmitting={isCreating || isUpdating}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

/**
 * Dropdown de seleção de Núcleo, reaproveitado tanto no header
 * quanto no empty state — garante o mesmo comportamento nos dois lugares.
 */
function NucleoDropdown({
  nucleos,
  nucleosLoading,
  selectedNucleoId,
  onSelect,
  trigger,
}: {
  nucleos: Nucleo[];
  nucleosLoading: boolean;
  selectedNucleoId: string | null;
  onSelect: (id: string) => void;
  trigger: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {nucleosLoading ? (
          <div className="p-2 space-y-1.5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-8 rounded-lg" />
            ))}
          </div>
        ) : nucleos.length === 0 ? (
          <div className="px-3 py-4 text-center text-sm text-muted-foreground/60">
            Nenhum Núcleo encontrado
          </div>
        ) : (
          nucleos.map((n) => (
            <DropdownMenuItem
              key={n.id}
              onClick={() => onSelect(n.id)}
              className={cn(
                "gap-2.5",
                selectedNucleoId === n.id && "bg-primary/8 text-primary",
              )}
            >
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ background: n.corDestaque || "var(--primary)" }}
              />
              <span className="flex-1 truncate font-medium">{n.nome}</span>
              {selectedNucleoId === n.id && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function EmptyCalendarState({
  nucleosCount,
  nucleos,
  nucleosLoading,
  onSelect,
}: {
  nucleosCount: number;
  nucleos: Nucleo[];
  nucleosLoading: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl mb-5"
        style={{
          background: "linear-gradient(135deg, oklch(0.58 0.19 245 / 0.12), oklch(0.58 0.19 245 / 0.06))",
          border: "1px solid oklch(0.58 0.19 245 / 0.2)",
        }}
      >
        <CalendarDays className="h-7 w-7 text-primary/70" />
      </div>
      <h2 className="text-base font-semibold mb-1.5">Seu calendário pessoal</h2>
      <p className="text-sm text-muted-foreground/60 max-w-xs mb-6">
        {nucleosCount > 0
          ? "Escolha um Núcleo abaixo para visualizar e criar eventos."
          : "Crie um Núcleo primeiro para começar a usar o calendário."}
      </p>
      {nucleosCount > 0 && (
        <div className="mt-8">
          <NucleoDropdown
            nucleos={nucleos}
            nucleosLoading={nucleosLoading}
            selectedNucleoId={null}
            onSelect={onSelect}
            trigger={
              <Button
                variant="outline"
                className="h-10 px-4 inline-flex items-center justify-center gap-2 leading-none"
              >
                <span className="leading-none">Escolher Núcleo</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </Button>
            }
          />
        </div>
      )}
    </motion.div>
  );
}