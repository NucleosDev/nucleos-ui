export interface UserLevel {
  nivel: number;
  xpAtual: number;
  xpProximoNivel: number;
  titulo: string;
}

export interface Streak {
  tipo: string;
  atual: number;
  maximo: number;
  ativo: boolean;
}

export interface Conquista {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  categoria: "habito" | "tarefa" | "nucleo" | "especial";
  desbloqueada: boolean;
  progresso?: number;
  meta?: number;
  dataDesbloqueio?: Date;
}

export interface GamificationStats {
  level: UserLevel;
  streaks: Streak[];
  conquistas: Conquista[];
}

export interface XPTransaction {
  id: string;
  amount: number;
  source: "tarefa" | "habito" | "nucleo" | "streak" | "conquista";
  description: string;
  createdAt: Date;
}

// Tipos do backend (compatíveis)
export interface UserGameStats {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  totalXp: number;
  currentStreak: number;
  maxStreak: number;
  achievementsCount: number;
  todayXp: number;
  totalActions: number;
  progressToNextLevel: number;
}

export interface Achievement {
  id: string;
  nome: string;
  descricao: string;
  tipo: string;
  xp_recompensa: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface LeaderboardUser {
  user_id: string;
  full_name: string;
  level: number;
  total_xp: number;
}

export interface XpTransactionBackend {
  id: string;
  xp_amount: number;
  source: string;
  nucleo_id: string | null;
  created_at: string;
}

export interface StreakData {
  currentStreak: number;
  maxStreak: number;
  lastActivityDate: string | null;
}
