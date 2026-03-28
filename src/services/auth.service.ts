// src/services/auth.service.ts
import api from "./api";
import { API_ROUTES } from "@/constants/routes";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, {
      email: credentials.email,
      Password: credentials.Password,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: response.data.userId,
          email: response.data.email,
          fullName: response.data.fullName,
        }),
      );
    }

    return response.data;
  },

  // src/services/auth.service.ts
  // src/services/auth.service.ts
  async register(data: RegisterData): Promise<AuthResponse> {
    console.log("🔍 [SERVICE] Register chamado com data:", {
      email: data.email,
      fullName: data.fullName,
      hasPassword: !!data.Password,
      hasConfirmPassword: !!data.ConfirmPassword,
      phone: data.phone,
      Cpf: data.Cpf,
      nickname: data.nickname,
    });

    // Validação explícita
    if (!data.ConfirmPassword) {
      console.error("❌ [SERVICE] ConfirmPassword não foi fornecido!");
      throw new Error("ConfirmPassword é obrigatório");
    }

    if (data.Password !== data.ConfirmPassword) {
      console.error("❌ [SERVICE] As senhas não conferem!");
      throw new Error("As senhas não conferem");
    }

    const payload = {
      email: data.email,
      fullName: data.fullName,
      Password: data.Password,
      ConfirmPassword: data.ConfirmPassword,
      phone: data.phone,
      Cpf: data.Cpf,
      nickname: data.nickname,
    };

    console.log("📤 [SERVICE] Payload enviado para API:", {
      ...payload,
      Password: "***",
      ConfirmPassword: "***",
    });

    try {
      const response = await api.post<AuthResponse>(
        API_ROUTES.AUTH.REGISTER,
        payload,
      );
      console.log("✅ [SERVICE] Resposta da API:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ [SERVICE] Erro na API:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post(API_ROUTES.AUTH.LOGOUT);
    } catch {
      // Ignorar erro no logout
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  async getCurrentUser(): Promise<any> {
    try {
      const response = await api.get(API_ROUTES.AUTH.ME);
      return response.data;
    } catch {
      return null;
    }
  },

  async refreshToken(refreshToken: string): Promise<{ token: string } | null> {
    try {
      const response = await api.post(API_ROUTES.AUTH.REFRESH_TOKEN, {
        refreshToken,
      });
      return response.data;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  getUser(): any | null {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
