// src/app/(user-auth)/dashboard/conquistas/page.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trophy,
  Lock,
  Award,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function ConquistasPage() {
  const router = useRouter();
  const { useAchievements, useStats } = useGamification();
  const { data: achievements, isLoading: achievementsLoading } =
    useAchievements();
  const { data: stats, isLoading: statsLoading } = useStats();

  const isLoading = achievementsLoading || statsLoading;

  // Separar conquistas desbloqueadas e bloqueadas
  const unlockedAchievements = achievements?.filter((a) => a.unlocked) || [];
  const lockedAchievements = achievements?.filter((a) => !a.unlocked) || [];

  const getAchievementIcon = (tipo: string, unlocked: boolean) => {
    const icons: Record<string, string> = {
      creation: "🏗️",
      progress: "✅",
      streak: "🔥",
      level: "🌟",
      default: "🏆",
    };
    return icons[tipo] || icons.default;
  };

  const getAchievementColor = (tipo: string) => {
    const colors: Record<string, string> = {
      creation: "from-purple-500/10 to-purple-500/5 border-purple-500/20",
      progress: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
      streak: "from-orange-500/10 to-orange-500/5 border-orange-500/20",
      level: "from-green-500/10 to-green-500/5 border-green-500/20",
      default: "from-primary/10 to-primary/5 border-primary/20",
    };
    return colors[tipo] || colors.default;
  };

  const getAchievementBadgeColor = (tipo: string) => {
    const colors: Record<string, string> = {
      creation: "bg-purple-500/10 text-purple-700 border-purple-300",
      progress: "bg-blue-500/10 text-blue-700 border-blue-300",
      streak: "bg-orange-500/10 text-orange-700 border-orange-300",
      level: "bg-green-500/10 text-green-700 border-green-300",
      default: "bg-primary/10 text-primary border-primary/30",
    };
    return colors[tipo] || colors.default;
  };

  // Estatísticas de progresso
  const totalAchievements = achievements?.length || 0;
  const unlockedCount = unlockedAchievements.length;
  const progressPercent =
    totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="font-semibold">Conquistas</span>
          <Badge
            variant="outline"
            className="text-xs text-yellow-600 border-yellow-300"
          >
            {unlockedCount} / {totalAchievements} desbloqueadas
          </Badge>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Barra de Progresso Geral */}
        {!isLoading && totalAchievements > 0 && (
          <div className="bg-card border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Progresso Geral</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {unlockedCount} de {totalAchievements} conquistas
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Complete mais ações para desbloquear novas conquistas e ganhar XP!
            </p>
          </div>
        )}

        {isLoading ? (
          // Skeletons enquanto carrega
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Conquistas Desbloqueadas */}
            {unlockedAchievements.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Desbloqueadas
                  </p>
                  <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-300 text-xs">
                    +
                    {unlockedAchievements.reduce(
                      (sum, a) => sum + a.xp_recompensa,
                      0,
                    )}{" "}
                    XP total
                  </Badge>
                </div>
                <div className="grid gap-3">
                  {unlockedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={cn(
                        "flex items-center gap-4 p-4 bg-card border rounded-xl shadow-sm transition-all hover:shadow-md",
                        getAchievementColor(achievement.tipo),
                      )}
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 flex items-center justify-center text-3xl shrink-0">
                        {getAchievementIcon(achievement.tipo, true)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{achievement.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {achievement.descricao}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge
                            className={cn(
                              "text-xs",
                              getAchievementBadgeColor(achievement.tipo),
                            )}
                          >
                            +{achievement.xp_recompensa} XP
                          </Badge>
                          {achievement.unlockedAt && (
                            <p className="text-xs text-muted-foreground/60 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(
                                new Date(achievement.unlockedAt),
                                "d 'de' MMMM 'de' yyyy",
                                {
                                  locale: ptBR,
                                },
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-300 text-xs shrink-0">
                        Desbloqueada
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conquistas Bloqueadas */}
            {lockedAchievements.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Em Progresso
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {lockedAchievements.length} restantes
                  </Badge>
                </div>
                <div className="grid gap-3">
                  {lockedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl opacity-70 transition-all hover:opacity-100"
                    >
                      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-3xl grayscale shrink-0">
                        {getAchievementIcon(achievement.tipo, false)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{achievement.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {achievement.descricao}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="outline" className="text-xs">
                            +{achievement.xp_recompensa} XP
                          </Badge>
                          <p className="text-xs text-muted-foreground/60">
                            Complete o desafio para desbloquear
                          </p>
                        </div>
                      </div>
                      <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensagem quando não há conquistas */}
            {(!achievements || achievements.length === 0) && (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma conquista disponível no momento.
                </p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  Continue usando a plataforma para desbloquear conquistas!
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
