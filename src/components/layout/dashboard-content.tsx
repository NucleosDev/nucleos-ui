"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Zap, Award, Calendar, Clock, Target } from "lucide-react";

export function DashboardContent() {
  const { user } = useAuth();

  // Mock data - substituir por dados reais da API
  const stats = [
    {
      label: "XP Total",
      value: "1,234",
      icon: TrendingUp,
      color: "text-green-500",
    },
    { label: "Energy", value: "78/100", icon: Zap, color: "text-yellow-500" },
    { label: "Conquistas", value: "12", icon: Award, color: "text-purple-500" },
    {
      label: "Dias seguidos",
      value: "7",
      icon: Calendar,
      color: "text-blue-500",
    },
  ];

  const recentActivity = [
    { id: 1, action: "Completou tarefa", xp: "+50 XP", time: "há 2 horas" },
    { id: 2, action: "Criou novo Nucleo", xp: "+100 XP", time: "há 5 horas" },
    { id: 3, action: "Bateu meta diária", xp: "+200 XP", time: "ontem" },
  ];

  const nextLevel = {
    current: 5,
    next: 6,
    progress: 65,
    xpNeeded: "350 XP",
  };

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold">
          Olá, {user?.profile?.full_name || user?.email}!
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
                <span>Nível {nextLevel.current}</span>
                <span>Nível {nextLevel.next}</span>
              </div>
              <Progress value={nextLevel.progress} className="h-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Faltam {nextLevel.xpNeeded} para subir de nível
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
              ➕ Criar novo Nucleo
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
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-2 border-b last:border-0 border-gray-100 dark:border-gray-800"
                >
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                  <span className="text-green-500 font-medium">
                    {activity.xp}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
