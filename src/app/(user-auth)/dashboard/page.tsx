"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/auth";
import { NucleosOverview } from "@/components/nucleo/ui/nucleos-overview";
import { CreateNucleoModal } from "@/components/nucleo/ui/nucleo-create-modal";
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
  ArrowRight,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

// Hooks mock mantidos como estavam
import { useUserStats } from "@/hooks/userStats";
import { useRecentActivity } from "@/hooks/useRecentActivity";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: ptBR });
  const hora = today.getHours();
  const saudacao =
    hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  const firstName = user?.fullName?.split(" ")[0] || "Usuário";

  const { stats, loading: statsLoading } = useUserStats();
  const { activities, loading: activitiesLoading } = useRecentActivity(5);

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-background via-background to-secondary/10">
      <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8">
        {/* Cabeçalho com saudação e data */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {saudacao}, {firstName}!
              </h1>
              <Sparkles className="h-6 w-6 text-primary/70" />
            </div>
            <p className="text-muted-foreground text-lg capitalize">
              {formattedDate} · Pronto para evoluir hoje?
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white hover:opacity-90 transition shadow-md shadow-primary/20"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Núcleo
          </Button>
        </motion.div>

        {/* Cards de Estatísticas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading ? (
            <>
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
            </>
          ) : (
            <>
              <StatsCard
                title="Nível Geral"
                value={stats?.level || 1}
                icon={<Zap className="h-5 w-5 text-primary" />}
                description={`${stats?.xpTotal || 0} XP total`}
                progress={stats?.levelProgress || 0}
              />
              <StatsCard
                title="Streak Atual"
                value={stats?.currentStreak || 0}
                icon={<Flame className="h-5 w-5 text-primary" />}
                description={`Melhor: ${stats?.maxStreak || 0}`}
              />
              <StatsCard
                title="Conquistas"
                value={stats?.achievements || 0}
                icon={<Trophy className="h-5 w-5 text-primary" />}
                description={`${stats?.totalAchievements || 0} disponíveis`}
              />
              <StatsCard
                title="Energia"
                value={stats?.energy || 0}
                icon={<Zap className="h-5 w-5 text-primary" />}
                description={`Renova em ${stats?.energyRegen || "2h"}`}
              />
            </>
          )}
        </div>

        {/* Seção Principal: Núcleos Overview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/nucleos")}
            >
              Ver todos <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <NucleosOverview />
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
              <CardDescription>Suas últimas ações nos núcleos</CardDescription>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
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
                  Nenhuma atividade recente. Comece a usar seus núcleos!
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
                onClick={() => router.push("/dashboard/tarefas")}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <span>Ver tarefas de hoje</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/habitos")}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Flame className="h-4 w-4 text-orange-500" />
                  </div>
                  <span>Registrar hábito</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/dashboard/conquistas")}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Trophy className="h-4 w-4 text-amber-500" />
                  </div>
                  <span>Ver conquistas</span>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de criação de núcleo */}
      <CreateNucleoModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}

// Componente auxiliar para os cards de estatística
interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
  progress?: number;
  color?: "yellow" | "orange" | "amber" | "blue" | "default";
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
    yellow: "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20",
    orange: "from-orange-500/10 to-orange-500/5 border-orange-500/20",
    amber: "from-amber-500/10 to-amber-500/5 border-amber-500/20",
    blue: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
    default: "from-primary/10 to-primary/5 border-primary/20",
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
