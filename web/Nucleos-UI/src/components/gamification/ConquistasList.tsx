// src/components/gamification/ConquistasList.tsx
"use client";

import { motion } from "framer-motion";
import { Lock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGamification } from "@/hooks/useGamification";
import { AchievementIconByName } from "./AchievementIcon";

export function ConquistasList() {
  const { useFullStats } = useGamification();
  const { data: stats, isLoading } = useFullStats();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "habito":
        return "from-green-500/20 to-green-500/5 border-green-500/30";
      case "tarefa":
        return "from-blue-500/20 to-blue-500/5 border-blue-500/30";
      case "nucleo":
        return "from-purple-500/20 to-purple-500/5 border-purple-500/30";
      default:
        return "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Suas Conquistas</h3>
        <p className="text-sm text-muted-foreground">
          {stats.conquistas.filter((c: any) => c.desbloqueada).length} /{" "}
          {stats.conquistas.length} desbloqueadas
        </p>
      </div>

      <div className="grid gap-3">
        {stats.conquistas.map((conquista: any, index: number) => (
          <motion.div
            key={conquista.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "p-4 rounded-xl border transition-all",
              conquista.desbloqueada
                ? `bg-gradient-to-r ${getCategoriaColor(conquista.categoria)}`
                : "bg-muted/30 border-border opacity-60",
            )}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <AchievementIconByName
                  name={conquista.icone}
                  size={20}
                  className={
                    conquista.desbloqueada
                      ? "text-primary"
                      : "text-muted-foreground"
                  }
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{conquista.nome}</h4>
                  {conquista.desbloqueada ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {conquista.descricao}
                </p>
                {conquista.desbloqueada && conquista.dataDesbloqueio && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Desbloqueada em{" "}
                    {conquista.dataDesbloqueio.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
