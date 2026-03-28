"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BadgeCheck,
  Flame,
  Zap,
  TrendingUp,
  CheckCircle2,
  Star,
  Eclipse,
  Plus,
  Bell,
  Layers,
  Award,
} from "lucide-react";
import { DashboardInbox } from "@/components/layout-auth/dashboard-inbox";
import { useAuth } from "@/auth";
import { ChatBot } from "@/components/layout-auth/chatbot";
import { NotificacoesTempoReal } from "@/components/nucleo/ui/notification-real-time";
import { ConquistasGrid } from "@/components/nucleo/ui/badge-conquist";
import { NucleoGrid } from "@/components/nucleo/ui/nucleo-grid";
import { mockNucleos } from "@/components/nucleo/mocks/nucleo-card.mock";
import { mockConquistas } from "@/components/nucleo/mocks/conquistas.mock";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockUserLevel = {
  level: 5,
  current_xp: 340,
  next_level_xp: 500,
  total_xp_earned: 1240,
};
const mockStreak = { current_streak: 12 };

const quickStats = [
  {
    label: "Tarefas hoje",
    value: "4",
    icon: CheckCircle2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Hábitos ativos",
    value: "3/4",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    label: "XP total",
    value: "1.240",
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    label: "Progresso",
    value: "72%",
    icon: TrendingUp,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: ptBR });
  const fullName = user?.fullName || "Usuário";
  const firstName = fullName.split(" ")[0];

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-bold text-foreground text-lg">Início</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
              <Flame className="w-3.5 h-3.5 text-[#6b7b1a]" />
              <span className="text-xs font-medium">
                {mockStreak.current_streak} dias
              </span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
              <Zap className="w-3.5 h-3.5 text-primary/90" />
              <span className="text-xs font-medium">
                Nv. {mockUserLevel.level}
              </span>
            </div>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Saudação */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2 text-balance">
              Olá, {firstName}!{" "}
              <BadgeCheck className="w-7 h-7 text-primary/80" />
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Hoje é{" "}
              {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)} ·
              Tudo certo por ai?
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            Novo Núcleo
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`${stat.bg} p-2.5 rounded-lg`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Seção Meus Núcleos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Meus Núcleos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NucleoGrid
              nucleos={mockNucleos}
              onNucleoClick={(nucleo) => {
                // Redirecionar para página do núcleo ou abrir modal
                console.log("Núcleo clicado:", nucleo.nome);
              }}
            />
          </CardContent>
        </Card>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          {/* Seção Central: Inbox e ChatBot lado a lado */}
          <div className="w-full mb-8">
            <div className="min-w-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Favoritos
                </h2>
                <p className="text-xs text-muted-foreground">
                  Selecione uma categoria e explore seus dados
                </p>
              </div>
              <DashboardInbox />
            </div>
            <div className="min-w-0">{/* <ChatBot /> */}</div>
          </div>
        </div>
        {/* Seção Conquistas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Conquistas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ConquistasGrid conquistas={mockConquistas} />
          </CardContent>
        </Card>

        {/* Notificações em tempo real (opcional) */}
        <div className="relative">
          <NotificacoesTempoReal />
        </div>
      </main>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-primary text-primary-foreground p-3.5 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
