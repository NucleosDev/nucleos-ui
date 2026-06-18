// src/services/notifications.service.ts
import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/routes";
import { GamificationNotification } from "@/types/notifications";

// Tipo para a resposta da API de notificações
interface NotificationsApiResponse {
  success?: boolean;
  data?: GamificationNotification[];
  [key: string]: unknown;
}

// Tipo para a resposta de contagem
interface CountApiResponse {
  success?: boolean;
  data?: { count: number };
  count?: number;
}

const getTypeFromSource = (
  source: string,
): GamificationNotification["type"] => {
  const typeMap: Record<string, GamificationNotification["type"]> = {
    COMPLETE_TAREFA: "XP",
    REGISTER_HABITO: "XP",
    CREATE_NUCLEO: "XP",
    CREATE_BLOCO: "XP",
    LEVEL_UP: "LEVEL_UP",
    ACHIEVEMENT: "ACHIEVEMENT",
    STREAK_MILESTONE: "STREAK",
    DAILY_LOGIN: "DAILY_REWARD",
  };
  return typeMap[source] || "XP";
};

const formatNotification = (notification: any): GamificationNotification => {
  return {
    id: notification.id,
    title: notification.titulo || notification.title || "Notificação",
    message: notification.mensagem || notification.message || "",
    type: notification.type || getTypeFromSource(notification.source),
    xp: notification.xp_amount || notification.xp,
    read: notification.read || false,
    createdAt: notification.created_at
      ? new Date(notification.created_at)
      : new Date(),
  };
};

export const notificationsService = {
  async getNotifications(): Promise<GamificationNotification[]> {
    try {
      const response = (await api.get(API_ROUTES.NOTIFICATIONS.LIST)) as
        | NotificationsApiResponse
        | GamificationNotification[];

      if (response && typeof response === "object") {
        // Se for array direto
        if (Array.isArray(response)) {
          return response.map(formatNotification);
        }
        // Se tiver data
        if ("data" in response && Array.isArray(response.data)) {
          return response.data.map(formatNotification);
        }
      }
      return [];
    } catch {
      return [];
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.patch(API_ROUTES.NOTIFICATIONS.MARK_READ(notificationId));
    } catch (error: any) {
      console.error("Erro ao marcar notificação:", error?.message);
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await api.patch(API_ROUTES.NOTIFICATIONS.MARK_ALL_READ);
    } catch (error: any) {
      console.error("Erro ao marcar todas:", error?.message);
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const response = (await api.get(
        `${API_ROUTES.NOTIFICATIONS.LIST}/unread-count`,
      )) as CountApiResponse;

      // Tenta extrair o count de diferentes formatos
      if (response && typeof response === "object") {
        // Direto: { count: 5 }
        if ("count" in response && typeof response.count === "number") {
          return response.count;
        }
        // Dentro de data: { data: { count: 5 } }
        if (
          "data" in response &&
          response.data &&
          typeof response.data === "object" &&
          "count" in response.data
        ) {
          return (response.data as { count: number }).count;
        }
      }
      return 0;
    } catch {
      return 0;
    }
  },
};
