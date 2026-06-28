"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, X, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReentryCheck, useProcessReentry } from "@/hooks/useReentryCheck";

const MESSAGES: Record<"soft" | "full", { headline: string; body: string }> = {
  soft: {
    headline: "Bem-vindo de volta.",
    body: "Você ficou fora por alguns dias. Sem pressão — vamos reorganizar o que ficou pendente no seu ritmo.",
  },
  full: {
    headline: "Que bom te ver de novo.",
    body: "Passaram alguns dias. Nada foi apagado, mas algumas tarefas precisam de atenção. Quando quiser, eu cuido disso.",
  },
};

export function ReentryBanner() {
  const { data: status, isLoading } = useReentryCheck();
  const { mutate: processReentry, isPending, isSuccess } = useProcessReentry();
  const [dismissed, setDismissed] = useState(false);

  if (isLoading || !status || status.severity === "none" || dismissed) return null;

  const msg = MESSAGES[status.severity];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative rounded-2xl border px-5 py-4 overflow-hidden",
          status.severity === "full"
            ? "bg-amber-500/5 border-amber-500/15"
            : "bg-primary/5 border-primary/15",
        )}
      >
        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 p-1 rounded-lg text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
          aria-label="Fechar"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-start gap-4 pr-6">
          {/* Icon */}
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              status.severity === "full"
                ? "bg-amber-500/12 text-amber-400"
                : "bg-primary/12 text-primary",
            )}
          >
            {status.severity === "full" ? (
              <AlertCircle className="h-4.5 w-4.5" />
            ) : (
              <Sparkles className="h-4.5 w-4.5" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground/90 mb-0.5">
              {msg.headline}
            </p>
            <p className="text-[13px] text-muted-foreground/60 leading-relaxed">
              {msg.body}
            </p>

            {/* Stats row */}
            {(status.overdueTasksCount > 0 || status.topFocus) && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {status.overdueTasksCount > 0 && (
                  <span className="text-[11px] font-medium text-muted-foreground/50 bg-muted/20 rounded-lg px-2.5 py-1">
                    {status.overdueTasksCount}{" "}
                    {status.overdueTasksCount === 1 ? "tarefa atrasada" : "tarefas atrasadas"}
                  </span>
                )}
                {status.topFocus && (
                  <span
                    className="text-[11px] font-medium rounded-lg px-2.5 py-1"
                    style={{
                      background: `${status.topFocus.corDestaque}18`,
                      color: status.topFocus.corDestaque,
                    }}
                  >
                    {status.topFocus.nome}
                  </span>
                )}
                {status.daysSince > 0 && (
                  <span className="text-[11px] text-muted-foreground/35">
                    {status.daysSince}{" "}
                    {status.daysSince === 1 ? "dia" : "dias"} ausente
                  </span>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="mt-3.5">
              {isSuccess ? (
                <motion.p
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[12px] font-semibold text-emerald-400"
                >
                  Pronto — tudo reorganizado. Bora nessa.
                </motion.p>
              ) : (
                <button
                  onClick={() => processReentry()}
                  disabled={isPending}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold transition-all duration-200",
                    status.severity === "full"
                      ? "bg-amber-500/12 text-amber-400 hover:bg-amber-500/20"
                      : "bg-primary/10 text-primary hover:bg-primary/18",
                    isPending && "opacity-60 cursor-not-allowed",
                  )}
                >
                  <RefreshCcw
                    className={cn("h-3.5 w-3.5", isPending && "animate-spin")}
                  />
                  {isPending ? "Reorganizando..." : "Reorganizar minha semana"}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
