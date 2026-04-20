// components/timer/TimerCard.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  Trash2,
  Clock,
  Hourglass,
  TrendingUp,
  TrendingDown,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Timer } from "@/types/timer";

interface TimerCardProps {
  timer: Timer;
  onStop: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate?: (id: string, titulo: string) => Promise<void>; // 👈 NOVO
  isStopping?: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean; // 👈 NOVO
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
        if (remaining === 0) {
          onStop(timer.id);
        }
      } else {
        setElapsedTime(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, startTime, modo, totalDuration, timer.id, onStop]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
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
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const displayTime = isRunning
    ? elapsedTime
    : modo === "decrescente" && totalDuration > 0
      ? totalDuration
      : startTime && endTime
        ? Math.floor((endTime - startTime) / 1000)
        : 0;

  return (
    <Card
      className={cn(
        "transition-all",
        isRunning && "border-primary/50 bg-primary/5",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              className={cn(
                "p-2 rounded-full",
                isRunning ? "bg-primary/20" : "bg-muted",
              )}
            >
              {isRunning ? (
                <Hourglass className="h-5 w-5 text-primary animate-pulse" />
              ) : (
                <Clock className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <Input
                    ref={inputRef}
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-8 text-sm"
                    disabled={isUpdating}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleSave}
                    disabled={isUpdating}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleCancel}
                    disabled={isUpdating}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <p
                    className="font-medium truncate"
                    onDoubleClick={() => onUpdate && setIsEditing(true)}
                  >
                    {timer.titulo || "Timer sem título"}
                  </p>
                  {onUpdate && !isRunning && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  )}
                  {modo === "crescente" ? (
                    <TrendingUp className="h-3 w-3 text-green-500 shrink-0" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-blue-500 shrink-0" />
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={isRunning ? "default" : "secondary"}
                  className="text-xs"
                >
                  {isRunning ? "Em andamento" : "Finalizado"}
                </Badge>
                <span className="text-sm font-mono">
                  {formatTime(displayTime)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isRunning ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onStop(timer.id)}
                disabled={isStopping}
              >
                <Square className="mr-1 h-4 w-4" />
                Parar
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onDelete(timer.id)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
