"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Star } from "lucide-react";

interface NucleoProgressProps {
  xpAtual: number;
  xpMax: number;
  nivel: number;
  variant?: "default" | "minimal" | "circular";
  showDetails?: boolean;
  className?: string;
}

export function NucleoProgress({
  xpAtual,
  xpMax,
  nivel,
  variant = "default",
  showDetails = true,
  className,
}: NucleoProgressProps) {
  const porcentagem = Math.min((xpAtual / xpMax) * 100, 100);
  const xpFaltando = Math.max(xpMax - xpAtual, 0);

  if (variant === "circular") {
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset =
      circumference - (porcentagem / 100) * circumference;

    return (
      <div
        className={cn(
          "relative inline-flex items-center justify-center",
          className,
        )}
      >
        <svg className="w-24 h-24 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-500"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{nivel}</span>
          <span className="text-xs text-muted-foreground">Nível</span>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("space-y-1", className)}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">Nível {nivel}</span>
          <span className="text-muted-foreground">
            {Math.round(porcentagem)}%
          </span>
        </div>
        <Progress value={porcentagem} className="h-1.5" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header com nível */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
            <Trophy className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Nível {nivel}</p>
            {showDetails && (
              <p className="text-xs text-muted-foreground">
                {xpFaltando.toLocaleString()} XP para o próximo nível
              </p>
            )}
          </div>
        </div>
        {showDetails && (
          <div className="text-right">
            <p className="text-sm font-bold text-primary">
              {xpAtual.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              / {xpMax.toLocaleString()} XP
            </p>
          </div>
        )}
      </div>

      {/* Barra de progresso */}
      <div className="space-y-1">
        <Progress value={porcentagem} className="h-2.5" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Zap className="size-3" />
            <span>{Math.round(porcentagem)}% completo</span>
          </div>
          {showDetails && (
            <div className="flex items-center gap-1">
              <Star className="size-3" />
              <span>Próximo: Nível {nivel + 1}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
