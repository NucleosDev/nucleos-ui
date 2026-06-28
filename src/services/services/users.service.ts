import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/routes";
import type { User } from "@/types/user";

export const usersService = {
  async getMe(): Promise<User> {
    return api.get<User>(API_ROUTES.USERS.ME);
  },

  async updateProfile(payload: Partial<User>): Promise<User> {
    return api.patch<User>(API_ROUTES.USERS.PROFILE, payload);
  },

  async updatePreferences(preferences: Record<string, any>): Promise<void> {
    return api.patch(API_ROUTES.USERS.PREFERENCES, preferences);
  },

  async getStats(): Promise<{ tarefasConcluidasHoje: number /* outros */ }> {
    return api.get(API_ROUTES.USERS.STATS);
  },

  async getAchievements(): Promise<any[]> {
    return api.get(API_ROUTES.USERS.ACHIEVEMENTS);
  },

  async getXpLogs(): Promise<any[]> {
    return api.get(API_ROUTES.USERS.XP_LOGS);
  },

  async getEnergyLogs(): Promise<any[]> {
    return api.get(API_ROUTES.USERS.ENERGY_LOGS);
  },

  async getActivityLogs(): Promise<any[]> {
    return api.get(API_ROUTES.USERS.ACTIVITY_LOGS);
  },

  async getCurrentPlan(): Promise<any> {
    return api.get(API_ROUTES.USERS.PLAN);
  },

  async deleteAccount(): Promise<void> {
    return api.delete(API_ROUTES.USERS.DELETE_ACCOUNT);
  },

  async reactivateAccount(): Promise<void> {
    return api.post(API_ROUTES.USERS.REACTIVATE);
  },
};
