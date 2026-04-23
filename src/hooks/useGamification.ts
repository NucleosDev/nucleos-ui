// src/hooks/useGamification.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { gamificacaoService } from "@/services/gamificacao.service";

export const GAMIFICATION_KEYS = {
  stats: ["gamification", "stats"] as const,
  fullStats: ["gamification", "fullStats"] as const,
  leaderboard: ["gamification", "leaderboard"] as const,
  achievements: ["gamification", "achievements"] as const,
  history: ["gamification", "history"] as const,
  streak: ["gamification", "streak"] as const,
};

export function useGamification() {
  const queryClient = useQueryClient();

  // Stats do backend
  const useStats = () => {
    return useQuery({
      queryKey: GAMIFICATION_KEYS.stats,
      queryFn: () => gamificacaoService.getUserStats(),
      staleTime: 1000 * 30,
      refetchInterval: 1000 * 60,
    });
  };

  // Stats completos para o frontend (convertidos)
  const useFullStats = () => {
    return useQuery({
      queryKey: GAMIFICATION_KEYS.fullStats,
      queryFn: () => gamificacaoService.getFullGamificationStats(),
      staleTime: 1000 * 30,
      refetchInterval: 1000 * 60,
    });
  };

  // Leaderboard
  const useLeaderboard = (limit: number = 10) => {
    return useQuery({
      queryKey: [...GAMIFICATION_KEYS.leaderboard, limit],
      queryFn: () => gamificacaoService.getLeaderboard(limit),
      staleTime: 1000 * 60,
      refetchInterval: 1000 * 120,
    });
  };

  // Conquistas
  const useAchievements = () => {
    return useQuery({
      queryKey: GAMIFICATION_KEYS.achievements,
      queryFn: () => gamificacaoService.getAchievements(),
      staleTime: 1000 * 60 * 5,
    });
  };

  // Histórico de XP
  const useXpHistory = (limit: number = 50, offset: number = 0) => {
    return useQuery({
      queryKey: [...GAMIFICATION_KEYS.history, limit, offset],
      queryFn: () => gamificacaoService.getXpHistory(limit, offset),
      staleTime: 1000 * 60,
    });
  };

  // Streak
  const useStreak = () => {
    return useQuery({
      queryKey: GAMIFICATION_KEYS.streak,
      queryFn: () => gamificacaoService.getStreak(),
      staleTime: 1000 * 30,
    });
  };

  // Invalidar cache
  const invalidateStats = () => {
    queryClient.invalidateQueries({ queryKey: GAMIFICATION_KEYS.stats });
    queryClient.invalidateQueries({ queryKey: GAMIFICATION_KEYS.fullStats });
    queryClient.invalidateQueries({ queryKey: GAMIFICATION_KEYS.streak });
    queryClient.invalidateQueries({ queryKey: GAMIFICATION_KEYS.achievements });
  };

  return {
    useStats,
    useFullStats,
    useLeaderboard,
    useAchievements,
    useXpHistory,
    useStreak,
    invalidateStats,
  };
}
