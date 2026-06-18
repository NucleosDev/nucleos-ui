// src/components/gamification/Leaderboard.tsx
"use client";

import { motion } from "framer-motion";
import { Crown, Medal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification } from "@/hooks/useGamification";
import { useAuth } from "@/auth";

export function Leaderboard() {
  const { useLeaderboard } = useGamification();
  const { user } = useAuth();
  const { data: users, isLoading } = useLeaderboard(20);

  const getMedal = (position: number) => {
    if (position === 0) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (position === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (position === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  const getPositionStyle = (position: number) => {
    if (position === 0)
      return "bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/30";
    if (position === 1)
      return "bg-gradient-to-r from-gray-400/20 to-transparent border-gray-400/30";
    if (position === 2)
      return "bg-gradient-to-r from-amber-600/20 to-transparent border-amber-600/30";
    return "";
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  // ✅ Garantir que users existe e é array
  const safeUsers = Array.isArray(users) ? users : [];

  // ✅ Remover duplicatas baseado no user_id
  const uniqueUsers = safeUsers.filter(
    (user, index, self) =>
      index === self.findIndex((u) => u.user_id === user.user_id),
  );

  if (uniqueUsers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum usuário no ranking ainda. Comece a acumular XP!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {uniqueUsers.map((userItem, index) => (
        <motion.div
          key={userItem.user_id} // Agora as chaves são únicas
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            "flex items-center justify-between p-3 rounded-lg border transition-all",
            getPositionStyle(index),
            user?.userId === userItem.user_id && "ring-2 ring-primary",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 text-center font-bold text-muted-foreground">
              {index + 1}
            </div>
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white">
                {userItem.full_name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {userItem.full_name}
                {user?.userId === userItem.user_id && (
                  <span className="ml-2 text-xs text-primary">(Você)</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Nível {userItem.level}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getMedal(index)}
            <span className="font-semibold">
              {userItem.total_xp.toLocaleString()} XP
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
