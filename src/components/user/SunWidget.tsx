"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LiquidGlass } from "@/components/ui/liquid-glass";

interface SunWidgetProps {
  lat?: number;
  lng?: number;
  city?: string;
}

interface SunData {
  sunrise: string;
  sunset: string;
}

const COLORS = ["#4d7cff00", "#00c9a700", "#5b7fff00", "#1fbfa700"];

// const COLORS = ["#4D7CFF", "#00C9A7", "#5B7FFF", "#1FBFA8"];

function getMinutes(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function getPointOnPath(t: number) {
  const p0 = { x: 80, y: 170 };
  const p1 = { x: 180, y: 30 };
  const p2 = { x: 360, y: 30 };
  const p3 = { x: 470, y: 90 };
  const p4 = { x: 720, y: 220 };
  const p5 = { x: 820, y: 120 };

  if (t <= 0.5) {
    const localT = t * 2;
    const x =
      Math.pow(1 - localT, 3) * p0.x +
      3 * Math.pow(1 - localT, 2) * localT * p1.x +
      3 * (1 - localT) * Math.pow(localT, 2) * p2.x +
      Math.pow(localT, 3) * p3.x;
    const y =
      Math.pow(1 - localT, 3) * p0.y +
      3 * Math.pow(1 - localT, 2) * localT * p1.y +
      3 * (1 - localT) * Math.pow(localT, 2) * p2.y +
      Math.pow(localT, 3) * p3.y;
    return { x, y };
  }

  const localT = (t - 0.5) * 2;
  const cp1 = {
    x: p3.x + (p3.x - p2.x),
    y: p3.y + (p3.y - p2.y),
  };
  const x =
    Math.pow(1 - localT, 3) * p3.x +
    3 * Math.pow(1 - localT, 2) * localT * cp1.x +
    3 * (1 - localT) * Math.pow(localT, 2) * p4.x +
    Math.pow(localT, 3) * p5.x;
  const y =
    Math.pow(1 - localT, 3) * p3.y +
    3 * Math.pow(1 - localT, 2) * localT * cp1.y +
    3 * (1 - localT) * Math.pow(localT, 2) * p4.y +
    Math.pow(localT, 3) * p5.y;

  return { x, y };
}

export default function GoldenHourWidget({
  lat = -22.5201,
  lng = -44.1042,
  city = "Volta Redonda",
}: SunWidgetProps) {
  const [sunData, setSunData] = useState<SunData | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadSunData() {
      try {
        const response = await fetch(
          `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`,
        );
        const data = await response.json();
        if (!data?.results) return;
        setSunData({
          sunrise: data.results.sunrise,
          sunset: data.results.sunset,
        });
      } catch (err) {
        console.error(err);
      }
    }
    loadSunData();
  }, [lat, lng]);

  const calculations = useMemo(() => {
    if (!sunData) return null;

    const sunrise = new Date(sunData.sunrise);
    const sunset = new Date(sunData.sunset);
    const sunriseMinutes = getMinutes(sunrise);
    const sunsetMinutes = getMinutes(sunset);
    const currentMinutes = getMinutes(now);

    const isNight =
      currentMinutes < sunriseMinutes || currentMinutes > sunsetMinutes;

    let t = 0;
    if (!isNight) {
      t = (currentMinutes - sunriseMinutes) / (sunsetMinutes - sunriseMinutes);
    } else {
      const totalNightMinutes = 24 * 60 - sunsetMinutes + sunriseMinutes;
      const passedNightMinutes =
        currentMinutes > sunsetMinutes
          ? currentMinutes - sunsetMinutes
          : 24 * 60 - sunsetMinutes + currentMinutes;
      t = passedNightMinutes / totalNightMinutes;
    }

    t = Math.max(0, Math.min(t, 1));
    const point = getPointOnPath(t);

    const period =
      now.getHours() < 12 ? "Manhã" : now.getHours() < 18 ? "Tarde" : "Noite";

    return { x: point.x, y: point.y, period, isNight };
  }, [sunData, now]);

  return (
    <LiquidGlass
      variant="subtle"
      radius="var(--radius-lg)"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="h-[108px] w-full overflow-hidden"
    >
      {/* Ambient glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(
                135deg,
                ${COLORS[0]}18 0%,
                ${COLORS[2]}14 30%,
                ${COLORS[1]}14 70%,
                ${COLORS[3]}18 100%
              )
            `,
          }}
        />
        <div
          className="absolute -top-24 left-[10%] h-[220px] w-[220px] rounded-full blur-[100px] opacity-30"
          style={{ background: COLORS[0] }}
        />
        <div
          className="absolute -bottom-32 right-[5%] h-[260px] w-[260px] rounded-full blur-[120px] opacity-20"
          style={{ background: COLORS[1] }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle at center,  1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
      </div>

      {/* Orbit */}
      <svg
        viewBox="0 0 900 260"
        className="absolute inset-0 h-full w-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.12)" />
          </linearGradient>
        </defs>

        {/* Main line */}
        <path
          d="M80 170 C180 30 360 30 470 90 S720 220 820 120"
          fill="none"
          stroke="url(#orbitGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* Soft glow */}
        <path
          d="M80 170 C180 30 360 30 470 90 S720 220 820 120"
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="14"
          strokeLinecap="round"
          filter="blur(12px)"
        />
      </svg>

      {/* Sol / Lua - Versão menor */}
      {calculations && (
        <motion.div
          animate={{
            left: `${(calculations.x / 900) * 100}%`,
            top: `${(calculations.y / 260) * 100}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 40,
            damping: 20,
          }}
          className="absolute z-20"
          style={{ transform: "translate(-50%, -50%)" }}
        >
          {calculations.isNight ? (
            <div className="relative">
              {/* Moon outer glow */}
              <div className="absolute inset-0 scale-[1.6] rounded-full bg-/20 blur-xl" />
              {/* Moon inner glow */}
              <div className="absolute inset-0 scale-[1.2] rounded-full bg-/40 blur-md" />
              {/* Moon core */}
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-/90 shadow-[0_0_20px_rgba(255,255,255,0.40)]">
                {/* <Moon className="h-3.5 w-3.5 text-slate-700" /> */}
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute inset-0 scale-[1.6] rounded-full bg-[#ffbe0b]/35 blur-xl" />
              {/* Mid glow */}
              <div className="absolute inset-0 scale-[1.3] rounded-full bg-[#ffbe0b]/45 blur-lg" />
              {/* Inner glow */}
              <div className="absolute inset-0 scale-[1.1] rounded-full bg-[#ffbe0b]/60 blur-sm" />
              {/* Core */}
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#ffbe0b] shadow-[0_0_25px_rgba(255,190,11,0.75)]">
                {/* <Sun className="h-4 w-4 text- drop-shadow-sm" /> */}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-30 flex h-full items-start justify-between p-3">
        {/* Cidade - canto superior esquerdo */}
        {/* <div className="text-[9px] uppercase tracking-[0.3em] text-/30 font-medium">
          {city}
        </div> */}

        {/* Período - canto inferior direito */}

        {/* {calculations && (
          <div className="absolute bottom-3 right-3 text-lg font-black tracking-tight text-/85">
            {calculations.period}
          </div>
        )} */}
      </div>
    </LiquidGlass>
  );
}
