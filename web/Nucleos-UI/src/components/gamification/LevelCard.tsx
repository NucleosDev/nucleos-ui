// src/components/gamification/LevelCard.tsx
"use client";

import { Trophy, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification } from "@/hooks/useGamification";

export function LevelCard() {
  const { useFullStats } = useGamification();
  const { data: stats, isLoading } = useFullStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const { nivel, xpAtual, xpProximoNivel, titulo } = stats.level;
  const progress = (xpAtual / xpProximoNivel) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Seu Nível</span>
          <Trophy className="w-5 h-5 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-5xl font-bold text-primary">{nivel}</p>
          <p className="text-sm text-muted-foreground mt-1">{titulo}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progresso para nível {nivel + 1}</span>
            <span>
              {xpAtual} / {xpProximoNivel} XP
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Zap className="w-3 h-3" />
          <span>Continue completando tarefas para ganhar XP!</span>
        </div>
      </CardContent>
    </Card>
  );
}
