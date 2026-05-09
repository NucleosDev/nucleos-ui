// src/components/habitos/CriarHabitoModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Activity, Check, Loader2 } from "lucide-react";
import { GlassModal, GlassModalHeader, GlassInput, GlassModalFooter, GlassButton } from "@/components/ui/glass-modal";
import { cn } from "@/lib/utils";
import type { FrequenciaHabito } from "@/types/habitos";

const ACCENT = "#22c55e";
const diasSemanaLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface CriarHabitoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    nome: string;
    frequencia: FrequenciaHabito;
    diasSemana?: number[];
    metaVezes?: number;
  }) => Promise<void>;
  initialData?: {
    nome: string;
    frequencia: FrequenciaHabito;
    diasSemana?: number[];
    metaVezes?: number;
  };
  isSubmitting?: boolean;
  titulo?: string;
}

export function CriarHabitoModal({
  open,
  onClose,
  onConfirm,
  initialData,
  isSubmitting = false,
  titulo = "Novo hábito",
}: CriarHabitoModalProps) {
  const [nome,       setNome]       = useState("");
  const [frequencia, setFrequencia] = useState<FrequenciaHabito>("diaria");
  const [diasSemana, setDiasSemana] = useState<number[]>([]);
  const [metaVezes,  setMetaVezes]  = useState<number>(1);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setNome(initialData.nome);
        setFrequencia(initialData.frequencia);
        setDiasSemana(Array.isArray(initialData.diasSemana) ? initialData.diasSemana.map(Number) : []);
        setMetaVezes(initialData.metaVezes || 1);
      } else {
        setNome("");
        setFrequencia("diaria");
        setDiasSemana([]);
        setMetaVezes(1);
      }
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    const diasLimpos = diasSemana.map(Number).filter((d) => !isNaN(d));
    await onConfirm({
      nome: nome.trim(),
      frequencia,
      diasSemana: frequencia === "semanal" ? diasLimpos : undefined,
      metaVezes: metaVezes || 1,
    });
  };

  const toggleDia = (dia: number) => {
    setDiasSemana((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia],
    );
  };

  return (
    <GlassModal open={open} onClose={onClose}>
      <GlassModalHeader
        title={titulo}
        description="Crie um hábito para acompanhar sua consistência."
        icon={Activity}
        accent={ACCENT}
        onClose={onClose}
      />

      <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
        <GlassInput
          label="Nome do hábito"
          placeholder="Ex: Meditar, Ler, Exercitar..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          autoFocus
          disabled={isSubmitting}
        />

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground/70">Frequência</label>
          <div className="flex rounded-xl border border-border/50 bg-muted/30 p-0.5 gap-0.5">
            {(["diaria", "semanal", "personalizada"] as FrequenciaHabito[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFrequencia(f)}
                disabled={isSubmitting}
                className={cn(
                  "flex-1 py-1.5 rounded-lg text-xs font-medium transition-all",
                  frequencia === f
                    ? "bg-background shadow-[var(--shadow-xs)] text-foreground"
                    : "text-muted-foreground/60 hover:text-muted-foreground",
                )}
              >
                {f === "diaria" ? "Diária" : f === "semanal" ? "Semanal" : "Personalizada"}
              </button>
            ))}
          </div>
        </div>

        {frequencia === "semanal" && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground/70">Dias da semana</label>
            <div className="grid grid-cols-7 gap-1">
              {diasSemanaLabels.map((label, idx) => {
                const active = diasSemana.includes(idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleDia(idx)}
                    className={cn(
                      "py-1.5 rounded-lg text-[11px] font-medium border transition-all",
                      active
                        ? "text-white border-transparent"
                        : "border-border/40 text-muted-foreground hover:border-border",
                    )}
                    style={active ? { background: ACCENT, boxShadow: `0 2px 8px ${ACCENT}30` } : {}}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground/70">Meta diária (vezes)</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMetaVezes(Math.max(1, metaVezes - 1))}
              disabled={isSubmitting || metaVezes <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:bg-accent transition-colors disabled:opacity-40"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums">{metaVezes}</span>
            <button
              type="button"
              onClick={() => setMetaVezes(Math.min(99, metaVezes + 1))}
              disabled={isSubmitting || metaVezes >= 99}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:bg-accent transition-colors disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
        <GlassModalFooter>
          <GlassButton variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </GlassButton>
          <GlassButton
            type="submit"
            disabled={isSubmitting || !nome.trim()}
            style={{ background: ACCENT, boxShadow: `0 4px 12px ${ACCENT}35` }}
            className="text-white hover:opacity-90 bg-transparent"
          >
            {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Salvar
          </GlassButton>
        </GlassModalFooter>
      </form>
    </GlassModal>
  );
}
