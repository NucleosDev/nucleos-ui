// src/components/gamification/StreakCard.tsx
"use client";

import { Flame, Calendar, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification } from "@/hooks/useGamification";

export function StreakCard() {
  const { useStreak } = useGamification();
  const { data: streak, isLoading } = useStreak();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!streak) return null;

  const getStreakMessage = () => {
    if (streak.currentStreak === 0) return "Comece sua jornada hoje!";
    if (streak.currentStreak === 1) return "Primeiro dia! Continue assim!";
    if (streak.currentStreak === 3) return "Streak de 3 dias! Incrível!";
    if (streak.currentStreak === 7) return "Semana completa! Você é demais!";
    if (streak.currentStreak === 14) return "2 semanas! Impressionante!";
    if (streak.currentStreak === 30) return "Mês completo! Lendário!";
    if (streak.currentStreak === 100) return "100 dias! Você é uma lenda!";
    return `${streak.currentStreak} dias consecutivos! Continue firme!`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-4xl font-bold text-orange-500">
            {streak.currentStreak}
          </p>
          <p className="text-sm text-muted-foreground">dias consecutivos</p>
          <p className="text-sm mt-2 font-medium">{getStreakMessage()}</p>
        </div>

        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4" />
            <span>Maior streak: {streak.maxStreak}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              Última atividade:{" "}
              {streak.lastActivityDate
                ? new Date(streak.lastActivityDate).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
