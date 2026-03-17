// /components/nucleos/ui/badge-conquista.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Lock, Check, Sparkles, Award, ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

export interface Conquista {
  id: string;
  nome: string;
  descricao: string;
  icone: React.ReactNode;
  tier: "bronze" | "prata" | "ouro" | "platina" | "diamante";
  progresso?: number;
  progressoMax?: number;
  desbloqueada: boolean;
  desbloqueadaEm?: string;
  rara?: boolean;
  xp?: number;
}

const tierConfig = {
  bronze: {
    cor: "from-amber-600 to-amber-700",
    corBg: "bg-amber-100 dark:bg-amber-950/30",
    corTexto: "text-amber-700 dark:text-amber-400",
    corBorda: "border-amber-300 dark:border-amber-700",
    icone: "/badges/bronze.svg",
    label: "Bronze",
  },
  prata: {
    cor: "from-slate-400 to-slate-500",
    corBg: "bg-slate-100 dark:bg-slate-800/50",
    corTexto: "text-slate-600 dark:text-slate-400",
    corBorda: "border-slate-300 dark:border-slate-600",
    icone: "/badges/prata.svg",
    label: "Prata",
  },
  ouro: {
    cor: "from-yellow-500 to-yellow-600",
    corBg: "bg-yellow-100 dark:bg-yellow-950/30",
    corTexto: "text-yellow-600 dark:text-yellow-400",
    corBorda: "border-yellow-400 dark:border-yellow-600",
    icone: "/badges/ouro.svg",
    label: "Ouro",
  },
  platina: {
    cor: "from-cyan-400 to-cyan-500",
    corBg: "bg-cyan-100 dark:bg-cyan-950/30",
    corTexto: "text-cyan-600 dark:text-cyan-400",
    corBorda: "border-cyan-300 dark:border-cyan-700",
    icone: "/badges/platina.svg",
    label: "Platina",
  },
  diamante: {
    cor: "from-violet-500 to-violet-600",
    corBg: "bg-violet-100 dark:bg-violet-950/30",
    corTexto: "text-violet-600 dark:text-violet-400",
    corBorda: "border-violet-300 dark:border-violet-700",
    icone: "/badges/diamante.svg",
    label: "Diamante",
  },
};

interface BadgeConquistaProps {
  conquista: Conquista;
  variant?: "card" | "mini" | "detalhado";
  onClick?: () => void;
  className?: string;
}

export function BadgeConquista({
  conquista,
  variant = "card",
  onClick,
  className,
}: BadgeConquistaProps) {
  const {
    nome,
    descricao,
    icone,
    tier,
    progresso,
    progressoMax,
    desbloqueada,
    desbloqueadaEm,
    rara,
    xp,
  } = conquista;
  const config = tierConfig[tier];

  const progressoPorcentagem =
    progresso && progressoMax ? (progresso / progressoMax) * 100 : 0;

  if (variant === "mini") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={cn(
                "relative size-10 rounded-xl flex items-center justify-center",
                config.corBg,
                desbloqueada ? "opacity-100" : "opacity-50 grayscale",
                onClick && "cursor-pointer",
                className,
              )}
              onClick={onClick}
            >
              {icone}
              {rara && desbloqueada && (
                <Sparkles className="absolute -top-1 -right-1 size-3 text-yellow-500" />
              )}
              {!desbloqueada && (
                <Lock className="absolute inset-0 m-auto size-4 text-muted-foreground/50" />
              )}
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px]">
            <p className="font-semibold text-sm">{nome}</p>
            <p className="text-xs text-muted-foreground mt-1">{descricao}</p>
            {xp && <p className="text-xs text-accent mt-1">+{xp} XP</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 transition-all",
        config.corBg,
        config.corBorda,
        desbloqueada ? "bg-gradient-to-br" : "opacity-60 grayscale",
        onClick && "cursor-pointer hover:shadow-lg",
        className,
      )}
      onClick={onClick}
    >
      {/* Efeito de brilho para desbloqueadas */}
      {desbloqueada && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}

      <div className="flex items-start gap-3">
        {/* Ícone */}
        <div
          className={cn(
            "size-12 rounded-xl flex items-center justify-center",
            config.corBg,
            `bg-gradient-to-br ${config.cor}`,
          )}
        >
          {icone}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-sm flex items-center gap-1">
                {nome}
                {rara && desbloqueada && (
                  <Sparkles className="size-3 text-yellow-500" />
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {descricao}
              </p>
            </div>
            {desbloqueada ? (
              <div className="size-5 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="size-3 text-white" />
              </div>
            ) : (
              <Lock className="size-4 text-muted-foreground/50" />
            )}
          </div>

          {/* Progresso */}
          {!desbloqueada && progresso !== undefined && progressoMax && (
            <div className="mt-3 space-y-1">
              <Progress value={progressoPorcentagem} className="h-1" />
              <p className="text-xs text-muted-foreground">
                {progresso} / {progressoMax}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between">
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full border",
                config.corBg,
                config.corTexto,
                config.corBorda,
              )}
            >
              {config.label}
            </span>
            {desbloqueada && desbloqueadaEm && (
              <span className="text-xs text-muted-foreground">
                {new Date(desbloqueadaEm).toLocaleDateString("pt-BR")}
              </span>
            )}
            {xp && (
              <span className="text-xs text-accent font-medium">+{xp} XP</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Grid de conquistas
export function ConquistasGrid({ conquistas }: { conquistas: Conquista[] }) {
  const [filtroTier, setFiltroTier] = useState<string | null>(null);

  const tiers = ["bronze", "prata", "ouro", "platina", "diamante"];
  const conquistasFiltradas = filtroTier
    ? conquistas.filter((c) => c.tier === filtroTier)
    : conquistas;

  const desbloqueadas = conquistas.filter((c) => c.desbloqueada).length;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltroTier(null)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
            filtroTier === null
              ? "bg-primary text-primary-foreground"
              : "bg-secondary hover:bg-secondary/80",
          )}
        >
          Todas
        </button>
        {tiers.map((tier) => (
          <button
            key={tier}
            onClick={() => setFiltroTier(tier)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors",
              filtroTier === tier
                ? "bg-primary text-primary-foreground"
                : tierConfig[tier as keyof typeof tierConfig].corBg,
              filtroTier === tier
                ? ""
                : tierConfig[tier as keyof typeof tierConfig].corTexto,
            )}
          >
            {tier}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {conquistasFiltradas.map((conquista) => (
          <BadgeConquista
            key={conquista.id}
            conquista={conquista}
            variant="card"
          />
        ))}
      </div>

      {/* Progresso total */}
      <div className="text-center pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Você desbloqueou{" "}
          <span className="font-bold text-primary">{desbloqueadas}</span> de{" "}
          {conquistas.length} conquistas
        </p>
        <Progress
          value={(desbloqueadas / conquistas.length) * 100}
          className="h-1 max-w-xs mx-auto mt-2"
        />
      </div>
    </div>
  );
}
