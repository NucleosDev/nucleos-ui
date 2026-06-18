"use client";

import { useGamification } from "@/hooks/useGamification";
import { useNucleos } from "@/hooks/useNucleo";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Flame, Zap, Trophy, Lock, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// ── Narrative engine ──────────────────────────────────────────────────────────

function buildNarrative(
  streak: any,
  stats: any,
  unlockedCount: number,
  totalCount: number,
  nucleosCount: number,
): { headline: string; lines: string[]; tone: "celebrating" | "encouraging" | "neutral" } {
  const currentStreak = streak?.currentStreak ?? 0;
  const maxStreak = streak?.maxStreak ?? 0;
  const level = stats?.level ?? 1;
  const todayXp = stats?.todayXp ?? 0;
  const totalXp = stats?.totalXp ?? 0;
  const isActive = todayXp > 0;

  if (currentStreak >= 14) {
    return {
      tone: "celebrating",
      headline: `${currentStreak} dias seguidos. Isso é raro.`,
      lines: [
        `Você está em uma das streaks mais longas que já registramos.`,
        nucleosCount > 0
          ? `Com ${nucleosCount} núcleo${nucleosCount !== 1 ? "s" : ""} ativos, você construiu um sistema que funciona — e que você usa.`
          : `A consistência que você demonstrou aqui é o ingrediente mais difícil de produtividade.`,
        totalXp > 500
          ? `${totalXp} XP no total. Cada ponto representa uma ação real, um hábito mantido, um compromisso cumprido.`
          : "Continue assim. A maioria das pessoas desiste antes de chegar aqui.",
      ],
    };
  }

  if (currentStreak >= 7) {
    return {
      tone: "celebrating",
      headline: `Uma semana inteira de consistência.`,
      lines: [
        `Sete dias é o primeiro ponto de inflexão. É quando o hábito começa a virar rotina.`,
        isActive
          ? `E hoje você já está aqui, de novo. Isso conta.`
          : `Ainda há tempo hoje para manter o ritmo.`,
        maxStreak > currentStreak
          ? `Seu recorde é ${maxStreak} dias — você já sabe que consegue ir mais longe.`
          : "Você está batendo seu próprio recorde a cada dia.",
      ],
    };
  }

  if (currentStreak >= 3) {
    return {
      tone: "encouraging",
      headline: `${currentStreak} dias. A consistência está se formando.`,
      lines: [
        `Os primeiros dias são os mais difíceis — você já passou por eles.`,
        `Sistemas de hábito levam entre 14 e 21 dias para se consolidar. Você está no caminho certo.`,
        isActive
          ? `Hoje você já se moveu. Isso é o que importa.`
          : `Faça uma coisa pequena hoje. Qualquer uma. Só para manter o fio.`,
      ],
    };
  }

  if (currentStreak === 1) {
    return {
      tone: "encouraging",
      headline: `Primeiro dia de uma nova sequência.`,
      lines: [
        `Todo recorde começa com um único dia. Este pode ser o começo do seu maior streak.`,
        level > 1
          ? `Você está no nível ${level} — já tem histórico aqui. Use isso como combustível.`
          : `Não existe momento errado para começar. O momento certo é agora.`,
        `Volte amanhã. É tudo que você precisa fazer.`,
      ],
    };
  }

  if (totalXp > 0) {
    return {
      tone: "encouraging",
      headline: `Bem-vindo de volta.`,
      lines: [
        `Você construiu algo aqui — ${totalXp} XP, ${unlockedCount} conquista${unlockedCount !== 1 ? "s" : ""}, ${nucleosCount} núcleo${nucleosCount !== 1 ? "s" : ""}.`,
        `Isso não desaparece. Tudo que você criou está aqui, esperando por você.`,
        `Recomeçar não é fracasso. É exatamente o que os sistemas são para — dar estrutura quando a motivação some.`,
      ],
    };
  }

  return {
    tone: "neutral",
    headline: "O espelho está se calibrando.",
    lines: [
      "Use o Nucleos por alguns dias e este painel vai refletir sua jornada em detalhes.",
      "Cada ação que você toma aqui vira narrativa. Cada hábito mantido, cada tarefa concluída.",
      "Comece por um núcleo. O resto se constrói sozinho.",
    ],
  };
}

function buildMicrovitorias(
  streak: any,
  stats: any,
  unlockedCount: number,
  nucleosCount: number,
): Array<{ text: string; done: boolean; icon: React.ElementType }> {
  const vitórias = [];
  const currentStreak = streak?.currentStreak ?? 0;
  const todayXp = stats?.todayXp ?? 0;
  const level = stats?.level ?? 1;

  vitórias.push({
    text: currentStreak > 0
      ? `Streak ativo: ${currentStreak} dia${currentStreak !== 1 ? "s" : ""} seguidos`
      : "Comece uma streak hoje",
    done: currentStreak > 0,
    icon: Flame,
  });

  vitórias.push({
    text: todayXp > 0
      ? `Você ganhou ${todayXp} XP hoje`
      : "Ganhe seu primeiro XP do dia",
    done: todayXp > 0,
    icon: Zap,
  });

  vitórias.push({
    text: unlockedCount > 0
      ? `${unlockedCount} conquista${unlockedCount !== 1 ? "s" : ""} desbloqueada${unlockedCount !== 1 ? "s" : ""}`
      : "Desbloqueie sua primeira conquista",
    done: unlockedCount > 0,
    icon: Trophy,
  });

  vitórias.push({
    text: nucleosCount > 0
      ? `${nucleosCount} núcleo${nucleosCount !== 1 ? "s" : ""} da sua vida organizado${nucleosCount !== 1 ? "s" : ""}`
      : "Crie seu primeiro núcleo",
    done: nucleosCount > 0,
    icon: Star,
  });

  vitórias.push({
    text: level >= 3
      ? `Nível ${level} — você está entre os mais consistentes`
      : `Nível ${level} — continue para desbloquear mais`,
    done: level >= 3,
    icon: TrendingUp,
  });

  return vitórias;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function EspelhoPage() {
  const { useStats, useAchievements, useStreak, useXpHistory } = useGamification();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: achievements = [], isLoading: achievementsLoading } = useAchievements();
  const { data: streak } = useStreak();
  const { data: xpHistory = [] } = useXpHistory(14);
  const { data: nucleos = [] } = useNucleos();

  const isLoading = statsLoading || achievementsLoading;
  const unlockedCount = (achievements as any[]).filter((a: any) => a.unlocked).length;
  const totalCount = (achievements as any[]).length;
  const nucleosCount = (nucleos as any[]).length;
  const nextAchievements = (achievements as any[]).filter((a: any) => !a.unlocked).slice(0, 2);

  const narrative = buildNarrative(streak, stats, unlockedCount, totalCount, nucleosCount);
  const microvitorias = buildMicrovitorias(streak, stats, unlockedCount, nucleosCount);

  const toneColors = {
    celebrating: { bg: "from-amber-500/6 via-primary/4", border: "border-amber-500/15", icon: "bg-amber-500/10 text-amber-400" },
    encouraging: { bg: "from-primary/6 via-primary/3", border: "border-primary/15", icon: "bg-primary/10 text-primary" },
    neutral: { bg: "from-muted/8", border: "border-border/30", icon: "bg-muted/20 text-muted-foreground" },
  };
  const tc = toneColors[narrative.tone];

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-5 md:px-6 h-14 flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight">O Espelho</h1>
        </div>
        <span className="ml-auto text-[11px] text-muted-foreground/50">
          Sua jornada em linguagem humana
        </span>
      </div>

      <div className="p-5 md:p-8 max-w-2xl mx-auto space-y-5">

        {/* Narrative card */}
        {isLoading ? (
          <Skeleton className="h-[180px] rounded-[var(--radius-lg)]" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative rounded-[var(--radius-lg)] border p-6 overflow-hidden",
              `bg-gradient-to-br ${tc.bg} to-transparent`,
              tc.border,
            )}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="flex items-start gap-3 mb-4">
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl mt-0.5", tc.icon)}>
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold leading-snug">{narrative.headline}</h2>
            </div>

            <div className="space-y-2.5 pl-11">
              {narrative.lines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
                  className="text-sm leading-relaxed text-foreground/70"
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Microvitórias */}
        <section>
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/40 mb-3 px-1">
            Microvitórias
          </h2>
          <div className="space-y-2">
            {isLoading ? (
              [0, 1, 2].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)
            ) : (
              microvitorias.map((v, i) => (
                <motion.div
                  key={v.text}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl border",
                    v.done
                      ? "bg-emerald-500/4 border-emerald-500/18"
                      : "bg-card/50 border-border/30 opacity-60",
                  )}
                >
                  <div className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    v.done ? "bg-emerald-500/10 text-emerald-400" : "bg-muted/30 text-muted-foreground/40",
                  )}>
                    <v.icon className="h-3.5 w-3.5" />
                  </div>
                  <p className={cn(
                    "text-sm font-medium flex-1",
                    v.done ? "text-foreground/80" : "text-muted-foreground/50",
                  )}>
                    {v.text}
                  </p>
                  {v.done && (
                    <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                      ✓
                    </span>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Next achievements — unlocked as narrative, not locked icons */}
        {!isLoading && nextAchievements.length > 0 && (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/40 mb-3 px-1">
              O que vem a seguir
            </h2>
            <div className="space-y-2">
              {nextAchievements.map((a: any, i: number) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border/25 bg-card/30"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/20">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground/60">{a.nome}</p>
                    {a.descricao && (
                      <p className="text-xs text-muted-foreground/40 truncate mt-0.5">{a.descricao}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-primary/50 bg-primary/8 px-1.5 py-0.5 rounded-full shrink-0 font-semibold">
                    +{a.xp_recompensa ?? 100} XP
                  </span>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* XP Sparkline — stripped down, narrative framing */}
        {(xpHistory as any[]).length > 0 && (
          <section>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/40 mb-3 px-1">
              Seus últimos 10 dias de energia
            </h2>
            <div className="rounded-[var(--radius-lg)] border border-border/30 bg-card/40 p-4">
              <XpSparkline items={xpHistory as any[]} />
              <p className="text-[11px] text-muted-foreground/35 mt-2 text-center">
                Cada barra é um dia de atividade real
              </p>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

// ── Sparkline ─────────────────────────────────────────────────────────────────

function XpSparkline({ items }: { items: any[] }) {
  const grouped: Record<string, number> = {};
  items.forEach((item) => {
    const d = item.created_at ? item.created_at.slice(0, 10) : "?";
    grouped[d] = (grouped[d] || 0) + (item.xp_amount || 0);
  });
  const entries = Object.entries(grouped).slice(-10);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="flex items-end gap-1.5 h-14">
      {entries.map(([date, xp]) => {
        const h = Math.max(8, Math.round((xp / max) * 100));
        return (
          <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              className="w-full rounded-t-sm bg-primary/25 group-hover:bg-primary/45 transition-colors duration-150"
              style={{ minHeight: "3px" }}
            />
            <span className="text-[8px] text-muted-foreground/25 tabular-nums">
              {date.slice(5)}
            </span>
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-card border border-border/50 rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap shadow-sm z-10">
              {xp} XP
            </div>
          </div>
        );
      })}
    </div>
  );
}
