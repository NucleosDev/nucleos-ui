// components/user/WeeklyPulseWidget.tsx
"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { useGamification } from "@/hooks/useGamification";

const DAYS = ["S", "T", "Q", "Q", "S", "S", "D"] as const;
const FULL = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
] as const;

const INTENSITY_BG = [
  "bg-muted/30",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary/85",
];

export default function WeeklyPulseWidget({ delay = 0 }: { delay?: number }) {
  const { useXpHistory } = useGamification();
  const { data: history, isLoading } = useXpHistory(100);

  const { weekData, peakDay, total } = useMemo(() => {
    const now = new Date();
    const dow = now.getDay(); // 0=Dom, 1=Seg...
    const daysFromMonday = dow === 0 ? 6 : dow - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysFromMonday);
    monday.setHours(0, 0, 0, 0);

    // Contagem de transações por dia: índice 0=Seg, 6=Dom
    const counts = [0, 0, 0, 0, 0, 0, 0];
    for (const tx of history ?? []) {
      const date = new Date(tx.created_at);
      if (date >= monday) {
        const d = date.getDay();
        const idx = d === 0 ? 6 : d - 1;
        if (idx < 7) counts[idx]++;
      }
    }

    const total = counts.reduce((a, b) => a + b, 0);
    const maxCount = Math.max(...counts, 1);
    const weekData = counts.map((c) => Math.round((c / maxCount) * 4));
    const peakDay = counts.indexOf(Math.max(...counts));

    return { weekData, peakDay, total };
  }, [history]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay }}
      >
        <Skeleton className="h-[148px] rounded-[var(--radius-lg)]" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay }}
      className="h-[200px]"
    >
      <LiquidGlass
        variant="subtle"
        radius="var(--radius-lg)"
        interactive={false}
        className="h-[200px]"
      >
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                Pulso semanal
              </p>
              <p className="text-2xl font-bold tracking-tight tabular-nums mt-1">
                {total}
                <span className="text-xs text-muted-foreground/40 ml-1 font-normal">
                  ações
                </span>
              </p>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8 text-primary shrink-0">
              <Activity className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="flex items-end justify-between gap-1.5 mt-4 mb-2">
            {weekData.map((intensity, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center gap-1.5 flex-1"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: delay + 0.1 + i * 0.05 }}
              >
                <div
                  className={cn(
                    "w-full aspect-square rounded-md transition-transform hover:scale-110",
                    INTENSITY_BG[intensity],
                    i === peakDay &&
                      total > 0 &&
                      "ring-1 ring-primary/40 ring-offset-1 ring-offset-background",
                  )}
                  title={`${FULL[i]}: ${intensity * 25}% atividade`}
                />
                <span
                  className={cn(
                    "text-[9px] text-muted-foreground/40",
                    i === peakDay &&
                      total > 0 &&
                      "font-semibold text-primary/70",
                  )}
                >
                  {DAYS[i]}
                </span>
              </motion.div>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground/50 mt-2">
            {total > 0 ? (
              <>
                Pico:{" "}
                <span className="text-foreground/70 font-medium">
                  {FULL[peakDay]}
                </span>
              </>
            ) : (
              "Nenhuma ação esta semana"
            )}
          </p>
        </div>
      </LiquidGlass>
    </motion.div>
  );
}
