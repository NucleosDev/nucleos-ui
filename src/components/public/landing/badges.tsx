"use client";

import { useState } from "react";
import {
  Trophy,
  Flame,
  Star,
  Zap,
  Target,
  Rocket,
  Award,
  Heart,
  Wallet,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { NucleoAchievement } from "@/types/nucleo";

// Mock de conquistas baseado no schema real
const mockAchievements: NucleoAchievement[] = [
  // Conquistas do Nucleo 1 (Estudos)
  {
    id: "ach1",
    nucleoId: "nucleo-1",
    achievementType: "streak_7",
    currentValue: 7,
    targetValue: 7,
    unlockedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "ach2",
    nucleoId: "nucleo-1",
    achievementType: "xp_2000",
    currentValue: 2450,
    targetValue: 2000,
    unlockedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "ach3",
    nucleoId: "nucleo-1",
    achievementType: "tarefas_100",
    currentValue: 87,
    targetValue: 100,
    createdAt: new Date().toISOString(),
  },
  {
    id: "ach4",
    nucleoId: "nucleo-1",
    achievementType: "streak_30",
    currentValue: 15,
    targetValue: 30,
    createdAt: new Date().toISOString(),
  },

  // Conquistas do Nucleo 2 (Fitness)
  {
    id: "ach5",
    nucleoId: "nucleo-2",
    achievementType: "treinos_30",
    currentValue: 30,
    targetValue: 30,
    unlockedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "ach6",
    nucleoId: "nucleo-2",
    achievementType: "meditacao_7",
    currentValue: 7,
    targetValue: 7,
    unlockedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "ach7",
    nucleoId: "nucleo-2",
    achievementType: "peso_ideal",
    currentValue: 5,
    targetValue: 10,
    createdAt: new Date().toISOString(),
  },

  // Conquistas do Nucleo 3 (Trabalho)
  {
    id: "ach8",
    nucleoId: "nucleo-3",
    achievementType: "projeto_entregue",
    currentValue: 3,
    targetValue: 3,
    unlockedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "ach9",
    nucleoId: "nucleo-3",
    achievementType: "horas_focadas",
    currentValue: 42,
    targetValue: 50,
    createdAt: new Date().toISOString(),
  },
];

// Mapeamento de tipos para ícones e cores
const achievementConfig: Record<
  string,
  { icon: any; color: string; label: string }
> = {
  streak_7: {
    icon: Flame,
    color: "#FF8C42",
    label: "Streak de 7 dias",
  },
  streak_30: {
    icon: Flame,
    color: "#FF8C42",
    label: "Streak de 30 dias",
  },
  xp_2000: {
    icon: Trophy,
    color: "#FFD700",
    label: "Mestre do XP",
  },
  tarefas_100: {
    icon: Target,
    color: "#4D7CFF",
    label: "Centenário",
  },
  treinos_30: {
    icon: Heart,
    color: "#00C9A7",
    label: "Atleta",
  },
  meditacao_7: {
    icon: Star,
    color: "#8CD47E",
    label: "Mindfulness",
  },
  peso_ideal: {
    icon: Wallet,
    color: "#0077BE",
    label: "Meta Fitness",
  },
  projeto_entregue: {
    icon: Rocket,
    color: "#2EBD59",
    label: "Entregador",
  },
  horas_focadas: {
    icon: Zap,
    color: "#4D7CFF",
    label: "Foco Total",
  },
};

// Agrupar conquistas por Nucleo
const nucleosComConquistas = [
  {
    nucleoId: "nucleo-1",
    nome: "Estudos",
    cor: "#4D7CFF",
    conquistas: mockAchievements.filter((a) => a.nucleoId === "nucleo-1"),
  },
  {
    nucleoId: "nucleo-2",
    nome: "Fitness",
    cor: "#00C9A7",
    conquistas: mockAchievements.filter((a) => a.nucleoId === "nucleo-2"),
  },
  {
    nucleoId: "nucleo-3",
    nome: "Trabalho",
    cor: "#FF4D4D",
    conquistas: mockAchievements.filter((a) => a.nucleoId === "nucleo-3"),
  },
];

export function Badges() {
  const [selectedNucleo, setSelectedNucleo] = useState<string | null>(null);
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const filteredAchievements = selectedNucleo
    ? mockAchievements.filter((a) => a.nucleoId === selectedNucleo)
    : mockAchievements;

  const displayedAchievements = showUnlockedOnly
    ? filteredAchievements.filter((a) => a.unlockedAt)
    : filteredAchievements;

  const desbloqueadas = mockAchievements.filter((a) => a.unlockedAt).length;

  return (
    <section className="relative overflow-hidden px-4 min-h-screen sm:px-6 lg:px-8">
      {/* GRADIENTE SUPERIOR */}
      <div className="absolute top-0 left-0 right-0 h-100 pointer-events-none z-10 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />

      {/* GRADIENTE INFERIOR */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-10 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-black dark:via-black/60 dark:to-transparent" />

      {/* SEGUNDA CAMADA DE DEGRADÊ */}
      <div className="absolute bottom-0 left-0 right-0 h-80 pointer-events-none z-5 bg-gradient-to-t from-white/40 via-transparent to-transparent dark:from-black/40 dark:via-transparent dark:to-transparent" />

      {/* Background elements sem animação */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-background/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl relative z-20">
        <div className="mb-4 text-center">
          <Badge
            variant="outline"
            className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF]"
          >
            <Sparkles className="size-4" />
            <span>Sistema de Conquistas</span>
          </Badge>
        </div>

        <h2 className="text-balance text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Colecione conquistas e{" "}
          <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto]">
            mostre sua evolução
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Cada marco da sua jornada é recompensado. Desbloqueie conquistas em
          todos os seus Nucleos.
        </p>

        {/* Filtros */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {/* Filtro por Nucleo */}
          <select
            value={selectedNucleo || ""}
            onChange={(e) => setSelectedNucleo(e.target.value || null)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-background border border-border/50 focus:outline-none focus:ring-2 focus:ring-[#4D7CFF]/50"
          >
            <option value="">Todos os Nucleos</option>
            {nucleosComConquistas.map((n) => (
              <option key={n.nucleoId} value={n.nucleoId}>
                {n.nome}
              </option>
            ))}
          </select>

          {/* Filtro desbloqueadas */}
          <button
            onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all border",
              showUnlockedOnly
                ? "bg-[#4D7CFF] text-white border-[#4D7CFF]"
                : "bg-background border-border/50 hover:border-[#4D7CFF]/50",
            )}
          >
            {showUnlockedOnly ? "Apenas desbloqueadas" : "Todas as conquistas"}
          </button>
        </div>

        {/* Grid de Conquistas */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedAchievements.map((achievement) => {
            const config = achievementConfig[achievement.achievementType] || {
              icon: Award,
              color: "#8B5CF6",
              label: achievement.achievementType,
            };
            const Icon = config.icon;
            const desbloqueada = !!achievement.unlockedAt;
            const progresso = achievement.targetValue
              ? (achievement.currentValue / achievement.targetValue) * 100
              : 100;

            return (
              <div
                key={achievement.id}
                className={cn(
                  "group relative overflow-hidden rounded-xl border p-5 transition-all",
                  desbloqueada
                    ? "bg-gradient-to-br from-card to-card/80 border-[#4D7CFF]/30 hover:shadow-lg hover:shadow-[#4D7CFF]/10"
                    : "bg-muted/30 border-border/30 opacity-80",
                )}
              >
                {/* Efeito de brilho para desbloqueadas (apenas hover) */}
                {desbloqueada && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}

                <div className="flex items-start gap-3">
                  {/* Ícone */}
                  <div
                    className="flex size-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${config.color}15` }}
                  >
                    <Icon className="size-6" style={{ color: config.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm">
                          {config.label}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {achievement.currentValue} / {achievement.targetValue}
                        </p>
                      </div>
                      {desbloqueada && (
                        <div className="size-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg
                            className="size-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Barra de progresso */}
                    {achievement.targetValue && (
                      <div className="mt-3">
                        <Progress
                          value={progresso}
                          className="h-1.5 bg-secondary"
                          style={
                            {
                              "--progress-background": config.color,
                            } as React.CSSProperties
                          }
                        />
                      </div>
                    )}

                    {/* Data de desbloqueio */}
                    {achievement.unlockedAt && (
                      <p className="mt-2 text-[10px] text-muted-foreground">
                        Desbloqueada em{" "}
                        {new Date(achievement.unlockedAt).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Badge do Nucleo */}
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground">
                    {nucleosComConquistas.find(
                      (n) => n.nucleoId === achievement.nucleoId,
                    )?.nome || "Nucleo"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progresso total */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
            <Trophy className="size-4 text-[#FFD700]" />
            <p className="text-sm">
              Você desbloqueou{" "}
              <span className="font-bold text-[#4D7CFF]">{desbloqueadas}</span>{" "}
              de <span className="font-bold">{mockAchievements.length}</span>{" "}
              conquistas
            </p>
          </div>
          <Progress
            value={(desbloqueadas / mockAchievements.length) * 100}
            className="h-1 max-w-xs mx-auto mt-2"
          />
        </div>
      </div>
    </section>
  );
}
