// src/auth/auth-context.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import authService from "@/services/auth.service";
import type { User } from "@/types/user";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types/auth";

// ========== TIPO DO CONTEXTO ==========
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "token";
const USER_KEY = "user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const clearAuth = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) {
        setUser(null);
        return;
      }

      const storedUser = localStorage.getItem(USER_KEY);
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
            return;
          }
        } catch {
          // Fallback para API
        }
      }

      const currentUser = await authService.getCurrentUser();
      if (currentUser && currentUser.userId) {
        const userData: User = {
          id: currentUser.userId,
          email: currentUser.email,
          fullName: currentUser.fullName,
          emailVerified: false,
          active: true,
          profile: {
            id: "",
            userId: currentUser.userId,
            fullName: currentUser.fullName,
            phone: currentUser.phone,
            Cpf: currentUser.Cpf,
            createdAt: new Date().toISOString(),
          },
          roles: [{ role: "user" }],
          createdAt: new Date().toISOString(),
        };
        setUser(userData);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      } else {
        clearAuth();
      }
    } catch {
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

  const login = async (
    credentials: LoginCredentials,
  ): Promise<AuthResponse> => {
    const response = await authService.login(credentials);

    const userData: User = {
      id: response.userId,
      email: response.email,
      fullName: response.fullName,
      emailVerified: false,
      active: true,
      profile: {
        id: "",
        userId: response.userId,
        fullName: response.fullName,
        phone: "",
        Cpf: "", // ← ADICIONAR Cpf (será atualizado depois)
        createdAt: new Date().toISOString(),
      },
      roles: [{ role: "user" }],
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);

    return response;
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await authService.register({
      email: data.email,
      fullName: data.fullName,
      Password: data.Password,
      ConfirmPassword: data.ConfirmPassword,
      phone: data.phone,
      Cpf: data.Cpf, // ← Cpf obrigatório
      nickname: data.nickname,
    });

    const userData: User = {
      id: response.userId,
      email: response.email,
      fullName: response.fullName,
      emailVerified: false,
      active: true,
      profile: {
        id: "",
        userId: response.userId,
        fullName: response.fullName,
        Cpf: data.Cpf, // ← Cpf DO REGISTRO
        ...(data.nickname && { nickname: data.nickname }),
        phone: data.phone,
        createdAt: new Date().toISOString(),
      },
      roles: [{ role: "user" }],
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);

    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
