"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/auth";
import { usersService } from "@/services/users.service";
import { progressService } from "@/services/progress.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Zap, Award, Calendar, Clock, Target } from "lucide-react";
import type { XpLog } from "@/types/logs";
import type { UserLevel } from "@/types/user";

export function DashboardContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<UserLevel | null>(null);
  const [xpLogs, setXpLogs] = useState<XpLog[]>([]);
  const [streakDays, setStreakDays] = useState(0); // TODO: implement streak logic
  const [achievements, setAchievements] = useState(0); // TODO: fetch achievements

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar nível do usuário
        const userLevel = await progressService.getUserLevel();
        setLevel(userLevel);

        // Buscar logs de XP recentes (últimos 5)
        const logs = await usersService.getXpLogs({ limit: 5 });
        setXpLogs(logs);

        // Aqui você pode adicionar outras chamadas, como:
        // - conquistas do usuário
        // - streak atual
        // - energia atual, etc.
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
        setError("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calcular progresso para o próximo nível
  const levelProgress = level
    ? {
        currentLevel: level.level,
        nextLevel: level.level + 1,
        progress: Math.min(100, (level.currentXp / level.nextLevelXp) * 100),
        xpNeeded: level.nextLevelXp - level.currentXp,
      }
    : {
        currentLevel: 1,
        nextLevel: 2,
        progress: 0,
        xpNeeded: 100,
      };

  // Stats mockados (substituir quando tiver endpoints reais)
  const stats = [
    {
      label: "XP Total",
      value: level?.totalXpEarned?.toLocaleString() ?? "0",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      label: "Energy",
      value: "0/100", // TODO: implementar energia
      icon: Zap,
      color: "text-yellow-500",
    },
    {
      label: "Conquistas",
      value: achievements.toString(),
      icon: Award,
      color: "text-purple-500",
    },
    {
      label: "Dias seguidos",
      value: streakDays.toString(),
      icon: Calendar,
      color: "text-blue-500",
    },
  ];

  // Formatar data relativa (ex: "há 2 horas")
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "agora mesmo";
    if (diffMins < 60)
      return `há ${diffMins} minuto${diffMins !== 1 ? "s" : ""}`;
    if (diffHours < 24)
      return `há ${diffHours} hora${diffHours !== 1 ? "s" : ""}`;
    return `há ${diffDays} dia${diffDays !== 1 ? "s" : ""}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
        <CardContent className="p-6 text-red-600 dark:text-red-400">
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold">
          Olá, {user?.profile?.fullName || user?.email || "Usuário"}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Bem-vindo de volta ao seu dashboard
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Level progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Progresso para próximo nível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Nível {levelProgress.currentLevel}</span>
                <span>Nível {levelProgress.nextLevel}</span>
              </div>
              <Progress value={levelProgress.progress} className="h-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Faltam {levelProgress.xpNeeded} XP para subir de nível
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              ➕ Criar novo Núcleo
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              ⏱️ Iniciar timer
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              📅 Adicionar evento
            </button>
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              🤖 Conversar com IA
            </button>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Atividade recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {xpLogs.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Nenhuma atividade recente
              </p>
            ) : (
              <div className="space-y-4">
                {xpLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between py-2 border-b last:border-0 border-gray-100 dark:border-gray-800"
                  >
                    <div>
                      <p className="font-medium">{log.source || "Atividade"}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(log.created_at)}
                      </p>
                    </div>
                    <span className="text-green-500 font-medium">
                      +{log.xp_amount} XP
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
