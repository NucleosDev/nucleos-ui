"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { User } from "@/types/user";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types/auth";

// ─── Credenciais fixas para demonstração ────────────────────────────────────
const DEMO_EMAIL = "nucleos@hotmail.com";
const DEMO_PASSWORD = "nucleos2026";
const DEMO_TOKEN = "demo-token-nucleos-2026";

const DEMO_USER: User = {
  userId: "demo-user-001",
  email: DEMO_EMAIL,
  fullName: "Nucleos Demo",
  avatarUrl: undefined,
  emailVerified: true,
  active: true,
  createdAt: new Date().toISOString(),
};
// ─────────────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "user";
const TOKEN_KEY = "token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const isAuthenticated = !!user;

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token === DEMO_TOKEN) {
      setUser(DEMO_USER);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };
    initAuth();
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (
      credentials.email === DEMO_EMAIL &&
      credentials.password === DEMO_PASSWORD
    ) {
      localStorage.setItem(TOKEN_KEY, DEMO_TOKEN);
      localStorage.setItem(USER_KEY, JSON.stringify(DEMO_USER));
      setUser(DEMO_USER);

      return {
        success: true,
        message: "Login realizado com sucesso",
        token: DEMO_TOKEN,
        refreshToken: DEMO_TOKEN,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        userId: DEMO_USER.userId,
        email: DEMO_USER.email,
        fullName: DEMO_USER.fullName,
      };
    }

    throw new Error("E-mail ou senha incorretos");
  };

  const register = async (_data: RegisterData): Promise<AuthResponse> => {
    throw new Error("Cadastro desabilitado nesta versão de demonstração.");
  };

  const loginWithGoogle = async (_token: string) => {
    throw new Error("Login com Google desabilitado nesta versão de demonstração.");
  };

  const logout = async () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

