import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/routes";
import {
  UserGameStats,
  Achievement,
  LeaderboardUser,
  XpTransactionBackend,
  StreakData,
  GamificationStats,
  UserLevel,
  Streak,
  Conquista,
  XPTransaction,
} from "@/types/gamification";

export const gamificacaoService = {
  // ========== API METHODS ==========

  async getUserStats(): Promise<UserGameStats> {
    const response = await api.get<
      { success: boolean; data: UserGameStats } | UserGameStats
    >(API_ROUTES.GAMIFICACAO.STATS);
    if (response && typeof response === "object" && "data" in response) {
      return response.data;
    }
    return response as UserGameStats;
  },

  async getLeaderboard(limit: number = 10): Promise<LeaderboardUser[]> {
    const response = await api.get<
      { success: boolean; data: LeaderboardUser[] } | LeaderboardUser[]
    >(`${API_ROUTES.GAMIFICACAO.LEADERBOARD}?limit=${limit}`);
    if (response && typeof response === "object" && "data" in response) {
      return Array.isArray(response.data) ? response.data : [];
    }
    return Array.isArray(response) ? response : [];
  },

  async getAchievements(): Promise<Achievement[]> {
    const response = await api.get<
      { success: boolean; data: Achievement[] } | Achievement[]
    >(API_ROUTES.GAMIFICACAO.ACHIEVEMENTS);
    if (response && typeof response === "object" && "data" in response) {
      return Array.isArray(response.data) ? response.data : [];
    }
    return Array.isArray(response) ? response : [];
  },

  async getXpHistory(
    limit: number = 50,
    offset: number = 0,
  ): Promise<XpTransactionBackend[]> {
    const response = await api.get<
      | { success: boolean; data: XpTransactionBackend[] }
      | XpTransactionBackend[]
    >(`${API_ROUTES.GAMIFICACAO.HISTORY}?limit=${limit}&offset=${offset}`);
    if (response && typeof response === "object" && "data" in response) {
      return Array.isArray(response.data) ? response.data : [];
    }
    return Array.isArray(response) ? response : [];
  },

  async getStreak(): Promise<StreakData> {
    const response = await api.get<
      { success: boolean; data: StreakData } | StreakData
    >(API_ROUTES.GAMIFICACAO.STREAK);
    if (response && typeof response === "object" && "data" in response) {
      return response.data;
    }
    return response as StreakData;
  },

  getLevelTitle(level: number): string {
    if (level >= 100) return "Mestre Supremo";
    if (level >= 80) return "Lenda Viva";
    if (level >= 60) return "Mestre Experiente";
    if (level >= 40) return "Guerreiro Dedicado";
    if (level >= 20) return "Aprendiz Avançado";
    if (level >= 10) return "Aprendiz";
    if (level >= 5) return "Iniciante";
    return "Novo Explorador";
  },

  async getFullGamificationStats(): Promise<GamificationStats> {
    const [stats, streakData, achievements] = await Promise.all([
      this.getUserStats(),
      this.getStreak(),
      this.getAchievements(),
    ]);

    const level: UserLevel = {
      nivel: stats.level,
      xpAtual: stats.currentXp,
      xpProximoNivel: stats.nextLevelXp,
      titulo: this.getLevelTitle(stats.level),
    };

    const streaks: Streak[] = [
      {
        tipo: "daily",
        atual: stats.currentStreak,
        maximo: stats.maxStreak,
        ativo: stats.currentStreak > 0,
      },
    ];

    const conquistas: Conquista[] = achievements.map((ach) => ({
      id: ach.id,
      nome: ach.nome,
      descricao: ach.descricao,
      icone: this.getAchievementIconName(ach.tipo), // AGORA RETORNA NOME DO ÍCONE
      categoria: this.mapCategoria(ach.tipo),
      desbloqueada: ach.unlocked,
      dataDesbloqueio: ach.unlockedAt ? new Date(ach.unlockedAt) : undefined,
    }));

    return { level, streaks, conquistas };
  },

  // ========== ACHIEVEMENT ICONS (Nomes dos ícones Lucide) ==========
  getAchievementIconName(tipo: string): string {
    const icons: Record<string, string> = {
      creation: "Rocket",
      progress: "CheckCircle",
      streak: "Flame",
      level: "Star",
      default: "Trophy",
    };
    return icons[tipo] || icons.default;
  },

  getAchievementIcon(tipo: string): string {
    return this.getAchievementIconName(tipo);
  },

  mapCategoria(tipo: string): Conquista["categoria"] {
    const mapping: Record<string, Conquista["categoria"]> = {
      creation: "nucleo",
      progress: "tarefa",
      streak: "habito",
      level: "especial",
    };
    return mapping[tipo] || "especial";
  },

  convertToXPTransaction(
    transactions: XpTransactionBackend[],
  ): XPTransaction[] {
    return transactions.map((tx) => ({
      id: tx.id,
      amount: tx.xp_amount,
      source: this.mapSource(tx.source),
      description: tx.source,
      createdAt: new Date(tx.created_at),
    }));
  },

  mapSource(source: string): XPTransaction["source"] {
    const mapping: Record<string, XPTransaction["source"]> = {
      COMPLETE_TAREFA: "tarefa",
      REGISTER_HABITO: "habito",
      CREATE_NUCLEO: "nucleo",
      CREATE_BLOCO: "nucleo",
      STREAK_MILESTONE: "streak",
      ACHIEVEMENT: "conquista",
      DAILY_LOGIN: "tarefa",
    };
    return mapping[source] || "tarefa";
  },
};
