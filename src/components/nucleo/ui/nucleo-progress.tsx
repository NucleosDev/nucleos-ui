"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, Zap, Trophy, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { NucleoProgressProps } from "../types/nucleo-components.types";

export function NucleoProgress({
  xpAtual,
  xpMax,
  nivel,
  energy,
  conquistas,
  showDetails = true,
  className,
  variant = "default",
}: NucleoProgressProps) {
  const progress = (xpAtual / xpMax) * 100;
  const xpRestante = xpMax - xpAtual;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Level e XP */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="size-4 text-primary" />
          <span className="text-sm font-medium">Nível {nivel}</span>
        </div>
        {showDetails && (
          <span className="text-xs text-muted-foreground">
            {xpAtual.toLocaleString("pt-BR")}
          </span>
        )}
      </div>

      {/* Barra de progresso */}
      <div className="relative">
        <Progress
          value={progress}
          className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent"
        />

        {/* Tooltip com XP restante */}
        {variant === "default" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  className="absolute -top-1 size-4 rounded-full bg-primary ring-2 ring-background cursor-help"
                  style={{
                    left: `${progress}%`,
                    transform: "translateX(-50%)",
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{xpRestante} XP para o próximo nível</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Stats adicionais */}
      {showDetails && (
        <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
          {energy !== undefined && (
            <div className="flex items-center gap-1">
              <Zap className="size-3.5 text-accent" />
              <span>{energy} energia</span>
            </div>
          )}

          {conquistas !== undefined && conquistas > 0 && (
            <div className="flex items-center gap-1">
              <Trophy className="size-3.5 text-yellow-500" />
              <span>{conquistas} conquistas</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Flame className="size-3.5 text-orange-500"></Flame>
            <span>+{Math.min(50, xpRestante)}/dia</span>
          </div>
        </div>
      )}
    </div>
  );
}
