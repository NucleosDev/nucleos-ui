"use client";

import { Trophy, Lock, Award, Calendar, Sparkles, Zap } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const TIPO_META: Record<string, { pill: string; glow: string }> = {
  creation: {
    pill: "bg-purple-500/10 text-purple-400",
    glow: "from-purple-500/8 to-purple-500/4 border-purple-500/20",
  },
  progress: {
    pill: "bg-blue-500/10 text-blue-400",
    glow: "from-blue-500/8 to-blue-500/4 border-blue-500/20",
  },
  streak: {
    pill: "bg-orange-500/10 text-orange-400",
    glow: "from-orange-500/8 to-orange-500/4 border-orange-500/20",
  },
  level: {
    pill: "bg-emerald-500/10 text-emerald-400",
    glow: "from-emerald-500/8 to-emerald-500/4 border-emerald-500/20",
  },
  default: {
    pill: "bg-primary/10 text-primary",
    glow: "from-primary/8 to-primary/4 border-primary/20",
  },
};

const TIPO_EMOJI: Record<string, string> = {
  creation: "🏗️",
  progress: "✅",
  streak: "🔥",
  level: "🌟",
  default: "🏆",
};

const getMeta = (tipo: string) => TIPO_META[tipo] || TIPO_META.default;
const getEmoji = (tipo: string) => TIPO_EMOJI[tipo] || TIPO_EMOJI.default;

const radialConfig = {
  unlocked: { label: "Desbloqueadas", color: "var(--chart-1)" },
  locked: { label: "Em Progresso", color: "var(--muted)" },
};

export default function ConquistasPage() {
  const { useAchievements, useStats } = useGamification();
  const { data: achievements, isLoading: achievementsLoading } =
    useAchievements();
  const { data: stats, isLoading: statsLoading } = useStats();

  const isLoading = achievementsLoading || statsLoading;

  const unlockedAchievements = achievements?.filter((a) => a.unlocked) ?? [];
  const lockedAchievements = achievements?.filter((a) => !a.unlocked) ?? [];

  const totalAchievements = achievements?.length ?? 0;
  const unlockedCount = unlockedAchievements.length;
  const lockedCount = lockedAchievements.length;
  const progressPercent =
    totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;
  const totalXp = unlockedAchievements.reduce(
    (s, a) => s + a.xp_recompensa,
    0,
  );

  const radialData = [
    { name: "progresso", unlocked: unlockedCount, locked: lockedCount },
  ];

  return (
    <div className="flex-1 overflow-auto">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-5 md:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/8">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <h1 className="text-sm font-semibold tracking-tight">Conquistas</h1>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
          {unlockedCount} / {totalAchievements}
        </span>
      </div>

      <div className="px-5 md:px-6 py-6 max-w-3xl mx-auto space-y-5">
        {/* Radial progress chart + stats */}
        {!isLoading && totalAchievements > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="py-4 gap-3">
              <CardHeader className="px-5 pb-0 pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <CardTitle className="text-sm font-semibold">
                      Progresso Geral
                    </CardTitle>
                  </div>
                  <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    +{totalXp} XP total
                  </span>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-0 pt-0">
                <div className="flex items-center gap-6">
                  {/* Radial chart */}
                  <ChartContainer
                    config={radialConfig}
                    className="h-[120px] w-[120px] shrink-0"
                  >
                    <RadialBarChart
                      data={radialData}
                      innerRadius={35}
                      outerRadius={55}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <PolarRadiusAxis tick={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <RadialBar
                        dataKey="unlocked"
                        stackId="a"
                        fill="var(--chart-1)"
                        cornerRadius={4}
                      />
                      <RadialBar
                        dataKey="locked"
                        stackId="a"
                        fill="var(--muted)"
                        cornerRadius={4}
                      />
                    </RadialBarChart>
                  </ChartContainer>

                  {/* Stats alongside */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-2xl font-bold tabular-nums">
                        {Math.round(progressPercent)}%
                      </p>
                      <p className="text-xs text-muted-foreground/60">
                        {unlockedCount} de {totalAchievements} conquistas desbloqueadas
                      </p>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, progressPercent)}%` }}
                        transition={{
                          duration: 0.9,
                          ease: [0.25, 1, 0.5, 1],
                          delay: 0.2,
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                      />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground/50">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-chart-1 inline-block" />
                        {unlockedCount} desbloqueadas
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-muted inline-block" />
                        {lockedCount} em progresso
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[76px] rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Unlocked */}
            {unlockedAchievements.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Trophy className="h-3.5 w-3.5 text-amber-500" />
                  <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                    Desbloqueadas
                  </p>
                </div>
                {unlockedAchievements.map((achievement, i) => {
                  const meta = getMeta(achievement.tipo);
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r",
                        meta.glow,
                      )}
                    >
                      <div className="w-11 h-11 rounded-full bg-amber-500/10 flex items-center justify-center text-xl shrink-0">
                        {getEmoji(achievement.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">
                          {achievement.nome}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                          {achievement.descricao}
                        </p>
                        <div className="flex items-center gap-2.5 mt-1.5">
                          <span
                            className={cn(
                              "text-[10px] font-semibold px-1.5 py-px rounded-full",
                              meta.pill,
                            )}
                          >
                            +{achievement.xp_recompensa} XP
                          </span>
                          {achievement.unlockedAt && (
                            <span className="text-[10px] text-muted-foreground/40 flex items-center gap-1">
                              <Calendar className="h-2.5 w-2.5" />
                              {format(
                                new Date(achievement.unlockedAt),
                                "d 'de' MMM",
                                { locale: ptBR },
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                      <Zap className="h-3.5 w-3.5 text-amber-500/60 shrink-0" />
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Locked */}
            {lockedAchievements.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />
                    <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                      Em Progresso
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground/40">
                    {lockedAchievements.length} restantes
                  </span>
                </div>
                {lockedAchievements.map((achievement, i) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border/30 bg-card/30 opacity-60 hover:opacity-90 transition-opacity"
                  >
                    <div className="w-11 h-11 rounded-full bg-muted/50 flex items-center justify-center text-xl grayscale shrink-0">
                      {getEmoji(achievement.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{achievement.nome}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">
                        {achievement.descricao}
                      </p>
                      <span className="mt-1.5 inline-block text-[10px] text-muted-foreground/40 border border-border/40 px-1.5 py-px rounded-full">
                        +{achievement.xp_recompensa} XP
                      </span>
                    </div>
                    <Lock className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
                  </motion.div>
                ))}
              </div>
            )}

            {(!achievements || achievements.length === 0) && (
              <div className="py-16 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-sm font-medium text-muted-foreground/60">
                  Nenhuma conquista disponível
                </p>
                <p className="text-xs text-muted-foreground/40 mt-1">
                  Continue usando a plataforma para desbloquear conquistas!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
