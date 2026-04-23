// src/hooks/useGamificationSocket.ts
"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useNotifications } from "./useNotifications";

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
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

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
      addRealtimeNotification({
        id: Date.now().toString(),
        type: "DAILY_REWARD",
        title: "Recompensa Diária!",
        message: data.message || `Você ganhou ${data.xp} XP por fazer login!`,
        xp: data.xp,
        read: false,
        createdAt: new Date(),
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [addRealtimeNotification]);

  return { socket: socketRef.current };
}
