"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PLACEHOLDERS = [
  "O que está na sua mente agora?",
  "Descarregue seus pensamentos aqui...",
  "O que precisa acontecer hoje?",
  "Qual é sua maior prioridade agora?",
  "Que pensamento está te pesando?",
  "Planejar meu dia...",
  "Organizar minha semana...",
  "O que você está procrastinando?",
];

export const PURGATORY_KEY = "nucleos:purgatory";

export interface PurgatoryItem {
  id: string;
  text: string;
  createdAt: string;
  processed: boolean;
}

export function getPurgatoryItems(): PurgatoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PURGATORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addToPurgatory(text: string): PurgatoryItem {
  const item: PurgatoryItem = {
    id: crypto.randomUUID(),
    text: text.trim(),
    createdAt: new Date().toISOString(),
    processed: false,
  };
  const existing = getPurgatoryItems();
  existing.unshift(item);
  // Keep last 50 items
  localStorage.setItem(PURGATORY_KEY, JSON.stringify(existing.slice(0, 50)));
  return item;
}

interface CaptureFieldProps {
  onCapture?: (text: string) => void;
  className?: string;
}

export function CaptureField({ onCapture, className }: CaptureFieldProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [lastCaptured, setLastCaptured] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setPendingCount(getPurgatoryItems().filter((i) => !i.processed).length);
  }, []);

  useEffect(() => {
    if (isFocused) return;
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isFocused]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    addToPurgatory(trimmed);
    setPendingCount((c) => c + 1);
    setSubmitted(true);
    setLastCaptured(trimmed);
    onCapture?.(trimmed);
    setValue("");
    setTimeout(() => setSubmitted(false), 2400);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const rows = value.length > 100 ? 3 : value.length > 0 ? 2 : 2;

  return (
    <div className={cn("relative", className)}>
      <motion.div
        animate={{
          boxShadow: isFocused
            ? "0 0 0 2px rgba(77,124,255,0.18), 0 8px 32px rgba(0,0,0,0.14)"
            : "0 4px 20px rgba(0,0,0,0.07)",
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative rounded-2xl transition-colors duration-200",
          "bg-background/50 border",
          isFocused ? "border-primary/30" : "border-border/30",
          "backdrop-blur-sm overflow-hidden",
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-5 pt-4 pb-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{
              background: "linear-gradient(135deg, rgba(77,124,255,0.18), rgba(0,201,167,0.12))",
            }}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground/80">
            Descarregar mente
          </span>
          {pendingCount > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground/40"
            >
              <span
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
                style={{ background: "rgba(77,124,255,0.15)", color: "#4D7CFF" }}
              >
                {pendingCount}
              </span>
              para triagem
            </motion.span>
          )}
        </div>

        {/* Input area */}
        <div className="relative px-5 pb-4">
          <AnimatePresence mode="wait">
            {!value && !isFocused && (
              <motion.p
                key={placeholderIdx}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.22 }}
                className="pointer-events-none absolute top-0 left-5 text-base leading-relaxed text-muted-foreground/35 select-none"
              >
                {PLACEHOLDERS[placeholderIdx]}
              </motion.p>
            )}
            {!value && isFocused && (
              <motion.p
                key="focused"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute top-0 left-5 text-base leading-relaxed text-muted-foreground/20 select-none"
              >
                Digite e pressione ⌘↵ para capturar
              </motion.p>
            )}
          </AnimatePresence>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={rows}
            className="w-full resize-none bg-transparent text-base leading-relaxed text-foreground outline-none placeholder:text-transparent"
            placeholder=" "
            aria-label="Campo de captura mental"
          />
        </div>

        {/* Footer */}
        <div
          className={cn(
            "flex items-center justify-between px-5 py-3 border-t transition-colors duration-200",
            isFocused ? "border-primary/15" : "border-border/15",
          )}
        >
          <span className="text-[11px] text-muted-foreground/30 hidden sm:block">
            ⌘↵ captura
          </span>
          <motion.button
            whileHover={value.trim() ? { scale: 1.03 } : {}}
            whileTap={value.trim() ? { scale: 0.97 } : {}}
            disabled={!value.trim()}
            onClick={handleSubmit}
            className={cn(
              "ml-auto flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
              value.trim()
                ? "bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(77,124,255,0.35)] hover:shadow-[0_6px_20px_rgba(77,124,255,0.45)]"
                : "bg-muted/30 text-muted-foreground/30 cursor-not-allowed",
            )}
          >
            <Send className="h-3.5 w-3.5" />
            Capturar
          </motion.button>
        </div>
      </motion.div>

      {/* Success confirmation overlay */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 rounded-2xl flex items-center justify-center z-10"
            style={{
              background: "rgba(0, 201, 167, 0.07)",
              border: "1px solid rgba(0, 201, 167, 0.22)",
              backdropFilter: "blur(2px)",
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="flex items-center gap-2.5 rounded-full px-5 py-2.5"
                style={{
                  background: "rgba(0, 201, 167, 0.12)",
                  border: "1px solid rgba(0, 201, 167, 0.28)",
                }}
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">
                  Capturado — pronto para triagem
                </span>
              </div>
              <motion.button
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.2 }}
                onClick={() => router.push("/dashboard/orbit")}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary/80 hover:text-primary transition-colors"
              >
                Processar com Orbit
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
