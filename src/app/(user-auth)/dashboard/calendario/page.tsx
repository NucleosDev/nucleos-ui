"use client";

import { useState } from "react";
import { CalendarioCard } from "@/components/calendario/CalendarioCard";
import { useCalendario } from "@/hooks/useCalendario";
import { useNucleos } from "@/hooks/useNucleo";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ChevronDown, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { Nucleo } from "@/types/nucleo";
import { LiquidGlass } from "@/components/ui/liquid-glass";

export default function CalendarioPage() {
  const { data: nucleos = [], isLoading: nucleosLoading } = useNucleos();
  const [selectedNucleoId, setSelectedNucleoId] = useState<string | null>(null);
  const [selectorOpen, setSelectorOpen] = useState(false);

  const activeNucleo = (nucleos as Nucleo[]).find((n) => n.id === selectedNucleoId);

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
      {/* Header */}
      <div className="px-5 md:px-8 pt-7 pb-5 border-b border-border/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/8">
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">Calendário</h1>
            <p className="text-[11px] text-muted-foreground/50 mt-px">
              {activeNucleo
                ? `Núcleo: ${activeNucleo.nome}`
                : "Selecione um Núcleo para ver os eventos"}
            </p>
          </div>
        </div>

        {/* Nucleo selector */}
        <div className="relative">
          <LiquidGlass
            variant="button"
            radius="12px"
            onClick={() => setSelectorOpen((v) => !v)}
            className="text-sm font-medium text-white"
          >
            <span className="flex items-center gap-2 px-3 py-2">
              {activeNucleo ? (
                <>
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ background: activeNucleo.corDestaque || "var(--primary)" }}
                  />
                  <span className="max-w-[140px] truncate">{activeNucleo.nome}</span>
                </>
              ) : (
                <>
                  <Layers className="h-3.5 w-3.5 text-white/60" />
                  <span className="text-white/60">Selecionar Núcleo</span>
                </>
              )}
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-white/40 transition-transform duration-[var(--duration-fast)]",
                  selectorOpen && "rotate-180",
                )}
              />
            </span>
          </LiquidGlass>

          <AnimatePresence>
            {selectorOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "absolute right-0 top-full mt-1.5 z-50 min-w-[200px]",
                  "rounded-xl border border-border/60 bg-card/95 backdrop-blur-[var(--glass-blur)]",
                  "shadow-[var(--shadow-lg)] overflow-hidden",
                )}
              >
                {nucleosLoading ? (
                  <div className="p-2 space-y-1.5">
                    {[0, 1, 2].map((i) => (
                      <Skeleton key={i} className="h-8 rounded-lg" />
                    ))}
                  </div>
                ) : (nucleos as Nucleo[]).length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-muted-foreground/60">
                    Nenhum Núcleo encontrado
                  </div>
                ) : (
                  <div className="p-1.5">
                    {(nucleos as Nucleo[]).map((n) => (
                      <button
                        key={n.id}
                        onClick={() => {
                          setSelectedNucleoId(n.id);
                          setSelectorOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left",
                          "hover:bg-accent transition-colors duration-[var(--duration-fast)]",
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
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {selectorOpen && (
            <div className="fixed inset-0 z-40" onClick={() => setSelectorOpen(false)} />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-8 max-w-4xl mx-auto">
        {!selectedNucleoId ? (
          <EmptyCalendarState
            nucleosCount={(nucleos as Nucleo[]).length}
            onSelect={() => setSelectorOpen(true)}
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

function EmptyCalendarState({
  nucleosCount,
  onSelect,
}: {
  nucleosCount: number;
  onSelect: () => void;
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
          background:
            "linear-gradient(135deg, oklch(0.58 0.19 245 / 0.12), oklch(0.58 0.19 245 / 0.06))",
          border: "1px solid oklch(0.58 0.19 245 / 0.2)",
        }}
      >
        <CalendarDays className="h-7 w-7 text-primary/70" />
      </div>
      <h2 className="text-base font-semibold mb-1.5">Seu calendário pessoal</h2>
      <p className="text-sm text-muted-foreground/60 max-w-xs mb-6">
        {nucleosCount > 0
          ? "Selecione um Núcleo para visualizar e criar eventos."
          : "Crie um Núcleo primeiro para começar a usar o calendário."}
      </p>
      {nucleosCount > 0 && (
        <LiquidGlass
          variant="button"
          radius="12px"
          onClick={onSelect}
          className="text-sm font-medium text-white"
        >
          <span className="flex items-center gap-2 px-4 py-2.5">
            <Layers className="h-3.5 w-3.5" />
            Escolher Núcleo
          </span>
        </LiquidGlass>
      )}
    </motion.div>
  );
}
