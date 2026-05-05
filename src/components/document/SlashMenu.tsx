// src/components/document/SlashMenu.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Type, Heading1, Heading2, Heading3, Quote, Code2, List,
  ListOrdered, CheckSquare, Minus, CalendarDays, Timer,
  Activity, ListTodo, Layers, FileText, Lightbulb,
} from "lucide-react";

interface SlashMenuProps {
  open: boolean;
  position: { top: number; left: number };
  onSelect: (tipo: string) => void;
  onClose: () => void;
}

const ALL_COMMANDS = [
  // Texto
  { type: "paragraph",    label: "Parágrafo",       icon: Type,         group: "Texto",    shortcut: "P" },
  { type: "h1",           label: "Título 1",         icon: Heading1,     group: "Texto",    shortcut: "#" },
  { type: "h2",           label: "Título 2",         icon: Heading2,     group: "Texto",    shortcut: "##" },
  { type: "h3",           label: "Título 3",         icon: Heading3,     group: "Texto",    shortcut: "###" },
  { type: "quote",        label: "Citação",          icon: Quote,        group: "Texto",    shortcut: ">" },
  { type: "code",         label: "Código",           icon: Code2,        group: "Texto",    shortcut: "```" },
  { type: "bullet-list",  label: "Lista",            icon: List,         group: "Texto",    shortcut: "-" },
  { type: "numbered-list",label: "Lista numerada",   icon: ListOrdered,  group: "Texto",    shortcut: "1." },
  { type: "todo",         label: "Checklist",        icon: CheckSquare,  group: "Texto",    shortcut: "[]" },
  { type: "divider",      label: "Divisor",          icon: Minus,        group: "Texto",    shortcut: "---" },
  // Blocos funcionais
  { type: "tarefas",      label: "Tarefas",          icon: CheckSquare,  group: "Blocos",   shortcut: "" },
  { type: "calendario",   label: "Calendário",       icon: CalendarDays, group: "Blocos",   shortcut: "" },
  { type: "habitos",      label: "Hábitos",          icon: Activity,     group: "Blocos",   shortcut: "" },
  { type: "lista",        label: "Lista",            icon: ListTodo,     group: "Blocos",   shortcut: "" },
  { type: "timer",        label: "Timer",            icon: Timer,        group: "Blocos",   shortcut: "" },
  { type: "colecoes",     label: "Coleções",         icon: Layers,       group: "Blocos",   shortcut: "" },
  { type: "notas",        label: "Notas",            icon: FileText,     group: "Blocos",   shortcut: "" },
];

export function SlashMenu({ open, position, onSelect, onClose }: SlashMenuProps) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Reset ao abrir
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
    }
  }, [open]);

  // Fechar com Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIdx]) onSelect(filtered[selectedIdx].type);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, selectedIdx, query]);

  const filtered = ALL_COMMANDS.filter(
    (c) =>
      !query ||
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.type.includes(query.toLowerCase())
  );

  const groups = [...new Set(filtered.map((c) => c.group))];

  // Calcular posição segura (não sair da tela)
  const safePos = {
    top: Math.min(position.top, window.innerHeight - 320),
    left: Math.min(position.left, window.innerWidth - 290),
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={onClose} />

          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="fixed z-50 w-72 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden"
            style={{ top: safePos.top, left: safePos.left }}
          >
            {/* Input de busca */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
              <span className="text-muted-foreground text-sm">/</span>
              <input
                autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
                placeholder="Buscar comando..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              />
            </div>

            <div className="max-h-72 overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  Nenhum comando encontrado
                </p>
              ) : (
                groups.map((group) => (
                  <div key={group}>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-2 pb-1">
                      {group}
                    </p>
                    {filtered
                      .filter((c) => c.group === group)
                      .map((cmd, i) => {
                        const globalIdx = filtered.indexOf(cmd);
                        const Icon = cmd.icon;
                        return (
                          <button
                            key={cmd.type}
                            className={cn(
                              "w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-left",
                              globalIdx === selectedIdx ? "bg-accent" : "hover:bg-accent/60"
                            )}
                            onClick={() => onSelect(cmd.type)}
                            onMouseEnter={() => setSelectedIdx(globalIdx)}
                          >
                            <div className={cn(
                              "h-7 w-7 rounded-md flex items-center justify-center flex-shrink-0",
                              group === "Blocos" ? "bg-primary/10" : "bg-muted"
                            )}>
                              <Icon className={cn(
                                "h-3.5 w-3.5",
                                group === "Blocos" && "text-primary"
                              )} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium">{cmd.label}</p>
                            </div>
                            {cmd.shortcut && (
                              <kbd className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {cmd.shortcut}
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
