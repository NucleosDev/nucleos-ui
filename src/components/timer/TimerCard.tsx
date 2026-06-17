// components/timer/TimerCard.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Square,
  Trash2,
  Clock,
  Hourglass,
  TrendingUp,
  TrendingDown,
  Pencil,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Timer } from "@/types/timer";

interface TimerCardProps {
  timer: Timer;
  onStop: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate?: (id: string, titulo: string) => Promise<void>;
  isStopping?: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export function TimerCard({
  timer,
  onStop,
  onDelete,
  onUpdate,
  isStopping = false,
  isDeleting = false,
  isUpdating = false,
}: TimerCardProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitulo, setEditTitulo] = useState(timer.titulo || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const isRunning = !timer.fim && timer.inicio;
  const startTime = timer.inicio ? new Date(timer.inicio).getTime() : null;
  const endTime = timer.fim ? new Date(timer.fim).getTime() : null;
  const totalDuration = timer.duracaoSegundos || 0;
  const modo = timer.modo || "crescente";

  useEffect(() => {
    if (!isRunning || !startTime) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      if (modo === "decrescente" && totalDuration > 0) {
        const remaining = Math.max(0, totalDuration - elapsed);
        setElapsedTime(remaining);
        if (remaining === 0) onStop(timer.id);
      } else {
        setElapsedTime(elapsed);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, startTime, modo, totalDuration, timer.id, onStop]);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const handleSave = async () => {
    if (editTitulo.trim() && editTitulo !== timer.titulo && onUpdate) {
      await onUpdate(timer.id, editTitulo.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitulo(timer.titulo || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    else if (e.key === "Escape") handleCancel();
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0)
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const displayTime = isRunning
    ? elapsedTime
    : modo === "decrescente" && totalDuration > 0
      ? totalDuration
      : startTime && endTime
        ? Math.floor((endTime - startTime) / 1000)
        : 0;

  const accent = "#f97316";

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all",
        "bg-card/60 backdrop-blur-sm",
        isRunning
          ? "border-orange-500/30 bg-orange-500/5"
          : "border-border/50 hover:border-border/80",
      )}
    >
      {/* Accent strip */}
      <div
        className={cn(
          "absolute left-0 top-3 bottom-3 w-[3px] rounded-full transition-colors",
          isRunning ? "bg-orange-500" : "bg-border/40",
        )}
      />

      {/* Icon */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{
          background: isRunning ? "#f9731620" : "hsl(var(--muted) / 0.6)",
        }}
      >
        {isRunning ? (
          <Hourglass
            className="h-4 w-4 animate-pulse"
            style={{ color: accent }}
          />
        ) : (
          <Clock className="h-4 w-4 text-muted-foreground/60" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              value={editTitulo}
              onChange={(e) => setEditTitulo(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isUpdating}
              className={cn(
                "flex-1 px-2 py-1 text-sm rounded-lg bg-muted/40 border border-border/50",
                "focus:outline-none focus:ring-1 focus:ring-orange-500/40",
              )}
            />
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="flex h-6 w-6 items-center justify-center rounded-md text-emerald-500 hover:bg-emerald-500/10 transition-colors"
            >
              {isUpdating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/60 hover:bg-accent transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <p
              className="text-sm font-medium truncate flex-1"
              onDoubleClick={() => onUpdate && setIsEditing(true)}
            >
              {timer.titulo || "Timer sem título"}
            </p>
            {modo === "crescente" ? (
              <TrendingUp className="h-3 w-3 shrink-0 text-emerald-500/70" />
            ) : (
              <TrendingDown className="h-3 w-3 shrink-0 text-primary-500/70" />
            )}
          </div>
        )}

        {!isEditing && (
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded-md",
                isRunning
                  ? "bg-orange-500/15 text-orange-500"
                  : "bg-muted/60 text-muted-foreground/60",
              )}
            >
              {isRunning ? "Em andamento" : "Finalizado"}
            </span>
            <span className="text-xs font-mono tabular-nums text-muted-foreground">
              {formatTime(displayTime)}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {isRunning ? (
          <button
            onClick={() => onStop(timer.id)}
            disabled={isStopping}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium",
              "border border-orange-500/30 text-orange-500 hover:bg-orange-500/10 transition-colors",
              "disabled:opacity-50",
            )}
          >
            {isStopping ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Square className="h-3.5 w-3.5" />
            )}
            Parar
          </button>
        ) : (
          <>
            {onUpdate && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/40 opacity-0 group-hover:opacity-100 hover:text-muted-foreground hover:bg-accent transition-all"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => onDelete(timer.id)}
              disabled={isDeleting}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/40 opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
