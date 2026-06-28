// src/components/gamification/StreaksList.tsx
"use client";

import { Flame, Calendar, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification } from "@/hooks/useGamification";

export function StreaksList() {
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
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const getStreakIcon = (tipo: string) => {
    switch (tipo) {
      case "daily":
        return <Flame className="w-5 h-5 text-orange-500" />;
      case "weekly":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      default:
        return <Award className="w-5 h-5 text-purple-500" />;
    }
  };

  const getStreakLabel = (tipo: string) => {
    switch (tipo) {
      case "daily":
        return "Diário";
      case "weekly":
        return "Semanal";
      default:
        return tipo;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Streaks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.streaks.map((streak: Streak) => (
          <div
            key={streak.tipo}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
          >
            <div className="flex items-center gap-3">
              {getStreakIcon(streak.tipo)}
              <div>
                <p className="font-medium">{getStreakLabel(streak.tipo)}</p>
                <p className="text-xs text-muted-foreground">
                  Maior: {streak.maximo}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{streak.atual}</p>
              <p className="text-xs text-muted-foreground">
                {streak.ativo ? "Ativo" : "Inativo"}
              </p>
            </div>
          </div>
        ))}

        {stats.streaks.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            Nenhum streak ativo. Comece sua jornada hoje!
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import { Streak } from "@/types/gamification";
