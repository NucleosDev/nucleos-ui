import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/routes";
import type {
  UserGameStats,
  Achievement,
  XpTransactionBackend,
  StreakData,
  GamificationStats,
  UserLevel,
  Streak,
  Conquista,
  XPTransaction,
} from "@/types/gamification";

// ── Level maths ────────────────────────────────────────────────────────────────
// Total XP needed to reach level N = 100 * N²
// Level given totalXp = floor(sqrt(totalXp / 100)), minimum 1
export function xpForLevel(level: number): number {
  return 100 * level * level;
}

export function levelFromTotalXp(totalXp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(Math.max(0, totalXp) / 100)));
}

export function computeXpStats(totalXp: number): {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  progressToNextLevel: number;
} {
  const level = levelFromTotalXp(totalXp);
  // Level 1 starts at 0 XP; level N>=2 starts at xpForLevel(N)
  const xpAtCurrentLevel = level <= 1 ? 0 : xpForLevel(level);
  const xpAtNextLevel = xpForLevel(level + 1);
  const currentXp = totalXp - xpAtCurrentLevel;
  const nextLevelXp = xpAtNextLevel - xpAtCurrentLevel;
  const progressToNextLevel =
    nextLevelXp > 0 ? Math.round((currentXp / nextLevelXp) * 100) : 100;
  return { level, currentXp, nextLevelXp, progressToNextLevel };
}

// ── Streak computation ─────────────────────────────────────────────────────────
export function computeStreakFromLogs(
  logs: Pick<XpTransactionBackend, "created_at">[],
): StreakData {
  if (logs.length === 0)
    return { currentStreak: 0, maxStreak: 0, lastActivityDate: null };

  const activeDays = new Set(logs.filter((l) => l.created_at).map((l) => l.created_at.slice(0, 10)));
  const sortedDays = Array.from(activeDays).sort();

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);

  // Current streak: count backwards from today or yesterday
  let currentStreak = 0;
  const anchor = activeDays.has(today)
    ? today
    : activeDays.has(yesterday)
      ? yesterday
      : null;

  if (anchor) {
    currentStreak = 1;
    const d = new Date(anchor);
    while (true) {
      d.setDate(d.getDate() - 1);
      if (activeDays.has(d.toISOString().slice(0, 10))) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Max streak: longest consecutive sequence in sorted days
  let maxStreak = Math.max(1, currentStreak);
  let run = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1] + "T12:00:00");
    const curr = new Date(sortedDays[i] + "T12:00:00");
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / 86_400_000,
    );
    if (diffDays === 1) {
      run++;
      if (run > maxStreak) maxStreak = run;
    } else {
      run = 1;
    }
  }

  return {
    currentStreak,
    maxStreak,
    lastActivityDate: sortedDays[sortedDays.length - 1] ?? null,
  };
}

// ── Achievement normalisation ─────────────────────────────────────────────────
// The backend may return different shapes. Normalise to Achievement.
function normaliseAchievement(raw: any): Achievement {
  return {
    id: raw.id ?? raw.achievementId ?? String(Math.random()),
    nome: raw.nome ?? raw.name ?? raw.titulo ?? "Conquista",
    descricao: raw.descricao ?? raw.description ?? "",
    tipo: raw.tipo ?? raw.type ?? raw.achievementType ?? "especial",
    xp_recompensa:
      raw.xp_recompensa ?? raw.xpRecompensa ?? raw.xp ?? raw.reward ?? 0,
    unlocked:
      raw.unlocked ??
      raw.desbloqueada ??
      raw.unlockedAt != null ??
      false,
    unlockedAt: raw.unlockedAt ?? raw.desbloquedaEm ?? null,
  };
}

// ── Service ───────────────────────────────────────────────────────────────────
export const gamificacaoService = {
  // ── XP History ──────────────────────────────────────────────────────────────
  async getXpHistory(
    limit = 200,
    _offset = 0,
  ): Promise<XpTransactionBackend[]> {
    try {
      const res = await api.get<
        { success: boolean; data: XpTransactionBackend[] } | XpTransactionBackend[]
      >(API_ROUTES.USERS.XP_LOGS);

      const raw = Array.isArray(res)
        ? res
        : "data" in res && Array.isArray(res.data)
          ? res.data
          : [];

      return raw.slice(0, limit);
    } catch {
      return [];
    }
  },

  // ── Achievements ────────────────────────────────────────────────────────────
  async getAchievements(): Promise<Achievement[]> {
    try {
      const res = await api.get<any>(API_ROUTES.USERS.ACHIEVEMENTS);
      const raw: any[] = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : [];
      return raw.map(normaliseAchievement);
    } catch {
      return [];
    }
  },

  // ── Stats (computed from XP logs) ──────────────────────────────────────────
  async getUserStats(): Promise<UserGameStats> {
    try {
      const logs = await this.getXpHistory(1000);
      const totalXp = logs.reduce((s, l) => s + (l.xp_amount ?? 0), 0);
      const { level, currentXp, nextLevelXp, progressToNextLevel } =
        computeXpStats(totalXp);
      const today = new Date().toISOString().slice(0, 10);
      const todayXp = logs
        .filter((l) => l.created_at && l.created_at.slice(0, 10) === today)
        .reduce((s, l) => s + (l.xp_amount ?? 0), 0);
      const streak = computeStreakFromLogs(logs);
      const achievements = await this.getAchievements();
      const achievementsCount = achievements.filter((a) => a.unlocked).length;

      return {
        level,
        currentXp,
        nextLevelXp,
        totalXp,
        currentStreak: streak.currentStreak,
        maxStreak: streak.maxStreak,
        achievementsCount,
        todayXp,
        totalActions: logs.length,
        progressToNextLevel,
      };
    } catch {
      return {
        level: 1,
        currentXp: 0,
        nextLevelXp: 100,
        totalXp: 0,
        currentStreak: 0,
        maxStreak: 0,
        achievementsCount: 0,
        todayXp: 0,
        totalActions: 0,
        progressToNextLevel: 0,
      };
    }
  },

  // ── Streak ──────────────────────────────────────────────────────────────────
  async getStreak(): Promise<StreakData> {
    try {
      const logs = await this.getXpHistory(1000);
      return computeStreakFromLogs(logs);
    } catch {
      return { currentStreak: 0, maxStreak: 0, lastActivityDate: null };
    }
  },

  // ── Leaderboard (try backend, empty fallback) ─────────────────────────────
  async getLeaderboard(limit = 10) {
    try {
      const res = await api.get<any>(
        `${API_ROUTES.GAMIFICACAO.LEADERBOARD}?limit=${limit}`,
      );
      const raw: any[] = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : [];
      return raw;
    } catch {
      return [];
    }
  },

  // ── Energy (try backend, empty fallback) ──────────────────────────────────
  async getEnergy() {
    try {
      const res = await api.get<any>(API_ROUTES.PROGRESS.ENERGY);
      const d = res?.data ?? res;
      return {
        energy: d?.energy ?? 0,
        maxEnergy: d?.maxEnergy ?? 100,
        baseEnergy: d?.baseEnergy ?? 100,
      };
    } catch {
      return { energy: 0, maxEnergy: 100, baseEnergy: 100 };
    }
  },

  // ── Full stats (used by useFullStats) ─────────────────────────────────────
  async getFullGamificationStats(): Promise<GamificationStats> {
    const [stats, achievements] = await Promise.all([
      this.getUserStats(),
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
      icone: this.getAchievementIconName(ach.tipo),
      categoria: this.mapCategoria(ach.tipo),
      desbloqueada: ach.unlocked,
      dataDesbloqueio: ach.unlockedAt ? new Date(ach.unlockedAt) : undefined,
    }));

    return { level, streaks, conquistas };
  },

  // ── Helpers ───────────────────────────────────────────────────────────────
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

  getAchievementIconName(tipo: string): string {
    const icons: Record<string, string> = {
      creation: "Rocket",
      progress: "CheckCircle",
      streak: "Flame",
      level: "Star",
      especial: "Trophy",
      default: "Trophy",
    };
    return icons[tipo] || icons.default;
  },

  mapCategoria(tipo: string): Conquista["categoria"] {
    const mapping: Record<string, Conquista["categoria"]> = {
      creation: "nucleo",
      progress: "tarefa",
      streak: "habito",
      level: "especial",
      especial: "especial",
    };
    return mapping[tipo] || "especial";
  },

  convertToXPTransaction(transactions: XpTransactionBackend[]): XPTransaction[] {
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
