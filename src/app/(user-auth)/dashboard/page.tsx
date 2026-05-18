"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/auth";
import { NucleosOverview } from "@/components/nucleo/nucleos-overview";
import { CreateNucleoModal } from "@/components/nucleo/nucleo-create-modal";
import {
  Trophy,
  Flame,
  Zap,
  Calendar,
  Sparkles,
  ChevronRight,
  BatteryMedium,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { BadgeAII } from "@/components/ui/badge-ai";
import { useGamification } from "@/hooks/useGamification";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import GoldenHourWidget from "@/components/user/SunWidget";
import MoonPhaseWidget from "@/components/user/MoonPhaseWidget";
import XPSparklineWidget from "@/components/user/XPSparklineWidget";
import WeeklyPulseWidget from "@/components/user/WeeklyPulseWidget";
import NextUnlockWidget from "@/components/user/NextUnlockWidget";
import VibeCheckWidget from "@/components/user/VibeCheckWidget";
import CalendarWidget from "@/components/user/CalendarWidget";

// <CalendarWidget delay={0.1} /> <VibeCheckWidget delay={0.2} />
export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { useStats, useAchievements, useStreak, useEnergy } = useGamification();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: achievements } = useAchievements();
  const { data: streak, isLoading: streakLoading } = useStreak();
  const { data: energy } = useEnergy();
  const { activities, loading: activitiesLoading } = useRecentActivity(5);

  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: ptBR });
  const hora = today.getHours();
  const saudacao =
    hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const firstName = user?.fullName?.split(" ")[0] || "Usuário";

  const levelProgress = stats ? (stats.currentXp / stats.nextLevelXp) * 100 : 0;
  const unlockedAchievements =
    achievements?.filter((a) => a.unlocked).length || 0;
  const totalAchievements = achievements?.length || 0;

  const quickActions = [
    {
      label: "Criar novo Núcleo",
      icon: Sparkles,
      href: "/dashboard/nucleos",
      iconColor: "text-primary",
      iconBg: "bg-primary/8 group-hover:bg-primary/15",
    },
    {
      label: "Ver conquistas",
      icon: Trophy,
      href: "/dashboard/conquistas",
      iconColor: "text-primary",
      iconBg: "bg-primary/8 group-hover:bg-primary/15",
    },
    {
      label: "Meu progresso",
      icon: Flame,
      href: "/dashboard/conquistas",
      iconColor: "text-primary",
      iconBg: "bg-primary/8 group-hover:bg-primary/15",
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-5 md:p-8 max-w-[1600px] mx-auto space-y-7">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-gradient-to-b from-[#4D7CFF] to-[#00C9A7] rounded-full" />

          <h1 className="text-[2.35rem] font-bold tracking-tight">
            Olá
            {/* {saudacao},{" "} */}
            {/* <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
              {firstName}
            </span> */}
            .
          </h1>
          <VibeCheckWidget delay={0.2} />
        </div>
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3"
        >
          {/* <CalendarWidget delay={0.1} /> */}
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-2 w-full"
          >
            <LiquidGlass
              variant="subtle"
              radius="var(--radius-lg)"
              interactive={false}
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground/40" />
                  <h3 className="text-sm font-semibold">Atividade Recente</h3>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-wider">
                  últimas ações
                </span>
              </div>

              {activitiesLoading ? (
                <LiquidGlass
                  variant="subtle"
                  radius="var(--radius-lg)"
                  interactive={false}
                  className="p-4 space-y-3"
                >
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                  ))}
                </LiquidGlass>
              ) : activities && activities.length > 0 ? (
                <ul className="divide-y divide-border/25">
                  {activities.map((activity) => (
                    <li
                      key={activity.id}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-muted/15 transition-colors duration-[var(--duration-fast)]"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/8">
                        <activity.icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground/50">
                          {activity.nucleoName} · {activity.time}
                        </p>
                      </div>
                      {activity.xp && (
                        <span className="text-xs font-semibold text-emerald-500 shrink-0">
                          +{activity.xp} XP
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-12 text-center">
                  <Calendar className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground/60">
                    Nenhuma atividade recente
                  </p>
                  <p className="text-xs text-muted-foreground/40 mt-1">
                    Comece a usar seus Núcleos para ver atividade aqui.
                  </p>
                </div>
              )}
            </LiquidGlass>
          </motion.div>
          {/* <GoldenHourWidget /> */}
          {/* <MoonPhaseWidget /> */}
        </motion.div>

        {/* AI Badge */}
        <div className="hidden md:block">
          <BadgeAII />
        </div>
        <section>
          <NucleosOverview variant="recent" limit={3} />
        </section>
        {/* Stats Quadrant - Cartão Único Dividido em 4 */}
        {statsLoading || streakLoading ? (
          <Skeleton className="h-[220px] rounded-[var(--radius-lg)] w-full" />
        ) : (
          <div className="flex gap-5">
            {/* Calendar Widget - 30% */}
            <div className="w-[30%] shrink-0"></div>

            {/* Stats Quadrant - 70% */}
            <div className="w-[70%]">
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
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
          >
            <LiquidGlass
              variant="subtle"
              radius="var(--radius-lg)"
              interactive={false}
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
                    className="w-full text-sm font-medium text-/70"
                  >
                    <span className="flex items-center gap-3 px-3 py-2.5">
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                          action.iconBg,
                          action.iconColor,
                        )}
                      >
                        <action.icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1 text-left">{action.label}</span>
                      <ChevronRight className="h-3.5 w-3.5 opacity-30" />
                    </span>
                  </div>
                ))}
              </div>
            </LiquidGlass>
          </motion.div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-2 gap-4">
          <XPSparklineWidget delay={0.1} />

          <WeeklyPulseWidget delay={0.15} />
        </div>

        {/* Nucleos section (continua igual) */}

        {/* Nucleos section */}

        {/* Bottom grid */}
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
    level,
    totalXp,
    levelProgress,
    streak,
    maxStreak,
    unlockedAchievements,
    totalAchievements,
    energy,
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
      <LiquidGlass
        variant="subtle"
        radius="var(--radius-lg)"
        interactive={false}
      >
        {/* Grid 2x2 com divisores */}
        <div className="grid grid-cols-2">
          {/* Top Left - Nível */}
          <QuadrantCell
            data={quadrants[0]}
            delay={delay}
            showRightBorder
            showBottomBorder
          />

          {/* Top Right - Streak */}
          <QuadrantCell
            data={quadrants[1]}
            delay={delay + 0.05}
            showBottomBorder
          />

          {/* Bottom Left - Conquistas */}
          <QuadrantCell
            data={quadrants[2]}
            delay={delay + 0.1}
            showRightBorder
          />

          {/* Bottom Right - Energia */}
          <QuadrantCell data={quadrants[3]} delay={delay + 0.15} />
        </div>
      </LiquidGlass>
    </motion.div>
  );
}

// ── QuadrantCell

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

function QuadrantCell({
  data,
  delay = 0,
  showRightBorder,
  showBottomBorder,
}: QuadrantCellProps) {
  return (
    <div
      className={cn(
        "group relative p-4 sm:p-5 hover:bg-accent/5 transition-colors duration-[var(--duration-fast)]",
        showRightBorder && "border-r border-border/20",
        showBottomBorder && "border-b border-border/20",
      )}
    >
      {/* Cabeçalho com título e ícone */}
      <div className="flex items-start justify-between mb-2.5">
        <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
          {data.title}
        </p>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8 text-primary shrink-0 transition-transform duration-[var(--duration-fast)] group-hover:scale-110">
          {data.icon}
        </div>
      </div>

      {/* Valor e descrição */}
      <div>
        <motion.p
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: delay + 0.1 }}
          className={cn(
            "text-xl sm:text-2xl font-bold tracking-tight tabular-nums",
            data.valueColor,
          )}
        >
          {data.value}
        </motion.p>
        <p className="text-[11px] text-muted-foreground/50 mt-0.5">
          {data.description}
        </p>

        {/* Barra de progresso */}
        {data.progress !== undefined && (
          <div className="mt-3 h-1 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, data.progress)}%` }}
              transition={{
                duration: 0.8,
                ease: [0.25, 1, 0.5, 1],
                delay: delay + 0.2,
              }}
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

      {/* Indicador de hover sutil */}
      {/* <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-fast)] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent" />
      </div> */}
    </div>
  );
}
