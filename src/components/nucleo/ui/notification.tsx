"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { NotificacaoUI } from "@/types";
import {
  X,
  Bell,
  Trophy,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
} from "lucide-react";

interface NotificacaoIOSProps {
  notificacao: NotificacaoUI;
  variant?: "flutuante" | "lista";
  onClose?: () => void;
  onMarkAsRead?: () => void;
  className?: string;
}

// Ícones por tipo
const ICONES_TIPO: Record<string, React.ReactNode> = {
  info: <Info className="size-5 text-blue-500" />,
  sucesso: <CheckCircle className="size-5 text-green-500" />,
  alerta: <AlertCircle className="size-5 text-yellow-500" />,
  conquista: <Trophy className="size-5 text-amber-500" />,
  lembrete: <Clock className="size-5 text-purple-500" />,
};

export function NotificacaoIOS({
  notificacao,
  variant = "lista",
  onClose,
  onMarkAsRead,
  className,
}: NotificacaoIOSProps) {
  const icone = notificacao.icone || ICONES_TIPO[notificacao.tipo || "info"];

  if (variant === "flutuante") {
    return (
      <div
        className={cn(
          "relative flex items-start gap-3 p-4 rounded-2xl bg-card/95 backdrop-blur-md shadow-lg border",
          "animate-in slide-in-from-right-5 fade-in duration-300",
          className,
        )}
      >
        {/* Ícone */}
        <div className="flex-shrink-0 mt-0.5">{icone}</div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{notificacao.titulo}</p>
          {notificacao.mensagem && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {notificacao.mensagem}
            </p>
          )}
          {notificacao.acao && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 mt-1 text-xs"
              onClick={notificacao.acao.onClick}
            >
              {notificacao.acao.label}
            </Button>
          )}
        </div>

        {/* Tempo e fechar */}
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground">
            {notificacao.tempo}
          </span>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Variant lista
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg transition-colors",
        notificacao.lida
          ? "bg-card opacity-70"
          : "bg-accent/30 hover:bg-accent/50",
        className,
      )}
      onClick={onMarkAsRead}
    >
      {/* Ícone */}
      <div className="flex-shrink-0 mt-0.5">{icone}</div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn("text-sm", !notificacao.lida && "font-semibold")}>
            {notificacao.titulo}
          </p>
          {!notificacao.lida && (
            <div className="w-2 h-2 rounded-full bg-primary" />
          )}
        </div>
        {notificacao.mensagem && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {notificacao.mensagem}
          </p>
        )}
        {notificacao.acao && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 mt-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              notificacao.acao?.onClick();
            }}
          >
            {notificacao.acao.label}
          </Button>
        )}
      </div>

      {/* Tempo */}
      <span className="text-xs text-muted-foreground shrink-0">
        {notificacao.tempo}
      </span>
    </div>
  );
}

// ============================================================================
// CONTAINER DE NOTIFICAÇÕES
// ============================================================================

interface NotificacoesContainerProps {
  children: React.ReactNode;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
}

export function NotificacoesContainer({
  children,
  position = "top-right",
  className,
}: NotificacoesContainerProps) {
  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]",
        positionClasses[position],
        className,
      )}
    >
      {children}
    </div>
  );
}
