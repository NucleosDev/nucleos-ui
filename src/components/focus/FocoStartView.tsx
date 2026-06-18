"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Brain, Timer, Pause, Square } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFocusTimer } from "@/contexts/FocusTimerContext";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h${m > 0 ? ` ${m}min` : ""}`;
}

export function FocoStartView() {
  const { status, elapsed, title, start, pause, resume, stop } = useFocusTimer();
  const [inputTitle, setInputTitle] = useState("");

  const handleStart = () => {
    start({ title: inputTitle.trim() || "Sessão de Foco" });
  };

  const isActive = status !== "idle";
  const isPaused = status === "paused";

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-5 py-12">
      {!isActive ? (
        /* ── Start form ────────────────────────────────────────── */
        <motion.div
          key="start"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm text-center space-y-8"
        >
          {/* Icon */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/8 ring-1 ring-primary/10"
          >
            <Brain className="h-11 w-11 text-primary/50" />
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">Iniciar Foco</h2>
            <p className="text-sm text-muted-foreground/60 mt-1.5 leading-relaxed">
              Um temporizador flutuante acompanhará sua sessão
              <br />
              enquanto você navega pelo app.
            </p>
          </div>

          <div className="space-y-3">
            <Input
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              placeholder="No que você vai trabalhar? (opcional)"
              className="text-center bg-muted/30 border-border/50 h-11 rounded-xl"
              autoFocus
            />
            <Button
              onClick={handleStart}
              size="lg"
              className="w-full rounded-xl h-11 text-sm font-semibold shadow-md"
            >
              <Play className="h-4 w-4 mr-2 fill-current" />
              Iniciar Foco
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground/30 tracking-wide">
            Arraste o temporizador para onde preferir na tela
          </p>
        </motion.div>
      ) : (
        /* ── Active session ──────────────────────────────────────── */
        <motion.div
          key="active"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-10 w-full max-w-sm"
        >
          {/* Timer display */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-muted-foreground/40">
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  isPaused
                    ? "bg-amber-400"
                    : "bg-red-500 animate-pulse",
                )}
              />
              <span className="text-[11px] font-semibold uppercase tracking-widest">
                {isPaused ? "Pausado" : "Em foco"}
              </span>
            </div>

            <p className="text-7xl font-black tabular-nums tracking-tighter text-foreground">
              {formatTime(elapsed)}
            </p>

            <p className="text-sm text-muted-foreground/50 font-medium truncate px-4">
              {title}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={isPaused ? resume : pause}
              className="rounded-xl gap-2 flex-1"
            >
              {isPaused ? (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  Continuar
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4 fill-current" />
                  Pausar
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={stop}
              className="rounded-xl gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Square className="h-4 w-4 fill-current" />
              Encerrar
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground/30">
            O temporizador também aparece no canto da tela
            {elapsed > 0 && (
              <span className="block mt-0.5 text-primary/40">
                {formatElapsed(elapsed)} de foco esta sessão
              </span>
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
}
