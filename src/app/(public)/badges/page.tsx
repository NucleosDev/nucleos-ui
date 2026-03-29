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
  Heart,
  Wallet,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { NucleoAchievement } from "@/types/nucleo";

// ================= MOCK =================
const mockAchievements: NucleoAchievement[] = [
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

// ================= CONFIG =================
const achievementConfig: Record<
  string,
  { icon: any; color: string; label: string }
> = {
  streak_7: { icon: Flame, color: "#FF8C42", label: "Streak de 7 dias" },
  streak_30: { icon: Flame, color: "#FF8C42", label: "Streak de 30 dias" },
  xp_2000: { icon: Trophy, color: "#FFD700", label: "Mestre do XP" },
  tarefas_100: { icon: Target, color: "#4D7CFF", label: "Centenário" },
  treinos_30: { icon: Heart, color: "#00C9A7", label: "Atleta" },
  meditacao_7: { icon: Star, color: "#8CD47E", label: "Mindfulness" },
  peso_ideal: { icon: Wallet, color: "#0077BE", label: "Meta Fitness" },
  projeto_entregue: { icon: Rocket, color: "#2EBD59", label: "Entregador" },
  horas_focadas: { icon: Zap, color: "#4D7CFF", label: "Foco Total" },
};

// ================= COMPONENT =================
export default function Badges() {
  const [selectedNucleo, setSelectedNucleo] = useState<string | null>(null);
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [lastAchievement, setLastAchievement] = useState<any>(null);

  const filtered = selectedNucleo
    ? mockAchievements.filter((a) => a.nucleoId === selectedNucleo)
    : mockAchievements;

  const displayed = showUnlockedOnly
    ? filtered.filter((a) => a.unlockedAt)
    : filtered;

  const unlocked = mockAchievements.filter((a) => a.unlockedAt).length;

  const level = Math.floor(unlocked / 2) + 1;

  // 🎉 POPUP
  useEffect(() => {
    const unlockedAchievements = mockAchievements.filter(
      (a) => a.unlockedAt
    );

    if (unlockedAchievements.length > 0) {
      const last = unlockedAchievements[unlockedAchievements.length - 1];

      setLastAchievement(last);
      setShowPopup(true);
    }
  }, []);

  return (
    <section className="min-h-screen px-4 py-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <Badge className="mb-3">
            <Sparkles className="size-4 mr-2" />
            Sistema de Conquistas
          </Badge>

          <h2 className="text-3xl font-bold">
            Evolução do Usuário 🚀
          </h2>

          <p className="text-muted-foreground mt-2">
            Desbloqueie conquistas e suba de nível
          </p>
        </div>

        {/* LEVEL */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
            <Crown className="text-yellow-500 size-5" />
            <span>Nível {level}</span>
          </div>
        </div>

        {/* FILTROS */}
        <div className="flex gap-3 justify-center mb-6 flex-wrap">
          <select
            onChange={(e) => setSelectedNucleo(e.target.value || null)}
            className="px-4 py-2 border rounded-full"
          >
            <option value="">Todos</option>
            <option value="nucleo-1">Estudos</option>
            <option value="nucleo-2">Fitness</option>
            <option value="nucleo-3">Trabalho</option>
          </select>

          <button
            onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
            className="px-4 py-2 border rounded-full"
          >
            {showUnlockedOnly ? "Desbloqueadas" : "Todas"}
          </button>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-4">
          {displayed.map((a, i) => {
            const config = achievementConfig[a.achievementType] || {
              icon: Award,
              color: "#999",
              label: a.achievementType,
            };

            const Icon = config.icon;
            const unlockedItem = !!a.unlockedAt;
            const progress =
              (a.currentValue / (a.targetValue || 1)) * 100;

            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "p-4 rounded-xl border",
                  unlockedItem ? "bg-card" : "opacity-60"
                )}
              >
                <div className="flex gap-3">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: config.color + "20" }}
                  >
                    <Icon style={{ color: config.color }} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold">{config.label}</h3>

                    <Progress value={progress} className="mt-2 h-1" />

                    {unlockedItem && (
                      <p className="text-xs mt-1 text-muted-foreground">
                        Desbloqueada 🎉
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* PROGRESSO TOTAL */}
        <div className="mt-10 text-center">
          <div className="flex justify-center items-center gap-2">
            <Trophy className="text-yellow-500" />
            <span>
              {unlocked} / {mockAchievements.length} conquistas
            </span>
          </div>

          <Progress
            value={(unlocked / mockAchievements.length) * 100}
            className="mt-2 max-w-xs mx-auto"
          />
        </div>

        {/* RANKING */}
        <div className="mt-12">
          <h3 className="text-center font-bold mb-4">Ranking</h3>

          <div className="space-y-2 max-w-md mx-auto">
            {["Você", "João", "Maria"].map((name, i) => (
              <div
                key={i}
                className="flex justify-between p-3 border rounded-lg"
              >
                <span className="flex items-center gap-2">
                  <Medal className="size-4" />
                  {name}
                </span>
                <span>{Math.floor(Math.random() * 1000)} XP</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 🎉 CONFETE */}
      {showPopup && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                y: -20,
                x: Math.random() * window.innerWidth,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: window.innerHeight + 50,
                rotate: 360,
                opacity: 0,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                ease: "easeOut",
              }}
              className="absolute w-2 h-2 rounded-sm"
              style={{
                backgroundColor: [
                  "#FFD700",
                  "#FF4D4D",
                  "#4D7CFF",
                  "#00C9A7",
                ][i % 4],
              }}
            />
          ))}
        </div>
      )}

      {/* 🎉 POPUP */}
      <AnimatePresence>
        {showPopup && lastAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 right-6 bg-card border p-5 rounded-xl shadow-xl z-50"
          >
            <h4 className="font-bold text-lg mb-1">
              🎉 Nova Conquista!
            </h4>
            <p className="text-sm">
              {
                achievementConfig[lastAchievement.achievementType]?.label
              }
            </p>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-3 text-xs underline"
            >
              Fechar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}