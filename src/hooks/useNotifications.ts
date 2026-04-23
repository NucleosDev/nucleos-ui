// src/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "@/services/notifications.service";
import { GamificationNotification } from "@/types/notifications";

export const NOTIFICATION_KEYS = {
  all: ["notifications"] as const,
  unreadCount: ["notifications", "unreadCount"] as const,
};

export function useNotifications() {
  const queryClient = useQueryClient();
  const [latestNotification, setLatestNotification] =
    useState<GamificationNotification | null>(null);

  // Buscar todas notificações
  const useGetNotifications = () => {
    return useQuery({
      queryKey: NOTIFICATION_KEYS.all,
      queryFn: () => notificationsService.getNotifications(),
      staleTime: 1000 * 30,
      refetchInterval: 1000 * 60,
      // Retorna array vazio se não houver notificações
      select: (data) => data || [],
    });
  };

  // Buscar contagem de não lidas
  const useUnreadCount = () => {
    return useQuery({
      queryKey: NOTIFICATION_KEYS.unreadCount,
      queryFn: () => notificationsService.getUnreadCount(),
      staleTime: 1000 * 10,
      refetchInterval: 1000 * 30,
      // Retorna 0 se não houver contagem
      select: (data) => data ?? 0,
    });
  };

  // Marcar como lida
  const markAsRead = useMutation({
    mutationFn: (notificationId: string) =>
      notificationsService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.unreadCount,
      });
    },
  });

  // Marcar todas como lidas
  const markAllAsRead = useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.unreadCount,
      });
    },
  });

  // Adicionar notificação em tempo real (via WebSocket)
  const addRealtimeNotification = useCallback(
    (notification: GamificationNotification) => {
      setLatestNotification(notification);
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_KEYS.unreadCount,
      });
    },
    [queryClient],
  );

  return {
    useGetNotifications,
    useUnreadCount,
    markAsRead,
    markAllAsRead,
    addRealtimeNotification,
    latestNotification,
  };
}
