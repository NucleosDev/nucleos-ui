"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, Clock, Loader2 } from "lucide-react";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { cn } from "@/lib/utils";
import type { Tarefa } from "@/types/tarefas";

interface ProximaAcaoProps {
  tarefa?: Tarefa;
  isLoading?: boolean;
  nucleoNome?: string;
  nucleoCor?: string;
  onIniciarFoco?: (tarefaId: string) => void;
}

export function ProximaAcao({
  tarefa,
  isLoading,
  nucleoNome,
  nucleoCor = "#4D7CFF",
  onIniciarFoco,
}: ProximaAcaoProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-border/20 bg-muted/10 px-5 py-4">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/30" />
        <span className="text-sm text-muted-foreground/40">Buscando próxima ação...</span>
      </div>
    );
  }

  if (!tarefa) {
    return (
      <LiquidGlass variant="subtle" radius="var(--radius-lg)" interactive={false}>
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
            <Target className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40 mb-0.5">
              Próxima Ação
            </p>
            <p className="text-sm font-semibold text-foreground/80">
              Nenhuma urgência hoje
            </p>
            <p className="text-xs text-muted-foreground/50 mt-0.5">
              Escolha um foco voluntário ou descanse — você merece.
            </p>
          </div>
        </div>
      </LiquidGlass>
    );
  }

  const prioridadeLabel: Record<string, string> = {
    alta: "Alta prioridade",
    media: "Prioridade média",
    baixa: "Baixa prioridade",
  };

  const getVencimentoLabel = () => {
    if (!tarefa.dataVencimento) return null;
    const d = new Date(tarefa.dataVencimento);
    const hoje = new Date();
    const diffDias = Math.floor((d.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDias < 0) return "Atrasada";
    if (diffDias === 0) return "Vence hoje";
    if (diffDias === 1) return "Vence amanhã";
    return `Vence em ${diffDias} dias`;
  };

  const vencimentoLabel = getVencimentoLabel();
  const isAtrasada = vencimentoLabel === "Atrasada";
  const isHoje = vencimentoLabel === "Vence hoje";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative overflow-hidden rounded-2xl group cursor-pointer"
        onClick={() => onIniciarFoco?.(tarefa.id)}
        style={{
          background: `linear-gradient(135deg, ${nucleoCor}10 0%, ${nucleoCor}06 100%)`,
          border: `1px solid ${nucleoCor}24`,
          boxShadow: `0 4px 24px ${nucleoCor}10`,
        }}
      >
        {/* Accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
          style={{ background: `linear-gradient(180deg, ${nucleoCor}, ${nucleoCor}88)` }}
        />

        <div className="flex items-center gap-4 pl-6 pr-5 py-4">
          {/* Icon */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${nucleoCor}22, ${nucleoCor}14)`,
              border: `1px solid ${nucleoCor}28`,
            }}
          >
            <Zap
              className="h-5 w-5"
              style={{ color: nucleoCor }}
              strokeWidth={2.2}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
                Próxima Ação
              </span>
              {nucleoNome && (
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{
                    background: `${nucleoCor}18`,
                    color: nucleoCor,
                    border: `1px solid ${nucleoCor}28`,
                  }}
                >
                  {nucleoNome}
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-foreground leading-snug truncate">
              {tarefa.titulo}
            </p>

            <div className="flex items-center gap-3 mt-1">
              {tarefa.prioridade && (
                <span className="text-[11px] text-muted-foreground/50">
                  {prioridadeLabel[tarefa.prioridade]}
                </span>
              )}
              {vencimentoLabel && (
                <div className="flex items-center gap-1">
                  <Clock
                    className={cn(
                      "h-3 w-3",
                      isAtrasada ? "text-red-400" : isHoje ? "text-amber-400" : "text-muted-foreground/40",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[11px] font-medium",
                      isAtrasada ? "text-red-400" : isHoje ? "text-amber-400" : "text-muted-foreground/40",
                    )}
                  >
                    {vencimentoLabel}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            whileHover={{ scale: 1.04, x: 2 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shrink-0 transition-shadow duration-200"
            style={{
              background: nucleoCor,
              color: "white",
              boxShadow: `0 4px 14px ${nucleoCor}44`,
            }}
          >
            Iniciar
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
