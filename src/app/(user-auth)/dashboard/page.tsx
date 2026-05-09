"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/auth";
import { NucleosOverview } from "@/components/nucleo/nucleos-overview";
import { CreateNucleoModal } from "@/components/nucleo/nucleo-create-modal";
import {
  Trophy, Flame, Zap, Calendar, Sparkles, Award, ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { BadgeAII } from "@/components/ui/badge-ai";
import { useGamification } from "@/hooks/useGamification";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { useStats, useAchievements, useStreak } = useGamification();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: achievements } = useAchievements();
  const { data: streak, isLoading: streakLoading } = useStreak();
  const { activities, loading: activitiesLoading } = useRecentActivity(5);

  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM", { locale: ptBR });
  const hora = today.getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  const firstName = user?.fullName?.split(" ")[0] || "Usuário";

  const levelProgress = stats ? (stats.currentXp / stats.nextLevelXp) * 100 : 0;
  const unlockedAchievements = achievements?.filter((a) => a.unlocked).length || 0;
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
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/8 group-hover:bg-amber-500/15",
    },
    {
      label: "Meu progresso",
      icon: Flame,
      href: "/dashboard/conquistas",
      iconColor: "text-orange-500",
      iconBg: "bg-orange-500/8 group-hover:bg-orange-500/15",
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-5 md:p-8 max-w-[1600px] mx-auto space-y-7">

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3"
        >
          <div className="h-9 w-0.5 rounded-full bg-gradient-to-b from-primary to-primary/20 shrink-0" />
          <div>
            <h1 className="text-[1.35rem] font-bold tracking-tight">
              {saudacao},{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
                {firstName}
              </span>
              .
            </h1>
            <p className="text-xs text-muted-foreground/50 mt-0.5 capitalize">{formattedDate}</p>
          </div>
        </motion.div>

        {/* AI Badge */}
        <div className="hidden md:block">
          <BadgeAII />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statsLoading || streakLoading ? (
            [0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[108px] rounded-[var(--radius-lg)]" />
            ))
          ) : (
            <>
              <StatsCard
                title="Nível"
                value={stats?.level || 1}
                icon={<Zap className="h-4 w-4" />}
                description={`${stats?.totalXp || 0} XP total`}
                progress={levelProgress}
                delay={0}
              />
              <StatsCard
                title="Streak"
                value={streak?.currentStreak || 0}
                icon={<Flame className="h-4 w-4" />}
                description={`Melhor: ${streak?.maxStreak || 0} dias`}
                delay={0.06}
              />
              <StatsCard
                title="Conquistas"
                value={`${unlockedAchievements}/${totalAchievements}`}
                icon={<Trophy className="h-4 w-4" />}
                description={`${totalAchievements - unlockedAchievements} restantes`}
                delay={0.12}
              />
              <StatsCard
                title="XP Hoje"
                value={stats?.todayXp || 0}
                icon={<Award className="h-4 w-4" />}
                description={`${stats?.totalActions || 0} ações`}
                delay={0.18}
              />
            </>
          )}
        </div>

        {/* Nucleos section */}
        <section>
          <NucleosOverview variant="recent" limit={3} />
        </section>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-2 rounded-[var(--radius-lg)] border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden"
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
              <div className="p-4 space-y-3">
                {[0, 1, 2].map((i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
              </div>
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
                      <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
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
                <p className="text-sm text-muted-foreground/60">Nenhuma atividade recente</p>
                <p className="text-xs text-muted-foreground/40 mt-1">
                  Comece a usar seus Núcleos para ver atividade aqui.
                </p>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
            className="rounded-[var(--radius-lg)] border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden"
          >
            <div className="px-5 py-3.5 border-b border-border/30">
              <h3 className="text-sm font-semibold">Ações Rápidas</h3>
              <p className="text-xs text-muted-foreground/50 mt-0.5">Acesse rapidamente</p>
            </div>
            <div className="p-2.5 space-y-0.5">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => router.push(action.href)}
                  className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-[var(--duration-fast)]"
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-[var(--duration-fast)]",
                      action.iconBg,
                      action.iconColor,
                    )}
                  >
                    <action.icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="flex-1 text-left">{action.label}</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0 transition-all duration-[var(--duration-fast)]" />
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      <CreateNucleoModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  );
}

// ── StatsCard ────────────────────────────────────────────────────────────────

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
  progress?: number;
  delay?: number;
}

function StatsCard({ title, value, icon, description, progress, delay = 0 }: StatsCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay }}
      className={cn(
        "group relative flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border/50",
        "bg-card/60 backdrop-blur-sm p-4 overflow-hidden",
        "hover:border-border/80 hover:shadow-[var(--shadow-sm)] hover:-translate-y-px",
        "transition-all duration-[var(--duration-base)]",
      )}
    >
      {/* Inner highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/8 to-transparent" />

      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
          {title}
        </p>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/8 text-primary">
          {icon}
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold tracking-tight tabular-nums">{value}</p>
        <p className="text-[11px] text-muted-foreground/50 mt-0.5">{description}</p>
        {progress !== undefined && (
          <div className="mt-3 h-1 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, progress)}%` }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: delay + 0.3 }}
              className="h-full rounded-full bg-primary/60"
            />
          </div>
        )}
      </div>
    </motion.article>
  );
}
