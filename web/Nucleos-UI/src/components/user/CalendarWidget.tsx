"use client";

import { motion } from "framer-motion";
import { Calendar, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { LiquidGlass } from "@/components/ui/liquid-glass";

interface CalendarWidgetProps {
  delay?: number;
}

export default function CalendarWidget({ delay = 0 }: CalendarWidgetProps) {
  const router = useRouter();
  const today = new Date();

  const day = today.getDate();
  const month = today.toLocaleDateString("pt-BR", { month: "long" });
  const year = today.getFullYear();
  const weekday = today.toLocaleDateString("pt-BR", { weekday: "long" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay }}
      className="cursor-pointer h-full"
      onClick={() => router.push("/dashboard/calendario")}
    >
      <LiquidGlass
        variant="visionOS"
        radius="var(--radius-lg)"
        interactive={false}
        className="overflow-hidden group h-full"
      >
        <div className="p-5 h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-/[0.08]">
                <Calendar className="h-4 w-4 text-/70" />
              </div>
              <p className="text-[10px] font-semibold text-/40 uppercase tracking-widest">
                Calendário
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-/20 group-hover:text-/50 group-hover:translate-x-0.5 transition-all duration-300" />
          </div>

          {/* Data atual */}
          <div className="text-center flex-1 flex flex-col items-center justify-center">
            {/* Dia da semana */}
            <p className="text-xs text-/40 capitalize mb-1">{weekday}</p>

            {/* Dia com destaque glass */}
            <div className="relative inline-flex items-center justify-center mb-2">
              {/* Glow atrás do número */}
              <div className="absolute inset-0 rounded-2xl bg-/[0.06] blur-xl scale-150" />
              <span className="relative text-6xl font-black tracking-tighter text- tabular-nums">
                {String(day).padStart(2, "0")}
              </span>
            </div>

            {/* Mês e ano */}
            <p className="text-sm font-medium text-/50 capitalize">
              {month} {year}
            </p>
          </div>

          {/* Indicador de hoje */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-/[0.05] border border-/[0.06]">
              <div className="h-1.5 w-1.5 rounded-full bg-/60" />
              <span className="text-[10px] font-medium text-/40 uppercase tracking-wider">
                Hoje
              </span>
            </div>
          </div>
        </div>
      </LiquidGlass>
    </motion.div>
  );
}
