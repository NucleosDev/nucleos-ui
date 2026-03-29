// src/auth/auth-context.tsx
"use client";

import {
  createContext,
  useContext,
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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "token";
const USER_KEY = "user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  const clearAuth = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const login = async (
    credentials: LoginCredentials,
  ): Promise<AuthResponse> => {
    setIsLoading(true);

    try {
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
          Cpf: "",
          createdAt: new Date().toISOString(),
        },
        roles: [{ role: "user" }],
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);

      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setIsLoading(true);

    try {
      const response = await authService.register(data);

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
          phone: data.phone,
          Cpf: data.Cpf,
          ...(data.nickname && { nickname: data.nickname }),
          createdAt: new Date().toISOString(),
        },
        roles: [{ role: "user" }],
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);

      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
