import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

const API_URL = "http://localhost:5000/auth";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro no login");

    return res.json();
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro no cadastro");

    return res.json();
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    const res = await fetch(`${API_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) throw new Error("Erro ao renovar token");

    return res.json();
  },
};