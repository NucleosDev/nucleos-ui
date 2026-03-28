// src/types/auth.ts
import { User } from "./user";

export interface LoginCredentials {
  email: string;
  Password: string;
}

export interface RegisterData {
  email: string;
  Password: string;
  ConfirmPassword: string; // ← ESSE CAMPO É OBRIGATÓRIO
  fullName: string;
  phone: string;
  Cpf: string;
  nickname?: string;
}

export interface AuthResponse {
  userId: string;
  email: string;
  fullName: string;
  token: string;
  expiresAt: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
}
