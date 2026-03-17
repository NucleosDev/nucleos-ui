import api from "./api";
import { API_ROUTES } from "@/constants/routes";
import type { User } from "@/types/user";
import type { Nucleo } from "@/types/nucleo";
import type { Plan } from "@/types/plan";

export const adminService = {
  // Usuários
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: "active" | "inactive";
  }): Promise<{ users: User[]; total: number }> {
    const response = await api.get<{ users: User[]; total: number }>(
      API_ROUTES.ADMIN.USERS,
      { params },
    );
    return response.data;
  },

  async getUser(id: string): Promise<User> {
    const response = await api.get<User>(API_ROUTES.ADMIN.USER(id));
    return response.data;
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await api.put<User>(API_ROUTES.ADMIN.USER(id), data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(API_ROUTES.ADMIN.USER(id));
  },

  // Nucleos
  async getAllNucleos(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ nucleos: Nucleo[]; total: number }> {
    const response = await api.get<{ nucleos: Nucleo[]; total: number }>(
      API_ROUTES.ADMIN.NUCLEOS,
      { params },
    );
    return response.data;
  },

  // Estatísticas
  async getStats(): Promise<{
    totalUsers: number;
    totalNucleos: number;
    activeSubscriptions: number;
    totalRevenue: number;
    recentActivity: any[];
  }> {
    const response = await api.get(API_ROUTES.ADMIN.STATS);
    return response.data;
  },

  // Planos (CRUD admin)
  async createPlan(data: Partial<Plan>): Promise<Plan> {
    const response = await api.post<Plan>("/admin/plans", data);
    return response.data;
  },

  async updatePlan(id: string, data: Partial<Plan>): Promise<Plan> {
    const response = await api.put<Plan>(`/admin/plans/${id}`, data);
    return response.data;
  },

  async deletePlan(id: string): Promise<void> {
    await api.delete(`/admin/plans/${id}`);
  },
};
