"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, Square } from "lucide-react";
import { useFocusTimer } from "@/contexts/FocusTimerContext";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function FocusTimerPopup() {
  const { status, elapsed, title, pause, resume, stop } = useFocusTimer();
  const containerRef = useRef<HTMLDivElement>(null);

  const isPaused = status === "paused";
  const isVisible = status !== "idle";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      aria-hidden={!isVisible}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            drag
            dragConstraints={containerRef}
            dragMomentum={false}
            dragElastic={0.05}
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="absolute bottom-6 right-6 pointer-events-auto"
            style={{ touchAction: "none", userSelect: "none" }}
          >
            {/* Glass pill */}
            <div
              className={cn(
                "flex items-center gap-2.5 pl-3.5 pr-2 py-2.5 rounded-2xl",
                "border border-border/50",
                "bg-background/85 backdrop-blur-xl",
                "shadow-[0_8px_32px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.06)]",
                "cursor-grab active:cursor-grabbing",
              )}
            >
              {/* Recording indicator */}
              <div className="relative shrink-0 flex items-center justify-center w-4 h-4">
                {isPaused ? (
                  <div className="h-2 w-2 rounded-full bg-amber-400/90" />
                ) : (
                  <>
                    <motion.div
                      animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute h-2 w-2 rounded-full bg-red-500"
                    />
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                  </>
                )}
              </div>

              {/* Timer */}
              <span className="text-sm font-bold tabular-nums tracking-tight text-foreground min-w-[46px]">
                {formatTime(elapsed)}
              </span>

              {/* Title */}
              {title && (
                <>
                  <span className="h-3.5 w-px bg-border/50 shrink-0" />
                  <span className="text-[11px] text-muted-foreground/60 max-w-[96px] truncate leading-none">
                    {title}
                  </span>
                </>
              )}

              {/* Controls */}
              <div className="flex items-center gap-0.5 ml-0.5">
                {/* Pause / Resume */}
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={isPaused ? resume : pause}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-xl transition-colors",
                    "text-muted-foreground/60 hover:text-foreground hover:bg-muted/50",
                  )}
                  title={isPaused ? "Continuar foco" : "Pausar foco"}
                >
                  {isPaused ? (
                    <Play className="h-3.5 w-3.5 fill-current" />
                  ) : (
                    <Pause className="h-3.5 w-3.5 fill-current" />
                  )}
                </button>

                {/* Stop */}
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={stop}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-xl transition-colors",
                    "text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10",
                  )}
                  title="Encerrar foco"
                >
                  <Square className="h-3 w-3 fill-current" />
                </button>
              </div>
            </div>

            {/* Paused label */}
            <AnimatePresence>
              {isPaused && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <span className="text-[10px] text-amber-500/70 font-medium tracking-wide">
                    pausado
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
