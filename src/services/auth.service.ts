"use client";

import api from "./api-auth";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AuthResponseDto,
} from "@/types/auth";
import type { User } from "@/types/user";
import { API_ROUTES } from "@/constants/routes";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export const authService = {
  // 🔐 LOGIN

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log("🔥 LOGIN CHAMADO");

    const response = await api.post<AuthResponseDto>(API_ROUTES.AUTH.LOGIN, {
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe ?? true,
    });

    const data = response.data;

    console.log("📦 RESPONSE:", data);

    if (!data.token) {
      throw new Error("Token não veio da API");
    }

    console.log("💾 SALVANDO TOKEN...");

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, data.token);
      console.log("🔑 TOKEN SALVO:", localStorage.getItem(TOKEN_KEY));

      const user: Partial<User> = {
        userId: data.userId,
        email: data.email,
        fullName: data.fullName,
      };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return {
      success: data.success,
      message: data.message,
      token: data.token,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt!,
      userId: data.userId!,
      email: data.email!,
      fullName: data.fullName!,
    };
  },

  // 📝 REGISTER

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponseDto>(
      API_ROUTES.AUTH.REGISTER,
      data,
    );

    const res = response.data;

    if (!res.success || !res.token) {
      throw new Error(res.message || "Erro ao registrar");
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, res.token);

      const user: Partial<User> = {
        userId: res.userId,
        email: res.email,
        fullName: res.fullName,
      };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return {
      success: res.success,
      message: res.message,
      token: res.token,
      refreshToken: res.refreshToken,
      expiresAt: res.expiresAt!,
      userId: res.userId!,
      email: res.email!,
      fullName: res.fullName!,
    };
  },

  // 🚪 LOGOUT

  async logout(): Promise<void> {
    try {
      await api.post(API_ROUTES.AUTH.LOGOUT);
    } catch {
      // Ignora erro
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  // 👤 GET CURRENT USER

  async getCurrentUser(): Promise<User | null> {
    try {
      if (typeof window === "undefined") return null;

      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return null;

      const response = await api.get(API_ROUTES.AUTH.ME, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData = response.data;
      const userData = responseData?.data || responseData;

      if (!userData || !userData.id) {
        console.warn("❌ Dados do usuário não encontrados na resposta");
        return null;
      }

      const user: User = {
        userId: userData.id,
        email: userData.email,
        fullName: userData.fullName || userData.full_name,
        avatarUrl: userData.avatarUrl,
        emailVerified: userData.emailVerified,
        active: userData.active,
        createdAt: userData.createdAt,
      };

      localStorage.setItem(USER_KEY, JSON.stringify(user));

      return user;
    } catch (err) {
      console.error("❌ ERRO getCurrentUser:", err);
      return null;
    }
  },

  // 💾 GET STORED USER

  getStoredUser(): User | null {
    if (typeof window === "undefined") return null;

    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as User;
    } catch {
      console.error("Erro ao fazer parse do usuário armazenado");
      return null;
    }
  },

  // 🔐 AUTH CHECK

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // GOOGLE LOGIN

  async loginWithGoogle(token: string): Promise<AuthResponse> {
    console.log("🔥 GOOGLE LOGIN CHAMADO");

    const response = await api.post<AuthResponseDto>("/auth/google", {
      token,
    });

    const data = response.data;

    console.log("📦 GOOGLE RESPONSE:", data);

    if (!data.token) {
      throw new Error("Token não veio da API (Google)");
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, data.token);

      const user: Partial<User> = {
        userId: data.userId,
        email: data.email,
        fullName: data.fullName,
      };

      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    return {
      success: data.success,
      message: data.message,
      token: data.token,
      refreshToken: data.refreshToken,
      expiresAt: data.expiresAt!,
      userId: data.userId!,
      email: data.email!,
      fullName: data.fullName!,
    };
  },
};

export default authService;
