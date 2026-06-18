// src/components/gamification/GamificationWidget.tsx
"use client";

import Link from "next/link";
import { Trophy, Zap, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification } from "@/hooks/useGamification";

export function GamificationWidget() {
  const { useFullStats } = useGamification();
  const { data: stats, isLoading } = useFullStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-16" />
            <Skeleton className="h-10 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const { nivel, xpAtual, xpProximoNivel, titulo } = stats.level;
  const progress = (xpAtual / xpProximoNivel) * 100;
  const dailyStreak = stats.streaks.find((s: Streak) => s.tipo === "daily");

  return (
    <Link href="/dashboard/gamificacao">
      <Card className="cursor-pointer hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Sua Jornada</span>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nível {nivel}</p>
              <p className="text-xs">{titulo}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">XP Total</p>
              <p className="font-bold">
                {stats.level.xpAtual.toLocaleString()}
              </p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <Zap className="w-4 h-4 mx-auto text-yellow-500" />
              <p className="text-xs text-muted-foreground">Conquistas</p>
              <p className="font-semibold">
                {
                  stats.conquistas.filter((c: Conquista) => c.desbloqueada)
                    .length
                }
                /{stats.conquistas.length}
              </p>
            </div>
            <div className="text-center">
              <Flame className="w-4 h-4 mx-auto text-orange-500" />
              <p className="text-xs text-muted-foreground">Streak</p>
              <p className="font-semibold">{dailyStreak?.atual || 0}d</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Importar tipos
import { Streak, Conquista } from "@/types/gamification";
