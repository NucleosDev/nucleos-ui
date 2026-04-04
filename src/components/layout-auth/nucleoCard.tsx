"use client";

import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Nucleo } from "@/types/test";

interface NucleoCardProps {
  nucleo: Nucleo;
  onClick?: (id: string) => void;
}

const colorMap: Record<string, string> = {
  health: "bg-nucleo-health/10 text-nucleo-health border-nucleo-health/20",
  study: "bg-nucleo-study/10 text-nucleo-study border-nucleo-study/20",
  finance: "bg-nucleo-finance/10 text-nucleo-finance border-nucleo-finance/20",
  default: "bg-nucleo-default/10 text-nucleo-default border-nucleo-default/20",
};

const progressColorMap: Record<string, string> = {
  health: "[&>div]:bg-nucleo-health",
  study: "[&>div]:bg-nucleo-study",
  finance: "[&>div]:bg-nucleo-finance",
  default: "[&>div]:bg-nucleo-default",
};

export function NucleoCard({ nucleo, onClick }: NucleoCardProps) {
  const cor = nucleo.cor ?? "default";
  const badgeClass = colorMap[cor] ?? colorMap.default;
  const progressClass = progressColorMap[cor] ?? progressColorMap.default;

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Abrir núcleo ${nucleo.nome}`}
      onClick={() => onClick?.(nucleo.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.(nucleo.id);
      }}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm",
        "transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/20",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-semibold leading-tight text-foreground">
            {nucleo.nome}
          </h3>
          {nucleo.descricao && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
              {nucleo.descricao}
            </p>
          )}
          <Badge
            variant="outline"
            className={cn("w-fit text-xs font-medium border", badgeClass)}
          >
            {nucleo.totalBlocos} {nucleo.totalBlocos === 1 ? "bloco" : "blocos"}
          </Badge>
        </div>

        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            "bg-muted text-muted-foreground",
            "transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground",
          )}
        >
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Progresso</span>
          <span className="text-xs font-medium text-foreground">
            {nucleo.progresso}%
          </span>
        </div>
        <Progress
          value={nucleo.progresso}
          className={cn("h-1.5 bg-muted", progressClass)}
        />
      </div>

      {nucleo.ultimaAtividade && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{nucleo.ultimaAtividade}</span>
        </div>
      )}
    </article>
  );
}
