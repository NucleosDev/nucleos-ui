"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Zap,
  Brain,
  Timer,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { tarefasService } from "@/services/tarefas.service";
import { addToPurgatory } from "@/components/home/capture-field";
import { useQueryClient } from "@tanstack/react-query";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function formatElapsedLabel(seconds: number): string {
  if (seconds < 60) return `${seconds}s em foco`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min em foco`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h${m > 0 ? ` ${m}min` : ""} em foco`;
}

export function FocusSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const tarefaId = searchParams.get("tarefaId") ?? "";
  const titulo = searchParams.get("titulo") ?? "Sessão de Foco";
  const nucleoNome = searchParams.get("nucleoNome") ?? "";
  const cor = searchParams.get("cor") ?? "#4D7CFF";
  const nucleoId = searchParams.get("nucleoId") ?? "";

  const [elapsed, setElapsed] = useState(0);
  const [thought, setThought] = useState("");
  const [status, setStatus] = useState<"active" | "completing" | "done">("active");
  const [captures, setCaptures] = useState<string[]>([]);
  const thoughtRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleExit();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleExit = useCallback(() => {
    if (nucleoId) {
      router.push(`/dashboard/nucleos/${nucleoId}`);
    } else {
      router.push("/dashboard");
    }
  }, [router, nucleoId]);

  const handleComplete = useCallback(async () => {
    if (status !== "active") return;
    setStatus("completing");
    try {
      if (tarefaId) {
        await tarefasService.concluirTarefa(tarefaId);
        queryClient.invalidateQueries({ queryKey: ["tarefas"] });
        queryClient.invalidateQueries({ queryKey: ["tarefas", "vencendo"] });
      }
      setStatus("done");
      setTimeout(() => handleExit(), 2200);
    } catch {
      setStatus("active");
    }
  }, [status, tarefaId, queryClient, handleExit]);

  const handleCapture = useCallback(() => {
    const trimmed = thought.trim();
    if (!trimmed) return;
    addToPurgatory(trimmed);
    setCaptures((prev) => [trimmed, ...prev]);
    setThought("");
    thoughtRef.current?.focus();
  }, [thought]);

  const handleCaptureKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleCapture();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[9999] bg-background flex flex-col"
      style={{
        background: "radial-gradient(ellipse 120% 80% at 50% -10%, rgba(77,124,255,0.06) 0%, transparent 60%)",
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0">
        <div className="flex items-center gap-2.5">
          {nucleoNome && (
            <span
              className="text-[11px] font-semibold rounded-full px-3 py-1"
              style={{ background: `${cor}18`, color: cor }}
            >
              {nucleoNome}
            </span>
          )}
          <span className="text-xs text-muted-foreground/40 flex items-center gap-1.5">
            <Timer className="h-3 w-3" />
            {formatElapsedLabel(elapsed)}
          </span>
        </div>
        <button
          onClick={handleExit}
          className="flex items-center gap-1.5 text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors px-2 py-1.5 rounded-lg hover:bg-muted/30"
        >
          <X className="h-3.5 w-3.5" />
          <span className="hidden sm:block">Esc para sair</span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8 max-w-2xl mx-auto w-full">

        {/* Timer */}
        <AnimatePresence mode="wait">
          {status === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <CheckCircle2 className="h-14 w-14 text-emerald-400" />
              <p className="text-2xl font-bold text-emerald-400">Concluído!</p>
              <p className="text-sm text-muted-foreground/60">
                {formatElapsedLabel(elapsed)} de foco. Excelente.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              className="text-center space-y-1"
            >
              <div
                className="text-[5.5rem] font-bold tracking-tight tabular-nums leading-none"
                style={{
                  background: `linear-gradient(135deg, ${cor}, ${cor}88)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {formatTime(elapsed)}
              </div>
              <p className="text-xs text-muted-foreground/30 uppercase tracking-widest font-medium">
                tempo em foco
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task title */}
        {status !== "done" && (
          <div className="text-center space-y-1 max-w-lg w-full">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/30">
              Agora
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold leading-snug tracking-tight">
              {titulo}
            </h1>
          </div>
        )}

        {/* Thought capture */}
        {status === "active" && (
          <div className="w-full max-w-lg space-y-2">
            <div className="relative rounded-2xl border border-border/20 bg-muted/8 overflow-hidden">
              <div className="flex items-center gap-2 px-4 pt-3 pb-1.5">
                <Brain className="h-3.5 w-3.5 text-muted-foreground/25 shrink-0" />
                <span className="text-[11px] text-muted-foreground/30 font-medium">
                  Capture distrações sem sair do foco
                </span>
              </div>
              <textarea
                ref={thoughtRef}
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                onKeyDown={handleCaptureKeyDown}
                rows={2}
                placeholder="O que está passando pela sua mente?"
                className="w-full resize-none bg-transparent px-4 pb-3 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/20"
              />
              {thought.trim() && (
                <div className="px-3 pb-3 flex justify-end">
                  <button
                    onClick={handleCapture}
                    className="text-[11px] font-semibold text-primary/70 hover:text-primary transition-colors px-2.5 py-1 rounded-lg hover:bg-primary/8"
                  >
                    ⌘↵ Guardar
                  </button>
                </div>
              )}
            </div>

            {captures.length > 0 && (
              <div className="space-y-1">
                {captures.slice(0, 3).map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 0.5, y: 0 }}
                    className="text-xs text-muted-foreground/40 px-2 py-0.5 truncate"
                  >
                    ↗ {c}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom bar — CTA */}
      {status === "active" && (
        <div className="shrink-0 flex items-center justify-between px-6 py-5 border-t border-border/10 gap-4">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 text-sm text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Pausar
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleComplete}
            disabled={status !== "active"}
            className={cn(
              "flex items-center gap-2.5 rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-200",
              tarefaId
                ? "bg-emerald-500 text-white shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_28px_rgba(16,185,129,0.45)]"
                : "bg-primary text-primary-foreground shadow-[0_4px_20px_rgba(77,124,255,0.35)]",
            )}
          >
            <Zap className="h-4 w-4" />
            {tarefaId ? "Concluir Tarefa" : "Encerrar Foco"}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
