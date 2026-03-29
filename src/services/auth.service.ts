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
      password: credentials.Password,
      rememberMe: true,
    });

    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(API_ROUTES.AUTH.REGISTER, {
      email: data.email,
      fullName: data.fullName,
      password: data.Password,
      confirmPassword: data.ConfirmPassword,
      phone: data.phone,
      cpf: data.Cpf,
      nickname: data.nickname,
    });

    return response.data;
  },

  async logout() {
    await api.post(API_ROUTES.AUTH.LOGOUT);
  },

  async getCurrentUser() {
    try {
      const res = await api.get(API_ROUTES.AUTH.ME);
      return res.data;
    } catch {
      return null;
    }
  },
};

export default authService;
