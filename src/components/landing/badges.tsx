"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Flame,
  Star,
  Zap,
  Target,
  Crown,
  Rocket,
  Medal,
  Award,
  BookOpen,
  Heart,
  Wallet,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { NucleoAchievement } from "@/types/nucleo";

// Mock de conquistas baseado no schema real
const mockAchievements: NucleoAchievement[] = [
  // Conquistas do núcleo 1 (Estudos)
  {
    id: "ach1",
    nucleo_id: "nucleo-1",
    achievement_type: "streak_7",
    current_value: 7,
    target_value: 7,
    unlocked_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "ach2",
    nucleo_id: "nucleo-1",
    achievement_type: "xp_2000",
    current_value: 2450,
    target_value: 2000,
    unlocked_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "ach3",
    nucleo_id: "nucleo-1",
    achievement_type: "tarefas_100",
    current_value: 87,
    target_value: 100,
    created_at: new Date().toISOString(),
  },
  {
    id: "ach4",
    nucleo_id: "nucleo-1",
    achievement_type: "streak_30",
    current_value: 15,
    target_value: 30,
    created_at: new Date().toISOString(),
  },

  // Conquistas do núcleo 2 (Fitness)
  {
    id: "ach5",
    nucleo_id: "nucleo-2",
    achievement_type: "treinos_30",
    current_value: 30,
    target_value: 30,
    unlocked_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "ach6",
    nucleo_id: "nucleo-2",
    achievement_type: "meditacao_7",
    current_value: 7,
    target_value: 7,
    unlocked_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "ach7",
    nucleo_id: "nucleo-2",
    achievement_type: "peso_ideal",
    current_value: 5,
    target_value: 10,
    created_at: new Date().toISOString(),
  },

  // Conquistas do núcleo 3 (Trabalho)
  {
    id: "ach8",
    nucleo_id: "nucleo-3",
    achievement_type: "projeto_entregue",
    current_value: 3,
    target_value: 3,
    unlocked_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "ach9",
    nucleo_id: "nucleo-3",
    achievement_type: "horas_focadas",
    current_value: 42,
    target_value: 50,
    created_at: new Date().toISOString(),
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

// Agrupar conquistas por núcleo
const nucleosComConquistas = [
  {
    nucleoId: "nucleo-1",
    nome: "Estudos",
    cor: "#4D7CFF",
    conquistas: mockAchievements.filter((a) => a.nucleo_id === "nucleo-1"),
  },
  {
    nucleoId: "nucleo-2",
    nome: "Fitness",
    cor: "#00C9A7",
    conquistas: mockAchievements.filter((a) => a.nucleo_id === "nucleo-2"),
  },
  {
    nucleoId: "nucleo-3",
    nome: "Trabalho",
    cor: "#FF4D4D",
    conquistas: mockAchievements.filter((a) => a.nucleo_id === "nucleo-3"),
  },
];

export function Badges() {
  const [selectedNucleo, setSelectedNucleo] = useState<string | null>(null);
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const filteredAchievements = selectedNucleo
    ? mockAchievements.filter((a) => a.nucleo_id === selectedNucleo)
    : mockAchievements;

  const displayedAchievements = showUnlockedOnly
    ? filteredAchievements.filter((a) => a.unlocked_at)
    : filteredAchievements;

  const desbloqueadas = mockAchievements.filter((a) => a.unlocked_at).length;

  return (
    <section className="relative pb-60 pt-60 overflow-hidden px-4 min-h-screen sm:px-6 lg:px-8">
      {/* GRADIENTE SUPERIOR */}
      <div className="absolute top-0 left-0 right-0 h-100 pointer-events-none z-10 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />

      {/* GRADIENTE INFERIOR */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-10 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-black dark:via-black/60 dark:to-transparent" />

      {/* SEGUNDA CAMADA DE DEGRADÊ */}
      <div className="absolute bottom-0 left-0 right-0 h-80 pointer-events-none z-5 bg-gradient-to-t from-white/40 via-transparent to-transparent dark:from-black/40 dark:via-transparent dark:to-transparent" />

      {/* Background elements com parallax */}
      <motion.div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-background/20 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-accent/20 blur-3xl animate-pulse delay-700" />
      </motion.div>

      <div className="mx-auto max-w-6xl relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-4 text-center"
        >
          <Badge
            variant="outline"
            className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF]"
          >
            <Sparkles className="size-4" />
            <span>Sistema de Conquistas</span>
          </Badge>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-balance text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
        >
          Colecione conquistas e{" "}
          <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            mostre sua evolução
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground"
        >
          Cada marco da sua jornada é recompensado. Desbloqueie conquistas em
          todos os seus Nucleos.
        </motion.p>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {/* Filtro por núcleo */}
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
        </motion.div>

        {/* Grid de Conquistas */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {displayedAchievements.map((achievement, index) => {
            const config = achievementConfig[achievement.achievement_type] || {
              icon: Award,
              color: "#8B5CF6",
              label: achievement.achievement_type,
            };
            const Icon = config.icon;
            const desbloqueada = !!achievement.unlocked_at;
            const progresso = achievement.target_value
              ? (achievement.current_value / achievement.target_value) * 100
              : 100;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={cn(
                  "group relative overflow-hidden rounded-xl border p-5 transition-all",
                  desbloqueada
                    ? "bg-gradient-to-br from-card to-card/80 border-[#4D7CFF]/30 hover:shadow-lg hover:shadow-[#4D7CFF]/10"
                    : "bg-muted/30 border-border/30 opacity-80",
                )}
              >
                {/* Efeito de brilho para desbloqueadas */}
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
                          {achievement.current_value} /{" "}
                          {achievement.target_value}
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
                    {achievement.target_value && (
                      <div className="mt-3">
                        <Progress
                          value={progresso}
                          className="h-1.5 bg-secondary"
                          style={{
                            ["--progress-background" as any]: config.color,
                          }}
                        />
                      </div>
                    )}

                    {/* Data de desbloqueio */}
                    {achievement.unlocked_at && (
                      <p className="mt-2 text-[10px] text-muted-foreground">
                        Desbloqueada em{" "}
                        {new Date(achievement.unlocked_at).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Badge do núcleo */}
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground">
                    {nucleosComConquistas.find(
                      (n) => n.nucleoId === achievement.nucleo_id,
                    )?.nome || "Núcleo"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Progresso total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
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
        </motion.div>
      </div>
    </section>
  );
}
