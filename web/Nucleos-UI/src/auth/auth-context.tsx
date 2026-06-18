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
import authService from "@/services/auth.service";
import type { User } from "@/types/user";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types/auth";
import { GoogleLogin } from "@react-oauth/google";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>; // GOOGLE LOGIN
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

  // 🔄 REFRESH USER
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await authService.getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      clearAuth();
    }
  }, [clearAuth]);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };

    initAuth();
  }, [refreshUser]);

  // LOGIN
  const login = async (
    credentials: LoginCredentials,
  ): Promise<AuthResponse> => {
    const response = await authService.login(credentials);

    localStorage.setItem(TOKEN_KEY, response.token);
    await refreshUser();

    return response;
  };

  // REGISTER
  const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await authService.register(data);

    localStorage.setItem(TOKEN_KEY, response.token);
    await refreshUser();

    return response;
  };

  // GOOGLE LOGIN
  const loginWithGoogle = useCallback(
    async (token: string) => {
      const response = await authService.loginWithGoogle(token);

      localStorage.setItem(TOKEN_KEY, response.token);
      await refreshUser(); // usa seu fluxo padrão 🔥
    },
    [refreshUser],
  );

  // LOGOUT
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      clearAuth();
    }
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
        loginWithGoogle, // GOOGLE LOGIN
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
