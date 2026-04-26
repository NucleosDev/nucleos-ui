"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/auth";
import { NucleosOverview } from "@/components/nucleo/nucleos-overview";
import { CreateNucleoModal } from "@/components/nucleo/nucleo-create-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Trophy,
  Flame,
  Zap,
  Calendar,
  PlusCircle,
  Sparkles,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import Link from "next/link";
import OrbitIcon from "@/components/ui/bolt-style-chat";
import { BadgeAII } from "@/components/ui/badge-ai";
import { useGamification } from "@/hooks/useGamification";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Dados reais de gamificação
  const { useStats, useAchievements, useStreak } = useGamification();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: achievements, isLoading: achievementsLoading } =
    useAchievements();
  const { data: streak, isLoading: streakLoading } = useStreak();
  const { activities, loading: activitiesLoading } = useRecentActivity(5);

  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: ptBR });
  const hora = today.getHours();
  const saudacao =
    hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  const firstName = user?.fullName?.split(" ")[0] || "Usuário";

  // Calcular progresso do nível
  const levelProgress = stats ? (stats.currentXp / stats.nextLevelXp) * 100 : 0;

  // Contar conquistas desbloqueadas
  const unlockedAchievements =
    achievements?.filter((a) => a.unlocked).length || 0;
  const totalAchievements = achievements?.length || 0;

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-background via-background to-secondary/10">
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
        {/* Botão do ChatBot */}

        <div className="flex items-center gap-3">
          {/* barra lateral */}
          <div className="h-9 w-1 rounded-full bg-gradient-to-b from-[#4D7CFF] to-[#00C9A7]" />

          <div className="flex flex-col">
            <h2 className="text-2xl font-bold tracking-tight">
              {saudacao},{" "}
              <span className="bg-gradient-to-r from-[#4D7CFF] via-[#5B7FFF] to-[#00C9A7] bg-clip-text text-transparent">
                {firstName}
              </span>
              .
            </h2>

            {/* <p className="text-sm text">
              Já são{" "}
              <span className="font-medium text-foreground">{hora}h</span> —
              pronto pra começar?
            </p> */}
          </div>
        </div>

        {/* Badge AI */}
        <div className="hidden md:block">
          <BadgeAII />
        </div>

        {/* Cards de Estatísticas Rápidas - Dados Reais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading || streakLoading ? (
            // Skeletons enquanto carrega
            <>
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </>
          ) : (
            <>
              <StatsCard
                title="Nível"
                value={stats?.level || 1}
                icon={<Zap className="h-5 w-5 text-primary" />}
                description={`${stats?.totalXp || 0} XP total`}
                progress={levelProgress}
                color="blue"
              />
              <StatsCard
                title="Streak Atual"
                value={streak?.currentStreak || 0}
                icon={<Flame className="h-5 w-5 text-primary" />}
                description={`Melhor: ${streak?.maxStreak || 0} dias`}
                color="orange"
              />
              <StatsCard
                title="Conquistas"
                value={`${unlockedAchievements}/${totalAchievements}`}
                icon={<Trophy className="h-5 w-5 text-primary" />}
                description={`${totalAchievements - unlockedAchievements} restantes`}
                color="yellow"
              />
              <StatsCard
                title="XP Hoje"
                value={stats?.todayXp || 0}
                icon={<Award className="h-5 w-5 text-primary" />}
                description={`${stats?.totalActions || 0} ações hoje`}
                color="default"
              />
            </>
          )}
        </div>

        {/* Seção Principal: Nucleos Overview */}
        <section className="space-y-4">
          <NucleosOverview variant="recent" limit={3} />
        </section>

        {/* Grid secundário: Atividade recente + Atalhos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Atividades Recentes */}
          <Card className="lg:col-span-2 shadow-sm border-border/50 hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                Atividade Recente
              </CardTitle>
              <CardDescription>Suas últimas ações nos Nucleos</CardDescription>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : activities && activities.length > 0 ? (
                <ul className="space-y-4">
                  {activities.map((activity) => (
                    <li
                      key={activity.id}
                      className="flex items-center gap-3 text-sm border-b border-border/50 pb-3 last:border-0"
                    >
                      <div className="p-2 rounded-full bg-primary/10">
                        <activity.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.nucleoName} • {activity.time}
                        </p>
                      </div>
                      {activity.xp && (
                        <span className="text-xs font-semibold text-green-500">
                          +{activity.xp} XP
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Nenhuma atividade recente. Comece a usar seus Nucleos!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Atalhos Rápidos */}
          <Card className="shadow-sm border-border/50 hover:shadow-md transition">
            <CardHeader>
              <CardTitle className="text-xl">Ações Rápidas</CardTitle>
              <CardDescription>Acesse rapidamente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/nucleos")}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span>Criar novo Nucleo</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/gamificacao")}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Trophy className="h-4 w-4 text-amber-500" />
                  </div>
                  <span>Ver minhas conquistas</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/gamificacao")}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Flame className="h-4 w-4 text-orange-500" />
                  </div>
                  <span>Ver meu progresso</span>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de criação de Nucleo */}
      <CreateNucleoModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}

// Componente StatsCard atualizado
interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
  progress?: number;
  color?: "yellow" | "orange" | "amber" | "blue" | "green" | "default";
}

function StatsCard({
  title,
  value,
  icon,
  description,
  progress,
  color = "default",
}: StatsCardProps) {
  const colorClasses = {
    yellow: "from-primary/10 to-primary/1 border-primary/20",
    orange: "from-primary/10 to-primary/1 border-primary/20",
    amber: "from-primary/10 to-primary/1 border-primary/20",
    blue: "from-primary/10 to-primary/1 border-primary/20",
    green: "from-primary/10 to-primary/1 border-primary/20",
    default: "from-primary/10 to-primary/1 border-primary/20",
  };

  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} border shadow-sm hover:shadow transition`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {progress !== undefined && (
          <Progress value={progress} className="mt-3 h-1.5" />
        )}
      </CardContent>
    </Card>
  );
}
