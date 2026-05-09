"use client";

import { useGamification } from "@/hooks/useGamification";
import { useNucleos } from "@/hooks/useNucleo";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3, Zap, Flame, Trophy, Target, TrendingUp,
  CheckCircle2, Lock, Sparkles, Award, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function InsightsPage() {
  const { useStats, useAchievements, useStreak, useXpHistory } = useGamification();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: achievements = [], isLoading: achievementsLoading } = useAchievements();
  const { data: streak } = useStreak();
  const { data: xpHistory = [] } = useXpHistory(14);
  const { data: nucleos = [] } = useNucleos();

  const isLoading = statsLoading || achievementsLoading;

  const unlockedCount = (achievements as any[]).filter((a) => a.unlocked).length;
  const totalCount = (achievements as any[]).length;
  const nextAchievements = (achievements as any[])
    .filter((a) => !a.unlocked)
    .slice(0, 3);

  // Productivity score (0–100) based on available signals
  const streak7 = Math.min(streak?.currentStreak ?? 0, 7);
  const streakScore = Math.round((streak7 / 7) * 40);
  const achScore = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 30) : 0;
  const xpScore = Math.min(Math.round(((stats?.todayXp ?? 0) / 50) * 30), 30);
  const productivityScore = streakScore + achScore + xpScore;

  const insights = buildInsights(stats, streak, unlockedCount, totalCount);

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="px-5 md:px-8 pt-7 pb-5 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/8">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">Insights</h1>
            <p className="text-[11px] text-muted-foreground/50 mt-px">
              Seu progresso e métricas de produtividade
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 md:p-8 max-w-3xl mx-auto space-y-5">

        {/* Productivity score */}
        {isLoading ? (
          <Skeleton className="h-[140px] rounded-[var(--radius-lg)]" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-[var(--radius-lg)] border border-primary/20 bg-gradient-to-br from-primary/6 via-primary/4 to-transparent backdrop-blur-sm p-5 overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold">Score de Produtividade</p>
                </div>
                <p className="text-4xl font-bold tabular-nums text-primary">{productivityScore}</p>
                <p className="text-xs text-muted-foreground/50 mt-1">baseado em streak, conquistas e XP diário</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <ScorePill label="Streak" value={streak7} max={7} color="orange" />
                <ScorePill label="Conquistas" value={unlockedCount} max={totalCount} color="amber" />
                <ScorePill label="XP Hoje" value={stats?.todayXp ?? 0} max={50} color="blue" />
              </div>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-muted/30 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${productivityScore}%` }}
                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1], delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
              />
            </div>
          </motion.div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {isLoading ? (
            [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-[var(--radius-lg)]" />)
          ) : (
            <>
              <StatCard title="Nível" value={stats?.level ?? 1} icon={<Zap className="h-4 w-4" />} sub={`${stats?.totalXp ?? 0} XP total`} delay={0} />
              <StatCard title="Streak" value={`${streak?.currentStreak ?? 0}d`} icon={<Flame className="h-4 w-4" />} sub={`Recorde: ${streak?.maxStreak ?? 0} dias`} delay={0.06} />
              <StatCard title="Conquistas" value={`${unlockedCount}/${totalCount}`} icon={<Trophy className="h-4 w-4" />} sub={`${totalCount - unlockedCount} restantes`} delay={0.12} />
              <StatCard title="Núcleos" value={(nucleos as any[]).length} icon={<Star className="h-4 w-4" />} sub="criados" delay={0.18} />
            </>
          )}
        </div>

        {/* Insights list */}
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/40 mb-3 px-1">
            Recomendações
          </h2>
          <div className="space-y-2">
            {isLoading ? (
              [0, 1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)
            ) : (
              insights.map((insight, i) => (
                <motion.div
                  key={insight.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border",
                    "bg-card/60 backdrop-blur-sm",
                    insight.done
                      ? "border-emerald-500/20 bg-emerald-500/4"
                      : "border-border/50",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl mt-px",
                      insight.done ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/8 text-primary",
                    )}
                  >
                    {insight.done ? <CheckCircle2 className="h-4 w-4" /> : <insight.icon className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">{insight.label}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">{insight.desc}</p>
                  </div>
                  {insight.done && (
                    <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-px rounded-full shrink-0">
                      Feito
                    </span>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Next achievements */}
        {nextAchievements.length > 0 && (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/40 mb-3 px-1">
              Próximas Conquistas
            </h2>
            <div className="space-y-2">
              {nextAchievements.map((a: any, i: number) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.06 }}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm opacity-60"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted/30">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{a.nome}</p>
                    {a.descricao && <p className="text-xs text-muted-foreground/50 mt-0.5 truncate">{a.descricao}</p>}
                  </div>
                  <span className="text-[10px] font-semibold text-primary/60 bg-primary/8 px-1.5 py-px rounded-full shrink-0">
                    +{a.xp_recompensa ?? 100} XP
                  </span>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* XP History mini-chart */}
        {(xpHistory as any[]).length > 0 && (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/40 mb-3 px-1">
              Histórico de XP
            </h2>
            <div className="rounded-[var(--radius-lg)] border border-border/50 bg-card/60 backdrop-blur-sm p-4">
              <XpMiniChart items={xpHistory as any[]} />
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StatCard({
  title, value, icon, sub, delay,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  sub: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay }}
      className={cn(
        "relative flex flex-col gap-2.5 rounded-[var(--radius-lg)] border border-border/50",
        "bg-card/60 backdrop-blur-sm p-4 overflow-hidden",
        "hover:border-border/80 hover:shadow-[var(--shadow-xs)] hover:-translate-y-px",
        "transition-all duration-[var(--duration-base)]",
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/6 to-transparent" />
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">{title}</p>
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/8 text-primary">{icon}</div>
      </div>
      <div>
        <p className="text-xl font-bold tracking-tight tabular-nums">{value}</p>
        <p className="text-[11px] text-muted-foreground/50 mt-0.5">{sub}</p>
      </div>
    </motion.div>
  );
}

function ScorePill({
  label, value, max, color,
}: {
  label: string;
  value: number;
  max: number;
  color: "orange" | "amber" | "blue";
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const colors = {
    orange: { bg: "bg-orange-500/10", text: "text-orange-500", bar: "bg-orange-500" },
    amber:  { bg: "bg-amber-500/10",  text: "text-amber-500",  bar: "bg-amber-500"  },
    blue:   { bg: "bg-blue-500/10",   text: "text-blue-500",   bar: "bg-blue-500"   },
  };
  const c = colors[color];

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <p className="text-[10px] text-muted-foreground/50 w-16 text-right shrink-0">{label}</p>
      <div className="flex-1 h-1 rounded-full bg-muted/30 overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-700", c.bar)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn("text-[10px] font-semibold w-8 shrink-0", c.text)}>{value}</span>
    </div>
  );
}

function XpMiniChart({ items }: { items: any[] }) {
  const recent = items.slice(-14);
  const grouped: Record<string, number> = {};
  recent.forEach((item) => {
    const d = item.created_at ? item.created_at.slice(0, 10) : "?";
    grouped[d] = (grouped[d] || 0) + (item.xp_amount || 0);
  });
  const entries = Object.entries(grouped).slice(-10);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  if (entries.length === 0) return null;

  return (
    <div className="flex items-end gap-1.5 h-16">
      {entries.map(([date, xp]) => {
        const h = Math.max(4, Math.round((xp / max) * 100));
        return (
          <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className="w-full rounded-t-sm bg-primary/30 group-hover:bg-primary/50 transition-colors duration-[var(--duration-fast)]"
              style={{ height: `${h}%` }}
            />
            <span className="text-[8px] text-muted-foreground/30 tabular-nums">
              {date.slice(5)}
            </span>
            {/* Tooltip */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-card border border-border/60 rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap shadow-sm z-10">
              {xp} XP
            </div>
          </div>
        );
      })}
    </div>
  );
}

function buildInsights(
  stats: any,
  streak: any,
  unlockedCount: number,
  totalCount: number,
) {
  const items: Array<{
    label: string;
    desc: string;
    done: boolean;
    icon: React.ElementType;
  }> = [];

  // Streak insight
  const currentStreak = streak?.currentStreak ?? 0;
  if (currentStreak >= 7) {
    items.push({ label: "Streak de 7 dias atingido!", desc: "Você está em uma sequência incrível. Continue assim.", done: true, icon: Flame });
  } else if (currentStreak > 0) {
    items.push({ label: `Mantenha o streak (${currentStreak} dias)`, desc: `Faltam ${7 - currentStreak} dias para atingir uma semana seguida.`, done: false, icon: Flame });
  } else {
    items.push({ label: "Comece um streak hoje", desc: "Use qualquer funcionalidade do Nucleos para iniciar sua sequência.", done: false, icon: Flame });
  }

  // XP hoje
  const todayXp = stats?.todayXp ?? 0;
  if (todayXp >= 50) {
    items.push({ label: "Meta de XP diária atingida", desc: `Você ganhou ${todayXp} XP hoje. Excelente desempenho!`, done: true, icon: Zap });
  } else {
    items.push({ label: `Ganhe ${50 - todayXp} XP ainda hoje`, desc: "Complete tarefas, registre hábitos ou crie conteúdo para ganhar XP.", done: false, icon: Zap });
  }

  // Conquistas
  const pct = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;
  if (pct >= 50) {
    items.push({ label: `${pct}% das conquistas desbloqueadas`, desc: "Você está progredindo bem na coleção de conquistas.", done: true, icon: Trophy });
  } else {
    items.push({ label: "Explore mais conquistas", desc: `${unlockedCount} de ${totalCount} desbloqueadas. Crie blocos e registre hábitos para desbloquear mais.`, done: false, icon: Trophy });
  }

  // Level
  if ((stats?.level ?? 1) >= 5) {
    items.push({ label: `Nível ${stats?.level} alcançado`, desc: "Você está entre os usuários mais engajados.", done: true, icon: Target });
  } else {
    items.push({ label: "Suba de nível", desc: `Nível ${stats?.level ?? 1}. Ganhe XP completando ações para avançar.`, done: false, icon: TrendingUp });
  }

  return items;
}
