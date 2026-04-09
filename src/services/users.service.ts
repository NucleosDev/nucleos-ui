// src/services/users.service.ts
import api from "./api";
import { API_ROUTES } from "@/constants/routes"; // ← CORRIGIDO
import type { User, UserLevel } from "@/types/user";
import type { XpLog, EnergyLog } from "@/types/logs";
import type { AiContext, AiInsight } from "@/types/ai";
import type { UpdateUserPayload } from "@/src/types/user";

export const usersService = {
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>(API_ROUTES.USERS.ME);
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<User>(API_ROUTES.USERS.PROFILE, data);
    return response.data;
  },

  async updateAvatar(file: File): Promise<{ avatar_url: string }> {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.post<{ avatar_url: string }>(
      API_ROUTES.USERS.AVATAR,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  async getUserLevel(): Promise<UserLevel> {
    const response = await api.get<UserLevel>(API_ROUTES.USERS.LEVEL);
    return response.data;
  },

  async getXpLogs(params?: {
    page?: number;
    limit?: number;
  }): Promise<XpLog[]> {
    const response = await api.get<XpLog[]>(API_ROUTES.USERS.XP_LOGS, {
      params,
    });
    return response.data;
  },

  async getEnergyLogs(params?: {
    page?: number;
    limit?: number;
  }): Promise<EnergyLog[]> {
    const response = await api.get<EnergyLog[]>(API_ROUTES.USERS.ENERGY_LOGS, {
      params,
    });
    return response.data;
  },

  async getAiContext(): Promise<AiContext> {
    const response = await api.get<AiContext>(API_ROUTES.USERS.AI_CONTEXT);
    return response.data;
  },

  async updateAiContext(data: Partial<AiContext>): Promise<AiContext> {
    const response = await api.put<AiContext>(
      API_ROUTES.USERS.AI_CONTEXT,
      data,
    );
    return response.data;
  },

  async getAiInsights(): Promise<AiInsight[]> {
    const response = await api.get<AiInsight[]>(API_ROUTES.USERS.AI_INSIGHTS);
    return response.data;
  },
  async update(payload: UpdateUserPayload): Promise<User> {
    const { data } = await api.put<User>("v1/auth/me", payload);
    return data;
  },
};
