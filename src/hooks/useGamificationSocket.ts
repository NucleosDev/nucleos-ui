// src/hooks/useGamificationSocket.ts
"use client";

import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "./useNotifications";
import { GAMIFICATION_KEYS } from "./useGamification";

interface XpEventData {
  xp: number;
  message?: string;
}

interface LevelUpEventData {
  newLevel: number;
  message?: string;
}

interface AchievementEventData {
  name: string;
  message?: string;
  xpReward?: number;
}

interface StreakEventData {
  currentStreak: number;
  message?: string;
}

interface DailyRewardEventData {
  xp: number;
  message?: string;
}

export function useGamificationSocket() {
  const { addRealtimeNotification } = useNotifications();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  function invalidateGamification() {
    queryClient.invalidateQueries({ queryKey: GAMIFICATION_KEYS.stats });
    queryClient.invalidateQueries({ queryKey: GAMIFICATION_KEYS.fullStats });
    queryClient.invalidateQueries({ queryKey: GAMIFICATION_KEYS.streak });
    queryClient.invalidateQueries({ queryKey: GAMIFICATION_KEYS.history });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Dynamic import avoids Turbopack statically bundling engine.io-client's
    // broken ESM build (transports/index.js missing in @6.6.4).
    import("socket.io-client").then(({ io }) => {
      const socket = io(
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
        {
          path: "/socket.io",
          transports: ["websocket"],
          auth: { token },
        },
      );

      socketRef.current = socket;

      socket.on("gamification:xp", (data: XpEventData) => {
        invalidateGamification();
        addRealtimeNotification({
          id: Date.now().toString(),
          type: "XP",
          title: "XP Ganho!",
          message: data.message || `Você ganhou ${data.xp} XP!`,
          xp: data.xp,
          read: false,
          createdAt: new Date(),
        });
      });

      socket.on("gamification:levelUp", (data: LevelUpEventData) => {
        invalidateGamification();
        addRealtimeNotification({
          id: Date.now().toString(),
          type: "LEVEL_UP",
          title: `Nível ${data.newLevel} Alcançado!`,
          message:
            data.message || `Parabéns! Você chegou ao nível ${data.newLevel}!`,
          read: false,
          createdAt: new Date(),
        });
      });

      socket.on("gamification:achievement", (data: AchievementEventData) => {
        invalidateGamification();
        addRealtimeNotification({
          id: Date.now().toString(),
          type: "ACHIEVEMENT",
          title: "Nova Conquista!",
          message: data.message || `Você desbloqueou "${data.name}"!`,
          xp: data.xpReward,
          read: false,
          createdAt: new Date(),
        });
      });

      socket.on("gamification:streak", (data: StreakEventData) => {
        invalidateGamification();
        addRealtimeNotification({
          id: Date.now().toString(),
          type: "STREAK",
          title: `${data.currentStreak} Dias de Streak!`,
          message:
            data.message ||
            `Você atingiu ${data.currentStreak} dias consecutivos!`,
          read: false,
          createdAt: new Date(),
        });
      });

      socket.on("gamification:dailyReward", (data: DailyRewardEventData) => {
        invalidateGamification();
        addRealtimeNotification({
          id: Date.now().toString(),
          type: "DAILY_REWARD",
          title: "Recompensa Diária!",
          message:
            data.message || `Você ganhou ${data.xp} XP por fazer login!`,
          xp: data.xp,
          read: false,
          createdAt: new Date(),
        });
      });

      return () => {
        socket.disconnect();
      };
    });
  }, [addRealtimeNotification]);

  return { socket: socketRef.current };
}
