import api from "./api-auth";
import { API_ROUTES } from "@/constants/routes";
import type { Notification } from "@/types/logs";

export const notificationsService = {
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<Notification[]> {
    const response = await api.get<Notification[]>(
      API_ROUTES.NOTIFICATIONS.LIST,
      { params },
    );
    return response.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.post(API_ROUTES.NOTIFICATIONS.MARK_READ(id));
  },

  async markAllAsRead(): Promise<void> {
    await api.post(API_ROUTES.NOTIFICATIONS.MARK_ALL_READ);
  },

  async delete(id: string): Promise<void> {
    await api.delete(API_ROUTES.NOTIFICATIONS.DELETE(id));
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get<{ count: number }>(
      "/notifications/unread-count",
    );
    return response.data.count;
  },
};
