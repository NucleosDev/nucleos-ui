// src/components/gamification/LevelProgress.tsx
"use client";

import { motion } from "framer-motion";
import { Trophy, Zap, Flame, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification } from "@/hooks/useGamification";

export function LevelProgress() {
  const { useStats } = useGamification();
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Sua Jornada</span>
          <Trophy className="w-5 h-5 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nível e XP */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nível Atual</p>
                <p className="text-2xl font-bold">{stats.level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">XP Total</p>
              <p className="text-2xl font-bold">
                {stats.totalXp.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progresso para nível {stats.level + 1}</span>
              <span>
                {stats.currentXp} / {stats.nextLevelXp} XP
              </span>
            </div>
            <Progress value={stats.progressToNextLevel} className="h-2" />
          </div>
        </div>

        {/* Stats Rápidos */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg bg-muted/50 text-center"
          >
            <Zap className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">XP Hoje</p>
            <p className="text-lg font-bold">{stats.todayXp}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg bg-muted/50 text-center"
          >
            <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Streak</p>
            <p className="text-lg font-bold">{stats.currentStreak} dias</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg bg-muted/50 text-center"
          >
            <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Conquistas</p>
            <p className="text-lg font-bold">{stats.achievementsCount}</p>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}
