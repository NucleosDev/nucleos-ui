"use client";

import api from "./api";
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
  // =========================
  // 🔐 LOGIN
  // =========================
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log("🔥 LOGIN CHAMADO");

    const response = await api.post<AuthResponseDto>(API_ROUTES.AUTH.LOGIN, {
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe ?? true,
    });

    const data = response.data; // ✅ ESSA LINHA É O FIX

    console.log("📦 RESPONSE:", data);

    if (!data.token) {
      throw new Error("Token não veio da API");
    }

    console.log("💾 SALVANDO TOKEN...");

    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
      console.log("🔑 TOKEN SALVO:", localStorage.getItem("token"));
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

  // =========================
  // 📝 REGISTER
  // =========================
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

  // =========================
  // 🚪 LOGOUT
  // =========================
  async logout(): Promise<void> {
    try {
      await api.post(API_ROUTES.AUTH.LOGOUT);
    } catch {}

    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  // =========================
  // 👤 GET CURRENT USER
  // =========================
  async getCurrentUser(): Promise<User | null> {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

      if (!token) {
        console.warn("❌ SEM TOKEN NO getCurrentUser");
        return null;
      }

      const response = await api.get<User>(API_ROUTES.AUTH.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data;

      if (typeof window !== "undefined" && user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }

      return user;
    } catch (err) {
      console.error("❌ ERRO getCurrentUser:", err);
      return null;
    }
  },

  // =========================
  // 💾 GET STORED USER (LOCAL)
  // =========================
  getStoredUser(): User | null {
    if (typeof window === "undefined") return null;

    const user = localStorage.getItem("user");

    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // =========================
  // 🔐 AUTH CHECK
  // =========================
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

export default authService;
