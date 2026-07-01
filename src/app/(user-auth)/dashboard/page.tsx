"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth";
import { CreateNucleoModal } from "@/components/nucleo/nucleo-create-modal";
import {
  Trophy,
  Flame,
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGamification } from "@/hooks/useGamification";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AreaChart, Area, XAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { NucleosOverview } from "@/components/nucleo/nucleos-overview";
import WeeklyPulseWidget from "@/components/user/WeeklyPulseWidget";
import Link from "next/link";

const xpChartConfig = {
  xp: { label: "XP Ganho", color: "var(--chart-1)" },
};

function processXpHistory(history: any[]): { date: string; xp: number }[] {
  const now = new Date();
  const days: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days[d.toISOString().slice(0, 10)] = 0;
  }
  history.forEach((t) => {
    const key = (t.created_at || "").slice(0, 10);
    if (key in days) days[key] = (days[key] || 0) + (t.xp_amount || 0);
  });
  return Object.entries(days).map(([date, xp]) => ({
    date: new Date(date).toLocaleDateString("pt-BR", { weekday: "short" }),
    xp,
  }));
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { useStats, useAchievements, useStreak, useXpHistory } =
    useGamification();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: achievements } = useAchievements();
  const { data: streak, isLoading: streakLoading } = useStreak();
  const { data: xpHistory = [] } = useXpHistory(200);

  const hora = new Date().getHours();
  const saudacao =
    hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const firstName = user?.fullName?.split(" ")[0] || "";

  const levelProgress = stats ? (stats.currentXp / stats.nextLevelXp) * 100 : 0;
  const unlockedAchievements =
    achievements?.filter((a) => a.unlocked).length || 0;
  const totalAchievements = achievements?.length || 0;

  const chartData = useMemo(
    () => processXpHistory(xpHistory as any[]),
    [xpHistory],
  );

  const metricCards = [
    {
      title: "Nível",
      value: stats?.level ?? 1,
      trendLabel: `${Math.round(levelProgress)}% para o próximo`,
      trend: 1,
      icon: Zap,
      color: "text-primary",
      bgColor: "bg-primary/8",
      href: "/dashboard/gamificacao",
    },
    {
      title: "Streak",
      value: `${streak?.currentStreak ?? 0}d`,
      trendLabel: `Recorde: ${streak?.maxStreak ?? 0} dias`,
      trend: (streak?.currentStreak ?? 0) > 0 ? 1 : -1,
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/8",
      href: "/dashboard/conquistas",
    },
    {
      title: "Conquistas",
      value: `${unlockedAchievements}/${totalAchievements}`,
      trendLabel: `${totalAchievements - unlockedAchievements} restantes`,
      trend: unlockedAchievements > 0 ? 1 : 0,
      icon: Trophy,
      color: "text-amber-500",
      bgColor: "bg-amber-500/8",
      href: "/dashboard/conquistas",
    },
    {
      title: "XP Hoje",
      value: `+${stats?.todayXp ?? 0}`,
      trendLabel: `Total: ${stats?.totalXp ?? 0} XP`,
      trend: (stats?.todayXp ?? 0) > 0 ? 1 : 0,
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/8",
      href: "/dashboard/gamificacao",
    },
  ];

  const isLoading = statsLoading || streakLoading;

  return (
    <div className="flex-1 overflow-auto">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-5 md:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8">
            <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
          </div>
          <h1 className="text-sm font-semibold tracking-tight">Dashboard</h1>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          Novo Núcleo
        </button>
      </div>

      <div className="p-5 md:p-6 max-w-[1400px] mx-auto space-y-5">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="pt-1"
        >
          <h2 className="text-2xl font-bold tracking-tight">
            {firstName ? (
              <>
                {saudacao},{" "}
                <span className="bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] bg-clip-text text-transparent">
                  {firstName}
                </span>
                .
              </>
            ) : (
              <>{saudacao}.</>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Aqui está o resumo do seu progresso.
          </p>
        </motion.div>

        {/* 4 Metric cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[118px] rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {metricCards.map((card, i) => (
              <Link key={card.title} href={card.href} className="block">
                <Card className="py-4 gap-2 hover:shadow-md hover:border-border transition-all cursor-pointer h-full">
                  <CardHeader className="px-4 pb-0 pt-0">
                    <div className="flex items-center justify-between gap-2">
                      <CardDescription className="text-[10px] font-semibold uppercase tracking-widest truncate">
                        {card.title}
                      </CardDescription>
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg shrink-0",
                          card.bgColor,
                        )}
                      >
                        <card.icon className={cn("h-3.5 w-3.5", card.color)} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pt-0 pb-0">
                    <motion.p
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + i * 0.04 }}
                      className="text-2xl font-bold tracking-tight tabular-nums"
                    >
                      {card.value}
                    </motion.p>
                    <div className="flex items-center gap-1 mt-1">
                      {card.trend > 0 ? (
                        <TrendingUp className="h-3 w-3 text-emerald-500 shrink-0" />
                      ) : card.trend < 0 ? (
                        <TrendingDown className="h-3 w-3 text-red-500 shrink-0" />
                      ) : null}
                      <p className="text-[11px] text-muted-foreground truncate">
                        {card.trendLabel}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </motion.div>
        )}

        {/* XP Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <Card className="py-4 gap-2">
            <CardHeader className="px-5 pb-0 pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    XP esta semana
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Evolução dos últimos 7 dias
                  </CardDescription>
                </div>
                <Link
                  href="/dashboard/gamificacao"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors shrink-0"
                >
                  Histórico <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-2 pt-2 pb-0">
              <ChartContainer
                config={xpChartConfig}
                className="h-[160px] w-full"
              >
                <AreaChart
                  data={chartData}
                  margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillXpDash" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--chart-1)"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    strokeOpacity={0.4}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="xp"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    fill="url(#fillXpDash)"
                    dot={false}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly pulse */}
        {/* <WeeklyPulseWidget delay={0.13} /> */}

        {/* Nucleos overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <Card className="py-0 gap-0 overflow-hidden">
            <CardHeader className="px-5 py-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    Meus Núcleos
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Acesse seus espaços de organização
                  </CardDescription>
                </div>
                <Link
                  href="/dashboard/nucleos"
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  Ver todos <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <NucleosOverview limit={3} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <CreateNucleoModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
