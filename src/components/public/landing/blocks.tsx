"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  CheckSquare,
  CalendarDays,
  Activity,
  ListTodo,
  Timer as TimerIcon,
  Layers,
  BookOpen,
  Check,
  Play,
  TrendingDown,
  TrendingUp,
  Volume2,
  LayoutGrid,
  List,
  FileText,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Bloco Colors ────────────────────────────────────────────────────────────
const BLOCK_COLORS = {
  notas: {
    accent: "bg-purple-500",
    icon: "text-purple-400",
    bg: "bg-purple-500/10",
    tint: "bg-purple-500/[0.03]",
  },
  tarefas: {
    accent: "bg-primary",
    icon: "text-primary",
    bg: "bg-primary/10",
    tint: "bg-primary/[0.03]",
  },
  calendario: {
    accent: "bg-indigo-500",
    icon: "text-indigo-400",
    bg: "bg-indigo-500/10",
    tint: "bg-indigo-500/[0.03]",
  },
  habitos: {
    accent: "bg-teal-500",
    icon: "text-green-400",
    bg: "bg-teal-500/10",
    tint: "bg-teal-500/[0.03]",
  },
  lista: {
    accent: "bg-cyan-500",
    icon: "text-cyan-400",
    bg: "bg-cyan-500/10",
    tint: "bg-cyan-500/[0.03]",
  },
  timer: {
    accent: "bg-orange-500",
    icon: "text-orange-400",
    bg: "bg-orange-500/10",
    tint: "bg-orange-500/[0.03]",
  },
  colecoes: {
    accent: "bg-emerald-500",
    icon: "text-emerald-400",
    bg: "bg-emerald-500/10",
    tint: "bg-emerald-500/[0.03]",
  },
} as const;

// ── BlocoWrapper ─────────────────────────────────────────────────────────────
function BlocoWrapper({
  type,
  icon: Icon,
  label,
  children,
  className,
}: {
  type: keyof typeof BLOCK_COLORS;
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const c = BLOCK_COLORS[type];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg shadow-black/5 transition-all hover:-translate-y-0.5 hover:shadow-md w-full",
        className,
      )}
    >
      <div className={cn("relative", c.tint)}>
        {/* Left accent strip */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-[3px] rounded-r-full",
            c.accent,
          )}
        />

        {/* Header */}
        <div className="flex items-center gap-2.5 px-5 pt-4 pb-3">
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
              c.bg,
            )}
          >
            <Icon className={cn("h-4 w-4", c.icon)} />
          </div>
          <span className="text-sm font-semibold text-neutral-900 dark:text-white/90">
            {label}
          </span>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 pt-0">{children}</div>
      </div>
    </div>
  );
}

// ── Notas ───────────────────────────────────────────────────────────────────
function NotasMock() {
  return (
    <BlocoWrapper type="notas" icon={BookOpen} label="Notas">
      <div className="relative">
        <div className="w-full whitespace-pre-line text-[0.9375rem] leading-[1.75] text-neutral-700 dark:text-neutral-300">
          {`Revisão — Fisiologia Renal\n\n• TFG normal ≈ 125 mL/min\n• Reabsorção proximal: Na⁺, glicose\n• Alça de Henle: gradiente osmótico\n• ADH: concentra urina no coletor`}
        </div>
        <div className="mt-2 flex items-center gap-1.5 border-t border-neutral-200 dark:border-neutral-800 pt-2">
          <FileText className="h-3 w-3 text-neutral-400" />
          <span className="tabular-nums text-[10px] text-neutral-400">
            24 palavras
          </span>
        </div>
      </div>
    </BlocoWrapper>
  );
}

// ── Hábitos ─────────────────────────────────────────────────────────────────
const MOCK_HABITOS = [
  { nome: "Meditar 10 min", completoHoje: true, streak: 12 },
  { nome: "Leitura 30 min", completoHoje: true, streak: 7 },
  { nome: "Exercícios", completoHoje: false, streak: 4 },
  { nome: "Beber 2L de água", completoHoje: false, streak: 9 },
];

function HabitosMock() {
  const done = MOCK_HABITOS.filter((h) => h.completoHoje).length;
  const total = MOCK_HABITOS.length;

  return (
    <BlocoWrapper type="habitos" icon={Activity} label="Hábitos">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
          <span className="tabular-nums text-[11px] text-neutral-500 dark:text-neutral-400">
            {done}/{total} hoje
          </span>
        </div>
        <div className="space-y-1.5">
          {MOCK_HABITOS.map((h, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm",
                h.completoHoje
                  ? "border-emerald-500/20 bg-emerald-500/8"
                  : "border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/30",
              )}
            >
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  h.completoHoje
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-neutral-300 dark:border-neutral-700",
                )}
              >
                {h.completoHoje && <Check className="h-3 w-3 text-white" />}
              </div>
              <span
                className={cn(
                  "flex-1",
                  h.completoHoje
                    ? "line-through text-neutral-400"
                    : "text-neutral-700 dark:text-neutral-300",
                )}
              >
                {h.nome}
              </span>
              <span className="tabular-nums text-[10px] text-neutral-400">
                {h.streak}🔥
              </span>
            </div>
          ))}
        </div>
      </div>
    </BlocoWrapper>
  );
}

// ── Lista ───────────────────────────────────────────────────────────────────
const MOCK_ITENS = [
  { texto: "Revisar anatomia — cap. 8", concluido: true },
  { texto: "Flashcards de metabolismo", concluido: true },
  { texto: "Questões de fisiologia", concluido: false },
  { texto: "Resumo do sistema nervoso", concluido: false },
  { texto: "Simular prova antiga", concluido: false },
];

function ListaMock() {
  const done = MOCK_ITENS.filter((i) => i.concluido).length;

  return (
    <BlocoWrapper type="lista" icon={ListTodo} label="Lista">
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-2.5 border-b border-neutral-200 dark:border-neutral-800 px-3.5 py-2.5">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ background: "#06b6d418" }}
          >
            <Check className="h-3.5 w-3.5" style={{ color: "#06b6d4" }} />
          </div>
          <span className="flex-1 text-sm font-medium text-neutral-900 dark:text-white">
            Estudos ENEM
          </span>
          <span className="tabular-nums text-[11px] text-neutral-400">
            {done}/{MOCK_ITENS.length}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
        </div>
        <div className="space-y-1.5 px-3.5 py-2.5">
          {MOCK_ITENS.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                  item.concluido
                    ? "border-cyan-500/60 bg-cyan-500/15"
                    : "border-neutral-300 dark:border-neutral-700",
                )}
              >
                {item.concluido && (
                  <Check className="h-2.5 w-2.5 text-cyan-500" />
                )}
              </div>
              <span
                className={cn(
                  item.concluido
                    ? "line-through text-neutral-400"
                    : "text-neutral-700 dark:text-neutral-300",
                )}
              >
                {item.texto}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BlocoWrapper>
  );
}

// ── Tarefas (Kanban) ─────────────────────────────────────────────────────────
const MOCK_COLS = [
  {
    label: "Pendente",
    tasks: ["Artigo científico", "Relatório mensal", "Reunião — prep."],
  },
  { label: "Em andamento", tasks: ["Projeto beta v2", "Design revisão"] },
  { label: "Concluída", tasks: ["Apresentação", "Deploy staging"] },
];

function TarefasMock() {
  const total = MOCK_COLS.reduce((s, c) => s + c.tasks.length, 0);
  const done = MOCK_COLS[2].tasks.length;
  const pct = Math.round((done / total) * 100);

  return (
    <BlocoWrapper type="tarefas" icon={CheckSquare} label="Tarefas">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 p-0.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white dark:bg-neutral-900 shadow-sm">
              <LayoutGrid className="h-3.5 w-3.5 text-neutral-900 dark:text-white" />
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400">
              <List className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="tabular-nums text-[11px] text-neutral-400 shrink-0">
              {done}/{total}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {MOCK_COLS.map((col, ci) => (
            <div
              key={ci}
              className="space-y-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 p-2.5"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {col.label}
                </span>
                <span className="tabular-nums text-[10px] text-neutral-400">
                  {col.tasks.length}
                </span>
              </div>
              {col.tasks.map((task, ti) => (
                <div
                  key={ti}
                  className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 shadow-sm"
                >
                  {task}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </BlocoWrapper>
  );
}

// ── Timer ───────────────────────────────────────────────────────────────────
const TIMER_PRESETS = [
  { label: "Pomodoro", min: 25 },
  { label: "Pausa", min: 5 },
  { label: "Foco", min: 45 },
  { label: "Estudo", min: 60 },
];

function TimerMock() {
  return (
    <BlocoWrapper type="timer" icon={TimerIcon} label="Timer">
      <div className="space-y-3">
        <div className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 px-3 py-2.5 text-sm text-neutral-400">
          O que você vai fazer?
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {TIMER_PRESETS.map((p, i) => (
            <div
              key={i}
              className={cn(
                "rounded-lg border py-1.5 text-center text-xs font-medium",
                i === 0
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400",
              )}
            >
              {p.min}m
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 p-0.5">
            <div className="flex items-center gap-1.5 rounded-md bg-white dark:bg-neutral-900 px-2.5 py-1 text-xs font-medium text-neutral-900 dark:text-white shadow-sm">
              <TrendingDown className="h-3 w-3" /> Timer
            </div>
            <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-neutral-400">
              <TrendingUp className="h-3 w-3" /> Stopwatch
            </div>
          </div>
          <div className="w-16 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 px-2 py-1.5 text-center text-xs text-neutral-700 dark:text-neutral-300">
            25
          </div>
          <Volume2 className="ml-auto h-3.5 w-3.5 text-neutral-400" />
        </div>
        <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(249,115,22,0.30)]">
          <Play className="h-4 w-4" /> Iniciar 25min
        </div>
      </div>
    </BlocoWrapper>
  );
}

// ── Calendário ───────────────────────────────────────────────────────────────
const CAL_EVENT_DAYS = new Set([5, 12, 15, 20, 23, 28]);
const CAL_TODAY = 13;
const CAL_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const CAL_OFFSET = 5;

function CalendarioMock() {
  return (
    <BlocoWrapper type="calendario" icon={CalendarDays} label="Calendário">
      <div className="space-y-2">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
            Maio 2026
          </span>
          <div className="flex items-center gap-0.5 text-neutral-400">
            <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">
              ‹
            </div>
            <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800">
              ›
            </div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
            <div
              key={i}
              className="pb-1 text-[10px] font-medium text-neutral-400"
            >
              {d}
            </div>
          ))}
          {Array.from({ length: CAL_OFFSET }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {CAL_DAYS.map((d) => (
            <div
              key={d}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-md text-xs",
                d === CAL_TODAY &&
                  "bg-primary font-bold text-primary-foreground",
                d !== CAL_TODAY &&
                  "cursor-pointer text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800",
                d !== CAL_TODAY &&
                  CAL_EVENT_DAYS.has(d) &&
                  "font-medium text-neutral-900 dark:text-white",
              )}
            >
              {d}
              {CAL_EVENT_DAYS.has(d) && d !== CAL_TODAY && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-indigo-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    </BlocoWrapper>
  );
}

// ── Coleções ─────────────────────────────────────────────────────────────────
const DB_CAMPOS = ["Tarefa", "Status", "Prazo", "Prioridade"];
const DB_ROWS = [
  ["Estudar fisiologia", "✅ Feito", "12/05", "Alta"],
  ["Revisar bioquímica", "🔄 Em progr.", "15/05", "Média"],
  ["Simulado completo", "⏳ Pendente", "18/05", "Alta"],
  ["Flashcards neuro", "⏳ Pendente", "20/05", "Baixa"],
];

function ColecoesMock() {
  return (
    <BlocoWrapper type="colecoes" icon={Layers} label="Base de Dados">
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div
          className="grid border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
          style={{ gridTemplateColumns: "2fr 1.2fr 0.8fr 0.8fr" }}
        >
          {DB_CAMPOS.map((c, i) => (
            <div key={i} className="px-3 py-2">
              {c}
            </div>
          ))}
        </div>
        {DB_ROWS.map((row, ri) => (
          <div
            key={ri}
            className={cn(
              "grid border-b border-neutral-200 dark:border-neutral-800 text-xs last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors",
              ri % 2 === 0
                ? "bg-white dark:bg-neutral-900"
                : "bg-neutral-50 dark:bg-neutral-800/30",
            )}
            style={{ gridTemplateColumns: "2fr 1.2fr 0.8fr 0.8fr" }}
          >
            {row.map((cell, ci) => (
              <div
                key={ci}
                className="px-3 py-2 text-neutral-700 dark:text-neutral-300"
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </BlocoWrapper>
  );
}

// ── Blocos como Testemunhas (Cards no lugar dos depoimentos) ─────────────────
const blocosTestemunhas = [
  { component: TarefasMock, id: "tarefas" },
  { component: TimerMock, id: "timer" },
  { component: CalendarioMock, id: "calendario" },
  { component: HabitosMock, id: "habitos" },
  { component: ListaMock, id: "lista" },
  { component: NotasMock, id: "notas" },
  { component: ColecoesMock, id: "colecoes" },
];

// Separar em colunas
const firstColumn = blocosTestemunhas.slice(0, 3);
const secondColumn = blocosTestemunhas.slice(3, 5);
const thirdColumn = blocosTestemunhas.slice(5, 7);

// ── Blocos Column ───────────────────────────────────────────────────────────
const BlocosColumn = (props: {
  className?: string;
  blocos: typeof blocosTestemunhas;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 25,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 list-none m-0 p-0"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.blocos.map(({ component: Component, id }, i) => (
                <motion.li
                  key={`${index}-${id}-${i}`}
                  aria-hidden={index === 1 ? "true" : "false"}
                  tabIndex={index === 1 ? -1 : 0}
                  whileHover={{
                    scale: 1.03,
                    y: -8,
                    boxShadow:
                      "0 25px 50px -12px rgba(77, 124, 255, 0.15), 0 10px 10px -5px rgba(0, 201, 167, 0.04), 0 0 0 1px rgba(77, 124, 255, 0.1)",
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 17,
                    },
                  }}
                  whileFocus={{
                    scale: 1.03,
                    y: -8,
                    boxShadow:
                      "0 25px 50px -12px rgba(77, 124, 255, 0.15), 0 10px 10px -5px rgba(0, 201, 167, 0.04), 0 0 0 1px rgba(77, 124, 255, 0.1)",
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 17,
                    },
                  }}
                  className="max-w-xs w-full cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-[#4D7CFF]/30"
                >
                  <Component />
                </motion.li>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.ul>
    </div>
  );
};

// ── Testimonials Section com Blocos ──────────────────────────────────────────
const Blocks = () => {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="bg-white dark:bg-neutral-950 py-24 relative overflow-hidden"
    >
      {/* Gradientes de fundo */}
      <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-10 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-neutral-950 dark:via-neutral-950/80 dark:to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-neutral-950 dark:via-neutral-950/80 dark:to-transparent" />

      {/* Elementos decorativos */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-[#4D7CFF]/5 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-[#00C9A7]/5 blur-3xl animate-pulse delay-700" />
      </div>

      <motion.div className="container px-4 z-10 mx-auto">
        <div className="flex flex-col items-center justify-center max-w-[640px] mx-auto mb-16">
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF]"
            >
              <Sparkles className="size-4" />
              <span>Blocos</span>
            </Badge>
          </div>

          <h2
            id="testimonials-heading"
            className="text-4xl md:text-5xl font-extrabold tracking-tight mt-6 text-center text-neutral-900 dark:text-white transition-colors"
          >
            Tudo que você precisa,{" "}
            <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              em um só lugar
            </span>
          </h2>
          <p className="text-center mt-5 text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed max-w-md transition-colors">
            Cada bloco foi projetado para potencializar uma área da sua vida —
            combine-os livremente dentro dos seus núcleos.
          </p>
        </div>

        {/* Mobile: rolagem normal. Desktop: perspectiva 3D inclinada para o canto superior esquerdo */}
        <div className="md:[perspective:1100px] md:[perspective-origin:55%_40%]">
          <div
            className={cn(
              "flex justify-center gap-6 mt-10",
              "[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]",
              "max-h-[740px] overflow-hidden",
              // Diagonal superior-esquerdo apenas em md+
              "md:[transform:rotateX(18deg)_rotateY(-13deg)]",
              "md:transform-gpu md:[transform-origin:center_top]",
              "md:scale-[1.08]",
            )}
            role="region"
            aria-label="Blocos em Rolagem"
          >
            <BlocosColumn blocos={firstColumn} duration={25} />
            <BlocosColumn
              blocos={secondColumn}
              className="hidden md:block"
              duration={30}
            />
            <BlocosColumn
              blocos={thirdColumn}
              className="hidden lg:block"
              duration={28}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default function BlocksSection() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="w-screen min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300 flex flex-col justify-center relative selection:bg-[#4D7CFF] selection:text-white">
      <Blocks />
    </div>
  );
}
