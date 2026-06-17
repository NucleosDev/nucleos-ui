import { User } from "./user";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  phone: string;
  cpf: string;
  nickname?: string;
}

export interface AuthResponseDto {
  success: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
  userId?: string;
  email?: string;
  fullName?: string;
  errors?: string[];
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  refreshToken?: string;
  expiresAt: string;
  userId: string;
  email: string;
  fullName: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
