// components/user/XPSparklineWidget.tsx
"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { useMemo } from "react";
import { useGamification } from "@/hooks/useGamification";
import { Skeleton } from "@/components/ui/skeleton";

function buildWeeklyData(
  transactions: { xp_amount: number; created_at: string }[],
  weeksBack: 0 | 1,
): number[] {
  const now = new Date();
  const days: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(now.getDate() - i - weeksBack * 7);
    const iso = day.toISOString().slice(0, 10);
    const total = transactions
      .filter(
        (t) =>
          typeof t.created_at === "string" && t.created_at.slice(0, 10) === iso,
      )
      .reduce((sum, t) => sum + (t.xp_amount ?? 0), 0);
    days.push(total);
  }

  return days;
}

export default function XPSparklineWidget({ delay = 0 }: { delay?: number }) {
  const { useXpHistory, useStats } = useGamification();
  const { data: history = [], isLoading: histLoading } = useXpHistory(200);
  const { data: stats, isLoading: statsLoading } = useStats();

  const isLoading = histLoading || statsLoading;

  const { points, areaPath, total, change, trending, lastX, lastY } =
    useMemo(() => {
      const current = buildWeeklyData(history, 0);
      const previous = buildWeeklyData(history, 1);

      const currentTotal = current.reduce((a, b) => a + b, 0);
      const previousTotal = previous.reduce((a, b) => a + b, 0);
      const change =
        previousTotal > 0
          ? ((currentTotal - previousTotal) / previousTotal) * 100
          : currentTotal > 0
            ? 100
            : 0;

      const max = Math.max(...current, 1);
      const coords = current.map((v, i) => ({
        x: (i / (current.length - 1)) * 100,
        y: 30 - (v / max) * 26,
      }));
      const pts = coords.map((c) => `${c.x},${c.y}`).join(" ");
      const area = `M 0,30 L ${pts.split(" ").join(" L ")} L 100,30 Z`;
      const last = coords[coords.length - 1];

      return {
        points: pts,
        areaPath: area,
        total: currentTotal,
        change,
        trending: change >= 0,
        lastX: last.x,
        lastY: last.y,
      };
    }, [history]);

  if (isLoading) {
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
          <div className="p-5 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-full mt-4" />
          </div>
        </LiquidGlass>
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
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                XP esta semana
              </p>
              <p className="text-2xl font-bold tracking-tight tabular-nums mt-1">
                {total.toLocaleString("pt-BR")}
                <span className="text-xs text-muted-foreground/40 ml-1 font-normal">
                  xp
                </span>
              </p>
            </div>
            <div
              className={`flex items-center gap-1 text-xs font-semibold ${
                trending ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {trending ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(change).toFixed(0)}%
            </div>
          </div>

          <div className="mt-4 -mx-1">
            <svg
              viewBox="0 0 100 32"
              className="w-full h-10"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="currentColor"
                    stopOpacity="0.20"
                  />
                  <stop
                    offset="100%"
                    stopColor="currentColor"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              <motion.path
                d={areaPath}
                fill="url(#xpGrad)"
                className="text-primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: delay + 0.2 }}
              />

              <motion.polyline
                points={points}
                fill="none"
                className="stroke-primary"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: delay + 0.1 }}
              />

              <motion.circle
                cx={lastX}
                cy={lastY}
                r="1.5"
                className="fill-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.9 }}
              />
            </svg>
          </div>

          <p className="text-[11px] text-muted-foreground/50 mt-2">
            {trending ? "Acima" : "Abaixo"} da semana anterior
            {stats?.todayXp != null && stats.todayXp > 0 && (
              <span className="ml-2 text-primary font-medium">
                · +{stats.todayXp} hoje
              </span>
            )}
          </p>
        </div>
      </LiquidGlass>
    </motion.div>
  );
}
