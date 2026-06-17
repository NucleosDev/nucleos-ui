// src/components/document/SlashMenu.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code2,
  List,
  ListOrdered,
  CheckSquare,
  Minus,
  CalendarDays,
  Timer,
  Activity,
  ListTodo,
  Layers,
  FileText,
  Columns2,
} from "lucide-react";

interface SlashMenuProps {
  open: boolean;
  position: { top: number; left: number };
  onSelect: (tipo: string) => void;
  onClose: () => void;
}

const ALL_COMMANDS = [
  {
    type: "paragraph",
    label: "Parágrafo",
    icon: Type,
    group: "Texto",
    shortcut: "P",
    accent: "",
  },
  {
    type: "h1",
    label: "Título 1",
    icon: Heading1,
    group: "Texto",
    shortcut: "#",
    accent: "",
  },
  {
    type: "h2",
    label: "Título 2",
    icon: Heading2,
    group: "Texto",
    shortcut: "##",
    accent: "",
  },
  {
    type: "h3",
    label: "Título 3",
    icon: Heading3,
    group: "Texto",
    shortcut: "###",
    accent: "",
  },
  {
    type: "quote",
    label: "Citação",
    icon: Quote,
    group: "Texto",
    shortcut: ">",
    accent: "",
  },
  {
    type: "code",
    label: "Código",
    icon: Code2,
    group: "Texto",
    shortcut: "```",
    accent: "",
  },
  {
    type: "bullet-list",
    label: "Lista",
    icon: List,
    group: "Texto",
    shortcut: "-",
    accent: "",
  },
  {
    type: "numbered-list",
    label: "Lista numerada",
    icon: ListOrdered,
    group: "Texto",
    shortcut: "1.",
    accent: "",
  },
  {
    type: "todo",
    label: "Checklist",
    icon: CheckSquare,
    group: "Texto",
    shortcut: "[]",
    accent: "",
  },
  {
    type: "divider",
    label: "Divisor",
    icon: Minus,
    group: "Texto",
    shortcut: "---",
    accent: "",
  },
  {
    type: "column-layout",
    label: "2 Colunas",
    icon: Columns2,
    group: "Layout",
    shortcut: "",
    accent: "",
  },
  {
    type: "tarefas",
    label: "Tarefas",
    icon: CheckSquare,
    group: "Módulos",
    shortcut: "",
    accent: "#3b82f6",
  },
  {
    type: "calendario",
    label: "Calendário",
    icon: CalendarDays,
    group: "Módulos",
    shortcut: "",
    accent: "#6366f1",
  },
  {
    type: "habitos",
    label: "Hábitos",
    icon: Activity,
    group: "Módulos",
    shortcut: "",
    accent: "#20e898",
  },
  {
    type: "lista",
    label: "Lista",
    icon: ListTodo,
    group: "Módulos",
    shortcut: "",
    accent: "#06b6d4",
  },
  {
    type: "timer",
    label: "Timer",
    icon: Timer,
    group: "Módulos",
    shortcut: "",
    accent: "#f97316",
  },
  {
    type: "colecoes",
    label: "Coleções",
    icon: Layers,
    group: "Módulos",
    shortcut: "",
    accent: "#10b981",
  },
  {
    type: "notas",
    label: "Notas",
    icon: FileText,
    group: "Módulos",
    shortcut: "",
    accent: "#a855f7",
  },
];

export function SlashMenu({
  open,
  position,
  onSelect,
  onClose,
}: SlashMenuProps) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const filtered = ALL_COMMANDS.filter(
    (c) =>
      !query ||
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.type.includes(query.toLowerCase()),
  );

  const filteredRef = useRef(filtered);
  const selectedIdxRef = useRef(selectedIdx);
  filteredRef.current = filtered;
  selectedIdxRef.current = selectedIdx;

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filteredRef.current.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const item = filteredRef.current[selectedIdxRef.current];
        if (item) onSelect(item.type);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, onSelect]);

  const groups = [...new Set(filtered.map((c) => c.group))];

  const safePos = {
    top: Math.min(
      position.top,
      (typeof window !== "undefined" ? window.innerHeight : 800) - 320,
    ),
    left: Math.min(
      position.left,
      (typeof window !== "undefined" ? window.innerWidth : 1200) - 290,
    ),
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.13, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-50 w-72 overflow-hidden rounded-2xl"
            style={{
              top: safePos.top,
              left: safePos.left,
              background: "var(--popover)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 16px 40px -8px oklch(0.18 0.02 250 / 0.22), 0 4px 12px -4px oklch(0.18 0.02 250 / 0.12), inset 0 1px 0 rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px) saturate(180%)",
            }}
          >
            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/40">
              <span className="text-muted-foreground/50 text-sm font-mono">
                /
              </span>
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIdx(0);
                }}
                placeholder="Buscar comando..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
              />
            </div>

            {/* Items */}
            <div className="max-h-72 overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <p className="text-xs text-muted-foreground/50 text-center py-6">
                  Nenhum comando encontrado
                </p>
              ) : (
                groups.map((group) => (
                  <div key={group}>
                    <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider px-2.5 pt-2.5 pb-1">
                      {group}
                    </p>
                    {filtered
                      .filter((c) => c.group === group)
                      .map((cmd) => {
                        const globalIdx = filtered.indexOf(cmd);
                        const Icon = cmd.icon;
                        const isModule = group === "Módulos";
                        return (
                          <button
                            key={cmd.type}
                            onClick={() => onSelect(cmd.type)}
                            onMouseEnter={() => setSelectedIdx(globalIdx)}
                            className={cn(
                              "w-full flex items-center gap-3 px-2.5 py-1.5 rounded-xl transition-colors text-left",
                              globalIdx === selectedIdx
                                ? "bg-accent"
                                : "hover:bg-accent/60",
                            )}
                          >
                            <div
                              className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                              style={
                                isModule && cmd.accent
                                  ? { background: `${cmd.accent}18` }
                                  : { background: "hsl(var(--muted) / 0.6)" }
                              }
                            >
                              <Icon
                                className="h-3.5 w-3.5"
                                style={
                                  isModule && cmd.accent
                                    ? { color: cmd.accent }
                                    : undefined
                                }
                              />
                            </div>
                            <p className="text-sm font-medium flex-1">
                              {cmd.label}
                            </p>
                            {cmd.shortcut && (
                              <kbd className="text-[10px] font-mono text-muted-foreground/50 bg-muted/60 px-1.5 py-0.5 rounded-md">
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
