// src/components/document/AddBlockTrigger.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Plus, Type, Heading1, Heading2, Heading3,
  Quote, Code2, List, ListOrdered, CheckSquare,
  Minus, CalendarDays, Timer, Activity, ListTodo,
  Layers, FileText, Loader2, Columns2,
} from "lucide-react";
import type { DocumentBlockType } from "./document-types";

interface AddBlockTriggerProps {
  onAddText: (tipo: DocumentBlockType) => void;
  onAddFunctional: (tipo: string, titulo?: string) => void;
  isCreating?: boolean;
}

const TEXT_BLOCKS = [
  { type: "paragraph"     as const, label: "Parágrafo",      icon: Type },
  { type: "h1"            as const, label: "Título 1",       icon: Heading1 },
  { type: "h2"            as const, label: "Título 2",       icon: Heading2 },
  { type: "h3"            as const, label: "Título 3",       icon: Heading3 },
  { type: "quote"         as const, label: "Citação",        icon: Quote },
  { type: "code"          as const, label: "Código",         icon: Code2 },
  { type: "bullet-list"   as const, label: "Lista",          icon: List },
  { type: "numbered-list" as const, label: "Lista numerada", icon: ListOrdered },
  { type: "todo"          as const, label: "Checklist",      icon: CheckSquare },
  { type: "divider"       as const, label: "Divisor",        icon: Minus },
  { type: "column-layout" as const, label: "2 Colunas",      icon: Columns2 },
];

const FUNCTIONAL_BLOCKS = [
  { type: "tarefas",   label: "Tarefas",    icon: CheckSquare,  desc: "Kanban de tarefas",      accent: "#3b82f6" },
  { type: "calendario",label: "Calendário", icon: CalendarDays, desc: "Eventos e agenda",        accent: "#6366f1" },
  { type: "habitos",   label: "Hábitos",    icon: Activity,     desc: "Tracker de hábitos",      accent: "#22c55e" },
  { type: "lista",     label: "Lista",      icon: ListTodo,     desc: "Lista de itens",          accent: "#06b6d4" },
  { type: "timer",     label: "Timer",      icon: Timer,        desc: "Cronômetro / Pomodoro",   accent: "#f97316" },
  { type: "colecoes",  label: "Coleções",   icon: Layers,       desc: "Banco de dados",          accent: "#10b981" },
  { type: "notas",     label: "Notas",      icon: FileText,     desc: "Bloco de notas",          accent: "#a855f7" },
];

export function AddBlockTrigger({ onAddText, onAddFunctional, isCreating = false }: AddBlockTriggerProps) {
  const [open, setOpen] = useState(false);
  const [tab,  setTab]  = useState<"text" | "functional">("text");

  return (
    <div className="relative mt-6 px-4 md:px-8 lg:px-14">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "group flex items-center gap-2 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-all duration-[var(--duration-fast)] py-1.5",
          open && "text-muted-foreground",
        )}
      >
        <span
          className={cn(
            "flex items-center justify-center h-5 w-5 rounded-md border transition-all duration-[var(--duration-fast)]",
            "border-dashed border-muted-foreground/25",
            open
              ? "border-muted-foreground/50 bg-muted/50"
              : "group-hover:border-muted-foreground/40 group-hover:bg-muted/30",
          )}
        >
          {isCreating
            ? <Loader2 className="h-3 w-3 animate-spin" />
            : <Plus className={cn("h-3 w-3 transition-transform", open && "rotate-45")} />
          }
        </span>
        <span className="font-medium">Adicionar bloco</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-4 md:left-8 lg:left-14 bottom-full mb-2 w-72 z-50 overflow-hidden rounded-2xl"
            style={{
              background: "var(--popover)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 32px -4px oklch(0.18 0.02 250 / 0.18), 0 2px 8px -2px oklch(0.18 0.02 250 / 0.10), inset 0 1px 0 rgba(255,255,255,0.06)",
              backdropFilter: "blur(16px) saturate(160%)",
            }}
          >
            {/* Tab bar */}
            <div className="flex border-b border-border/40">
              {(["text", "functional"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex-1 px-3 py-2.5 text-xs font-medium transition-colors",
                    tab === t
                      ? "text-foreground border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t === "text" ? "Texto" : "Módulos"}
                </button>
              ))}
            </div>

            {/* Items */}
            <div className="p-1.5 max-h-64 overflow-y-auto">
              {tab === "text"
                ? TEXT_BLOCKS.map((b) => {
                    const Icon = b.icon;
                    return (
                      <button
                        key={b.type}
                        onClick={() => { onAddText(b.type); setOpen(false); }}
                        className="w-full flex items-center gap-3 px-2.5 py-1.5 rounded-xl hover:bg-accent/70 transition-colors text-left group/item"
                      >
                        <div className="h-7 w-7 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 group-hover/item:bg-muted transition-colors">
                          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium">{b.label}</span>
                      </button>
                    );
                  })
                : FUNCTIONAL_BLOCKS.map((b) => {
                    const Icon = b.icon;
                    return (
                      <button
                        key={b.type}
                        onClick={() => { onAddFunctional(b.type); setOpen(false); }}
                        className="w-full flex items-center gap-3 px-2.5 py-1.5 rounded-xl hover:bg-accent/70 transition-colors text-left group/item"
                      >
                        <div
                          className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-opacity"
                          style={{ background: `${b.accent}18` }}
                        >
                          <Icon className="h-3.5 w-3.5" style={{ color: b.accent }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{b.label}</p>
                          <p className="text-[11px] text-muted-foreground/70">{b.desc}</p>
                        </div>
                      </button>
                    );
                  })
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}
    </div>
  );
}
