// src/components/document/AddBlockTrigger.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Plus, Type, Heading1, Heading2, Heading3, Quote,
  Code2, List, ListOrdered, CheckSquare, Minus,
  CheckSquare as CheckSquareIcon, CalendarDays, Timer,
  Activity, ListTodo, Layers, FileText, Loader2,
} from "lucide-react";
import type { DocumentBlockType } from "./document-types";

interface AddBlockTriggerProps {
  onAddText: (tipo: DocumentBlockType) => void;
  onAddFunctional: (tipo: string, titulo?: string) => void;
  isCreating?: boolean;
}

const TEXT_BLOCKS = [
  { type: "paragraph" as const,      label: "Parágrafo",       icon: Type,         shortcut: "P" },
  { type: "h1" as const,             label: "Título 1",         icon: Heading1,     shortcut: "#" },
  { type: "h2" as const,             label: "Título 2",         icon: Heading2,     shortcut: "##" },
  { type: "h3" as const,             label: "Título 3",         icon: Heading3,     shortcut: "###" },
  { type: "quote" as const,          label: "Citação",          icon: Quote,        shortcut: ">" },
  { type: "code" as const,           label: "Código",           icon: Code2,        shortcut: "```" },
  { type: "bullet-list" as const,    label: "Lista",            icon: List,         shortcut: "-" },
  { type: "numbered-list" as const,  label: "Lista numerada",   icon: ListOrdered,  shortcut: "1." },
  { type: "todo" as const,           label: "Checklist",        icon: CheckSquare,  shortcut: "[]" },
  { type: "divider" as const,        label: "Divisor",          icon: Minus,        shortcut: "---" },
];

const FUNCTIONAL_BLOCKS = [
  { type: "tarefas",    label: "Tarefas",     icon: CheckSquareIcon, desc: "Kanban de tarefas" },
  { type: "calendario", label: "Calendário",  icon: CalendarDays,    desc: "Eventos e agenda" },
  { type: "habitos",    label: "Hábitos",     icon: Activity,        desc: "Tracker de hábitos" },
  { type: "lista",      label: "Lista",       icon: ListTodo,        desc: "Lista de itens" },
  { type: "timer",      label: "Timer",       icon: Timer,           desc: "Cronômetro / Pomodoro" },
  { type: "colecoes",   label: "Coleções",    icon: Layers,          desc: "Banco de dados" },
  { type: "notas",      label: "Notas",       icon: FileText,        desc: "Bloco de notas" },
];

export function AddBlockTrigger({
  onAddText,
  onAddFunctional,
  isCreating = false,
}: AddBlockTriggerProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"text" | "functional">("text");

  return (
    <div className="relative mt-4 px-4 md:px-8 lg:px-14">
      {/* Botão principal */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 py-2",
          open && "text-foreground"
        )}
      >
        <span className={cn(
          "flex items-center justify-center h-5 w-5 rounded border border-dashed border-muted-foreground/40 transition-all group-hover:border-foreground/40 group-hover:bg-muted/50",
          open && "border-foreground/40 bg-muted/50"
        )}>
          {isCreating ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Plus className={cn("h-3 w-3 transition-transform", open && "rotate-45")} />
          )}
        </span>
        <span>Adicionar bloco</span>
      </button>

      {/* Menu popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-4 md:left-8 lg:left-14 bottom-full mb-2 w-72 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-50"
          >
            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                className={cn(
                  "flex-1 px-3 py-2.5 text-xs font-medium transition-colors",
                  tab === "text"
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setTab("text")}
              >
                Texto
              </button>
              <button
                className={cn(
                  "flex-1 px-3 py-2.5 text-xs font-medium transition-colors",
                  tab === "functional"
                    ? "text-foreground border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setTab("functional")}
              >
                Blocos
              </button>
            </div>

            <div className="p-1.5 max-h-72 overflow-y-auto">
              {tab === "text" ? (
                TEXT_BLOCKS.map((b) => {
                  const Icon = b.icon;
                  return (
                    <button
                      key={b.type}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent transition-colors text-left"
                      onClick={() => {
                        onAddText(b.type);
                        setOpen(false);
                      }}
                    >
                      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{b.label}</p>
                        <p className="text-xs text-muted-foreground font-mono">{b.shortcut}</p>
                      </div>
                    </button>
                  );
                })
              ) : (
                FUNCTIONAL_BLOCKS.map((b) => {
                  const Icon = b.icon;
                  return (
                    <button
                      key={b.type}
                      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent transition-colors text-left"
                      onClick={() => {
                        onAddFunctional(b.type);
                        setOpen(false);
                      }}
                    >
                      <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{b.label}</p>
                        <p className="text-xs text-muted-foreground">{b.desc}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Dica do slash menu */}
            <div className="border-t border-border px-3 py-2 text-[11px] text-muted-foreground bg-muted/30">
              💡 Digite <kbd className="font-mono bg-background border rounded px-1">/</kbd> em qualquer bloco para abrir o menu de comandos
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para fechar */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
