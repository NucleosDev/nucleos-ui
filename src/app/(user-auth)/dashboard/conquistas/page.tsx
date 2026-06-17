"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy, Lock, Award, Calendar, Sparkles, Zap } from "lucide-react";
import { useGamification } from "@/hooks/useGamification";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const TIPO_META: Record<string, { pill: string; glow: string }> = {
  creation: { pill: "bg-purple-500/10 text-purple-400", glow: "from-purple-500/8 to-purple-500/4 border-purple-500/20" },
  progress:  { pill: "bg-blue-500/10 text-blue-400",   glow: "from-blue-500/8 to-blue-500/4 border-blue-500/20"   },
  streak:    { pill: "bg-orange-500/10 text-orange-400",glow: "from-orange-500/8 to-orange-500/4 border-orange-500/20"},
  level:     { pill: "bg-emerald-500/10 text-emerald-400",glow:"from-emerald-500/8 to-emerald-500/4 border-emerald-500/20"},
  default:   { pill: "bg-primary/10 text-primary",     glow: "from-primary/8 to-primary/4 border-primary/20"     },
};

const TIPO_EMOJI: Record<string, string> = {
  creation: "🏗️",
  progress: "✅",
  streak:   "🔥",
  level:    "🌟",
  default:  "🏆",
};

const getMeta  = (tipo: string) => TIPO_META[tipo]  || TIPO_META.default;
const getEmoji = (tipo: string) => TIPO_EMOJI[tipo] || TIPO_EMOJI.default;

export default function ConquistasPage() {
  const router = useRouter();
  const { useAchievements, useStats } = useGamification();
  const { data: achievements, isLoading: achievementsLoading } = useAchievements();
  const { data: stats, isLoading: statsLoading } = useStats();

  const isLoading = achievementsLoading || statsLoading;

  const unlockedAchievements = achievements?.filter((a) => a.unlocked) ?? [];
  const lockedAchievements   = achievements?.filter((a) => !a.unlocked) ?? [];

  const totalAchievements = achievements?.length ?? 0;
  const unlockedCount     = unlockedAchievements.length;
  const progressPercent   = totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;
  const totalXp           = unlockedAchievements.reduce((s, a) => s + a.xp_recompensa, 0);

  return (
    <div className="flex-1 overflow-auto">
      {/* Page header */}
      <div className="px-5 md:px-7 pt-7 pb-5 flex items-center gap-3 border-b border-border/40">
        <button
          onClick={() => router.back()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-[var(--duration-fast)]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Trophy className="h-4 w-4 text-amber-500" />
        <h1 className="text-base font-semibold">Conquistas</h1>
        <span className="ml-auto text-[11px] font-medium text-muted-foreground/50">
          {unlockedCount} / {totalAchievements}
        </span>
      </div>

      <div className="px-5 md:px-7 py-6 max-w-3xl mx-auto space-y-6">

        {/* Progress card */}
        {!isLoading && totalAchievements > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-[var(--radius-lg)] border border-border/50 bg-card/60 backdrop-blur-sm p-5 overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <p className="text-sm font-semibold">Progresso Geral</p>
              </div>
              <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-px rounded-full">
                +{totalXp} XP total
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, progressPercent)}%` }}
                transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
              />
            </div>
            <p className="text-[11px] text-muted-foreground/50 mt-2">
              {unlockedCount} de {totalAchievements} conquistas desbloqueadas
            </p>
          </motion.div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[76px] rounded-[var(--radius-lg)]" />
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
                        "flex items-center gap-4 p-4 rounded-[var(--radius-lg)] border bg-gradient-to-r backdrop-blur-sm",
                        meta.glow,
                      )}
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-2xl shrink-0">
                        {getEmoji(achievement.tipo)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{achievement.nome}</p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">{achievement.descricao}</p>
                        <div className="flex items-center gap-2.5 mt-1.5">
                          <span className={cn("text-[10px] font-semibold px-1.5 py-px rounded-full", meta.pill)}>
                            +{achievement.xp_recompensa} XP
                          </span>
                          {achievement.unlockedAt && (
                            <span className="text-[10px] text-muted-foreground/40 flex items-center gap-1">
                              <Calendar className="h-2.5 w-2.5" />
                              {format(new Date(achievement.unlockedAt), "d 'de' MMM", { locale: ptBR })}
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
                <div className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />
                  <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                    Em Progresso
                  </p>
                  <span className="ml-auto text-[10px] text-muted-foreground/40">
                    {lockedAchievements.length} restantes
                  </span>
                </div>
                {lockedAchievements.map((achievement, i) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    className="flex items-center gap-4 p-4 rounded-[var(--radius-lg)] border border-border/30 bg-card/30 opacity-60 hover:opacity-90 transition-opacity"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-2xl grayscale shrink-0">
                      {getEmoji(achievement.tipo)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{achievement.nome}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{achievement.descricao}</p>
                      <span className="mt-1.5 inline-block text-[10px] text-muted-foreground/40 border border-border/40 px-1.5 py-px rounded-full">
                        +{achievement.xp_recompensa} XP
                      </span>
                    </div>
                    <Lock className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Empty */}
            {(!achievements || achievements.length === 0) && (
              <div className="py-16 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-sm font-medium text-muted-foreground/60">Nenhuma conquista disponível</p>
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
