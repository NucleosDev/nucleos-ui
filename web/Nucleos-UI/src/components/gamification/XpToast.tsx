// src/components/gamification/XpToast.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trophy, Flame, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { useGamification } from "@/hooks/useGamification";

export function XpToast() {
  const [toasts, setToasts] = useState<any[]>([]);
  const { latestNotification, addRealtimeNotification } = useNotifications();
  const { invalidateStats } = useGamification();

  // Efeito para mostrar toast quando chega notificação
  useEffect(() => {
    if (latestNotification) {
      addToast(latestNotification);
      invalidateStats();
    }
  }, [latestNotification, invalidateStats]);

  const addToast = (notification: any) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...notification }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "LEVEL_UP":
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case "ACHIEVEMENT":
        return <Award className="w-6 h-6 text-purple-500" />;
      case "STREAK":
        return <Flame className="w-6 h-6 text-orange-500" />;
      case "DAILY_REWARD":
        return <Star className="w-6 h-6 text-blue-500" />;
      default:
        return <Zap className="w-6 h-6 text-primary" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case "LEVEL_UP":
        return "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30";
      case "ACHIEVEMENT":
        return "from-purple-500/20 to-purple-500/5 border-purple-500/30";
      case "STREAK":
        return "from-orange-500/20 to-orange-500/5 border-orange-500/30";
      case "DAILY_REWARD":
        return "from-blue-500/20 to-blue-500/5 border-blue-500/30";
      default:
        return "from-primary/20 to-primary/5 border-primary/30";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={cn(
              "p-4 rounded-xl border shadow-lg bg-background/95 backdrop-blur-sm min-w-[320px]",
              getColors(toast.type),
            )}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {getIcon(toast.type)}
              </div>
              <div className="flex-1">
                <p className="font-bold">{toast.title}</p>
                <p className="text-sm text-muted-foreground">{toast.message}</p>
                {toast.xp && (
                  <p className="text-xs text-primary mt-1">+{toast.xp} XP</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
