// components/user/VibeCheckWidget.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Frown, Meh, Smile, Laugh, Sparkles } from "lucide-react";
import { LiquidGlass } from "@/components/ui/liquid-glass";
import { cn } from "@/lib/utils";

const VIBES = [
  {
    icon: Frown,
    label: "Difícil",
    color: "bg-red-500/15 text-red-400",
  },
  {
    icon: Meh,
    label: "Neutro",
    color: "bg-amber-500/15 text-amber-400",
  },
  {
    icon: Smile,
    label: "Bem",
    color: "bg-emerald-500/15 text-emerald-400",
  },
  {
    icon: Laugh,
    label: "Ótimo",
    color: "bg-sky-500/15 text-sky-400",
  },
  {
    icon: Sparkles,
    label: "Incrível",
    color: "bg-violet-500/15 text-violet-400",
  },
] as const;

export default function VibeCheckWidget({ delay = 0 }: { delay?: number }) {
  const [vibe, setVibe] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay }}
      className="hidden md:w-full lg:w-[60%] ml-auto"
    >
      <LiquidGlass
        variant="subtle"
        radius="var(--radius-lg)"
        interactive={false}
      >
        <div className="p-3 flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest leading-none">
                Como está o dia?
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={vibe ?? "empty"}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs font-semibold tracking-tight mt-1 truncate leading-tight"
                >
                  {vibe !== null ? VIBES[vibe].label : "Sua energia"}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-pink-500/10 text-pink-400 shrink-0">
              <Heart className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Vibe buttons */}
          <div className="flex items-center gap-1.5">
            {VIBES.map((v, i) => {
              const Icon = v.icon;
              return (
                <button
                  key={i}
                  onClick={() => setVibe(i)}
                  className={cn(
                    "flex-1 aspect-square max-h-[60px] rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all duration-200 hover:scale-105",
                    vibe === i
                      ? cn(
                          v.color,
                          "ring-1 ring-current ring-offset-1 ring-offset-background/50 scale-105",
                        )
                      : "bg-muted/20 opacity-60 hover:opacity-100 hover:bg-muted/30",
                  )}
                  title={v.label}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                  <span className="text-[8px] font-medium leading-none opacity-70">
                    {v.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </LiquidGlass>
    </motion.div>
  );
}
