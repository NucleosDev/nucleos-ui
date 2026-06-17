// src/components/gamification/MyRankWidget.tsx
"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification } from "@/hooks/useGamification";
import { useAuth } from "@/auth";

export function MyRankWidget({ delay = 0 }: { delay?: number }) {
  const { useLeaderboard, useStats } = useGamification();
  const { user } = useAuth();
  const { data: users, isLoading: leaderboardLoading } = useLeaderboard(100);
  const { data: stats, isLoading: statsLoading } = useStats();

  const isLoading = leaderboardLoading || statsLoading;

  if (isLoading) {
    return <Skeleton className="h-[140px] rounded-[var(--radius-lg)] w-full" />;
  }

  const safeUsers = Array.isArray(users) ? users : [];
  const myIndex = safeUsers.findIndex((u) => u.user_id === user?.userId);
  const myRank = myIndex >= 0 ? myIndex + 1 : null;
  const myEntry = myIndex >= 0 ? safeUsers[myIndex] : null;

  const xp = myEntry?.total_xp ?? stats?.totalXp ?? 0;
  const level = myEntry?.level ?? stats?.level ?? 1;

  const rankColor =
    myRank === 1
      ? "text-yellow-500"
      : myRank === 2
        ? "text-gray-400"
        : myRank === 3
          ? "text-amber-600"
          : "text-primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <LiquidGlass variant="subtle" radius="var(--radius-lg)" interactive={false}>
        <div className="p-5 flex items-center gap-5">
          {/* Rank badge */}
          <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-primary/8 shrink-0">
            <Trophy className={`w-5 h-5 mb-0.5 ${rankColor}`} />
            <span className={`text-2xl font-bold tabular-nums leading-none ${rankColor}`}>
              {myRank ? `#${myRank}` : "—"}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest mb-1">
              Sua Posição no Ranking
            </p>
            <p className="text-xl font-bold tracking-tight">
              {myRank ? `${myRank}º lugar` : "Fora do top 100"}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-muted-foreground/60">
                {xp.toLocaleString("pt-BR")} XP total
              </span>
              <span className="text-xs text-muted-foreground/40">·</span>
              <span className="text-xs text-muted-foreground/60">
                Nível {level}
              </span>
            </div>
          </div>
        </div>
      </LiquidGlass>
    </motion.div>
  );
}
