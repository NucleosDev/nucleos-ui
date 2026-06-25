"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import { nucleosService } from "@/services/nucleos.service";
import { blocosService } from "@/services/blocos.service";
import { tarefasService } from "@/services/tarefas.service";
import { habitosService } from "@/services/habitos.service";
import { avaliarConquistas, type CondicoesUsuario } from "@/lib/conquistas-catalog";
import {
  computeXpStats,
  computeStreakFromLogs,
  xpForLevel,
} from "@/services/gamificacao.service";
import type { XpTransactionBackend, UserGameStats, StreakData } from "@/types/gamification";

// XP rates
const XP_RATES = {
  nucleo_criado: 100,
  bloco_criado: 10,
  tarefa_concluida: 50,
  habito_streak_3: 30,
  habito_streak_7: 100,
  habito_streak_30: 500,
} as const;

// Converte uma data de criação/conclusão num XpTransactionBackend sintético
function makeXpLog(
  id: string,
  date: string,
  amount: number,
  source: string,
  nucleoId: string | null = null,
): XpTransactionBackend {
  return { id, xp_amount: amount, source, nucleo_id: nucleoId, created_at: date };
}

export function useGamificationDerived() {
  // ── 1. Nucleos ──────────────────────────────────────────────────────────────
  const { data: nucleos = [], isLoading: nucleosLoading } = useQuery({
    queryKey: ["nucleos"],
    queryFn: () => nucleosService.getNucleos(),
    staleTime: 1000 * 60 * 5,
  });

  // ── 2. Blocos de cada nucleo (parallel) ────────────────────────────────────
  const blocosQueries = useQueries({
    queries: nucleos.map((n) => ({
      queryKey: ["blocos", n.id, undefined],
      queryFn: () => blocosService.listarPorNucleo(n.id),
      staleTime: 1000 * 60 * 5,
      enabled: nucleos.length > 0,
    })),
  });

  const allBlocos = blocosQueries.flatMap((q) => q.data ?? []);
  const blocosTarefas = allBlocos.filter((b) => b.tipo === "tarefas");
  const blocosHabitos = allBlocos.filter(
    (b) => b.tipo === "habitos" || b.tipo === "habito",
  );
  const blocosLoading = blocosQueries.some((q) => q.isLoading);

  // ── 3. Tarefas de cada bloco de tarefas (parallel) ─────────────────────────
  const tarefasQueries = useQueries({
    queries: blocosTarefas.map((b) => ({
      queryKey: ["tarefas", b.id],
      queryFn: () => tarefasService.getTarefas(b.id),
      staleTime: 1000 * 60 * 5,
      enabled: !blocosLoading && blocosTarefas.length > 0,
    })),
  });

  const allTarefas = tarefasQueries.flatMap((q) => q.data ?? []);
  const tarefasConcluidas = allTarefas.filter((t) => t.status === "concluida");
  const tarefasLoading = tarefasQueries.some((q) => q.isLoading);

  // ── 4. Habitos de cada bloco de habitos (parallel) ─────────────────────────
  const habitosQueries = useQueries({
    queries: blocosHabitos.map((b) => ({
      queryKey: ["habitos", b.id],
      queryFn: () => habitosService.listarPorBloco(b.id),
      staleTime: 1000 * 60 * 5,
      enabled: !blocosLoading && blocosHabitos.length > 0,
    })),
  });

  const allHabitos = habitosQueries.flatMap((q) => q.data ?? []);
  const habitosLoading = habitosQueries.some((q) => q.isLoading);

  const isLoading =
    nucleosLoading || blocosLoading || tarefasLoading || habitosLoading;

  // ── 5. Computar XP logs sintéticos ─────────────────────────────────────────
  const xpLogs: XpTransactionBackend[] = [];

  // XP de criação de núcleos
  nucleos.forEach((n, i) => {
    xpLogs.push(
      makeXpLog(`nucleo-${i}`, n.createdAt, XP_RATES.nucleo_criado, "CREATE_NUCLEO", n.id),
    );
  });

  // XP de criação de blocos (bloco.nucleoId disponível)
  allBlocos.forEach((b, i) => {
    xpLogs.push(
      makeXpLog(`bloco-${i}`, b.createdAt, XP_RATES.bloco_criado, "CREATE_BLOCO", b.nucleoId ?? null),
    );
  });

  // XP de tarefas concluídas — precisa do nucleoId via bloco
  // Mapa blocoId → nucleoId para lookup rápido
  const blocoNucleoMap = new Map(allBlocos.map((b) => [b.id, b.nucleoId ?? null]));

  tarefasConcluidas.forEach((t, i) => {
    const date = t.concluidaEm ?? t.updatedAt;
    const nucleoId = blocoNucleoMap.get(t.blocoId ?? "") ?? null;
    xpLogs.push(
      makeXpLog(`tarefa-${i}`, date, XP_RATES.tarefa_concluida, "COMPLETE_TAREFA", nucleoId),
    );
  });

  // XP de streaks de hábitos — lookup via bloco também
  allHabitos.forEach((h, i) => {
    const maxStreak = h.streakMaximo ?? 0;
    const nucleoId = blocoNucleoMap.get(h.blocoId ?? "") ?? null;
    if (maxStreak >= 30) {
      xpLogs.push(
        makeXpLog(`streak-30-${i}`, h.updatedAt, XP_RATES.habito_streak_30, "STREAK_MILESTONE", nucleoId),
      );
    } else if (maxStreak >= 7) {
      xpLogs.push(
        makeXpLog(`streak-7-${i}`, h.updatedAt, XP_RATES.habito_streak_7, "STREAK_MILESTONE", nucleoId),
      );
    } else if (maxStreak >= 3) {
      xpLogs.push(
        makeXpLog(`streak-3-${i}`, h.updatedAt, XP_RATES.habito_streak_3, "STREAK_MILESTONE", nucleoId),
      );
    }
  });

  // ── 6. Calcular stats ───────────────────────────────────────────────────────
  const totalXp = xpLogs.reduce((s, l) => s + l.xp_amount, 0);
  const { level, currentXp, nextLevelXp, progressToNextLevel } =
    computeXpStats(totalXp);

  const today = new Date().toISOString().slice(0, 10);
  const todayXp = xpLogs
    .filter((l) => l.created_at && l.created_at.slice(0, 10) === today)
    .reduce((s, l) => s + l.xp_amount, 0);

  // Streak a partir dos hábitos (máximo entre todos os hábitos)
  const streakAtual = allHabitos.reduce(
    (max, h) => Math.max(max, h.streakAtual ?? 0),
    0,
  );
  const streakMaximo = allHabitos.reduce(
    (max, h) => Math.max(max, h.streakMaximo ?? 0),
    0,
  );

  const stats: UserGameStats = {
    level,
    currentXp,
    nextLevelXp,
    totalXp,
    currentStreak: streakAtual,
    maxStreak: streakMaximo,
    achievementsCount: 0, // preenchido abaixo
    todayXp,
    totalActions: xpLogs.length,
    progressToNextLevel,
  };

  // ── 7. Avaliar conquistas ───────────────────────────────────────────────────
  const condicoes: CondicoesUsuario = {
    totalNucleos: nucleos.length,
    totalTarefasConcluidas: tarefasConcluidas.length,
    totalHabitos: allHabitos.length,
    streakMaximo,
    streakAtual,
    nivel: level,
    totalXp,
    totalBlocos: allBlocos.length,
  };

  const achievements = avaliarConquistas(condicoes);
  stats.achievementsCount = achievements.filter((a) => a.unlocked).length;

  const streakData: StreakData = {
    currentStreak: streakAtual,
    maxStreak: streakMaximo,
    lastActivityDate:
      xpLogs.length > 0
        ? (xpLogs.filter((l) => l.created_at).sort((a, b) => b.created_at.localeCompare(a.created_at))[0]
            ?.created_at?.slice(0, 10) ?? null)
        : null,
  };

  // ── 8. XP por Núcleo ────────────────────────────────────────────────────────
  const xpPerNucleo: Record<string, number> = {};
  xpLogs.forEach((log) => {
    if (log.nucleo_id) {
      xpPerNucleo[log.nucleo_id] = (xpPerNucleo[log.nucleo_id] ?? 0) + log.xp_amount;
    }
  });

  return {
    stats,
    achievements,
    xpLogs: xpLogs.sort((a, b) => b.created_at.localeCompare(a.created_at)),
    streak: streakData,
    isLoading,
    condicoes,
    xpPerNucleo,
  };
}
