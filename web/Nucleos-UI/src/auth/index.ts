"use client";

// Exportar o Provider e o hook do contexto de autenticação
export { AuthProvider, useAuth } from "./auth-context";

// Exportar os tipos necessários
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types/auth";
