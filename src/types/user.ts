// src/types/user.ts
import { Plan } from "./plan";

export interface User {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  active: boolean;
  Cpf?: string; // ← ADICIONAR Cpf OPCIONAL no nível do User
  profile: UserProfile;
  roles: UserRole[];
  security?: UserSecurity;
  level?: UserLevel;
  subscription?: Subscription;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  nickname?: string;
  avatarUrl?: string;
  phone: string;
  Cpf: string; // ← Cpf OBRIGATÓRIO no profile
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
