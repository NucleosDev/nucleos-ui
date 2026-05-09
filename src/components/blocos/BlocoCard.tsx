// src/components/blocos/BlocoCard.tsx
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  ExternalLink,
  Copy,
  Trash2,
  Plus,
  Pencil,
  CheckSquare,
  CalendarDays,
  Activity,
  ListTodo,
  Timer,
  Layers,
  FileText,
  BookOpen,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CriarBlocoModal } from "@/components/blocos/CriarBlocoModal";
import { BlocoHoverActions } from "@/components/blocos/BlocoHoverActions";
import { cn } from "@/lib/utils";
import type { Bloco, CreateBlocoPayload } from "@/types/bloco";

import { ColecoesBlocoCard } from "@/components/blocos/cruds/ColecoesBlocoCard";
import { TarefasBlocoCard } from "@/components/blocos/cruds/TarefasBlocoCard";
import { ListasBlocoCard } from "@/components/blocos/cruds/ListasBlocoCard";
import { CalendarioBlocoCard } from "@/components/blocos/cruds/CalendarioBlocoCard";
import { TimersBlocoCard } from "@/components/blocos/cruds/TimersBlocoCard";
import { HabitosBlocoCard } from "@/components/blocos/cruds/HabitosBlocoCard";
import { BlocoDeNotas } from "@/components/blocos/cruds/BlocoDeNotas";

interface BlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onCreateBloco?: (payload: CreateBlocoPayload) => Promise<void>;
  isDeleting?: boolean;
  isCreating?: boolean;
  compact?: boolean;
  depth?: number;
  onEditTitle?: (titulo: string) => void;
  onAddBelow?: () => void;
}

const BLOCK_META: Record<
  string,
  {
    label: string;
    icon: React.ElementType;
    accent: string;
    accentBg: string;
    accentLight: string;
  }
> = {
  tarefas: {
    label: "Tarefas",
    icon: CheckSquare,
    accent: "#3b82f6",
    accentBg: "#eff6ff",
    accentLight: "#dbeafe",
  },
  calendario: {
    label: "Calendário",
    icon: CalendarDays,
    accent: "#6366f1",
    accentBg: "#eef2ff",
    accentLight: "#e0e7ff",
  },
  habitos: {
    label: "Hábitos",
    icon: Activity,
    accent: "#22c55e",
    accentBg: "#f0fdf4",
    accentLight: "#dcfce7",
  },
  habito: {
    label: "Hábito",
    icon: Activity,
    accent: "#22c55e",
    accentBg: "#f0fdf4",
    accentLight: "#dcfce7",
  },
  lista: {
    label: "Lista",
    icon: ListTodo,
    accent: "#06b6d4",
    accentBg: "#ecfeff",
    accentLight: "#cffafe",
  },
  timer: {
    label: "Timer",
    icon: Timer,
    accent: "#f97316",
    accentBg: "#fff7ed",
    accentLight: "#ffedd5",
  },
  timers: {
    label: "Timers",
    icon: Timer,
    accent: "#f97316",
    accentBg: "#fff7ed",
    accentLight: "#ffedd5",
  },
  colecoes: {
    label: "Base de Dados",
    icon: Layers,
    accent: "#10b981",
    accentBg: "#ecfdf5",
    accentLight: "#d1fae5",
  },
  notas: {
    label: "Notas",
    icon: BookOpen,
    accent: "#a855f7",
    accentBg: "#faf5ff",
    accentLight: "#f3e8ff",
  },
};

function renderContent(bloco: Bloco, nucleoId: string, onDelete: () => void) {
  const common = {
    bloco,
    nucleoId,
    onDelete,
    onEdit: () => {},
    isDeleting: false,
  };

  switch (bloco.tipo) {
    case "tarefas":
      return <TarefasBlocoCard {...common} />;
    case "calendario":
      return <CalendarioBlocoCard {...common} />;
    case "habitos":
    case "habito":
      return <HabitosBlocoCard {...common} />;
    case "lista":
      return <ListasBlocoCard {...common} />;
    case "timer":
    case "timers":
      return <TimersBlocoCard {...common} />;
    case "colecoes":
      return <ColecoesBlocoCard {...common} />;
    case "notas":
      return (
        <BlocoDeNotas bloco={bloco} nucleoId={nucleoId} onDelete={onDelete} />
      );
    default:
      return (
        <div className="py-12 px-6 text-center">
          <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground/50">
            Tipo de bloco não reconhecido: {bloco.tipo}
          </p>
        </div>
      );
  }
}

export function BlocoCard({
  bloco,
  nucleoId,
  onDelete,
  onEdit,
  onDuplicate,
  onCreateBloco,
  isDeleting = false,
  isCreating = false,
  compact = false, // Changed default to false for better UX
  depth = 0,
  onEditTitle,
  onAddBelow,
}: BlocoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(bloco.titulo || "");
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState<"sub" | "abaixo">("abaixo");
  const inputRef = useRef<HTMLInputElement>(null);

  const meta = BLOCK_META[bloco.tipo] ?? {
    label: bloco.tipo || "Bloco",
    icon: FileText,
    accent: "#6b7280",
    accentBg: "#f9fafb",
    accentLight: "#f3f4f6",
  };
  const IconComponent = meta.icon;
  const titulo = titleValue || meta.label;

  useEffect(() => {
    setTitleValue(bloco.titulo || "");
  }, [bloco.titulo]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const saveTitle = () => {
    setIsEditing(false);
    if (titleValue !== bloco.titulo && titleValue.trim() && onEditTitle) {
      onEditTitle(titleValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveTitle();
    }
    if (e.key === "Escape") {
      setTitleValue(bloco.titulo || "");
      setIsEditing(false);
    }
  };

  const handleCriar = async (payload: CreateBlocoPayload) => {
    if (onCreateBloco) {
      if (modalTipo === "sub") {
        await onCreateBloco({ ...payload, parentId: bloco.id });
      } else {
        await onCreateBloco({
          ...payload,
          posicao: (bloco.posicao || 0) + 1,
          parentId: bloco.parentId,
        });
      }
    }
    setModalCriarAberto(false);
  };

  // Determine max-width based on depth to prevent horizontal overflow
  const getMaxWidth = () => {
    const baseWidth = 100;
    const depthReduction = depth * 2;
    return `${baseWidth - depthReduction}%`;
  };

  return (
    <div className="w-full" style={{ maxWidth: getMaxWidth() }}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="group relative mb-4"
        style={{
          marginLeft: depth > 0 ? `${Math.min(depth * 24, 120)}px` : undefined,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Depth connector line - improved visibility */}
        {depth > 0 && (
          <div className="absolute left-[-20px] top-0 bottom-0 flex items-stretch">
            <span className="w-px bg-gradient-to-b from-border/60 via-border/40 to-transparent" />
            <span className="absolute left-[-6px] top-6 h-3 w-3 rounded-full border border-border/60 bg-background" />
          </div>
        )}

        {compact ? (
          /* ── Compact card (grid/list view) - IMPROVED SPACING ── */
          <div
            className={cn(
              "relative overflow-hidden",
              "rounded-xl border border-border/60 bg-card",
              "transition-all duration-200 ease-out",
              isHovered && "shadow-md border-border ring-1 ring-border/10",
              isDeleting && "opacity-50 pointer-events-none",
            )}
            style={{
              minHeight: "120px",
              background: `linear-gradient(135deg, ${meta.accentBg} 0%, var(--card) 100%)`,
            }}
          >
            {/* Accent left rail - more subtle */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 opacity-50 transition-opacity duration-200"
              style={{
                background: `linear-gradient(to bottom, ${meta.accent}, ${meta.accent}88)`,
              }}
            />

            {/* Clickable link overlay */}
            <Link
              href={`/dashboard/nucleos/${nucleoId}/blocos/${bloco.id}`}
              className="absolute inset-0 z-0 rounded-xl"
              aria-label={`Abrir ${titulo}`}
            />

            {/* Header - IMPROVED with more padding */}
            <div className="flex items-center gap-3 px-5 py-4 pl-6 relative z-10">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-sm"
                style={{ background: `${meta.accent}15` }}
              >
                <IconComponent
                  className="h-4.5 w-4.5"
                  style={{ color: meta.accent }}
                />
              </div>

              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    onBlur={saveTitle}
                    onKeyDown={handleKeyDown}
                    className="text-base font-semibold bg-white/50 rounded-md px-2 py-1 outline-none ring-1 ring-border w-full"
                    placeholder={meta.label}
                  />
                ) : (
                  <p
                    className={cn(
                      "text-base font-semibold text-foreground truncate",
                      onEditTitle &&
                        "cursor-text hover:text-primary/80 transition-colors",
                    )}
                    onClick={() => onEditTitle && setIsEditing(true)}
                    title={titulo}
                  >
                    {titulo}
                  </p>
                )}
                {/* Subtitle with block type */}
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  {meta.label}
                </p>
              </div>

              {/* Actions - always visible on compact */}
              <div className="relative z-10 flex items-center gap-1">
                {onAddBelow || onCreateBloco ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (onAddBelow) onAddBelow();
                      else {
                        setModalTipo("abaixo");
                        setModalCriarAberto(true);
                      }
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-accent/50 transition-all"
                    title="Adicionar abaixo"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                ) : null}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-accent/50 transition-all"
                      disabled={isDeleting}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {onEdit && (
                      <DropdownMenuItem
                        onClick={onEdit}
                        className="gap-2.5 py-2"
                      >
                        <ExternalLink className="h-4 w-4" /> Abrir em página
                        completa
                      </DropdownMenuItem>
                    )}
                    {onEditTitle && (
                      <DropdownMenuItem
                        onClick={() => setIsEditing(true)}
                        className="gap-2.5 py-2"
                      >
                        <Pencil className="h-4 w-4" /> Renomear
                      </DropdownMenuItem>
                    )}
                    {onDuplicate && (
                      <DropdownMenuItem
                        onClick={onDuplicate}
                        className="gap-2.5 py-2"
                      >
                        <Copy className="h-4 w-4" /> Duplicar
                      </DropdownMenuItem>
                    )}
                    {onCreateBloco && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setModalTipo("sub");
                            setModalCriarAberto(true);
                          }}
                          className="gap-2.5 py-2"
                        >
                          <Plus className="h-4 w-4" /> Adicionar sub-bloco
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete?.()}
                      className="gap-2.5 py-2 text-destructive focus:text-destructive"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                      {isDeleting ? "Excluindo…" : "Excluir"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Content preview - shows a mini version of the content */}
            <div className="px-6 pb-4 relative z-10 opacity-70">
              <div className="text-sm text-muted-foreground/60 line-clamp-2">
                {/* This would ideally show a preview of the block's content */}
                {bloco.tipo === "notas" && bloco.conteudo
                  ? bloco.conteudo.substring(0, 100) + "..."
                  : `Clique para abrir o bloco de ${meta.label.toLowerCase()}`}
              </div>
            </div>
          </div>
        ) : (
          /* ── Non-compact: document-native section card ── */
          <div className="relative">
            {/* Accent left rail */}
            <div
              className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full transition-all duration-[var(--duration-base)]"
              style={{
                background: `linear-gradient(to bottom, ${meta.accent}, ${meta.accent}33)`,
                opacity: isHovered ? 0.9 : 0.45,
              }}
            />

            {/* Hover actions */}
            <BlocoHoverActions
              bloco={bloco}
              nucleoId={nucleoId}
              onOpenFullPage={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onAddBelow={
                onAddBelow ||
                (() => {
                  setModalTipo("abaixo");
                  setModalCriarAberto(true);
                })
              }
              onEdit={() => setIsEditing(true)}
              isDeleting={isDeleting}
            />

            {/* Section header — glass, dark-mode safe */}
            <div
              className={cn(
                "flex items-center gap-2.5 pl-4 pr-2 py-2.5",
                "rounded-t-[var(--radius-lg)] border border-border/50",
                "backdrop-blur-sm transition-all duration-[var(--duration-base)]",
                isHovered && "border-border/80",
              )}
              style={{
                background: `linear-gradient(135deg, ${meta.accent}0d 0%, var(--surface-raised) 100%)`,
              }}
            >
              {/* Drag handle */}
              <div className="flex items-center justify-center h-4 w-4 text-muted-foreground/25 hover:text-muted-foreground/60 cursor-grab active:cursor-grabbing transition-colors shrink-0">
                <GripVertical className="h-3.5 w-3.5" />
              </div>

              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-[var(--duration-fast)]"
                style={{ background: `${meta.accent}15` }}
              >
                <IconComponent className="h-3.5 w-3.5" style={{ color: meta.accent }} />
              </div>

              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    onBlur={saveTitle}
                    onKeyDown={handleKeyDown}
                    className="text-sm font-semibold bg-transparent rounded-md px-1 py-0.5 outline-none ring-1 ring-primary/30 w-full"
                    placeholder={meta.label}
                  />
                ) : (
                  <p
                    className={cn(
                      "text-sm font-semibold text-foreground/90 truncate",
                      onEditTitle && "cursor-text hover:text-primary transition-colors duration-[var(--duration-fast)]",
                    )}
                    onClick={() => onEditTitle && setIsEditing(true)}
                    title={titulo}
                  >
                    {titulo}
                  </p>
                )}
              </div>

              {/* Collapse toggle */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-md shrink-0",
                  "text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent",
                  "transition-all duration-[var(--duration-fast)]",
                )}
              >
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-[var(--duration-fast)]",
                    isCollapsed && "-rotate-90",
                  )}
                />
              </button>
            </div>

            {/* Content */}
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-x border-b border-border/50 rounded-b-[var(--radius-lg)] bg-card/40 backdrop-blur-sm p-4">
                    {renderContent(bloco, nucleoId, () => onDelete?.())}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom action bar - appears on hover */}
            <AnimatePresence>
              {isHovered && !isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20"
                >
                  <div className="flex items-center gap-1 bg-background border border-border rounded-full shadow-lg px-2 py-1.5">
                    <button
                      onClick={() => {
                        setModalTipo("abaixo");
                        setModalCriarAberto(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                      title="Adicionar bloco abaixo"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Adicionar abaixo
                    </button>
                    <div className="w-px h-4 bg-border" />
                    <button
                      onClick={() => {
                        setModalTipo("sub");
                        setModalCriarAberto(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                      title="Adicionar sub-bloco"
                    >
                      <Layers className="h-3.5 w-3.5" />
                      Sub-bloco
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {onCreateBloco && (
        <CriarBlocoModal
          open={modalCriarAberto}
          onClose={() => setModalCriarAberto(false)}
          onConfirm={handleCriar}
          nucleoId={nucleoId}
          isCreating={isCreating}
          parentId={modalTipo === "sub" ? bloco.id : null}
        />
      )}
    </div>
  );
}
