// components/user/MoonPhaseWidget.tsx
"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const PHASE_NAMES = [
  "Lua Nova",
  "Crescente",
  "Quarto Crescente",
  "Gibosa Crescente",
  "Lua Cheia",
  "Gibosa Minguante",
  "Quarto Minguante",
  "Minguante",
] as const;

function getMoonPhase(date = new Date()) {
  const SYNODIC = 29.530588853;
  const KNOWN_NEW = new Date("2000-01-06T18:14:00Z").getTime();
  const days = (date.getTime() - KNOWN_NEW) / 86400000;
  const phase = (((days % SYNODIC) + SYNODIC) % SYNODIC) / SYNODIC;
  const idx = Math.floor((phase + 0.0625) * 8) % 8;
  const daysToFull = ((0.5 - phase + 1) % 1) * SYNODIC;
  return { phase, name: PHASE_NAMES[idx], daysToFull: Math.round(daysToFull) };
}

export default function MoonPhaseWidget() {
  const { phase, name, daysToFull } = useMemo(() => getMoonPhase(), []);

  const path = useMemo(() => {
    const r = 8,
      cx = 11,
      cy = 11;
    const illum = phase < 0.5 ? phase * 2 : 2 - phase * 2;
    const rx = Math.max(r * Math.abs(1 - 2 * illum), 0.01);
    const waxing = phase < 0.5;
    const sweepOuter = waxing ? 1 : 0;
    const sweepInner = illum > 0.5 ? (waxing ? 1 : 0) : waxing ? 0 : 1;
    return `M ${cx},${cy - r} A ${r},${r} 0 1 ${sweepOuter} ${cx},${cy + r} A ${rx},${r} 0 1 ${sweepInner} ${cx},${cy - r} Z`;
  }, [phase]);

  const label =
    daysToFull === 0
      ? "cheia hoje"
      : daysToFull <= 1
        ? "cheia amanhã"
        : `cheia em ${daysToFull}d`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors"
      title={`${name} · ${label}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 22 22"
        className="text-foreground/80"
      >
        <circle cx="11" cy="11" r="8" fill="currentColor" opacity="0.12" />
        <path d={path} fill="currentColor" opacity="0.85" />
      </svg>
      <div className="hidden sm:block leading-tight">
        <p className="text-[10px] font-medium text-foreground/70">{name}</p>
        <p className="text-[9px] text-muted-foreground/50">{label}</p>
      </div>
    </motion.div>
  );
}
