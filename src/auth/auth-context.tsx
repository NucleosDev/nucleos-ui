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

const USER_KEY = "user";
const TOKEN_KEY = "token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);


  // 🔄 REFRESH USER (FIXADO)

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      return;
    }

    const currentUser = await authService.getCurrentUser();

    if (currentUser) {
      setUser(currentUser);
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    } else {
      clearAuth();
    }
  }, [clearAuth]);


  // INIT

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    })();
  }, [refreshUser]);


  // LOGIN (🔥 FIX REAL)

  const login = async (
    credentials: LoginCredentials,
  ): Promise<AuthResponse> => {
    const response = await authService.login(credentials);

    // 🔥 GARANTE TOKEN (ANTI BUG)
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


  // LOGOUT

  const logout = async () => {
    await authService.logout();
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
