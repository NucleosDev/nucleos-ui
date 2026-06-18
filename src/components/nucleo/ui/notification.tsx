"use client";

import { cn } from "@/lib/utils";

interface NotificacaoData {
  id: string;
  titulo: string;
  mensagem: string;
  icone: React.ReactNode;
  tempo: string;
  tipo: "conquista" | "sucesso" | "info";
}

interface NotificacaoIOSProps {
  notificacao: NotificacaoData;
  variant?: "flutuante" | "default";
  className?: string;
}

export function NotificacaoIOS({ notificacao, variant = "default", className }: NotificacaoIOSProps) {
  const colorMap = {
    conquista: "bg-yellow-500/10 border-yellow-500/20",
    sucesso: "bg-emerald-500/10 border-emerald-500/20",
    info: "bg-blue-500/10 border-blue-500/20",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border bg-background/90 backdrop-blur-md px-4 py-3 w-64",
        colorMap[notificacao.tipo],
        variant === "flutuante" && "shadow-xl",
        className,
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background/60">
        {notificacao.icone}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">{notificacao.titulo}</p>
        <p className="text-xs text-muted-foreground truncate">{notificacao.mensagem}</p>
        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{notificacao.tempo}</p>
      </div>
    </div>
  );
}
