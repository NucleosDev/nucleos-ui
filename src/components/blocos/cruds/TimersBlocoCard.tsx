"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Loader2,
  TrendingUp,
  TrendingDown,
  Volume2,
  VolumeX,
  Clock,
  Timer as TimerIcon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TimerCard } from "@/components/timer/TimerCard";
import { useTimers } from "@/hooks/useTimers";
import { toast } from "@/hooks/use-toast";
import type { Bloco } from "@/types/bloco";

const PRESETS = [
  { label: "Pomodoro", min: 25 },
  { label: "Pausa", min: 5 },
  { label: "Foco", min: 45 },
  { label: "Estudo", min: 60 },
];

interface TimersBlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete: (blocoId: string) => void;
  onEdit: (blocoId: string) => void;
  isDeleting?: boolean;
}

export function TimersBlocoCard({ nucleoId }: TimersBlocoCardProps) {
  const {
    timers = [],
    isLoading,
    start,
    stop,
    deletar,
    atualizar,
    isStopping,
    isDeleting: isDeletingTimer,
    isUpdating,
  } = useTimers(nucleoId);

  const [descricao, setDescricao] = useState("");
  const [minutos, setMinutos] = useState(25);
  const [modo, setModo] = useState<"crescente" | "decrescente">("decrescente");
  const [som, setSom] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeTimer = timers.find((t) => !t.fim && t.inicio);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/timer-complete.mp3");
  }, []);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) {
      toast({ title: "Informe uma descrição", variant: "destructive" });
      return;
    }
    setIsStarting(true);
    try {
      await start({
        nucleoId,
        titulo: descricao.trim(),
        duracaoSegundos: modo === "decrescente" ? minutos * 60 : undefined,
        modo,
      });
      setDescricao("");
      toast({ title: "Timer iniciado!" });
    } catch (e: any) {
      toast({
        title: "Erro ao iniciar timer",
        description: e?.message,
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  const handleStop = async (id: string) => {
    try {
      await stop(id);
      toast({ title: "Timer finalizado!" });
      if (som && audioRef.current) audioRef.current.play().catch(() => {});
    } catch (e: any) {
      toast({
        title: "Erro ao parar timer",
        description: e?.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este timer?")) return;
    try {
      await deletar(id);
    } catch (e: any) {
      toast({
        title: "Erro ao excluir",
        description: e?.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string, titulo: string) => {
    try {
      await atualizar({ id, titulo });
    } catch (e: any) {
      toast({
        title: "Erro ao atualizar",
        description: e?.message,
        variant: "destructive",
      });
    }
  };

  /* ── Timer ativo ── */
  if (activeTimer) {
    return (
      <TimerCard
        timer={activeTimer}
        onStop={handleStop}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        isStopping={isStopping}
        isDeleting={isDeletingTimer}
        isUpdating={isUpdating}
      />
    );
  }

  /* ── Formulário ── */
  return (
    <div className="space-y-4">
      <form onSubmit={handleStart} className="space-y-3">
        {/* Descrição */}
        <input
          type="text"
          placeholder="O que você vai fazer?"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          disabled={isStarting}
          autoFocus
          className={cn(
            "w-full px-3 py-2.5 text-sm rounded-xl",
            "bg-muted/40 border border-border/50",
            "placeholder:text-muted-foreground/40",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
            "transition-[border-color,box-shadow] duration-[var(--duration-fast)]",
          )}
        />

        {/* Presets */}
        <div className="grid grid-cols-4 gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setMinutos(p.min);
                setModo("decrescente");
              }}
              className={cn(
                "py-1.5 rounded-lg text-xs font-medium border transition-all duration-[var(--duration-fast)]",
                minutos === p.min && modo === "decrescente"
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "border-border/40 text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {p.min}m
            </button>
          ))}
        </div>

        {/* Modo + tempo custom */}
        <div className="flex items-center gap-2">
          {/* Segmented mode control */}
          <div className="flex rounded-lg border border-border/50 bg-muted/30 p-0.5 gap-0.5">
            {(["decrescente", "crescente"] as const).map((m) => {
              const Icon = m === "decrescente" ? TrendingDown : TrendingUp;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModo(m)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-[var(--duration-fast)]",
                    modo === m
                      ? "bg-background shadow-[var(--shadow-xs)] text-foreground"
                      : "text-muted-foreground/60 hover:text-muted-foreground",
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {m === "decrescente" ? "Timer" : "Stopwatch"}
                </button>
              );
            })}
          </div>

          {modo === "decrescente" && (
            <input
              type="number"
              min={1}
              max={480}
              value={minutos}
              onChange={(e) => setMinutos(parseInt(e.target.value) || 25)}
              disabled={isStarting}
              className={cn(
                "w-16 px-2 py-1.5 text-xs text-center rounded-lg",
                "bg-muted/40 border border-border/50",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
              )}
            />
          )}

          {/* Som */}
          <button
            type="button"
            onClick={() => setSom((s) => !s)}
            className="ml-auto flex items-center justify-center h-7 w-7 rounded-lg text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent transition-colors"
          >
            {som ? (
              <Volume2 className="h-3.5 w-3.5" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isStarting || !descricao.trim()}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl",
            "text-sm font-semibold text-",
            "bg-gradient-to-r from-orange-500 to-amber-500",
            "hover:opacity-90 disabled:opacity-40 transition-opacity",
            "shadow-[0_4px_14px_rgba(249,115,22,0.30)]",
          )}
        >
          {isStarting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Iniciando...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />{" "}
              {modo === "decrescente"
                ? `Iniciar ${minutos}min`
                : "Iniciar stopwatch"}
            </>
          )}
        </button>
      </form>

      {/* Histórico */}
      {!isLoading && timers.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 pt-1">
            <Clock className="h-3.5 w-3.5 text-muted-foreground/50" />
            <p className="text-xs font-medium text-muted-foreground/60">
              Recente
            </p>
          </div>
          <div className="space-y-1.5 max-h-52 overflow-y-auto">
            {timers.slice(0, 5).map((timer) => (
              <TimerCard
                key={timer.id}
                timer={timer}
                onStop={handleStop}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                isStopping={isStopping}
                isDeleting={isDeletingTimer}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="space-y-1.5">
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      )}

      {!isLoading && timers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <TimerIcon className="h-7 w-7 text-muted-foreground/20 mb-2" />
          <p className="text-xs text-muted-foreground/50">Nenhum timer ainda</p>
        </div>
      )}
    </div>
  );
}
