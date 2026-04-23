// src/components/gamification/AchievementCard.tsx
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AchievementIconByName } from "./AchievementIcon";
import type { Conquista } from "@/types/gamification";

interface AchievementCardProps {
  achievement: Conquista;
  compact?: boolean;
}

export function AchievementCard({
  achievement,
  compact = false,
}: AchievementCardProps) {
  const isUnlocked = achievement.desbloqueada;

  return (
    <Card
      className={cn(
        "transition-all duration-300",
        isUnlocked
          ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg"
          : "bg-muted/30 border-border/50 opacity-60 hover:opacity-80",
        compact ? "p-2" : "p-4",
      )}
    >
      <CardContent
        className={cn("flex items-center gap-4", compact ? "p-2" : "p-0")}
      >
        {/* Ícone usando Lucide React */}
        <div
          className={cn(
            "flex items-center justify-center rounded-full",
            isUnlocked ? "bg-primary/20" : "bg-muted",
            compact ? "w-10 h-10" : "w-12 h-12",
          )}
        >
          <AchievementIconByName
            name={achievement.icone}
            size={compact ? 20 : 24}
            className={isUnlocked ? "text-primary" : "text-muted-foreground"}
          />
        </div>

        {/* Informações */}
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={cn("font-semibold", compact ? "text-sm" : "text-base")}
            >
              {achievement.nome}
            </h4>
            {isUnlocked && (
              <Badge
                variant="outline"
                className="text-[10px] bg-green-500/10 text-green-600 border-green-200"
              >
                +100 XP
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {achievement.descricao}
          </p>
          {isUnlocked && achievement.dataDesbloqueio && (
            <p className="text-[10px] text-muted-foreground mt-1">
              Desbloqueada em{" "}
              {achievement.dataDesbloqueio.toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
