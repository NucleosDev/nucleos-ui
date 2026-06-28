"use client";

import { cn } from "@/lib/utils";

interface ConquistaData {
  id: string;
  nome: string;
  descricao: string;
  icone: React.ReactNode;
  tier: "ouro" | "prata" | "bronze";
  desbloqueada: boolean;
  xp: number;
  progresso?: number;
  progressoMax?: number;
}

interface BadgeConquistaProps {
  conquista: ConquistaData;
  variant?: "mini" | "default";
  className?: string;
}

const tierColors = {
  ouro: "bg-yellow-500/20 border-yellow-500/40 text-yellow-500",
  prata: "bg-slate-400/20 border-slate-400/40 text-slate-400",
  bronze: "bg-amber-700/20 border-amber-700/40 text-amber-700",
};

export function BadgeConquista({ conquista, variant = "default", className }: BadgeConquistaProps) {
  if (variant === "mini") {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-full border px-2.5 py-1",
          conquista.desbloqueada ? tierColors[conquista.tier] : "bg-muted/30 border-muted/40 text-muted-foreground/50",
          className,
        )}
      >
        <span className="text-[11px]">{conquista.icone}</span>
        <span className="text-[10px] font-medium truncate max-w-16">{conquista.nome}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3",
        conquista.desbloqueada ? tierColors[conquista.tier] : "bg-muted/20 border-muted/30 opacity-60",
        className,
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background/40">
        {conquista.icone}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate">{conquista.nome}</p>
        <p className="text-xs text-muted-foreground truncate">{conquista.descricao}</p>
        <p className="text-[10px] font-medium mt-0.5">+{conquista.xp} XP</p>
      </div>
    </div>
  );
}
