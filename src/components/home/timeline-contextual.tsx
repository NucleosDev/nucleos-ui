"use client";

import { motion } from "framer-motion";
import { Sunrise, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tarefa } from "@/types/tarefas";

type Periodo = "manha" | "tarde" | "noite";

function getPeriodoAtual(): Periodo {
  const hora = new Date().getHours();
  if (hora >= 6 && hora < 12) return "manha";
  if (hora >= 12 && hora < 18) return "tarde";
  return "noite";
}

interface PeriodoConfig {
  id: Periodo;
  label: string;
  icon: React.ElementType;
  range: string;
  passadoLabel: string;
  futuroLabel: string;
}

const PERIODOS: PeriodoConfig[] = [
  {
    id: "manha",
    label: "Manhã",
    icon: Sunrise,
    range: "06 – 12h",
    passadoLabel: "Período concluído",
    futuroLabel: "Em breve",
  },
  {
    id: "tarde",
    label: "Tarde",
    icon: Sun,
    range: "12 – 18h",
    passadoLabel: "Período concluído",
    futuroLabel: "Em breve",
  },
  {
    id: "noite",
    label: "Noite",
    icon: Moon,
    range: "18 – 00h",
    passadoLabel: "Período concluído",
    futuroLabel: "Em breve",
  },
];

function isPeriodoPassado(id: Periodo, atual: Periodo): boolean {
  const ordem: Periodo[] = ["manha", "tarde", "noite"];
  return ordem.indexOf(id) < ordem.indexOf(atual);
}

interface TimelineContextualProps {
  tarefas: Tarefa[];
  className?: string;
}

export function TimelineContextual({ tarefas, className }: TimelineContextualProps) {
  const periodoAtual = getPeriodoAtual();
  const tarefasPendentes = tarefas.filter((t) => t.status !== "concluida").slice(0, 3);

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-6 w-1 bg-gradient-to-b from-[#4D7CFF] to-[#00C9A7] rounded-full" />
        <h2 className="text-base font-semibold text-foreground/80">Seu dia</h2>
        <span className="text-xs text-muted-foreground/40 ml-1">
          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "short" })}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {PERIODOS.map((periodo, idx) => {
          const isAtual = periodo.id === periodoAtual;
          const isPassado = isPeriodoPassado(periodo.id, periodoAtual);
          const isFuturo = !isAtual && !isPassado;
          const Icon = periodo.icon;

          return (
            <motion.div
              key={periodo.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              className={cn(
                "relative rounded-2xl p-4 border transition-all duration-300",
                isAtual
                  ? "border-primary/25 bg-primary/4"
                  : isPassado
                  ? "border-border/12 bg-muted/4 opacity-50"
                  : "border-border/15 bg-muted/3 opacity-65",
              )}
              style={
                isAtual
                  ? {
                      boxShadow:
                        "0 0 0 1px rgba(77,124,255,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
                    }
                  : undefined
              }
            >
              {/* Pulse indicator — somente no período atual */}
              {isAtual && (
                <div className="absolute top-3 right-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-center gap-2 mb-2.5">
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    isAtual
                      ? "text-primary"
                      : isPassado
                      ? "text-muted-foreground/25"
                      : "text-muted-foreground/30",
                  )}
                  strokeWidth={isAtual ? 2.2 : 1.8}
                />
                <span
                  className={cn(
                    "text-xs font-semibold",
                    isAtual
                      ? "text-foreground"
                      : isPassado
                      ? "text-muted-foreground/30"
                      : "text-muted-foreground/40",
                  )}
                >
                  {periodo.label}
                </span>
              </div>

              <p
                className={cn(
                  "text-[10px] mb-2.5",
                  isAtual ? "text-muted-foreground/40" : "text-muted-foreground/25",
                )}
              >
                {periodo.range}
              </p>

              {/* Content */}
              {isAtual && tarefasPendentes.length > 0 ? (
                <div className="space-y-1.5">
                  {tarefasPendentes.map((t) => (
                    <div key={t.id} className="flex items-start gap-1.5">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                      <span className="text-[11px] leading-snug text-foreground/70 line-clamp-2">
                        {t.titulo}
                      </span>
                    </div>
                  ))}
                </div>
              ) : isAtual ? (
                <p className="text-[11px] italic text-muted-foreground/35">
                  Período livre
                </p>
              ) : isPassado ? (
                <p className="text-[11px] text-muted-foreground/25">
                  {periodo.passadoLabel}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground/25">
                  {periodo.futuroLabel}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
