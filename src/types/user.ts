// src/types/user.ts
import { Plan } from "./plan";


export interface User {
  userId: string;
  email: string;
  fullName: string;
  cpf?: string;
  phone?: string;
  nickname?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  active: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  nickname?: string;
  avatarUrl?: string;
  phone: string;
  cpf: string;
  createdAt: string;
}

export interface UserRole {
  role: "user" | "admin" | "moderator";
}

export interface UserSecurity {
  lastLogin?: string;
  failedAttempts: number;
  passwordUpdatedAt: string;
}

export interface UserLevel {
  level: number;
  currentXp: number;
  nextLevelXp: number;
  totalXpEarned: number;
  updatedAt: string;
}

export interface Subscription {
  plan: Plan;
  startedAt: string;
  expiresAt?: string;
}

export interface DashboardStats {
  totalUsuarios: number;
  totalNucleos: number;
  totalTarefasConcluidas: number;
  totalHabitosAtivos: number;
  nucleosAtivos: number;
  tarefasConcluidasHoje: number;
  minutosConcentradosHoje: number;
  progressoGeral: number;
}

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
  desbloquedaEm?: string | null;
  raridade: "comum" | "raro" | "epico" | "lendario";
}

export interface UpdateUserPayload {
  nome?: string;
  email?: string;
  senhaAtual?: string;
  novaSenha?: string;
  avatarUrl?: string;
}
