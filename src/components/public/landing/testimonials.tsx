"use client";

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

// ── Shared wrapper that replicates BlocoCard visual language ────────────────

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
        "relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm",
        "transition-all hover:-translate-y-0.5 hover:shadow-md",
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
          <span className="text-sm font-semibold text-foreground/90">
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
        <div className="w-full whitespace-pre-line text-[0.9375rem] leading-[1.75] text-foreground/80">
          {`Revisão — Fisiologia Renal\n\n• TFG normal ≈ 125 mL/min\n• Reabsorção proximal: Na⁺, glicose\n• Alça de Henle: gradiente osmótico\n• ADH: concentra urina no coletor`}
        </div>
        <div className="mt-2 flex items-center gap-1.5 border-t border-border/20 pt-2">
          <FileText className="h-3 w-3 text-muted-foreground/30" />
          <span className="tabular-nums text-[10px] text-muted-foreground/30">
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
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
          <span className="tabular-nums text-[11px] text-muted-foreground">
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
                  : "border-border/40 bg-muted/30",
              )}
            >
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                  h.completoHoje
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-border/60",
                )}
              >
                {h.completoHoje && <Check className="h-3 w-3 text-white" />}
              </div>
              <span
                className={cn(
                  "flex-1",
                  h.completoHoje
                    ? "line-through text-muted-foreground/60"
                    : "text-foreground/80",
                )}
              >
                {h.nome}
              </span>
              <span className="tabular-nums text-[10px] text-muted-foreground/50">
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
      <div className="overflow-hidden rounded-xl border border-border/50 bg-card/60">
        {/* List header */}
        <div className="flex items-center gap-2.5 border-b border-border/30 px-3.5 py-2.5">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ background: "#06b6d418" }}
          >
            <Check className="h-3.5 w-3.5" style={{ color: "#06b6d4" }} />
          </div>
          <span className="flex-1 text-sm font-medium">Estudos ENEM</span>
          <span className="tabular-nums text-[11px] text-muted-foreground/60">
            {done}/{MOCK_ITENS.length}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/40" />
        </div>
        {/* Items */}
        <div className="space-y-1.5 px-3.5 py-2.5">
          {MOCK_ITENS.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                  item.concluido
                    ? "border-cyan-500/60 bg-cyan-500/15"
                    : "border-border/50",
                )}
              >
                {item.concluido && (
                  <Check className="h-2.5 w-2.5 text-cyan-500" />
                )}
              </div>
              <span
                className={cn(
                  item.concluido
                    ? "line-through text-muted-foreground/50"
                    : "text-foreground/80",
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
    <BlocoWrapper
      type="tarefas"
      icon={CheckSquare}
      label="Tarefas"
      className="md:col-span-2"
    >
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-md border border-border/40 bg-muted/30 p-0.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-background shadow-sm text-foreground">
              <LayoutGrid className="h-3.5 w-3.5" />
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60">
              <List className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="tabular-nums text-[11px] text-muted-foreground shrink-0">
              {done}/{total}
            </span>
          </div>
        </div>

        {/* Kanban columns */}
        <div className="grid grid-cols-3 gap-2">
          {MOCK_COLS.map((col, ci) => (
            <div
              key={ci}
              className="space-y-1.5 rounded-xl border border-border/40 bg-muted/20 p-2.5"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {col.label}
                </span>
                <span className="tabular-nums text-[10px] text-muted-foreground/50">
                  {col.tasks.length}
                </span>
              </div>
              {col.tasks.map((task, ti) => (
                <div
                  key={ti}
                  className="rounded-lg border border-border/30 bg-background/80 px-2.5 py-1.5 text-xs text-foreground/80 shadow-sm"
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
        <div className="w-full rounded-xl border border-border/50 bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground/40">
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
                  : "border-border/40 text-muted-foreground",
              )}
            >
              {p.min}m
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 rounded-lg border border-border/50 bg-muted/30 p-0.5">
            <div className="flex items-center gap-1.5 rounded-md bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
              <TrendingDown className="h-3 w-3" /> Timer
            </div>
            <div className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground/60">
              <TrendingUp className="h-3 w-3" /> Stopwatch
            </div>
          </div>
          <div className="w-16 rounded-lg border border-border/50 bg-muted/40 px-2 py-1.5 text-center text-xs text-foreground/70">
            25
          </div>
          <Volume2 className="ml-auto h-3.5 w-3.5 text-muted-foreground/50" />
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
// May 1 2026 = Friday → offset 5 (Sun=0 … Sat=6)
const CAL_OFFSET = 5;

function CalendarioMock() {
  return (
    <BlocoWrapper type="calendario" icon={CalendarDays} label="Calendário">
      <div className="space-y-2">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-semibold">Maio 2026</span>
          <div className="flex items-center gap-0.5 text-muted-foreground">
            <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-accent">
              ‹
            </div>
            <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md hover:bg-accent">
              ›
            </div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
            <div
              key={i}
              className="pb-1 text-[10px] font-medium text-muted-foreground/50"
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
                  "cursor-pointer text-foreground/70 hover:bg-accent/60",
                d !== CAL_TODAY &&
                  CAL_EVENT_DAYS.has(d) &&
                  "font-medium text-foreground/80",
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

// ── Coleções (Base de Dados) ─────────────────────────────────────────────────

const DB_CAMPOS = ["Tarefa", "Status", "Prazo", "Prioridade"];
const DB_ROWS = [
  ["Estudar fisiologia", "✅ Feito", "12/05", "Alta"],
  ["Revisar bioquímica", "🔄 Em progr.", "15/05", "Média"],
  ["Simulado completo", "⏳ Pendente", "18/05", "Alta"],
  ["Flashcards neuro", "⏳ Pendente", "20/05", "Baixa"],
];

function ColecoesMock() {
  return (
    <BlocoWrapper
      type="colecoes"
      icon={Layers}
      label="Base de Dados"
      className="md:col-span-2"
    >
      <div className="overflow-hidden rounded-xl border border-border/50">
        <div
          className="grid border-b border-border/40 bg-muted/30 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70"
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
              "grid border-b border-border/30 text-xs last:border-0 hover:bg-accent/30 transition-colors",
              ri % 2 === 0 ? "bg-card/40" : "bg-muted/10",
            )}
            style={{ gridTemplateColumns: "2fr 1.2fr 0.8fr 0.8fr" }}
          >
            {row.map((cell, ci) => (
              <div key={ci} className="px-3 py-2 text-foreground/80">
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </BlocoWrapper>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────

export function Testimonials() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div data-animate="fade-up" className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Blocos
          </span>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Tudo que você precisa, em um só lugar
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Cada bloco foi projetado para potencializar uma área da sua vida —
            combine-os livremente dentro dos seus Nucleos.
          </p>
        </div>

        {/* Row 1: Tarefas (wide) + Timer */}
        <div
          data-animate="fade-up"
          data-delay="100"
          className="mb-6 grid gap-6 md:grid-cols-3"
        >
          <TarefasMock />
          <TimerMock />
        </div>

        {/* Row 2: Calendário + Hábitos + Lista */}
        <div
          data-animate="fade-up"
          data-delay="200"
          className="mb-6 grid gap-6 md:grid-cols-3"
        >
          <CalendarioMock />
          <HabitosMock />
          <ListaMock />
        </div>

        {/* Row 3: Notas + Coleções (wide) */}
        <div
          data-animate="fade-up"
          data-delay="300"
          className="grid gap-6 md:grid-cols-3"
        >
          <NotasMock />
          <ColecoesMock />
        </div>
      </div>
    </section>
  );
}
