"use client";

import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LevelCard } from "@/components/gamification/LevelCard";
import { StreaksList } from "@/components/gamification/StreaksList";
import { ConquistasList } from "@/components/gamification/ConquistasList";
import { Leaderboard } from "@/components/gamification/Leaderboard";
import { XPHistoryList } from "@/components/gamification/XPHistoryList";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGamification } from "@/hooks/useGamification";
import { Zap } from "lucide-react";

const xpChartConfig = {
  xp: { label: "XP Ganho", color: "var(--chart-1)" },
};

function processXpHistory(
  history: any[],
  days: number,
): { date: string; xp: number }[] {
  const now = new Date();
  const buckets: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    buckets[d.toISOString().slice(0, 10)] = 0;
  }
  history.forEach((t) => {
    const key = (t.created_at || "").slice(0, 10);
    if (key in buckets) buckets[key] = (buckets[key] || 0) + (t.xp_amount || 0);
  });
  return Object.entries(buckets).map(([date, xp]) => ({
    date: new Date(date + "T12:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }),
    xp,
  }));
}

export default function GamificacaoPage() {
  const { useXpHistory, useStats, useStreak } = useGamification();
  const { data: xpHistory = [] } = useXpHistory(200);
  const { data: stats } = useStats();
  const { data: streak } = useStreak();

  const chartData = useMemo(
    () => processXpHistory(xpHistory as any[], 14),
    [xpHistory],
  );

  const totalXpWeek = useMemo(
    () => chartData.slice(-7).reduce((s, d) => s + d.xp, 0),
    [chartData],
  );

  return (
    <div className="flex-1 overflow-auto">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 px-5 md:px-6 h-14 flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8">
          <Zap className="h-3.5 w-3.5 text-primary" />
        </div>
        <h1 className="text-sm font-semibold tracking-tight">Gamificação</h1>
        <span className="ml-auto text-[11px] text-muted-foreground/50">
          Nível {stats?.level ?? 1} · {stats?.totalXp?.toLocaleString() ?? 0} XP total
        </span>
      </div>

      <div className="p-5 md:p-6 max-w-[1400px] mx-auto space-y-5">
        {/* XP History Chart */}
        <Card className="py-4 gap-2">
          <CardHeader className="px-5 pb-0 pt-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Histórico de XP
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Últimos 14 dias · {totalXpWeek.toLocaleString()} XP nesta semana
                </CardDescription>
              </div>
              {streak?.currentStreak != null && streak.currentStreak > 0 && (
                <span className="text-xs font-semibold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full">
                  🔥 {streak.currentStreak} dias
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-2 pt-2 pb-0">
            <ChartContainer config={xpChartConfig} className="h-[200px] w-full">
              <AreaChart
                data={chartData}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillXpGamif" x1="0" y1="0" x2="0" y2="1">
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
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={1}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#fillXpGamif)"
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Level + Streak cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <LevelCard />
          <StreaksList />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="conquistas" className="space-y-5">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
            <TabsTrigger value="leaderboard">Ranking Global</TabsTrigger>
            <TabsTrigger value="history">Histórico de XP</TabsTrigger>
          </TabsList>

          <TabsContent value="conquistas">
            <ConquistasList />
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="history">
            <XPHistoryList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
