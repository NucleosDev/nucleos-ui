"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth";
import { NucleosOverview } from "@/components/nucleo/nucleos-overview";
import { CreateNucleoModal } from "@/components/nucleo/nucleo-create-modal";
import { Trophy, Flame, Zap, Sparkles, ChevronRight, BatteryMedium } from "lucide-react";
import { motion } from "framer-motion";
import { BadgeAII } from "@/components/ui/badge-ai";
import { useGamification } from "@/hooks/useGamification";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import XPSparklineWidget from "@/components/user/XPSparklineWidget";
import WeeklyPulseWidget from "@/components/user/WeeklyPulseWidget";
import VibeCheckWidget from "@/components/user/VibeCheckWidget";
import { OrbitWorkspace } from "@/components/orbit/orbit-workspace";
import { ProximaAcao } from "@/components/home/proxima-acao";
import { TimelineContextual } from "@/components/home/timeline-contextual";
import { ReentryBanner } from "@/components/home/reentry-banner";
import { useTarefasVencendo } from "@/hooks/useTarefasVencendo";
import { useNucleos } from "@/hooks/useNucleo";
import type { Nucleo } from "@/types/nucleo";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { useStats, useAchievements, useStreak, useEnergy } = useGamification();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: achievements } = useAchievements();
  const { data: streak, isLoading: streakLoading } = useStreak();
  const { data: energy } = useEnergy();

  const { data: tarefasVencendo = [], isLoading: tarefasLoading } = useTarefasVencendo();
  const { data: nucleos = [] } = useNucleos();

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const firstName = user?.fullName?.split(" ")[0] || "";

  // Encontra o nucleo correspondente à tarefa mais urgente
  const nucleoMaisUrgente = useMemo(() => {
    const tarefaMaisUrgente = tarefasVencendo[0];
    if (!tarefaMaisUrgente) return undefined;
    return nucleos.find((n: Nucleo) =>
      n.blocos?.some((b) => b.id === tarefaMaisUrgente.blocoId),
    );
  }, [tarefasVencendo, nucleos]);

  const levelProgress = stats ? (stats.currentXp / stats.nextLevelXp) * 100 : 0;
  const unlockedAchievements = achievements?.filter((a) => a.unlocked).length || 0;
  const totalAchievements = achievements?.length || 0;

  const quickActions = [
    {
      label: "Criar novo Núcleo",
      icon: Sparkles,
      href: "/dashboard/nucleos",
    },
    {
      label: "Ver conquistas",
      icon: Trophy,
      href: "/dashboard/conquistas",
    },
    {
      label: "Meu progresso",
      icon: Flame,
      href: "/dashboard/conquistas",
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-5 md:p-8 max-w-[1400px] mx-auto space-y-7">

        {/* ── 1. SAUDAÇÃO ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3"
        >
          <div className="h-8 w-1 bg-gradient-to-b from-[#4D7CFF] to-[#00C9A7] rounded-full" />
          <h1 className="text-[2rem] font-bold tracking-tight">
            {firstName ? (
              <>
                {saudacao},{" "}
                <span className="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                  {firstName}
                </span>
                .
              </>
            ) : (
              <>{saudacao}.</>
            )}
          </h1>
          <VibeCheckWidget delay={0.15} />
        </motion.div>

        {/* ── 2. BANNER DE REENTRADA ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
        >
          <ReentryBanner />
        </motion.div>

        {/* ── 3. ORBIT — entrada principal ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        >
          <OrbitWorkspace compact />
        </motion.div>

        {/* ── 4. PRÓXIMA AÇÃO ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <ProximaAcao
            tarefa={tarefasVencendo[0]}
            isLoading={tarefasLoading}
            nucleoNome={nucleoMaisUrgente?.nome}
            nucleoCor={nucleoMaisUrgente?.corDestaque || "#4D7CFF"}
            onIniciarFoco={(tarefaId) => {
              const tarefa = tarefasVencendo[0];
              const nucleo = nucleoMaisUrgente;
              const params = new URLSearchParams({
                tarefaId,
                titulo: tarefa?.titulo ?? "",
                nucleoNome: nucleo?.nome ?? "",
                cor: nucleo?.corDestaque ?? "#4D7CFF",
                nucleoId: nucleo?.id ?? "",
              });
              router.push(`/dashboard/foco?${params.toString()}`);
            }}
          />
        </motion.div>

        {/* ── 5. LINHA DO TEMPO ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <TimelineContextual tarefas={tarefasVencendo} />
        </motion.div>

        {/* ── 6. AI BADGE (desktop) ─────────────────────────────── */}
        <div className="hidden md:block">
          <BadgeAII />
        </div>

        {/* ── 6. NÚCLEOS RECENTES ──────────────────────────────── */}
        <section>
          <NucleosOverview variant="recent" limit={3} />
        </section>

        {/* ── 7. STATS + AÇÕES RÁPIDAS ─────────────────────────── */}
        {statsLoading || streakLoading ? (
          <Skeleton className="h-[220px] rounded-[var(--radius-lg)] w-full" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Stats quadrant — 2/3 */}
            <div className="lg:col-span-2">
              <StatsQuadrant
                stats={{
                  level: stats?.level || 1,
                  totalXp: stats?.totalXp || 0,
                  levelProgress,
                  streak: streak?.currentStreak || 0,
                  maxStreak: streak?.maxStreak || 0,
                  unlockedAchievements,
                  totalAchievements,
                  energy: energy
                    ? { current: energy.energy, max: energy.maxEnergy }
                    : null,
                }}
              />
            </div>

            {/* Quick Actions — 1/3 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
            >
              <LiquidGlass
                variant="subtle"
                radius="var(--radius-lg)"
                interactive={false}
                className="h-full"
              >
                <div className="px-5 py-3.5 border-b border-border/30">
                  <h3 className="text-sm font-semibold">Ações Rápidas</h3>
                  <p className="text-xs text-muted-foreground/50 mt-0.5">
                    Acesse rapidamente
                  </p>
                </div>
                <div className="p-2.5 space-y-1">
                  {quickActions.map((action) => (
                    <div
                      key={action.label}
                      onClick={() => router.push(action.href)}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted/20 transition-colors duration-150"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/8 group-hover:bg-primary/15 text-primary transition-colors duration-150">
                        <action.icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1 text-sm font-medium text-foreground/70 group-hover:text-foreground/90 transition-colors duration-150">
                        {action.label}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors duration-150" />
                    </div>
                  ))}
                </div>
              </LiquidGlass>
            </motion.div>
          </div>
        )}

        {/* ── 8. WIDGETS XP + WEEKLY ───────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">
          <XPSparklineWidget delay={0.1} />
          <WeeklyPulseWidget delay={0.15} />
        </div>

      </div>

      <CreateNucleoModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}

// ── StatsQuadrant ────────────────────────────────────────────────────────────

interface StatsQuadrantProps {
  stats: {
    level: number;
    totalXp: number;
    levelProgress: number;
    streak: number;
    maxStreak: number;
    unlockedAchievements: number;
    totalAchievements: number;
    energy: { current: number; max: number } | null;
  };
  delay?: number;
}

function StatsQuadrant({ stats, delay = 0 }: StatsQuadrantProps) {
  const {
    level, totalXp, levelProgress, streak, maxStreak,
    unlockedAchievements, totalAchievements, energy,
  } = stats;

  const quadrants = [
    {
      title: "Nível",
      value: level,
      icon: <Zap className="h-4 w-4" />,
      description: `${totalXp} XP total`,
      progress: levelProgress,
      valueColor: "text-foreground",
    },
    {
      title: "Streak",
      value: streak,
      icon: <Flame className="h-4 w-4" />,
      description: `Melhor: ${maxStreak} dias`,
      valueColor: "text-foreground",
    },
    {
      title: "Conquistas",
      value: `${unlockedAchievements}/${totalAchievements}`,
      icon: <Trophy className="h-4 w-4" />,
      description: `${totalAchievements - unlockedAchievements} restantes`,
      valueColor: "text-foreground",
    },
    {
      title: "Energia",
      value: energy ? `${energy.current}/${energy.max}` : "—",
      icon: <BatteryMedium className="h-4 w-4" />,
      description: "pontos disponíveis",
      progress: energy ? (energy.current / energy.max) * 100 : undefined,
      valueColor: energy
        ? energy.current > energy.max * 0.5
          ? "text-primary-500"
          : energy.current > energy.max * 0.2
          ? "text-primary-500"
          : "text-red-500"
        : "text-muted-foreground",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <LiquidGlass variant="subtle" radius="var(--radius-lg)" interactive={false}>
        <div className="grid grid-cols-2">
          <QuadrantCell data={quadrants[0]} delay={delay} showRightBorder showBottomBorder />
          <QuadrantCell data={quadrants[1]} delay={delay + 0.05} showBottomBorder />
          <QuadrantCell data={quadrants[2]} delay={delay + 0.1} showRightBorder />
          <QuadrantCell data={quadrants[3]} delay={delay + 0.15} />
        </div>
      </LiquidGlass>
    </motion.div>
  );
}

// ── QuadrantCell ─────────────────────────────────────────────────────────────

interface QuadrantCellProps {
  data: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    description: string;
    progress?: number;
    valueColor: string;
  };
  delay?: number;
  showRightBorder?: boolean;
  showBottomBorder?: boolean;
}

function QuadrantCell({ data, delay = 0, showRightBorder, showBottomBorder }: QuadrantCellProps) {
  return (
    <div
      className={cn(
        "group relative p-4 sm:p-5 hover:bg-accent/5 transition-colors duration-[var(--duration-fast)]",
        showRightBorder && "border-r border-border/20",
        showBottomBorder && "border-b border-border/20",
      )}
    >
      <div className="flex items-start justify-between mb-2.5">
        <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
          {data.title}
        </p>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8 text-primary shrink-0 transition-transform duration-[var(--duration-fast)] group-hover:scale-110">
          {data.icon}
        </div>
      </div>

      <div>
        <motion.p
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: delay + 0.1 }}
          className={cn("text-xl sm:text-2xl font-bold tracking-tight tabular-nums", data.valueColor)}
        >
          {data.value}
        </motion.p>
        <p className="text-[11px] text-muted-foreground/50 mt-0.5">{data.description}</p>

        {data.progress !== undefined && (
          <div className="mt-3 h-1 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, data.progress)}%` }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: delay + 0.2 }}
              className={cn(
                "h-full rounded-full",
                data.title === "Energia"
                  ? data.progress > 50
                    ? "bg-primary/60"
                    : data.progress > 20
                    ? "bg-primary-500/60"
                    : "bg-red-500/60"
                  : "bg-primary/60",
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
