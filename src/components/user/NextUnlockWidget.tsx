// components/user/NextUnlockWidget.tsx
"use client";

import { motion } from "framer-motion";
import { Lock, Trophy, CheckCircle2 } from "lucide-react";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { useGamification } from "@/hooks/useGamification";

const TIPO_LABEL: Record<string, string> = {
  creation: "criação",
  progress: "progresso",
  streak: "streak",
  level: "nível",
};

export default function NextUnlockWidget({ delay = 0 }: { delay?: number }) {
  const { useStats, useAchievements } = useGamification();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: achievements, isLoading: achLoading } = useAchievements();

  const { nextAchievement, progress, xpRemaining, nextLevel } = useMemo(() => {
    const locked = (achievements ?? []).filter((a) => !a.unlocked);
    const next = locked[0] ?? null;
    const progress = stats
      ? Math.min(100, (stats.currentXp / stats.nextLevelXp) * 100)
      : 0;
    const xpRemaining = stats
      ? Math.max(0, stats.nextLevelXp - stats.currentXp)
      : 0;
    const nextLevel = stats ? stats.level + 1 : null;
    return { nextAchievement: next, progress, xpRemaining, nextLevel };
  }, [achievements, stats]);

  const isLoading = statsLoading || achLoading;

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (progress / 100) * circumference;

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

  const allUnlocked =
    (achievements ?? []).length > 0 &&
    (achievements ?? []).every((a) => a.unlocked);

  return (
    <motion.div>
      <LiquidGlass
        variant="subtle"
        radius="var(--radius-lg)"
        borderRadius="90px"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay }}
      >
        <div className="p-4 h-full flex items-center gap-4">
          <div className="relative shrink-0">
            <svg
              width="72"
              height="72"
              viewBox="0 0 72 72"
              className="-rotate-90"
            >
              <circle
                cx="36"
                cy="36"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-muted/30"
              />
              <motion.circle
                cx="36"
                cy="36"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{
                  duration: 1,
                  ease: [0.25, 1, 0.5, 1],
                  delay: delay + 0.2,
                }}
                className="text-amber-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10">
                {allUnlocked ? (
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                ) : (
                  <Lock className="h-4 w-4 text-amber-500/70" />
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {allUnlocked ? (
              <>
                <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-1">
                  Conquistas
                </p>
                <p className="text-sm font-semibold tracking-tight">
                  Todas desbloqueadas!
                </p>
                <p className="text-[11px] text-muted-foreground/60 mt-1.5">
                  {Math.round(progress)}% para nível {nextLevel}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                    Próxima conquista
                  </p>
                  {nextAchievement && (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 capitalize">
                      {TIPO_LABEL[nextAchievement.tipo] ?? nextAchievement.tipo}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold tracking-tight truncate">
                  {nextAchievement?.nome ?? "—"}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Trophy className="h-3 w-3 text-amber-500/60" />
                  <p className="text-[11px] text-muted-foreground/60">
                    {xpRemaining > 0 ? (
                      <>
                        {/* Faltam{" "} */}
                        <span className="text-foreground/80 font-medium tabular-nums">
                          {xpRemaining}
                        </span>{" "}
                        {/* XP para nível {nextLevel} */}
                      </>
                    ) : (
                      "Pronto para o próximo nível!"
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </LiquidGlass>
    </motion.div>
  );
}
