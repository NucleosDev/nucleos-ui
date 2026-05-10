"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GripVertical,
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
  ChevronRight,
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
import { LiquidGlass } from "@/components/ui/liquid-glass";
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
    color: string;
    bg: string;
    accent: string;
    tint: string;
    descricao: string;
  }
> = {
  tarefas: {
    label: "Tarefas",
    icon: CheckSquare,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    accent: "bg-blue-500",
    tint: "bg-blue-500/[0.04]",
    descricao: "Gerencie suas tarefas e projetos",
  },
  calendario: {
    label: "Calendário",
    icon: CalendarDays,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    accent: "bg-indigo-500",
    tint: "bg-indigo-500/[0.04]",
    descricao: "Visualize e organize eventos",
  },
  habitos: {
    label: "Hábitos",
    icon: Activity,
    color: "text-green-400",
    bg: "bg-green-500/10",
    accent: "bg-green-500",
    tint: "bg-green-500/[0.04]",
    descricao: "Acompanhe seus hábitos diários",
  },
  habito: {
    label: "Hábito",
    icon: Activity,
    color: "text-green-400",
    bg: "bg-green-500/10",
    accent: "bg-green-500",
    tint: "bg-green-500/[0.04]",
    descricao: "Monitore um hábito específico",
  },
  lista: {
    label: "Lista",
    icon: ListTodo,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    accent: "bg-cyan-500",
    tint: "bg-cyan-500/[0.04]",
    descricao: "Crie listas organizadas",
  },
  timer: {
    label: "Timer",
    icon: Timer,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    accent: "bg-orange-500",
    tint: "bg-orange-500/[0.04]",
    descricao: "Gerencie seu tempo com timers",
  },
  timers: {
    label: "Timers",
    icon: Timer,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    accent: "bg-orange-500",
    tint: "bg-orange-500/[0.04]",
    descricao: "Múltiplos timers para produtividade",
  },
  colecoes: {
    label: "Base de Dados",
    icon: Layers,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    accent: "bg-emerald-500",
    tint: "bg-emerald-500/[0.04]",
    descricao: "Crie bases de dados flexíveis",
  },
  notas: {
    label: "Notas",
    icon: BookOpen,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    accent: "bg-purple-500",
    tint: "bg-purple-500/[0.04]",
    descricao: "Anotações e lembretes",
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

  let content;
  switch (bloco.tipo) {
    case "tarefas":
      content = <TarefasBlocoCard {...common} />;
      break;
    case "calendario":
      content = <CalendarioBlocoCard {...common} />;
      break;
    case "habitos":
    case "habito":
      content = <HabitosBlocoCard {...common} />;
      break;
    case "lista":
      content = <ListasBlocoCard {...common} />;
      break;
    case "timer":
    case "timers":
      content = <TimersBlocoCard {...common} />;
      break;
    case "colecoes":
      content = <ColecoesBlocoCard {...common} />;
      break;
    case "notas":
      content = (
        <BlocoDeNotas bloco={bloco} nucleoId={nucleoId} onDelete={onDelete} />
      );
      break;
    default:
      content = (
        <div className="py-10 text-center">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-30 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{bloco.tipo}</p>
        </div>
      );
  }

  // 👈 Padding aplicado aqui - ajuste conforme necessário
  return <div className="px-5 pb-5 pt-2">{content}</div>;
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
  compact = true,
  depth = 0,
  onEditTitle,
  onAddBelow,
}: BlocoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(bloco.titulo || "");
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState<"sub" | "abaixo">("sub");
  const inputRef = useRef<HTMLInputElement>(null);

  const meta = BLOCK_META[bloco.tipo] ?? {
    label: bloco.tipo || "Bloco",
    icon: FileText,
    color: "text-muted-foreground",
    bg: "bg-white/5",
    accent: "bg-muted-foreground/40",
    tint: "",
    descricao: "",
  };

  const IconComponent = meta.icon;
  const tituloExibicao = titleValue || meta.label;

  useEffect(() => {
    setTitleValue(bloco.titulo || "");
  }, [bloco.titulo]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveTitle = () => {
    setIsEditing(false);
    if (titleValue !== bloco.titulo && titleValue.trim() && onEditTitle) {
      onEditTitle(titleValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveTitle();
    else if (e.key === "Escape") {
      setTitleValue(bloco.titulo || "");
      setIsEditing(false);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", bloco.id);
    e.dataTransfer.effectAllowed = "move";
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnd = () => setIsDragging(false);

  const handleOpenSubBlocoModal = () => {
    setModalTipo("sub");
    setModalCriarAberto(true);
  };

  const handleOpenAbaixoModal = () => {
    setModalTipo("abaixo");
    setModalCriarAberto(true);
  };

  const handleCriarBloco = async (payload: CreateBlocoPayload) => {
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

  const handleDelete = () => {
    if (onDelete) onDelete();
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="group relative my-2"
        style={{ marginLeft: depth > 0 ? `${depth * 24}px` : undefined }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Drag handle — floats left of the card */}
        <div
          className={cn(
            "absolute -left-8 top-1/2 -translate-y-1/2 z-20 transition-all duration-200",
            isHovered && !compact
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2",
          )}
        >
          <div
            className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-colors"
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            title="Arraste para reordenar"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground/60" />
          </div>
        </div>

        {/* Glass card */}
        <LiquidGlass
          variant={compact ? "interactive" : "subtle"}
          radius="16px"
          className={cn(
            "overflow-hidden transition-all duration-200",
            isDragging && "opacity-50 scale-[1.02] ring-2 ring-primary/50",
          )}
        >
          {/* Inner wrapper */}
          <div className={cn("relative", meta.tint)}>
            {/* Left accent strip */}
            <div
              className={cn(
                "absolute inset-y-0 left-0 w-[3px] rounded-r-full",
                meta.accent,
              )}
            />

            {/* Full-card link overlay (compact) */}
            {compact && (
              <Link
                href={`/dashboard/nucleos/${nucleoId}/blocos/${bloco.id}`}
                className="absolute inset-0 z-[1] rounded-[16px]"
                aria-label={`Abrir bloco ${tituloExibicao}`}
              />
            )}

            {/* Floating action bar (non-compact) */}
            {!compact && (
              <BlocoHoverActions
                bloco={bloco}
                nucleoId={nucleoId}
                onOpenFullPage={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onAddBelow={onAddBelow || handleOpenAbaixoModal}
                onEdit={() => setIsEditing(true)}
                isDeleting={isDeleting}
              />
            )}

            {/* Header row */}
            <div className="flex items-center gap-3 pl-6 pr-3 py-3.5">
              {/* Icon */}
              <div
                className={cn(
                  "flex items-center justify-center shrink-0 rounded-xl",
                  compact ? "w-8 h-8" : "w-10 h-10",
                  meta.bg,
                )}
              >
                <IconComponent
                  className={cn(compact ? "h-4 w-4" : "h-5 w-5", meta.color)}
                />
              </div>

              {/* Title + description */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    onBlur={handleSaveTitle}
                    onKeyDown={handleKeyDown}
                    className="font-semibold text-sm bg-white/5 border-b border-primary/50 outline-none w-full max-w-xs px-0 py-0.5 rounded"
                    placeholder={meta.label}
                  />
                ) : (
                  <h3
                    className={cn(
                      "font-semibold truncate leading-snug",
                      compact ? "text-sm" : "text-[15px]",
                      onEditTitle &&
                        "cursor-pointer hover:text-primary transition-colors",
                    )}
                    onClick={() => onEditTitle && setIsEditing(true)}
                    title={onEditTitle ? "Clique para editar" : undefined}
                  >
                    {tituloExibicao}
                  </h3>
                )}
                {!compact && meta.descricao && (
                  <p className="text-xs text-muted-foreground/60 truncate mt-0.5">
                    {meta.descricao}
                  </p>
                )}
              </div>

              {/* Right-side controls */}
              <div className="flex items-center gap-0.5 shrink-0 relative z-10">
                {/* Collapse toggle (non-compact) */}
                {!compact && (
                  <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-foreground hover:bg-white/10 transition-all"
                  >
                    {isCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                )}

                {/* Dropdown menu (compact) */}
                {compact && (
                  <div data-no-nav="true">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            "p-1.5 rounded-lg hover:bg-white/10 transition-all duration-200",
                            isHovered ? "opacity-100" : "opacity-0",
                          )}
                          disabled={isDeleting}
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground/60" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {onEdit && (
                          <DropdownMenuItem onClick={onEdit} className="gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Abrir em tela cheia
                          </DropdownMenuItem>
                        )}
                        {onEditTitle && (
                          <DropdownMenuItem
                            onClick={() => setIsEditing(true)}
                            className="gap-2"
                          >
                            <Pencil className="h-4 w-4" />
                            Editar título
                          </DropdownMenuItem>
                        )}
                        {onDuplicate && (
                          <DropdownMenuItem
                            onClick={onDuplicate}
                            className="gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                        )}
                        {onCreateBloco && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={handleOpenSubBlocoModal}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Adicionar sub-bloco
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={handleOpenAbaixoModal}
                              className="gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Adicionar abaixo
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleDelete}
                          className="gap-2 text-destructive focus:text-destructive"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                          {isDeleting ? "Excluindo..." : "Excluir"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                {/* Navigation chevron hint (compact) */}
                {compact && (
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-all duration-200",
                      isHovered
                        ? "text-muted-foreground/50 translate-x-0 opacity-100"
                        : "text-muted-foreground/20 -translate-x-1 opacity-0",
                    )}
                  />
                )}
              </div>
            </div>

            {/* Expandable content (non-compact) */}
            {!compact && (
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="h-px bg-white/10 mx-5" />
                    {renderContent(bloco, nucleoId, handleDelete)}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </LiquidGlass>

        {/* Floating "add below" button (compact mode) */}
        <AnimatePresence>
          {isHovered && compact && (onAddBelow || onCreateBloco) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 8 }}
              transition={{ duration: 0.15 }}
              onClick={onAddBelow || handleOpenAbaixoModal}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30"
            >
              <LiquidGlass
                variant="floating"
                radius="999px"
                interactive={false}
                className="p-1 shadow-md hover:shadow-lg transition-shadow"
              >
                <Plus className="h-3 w-3 text-muted-foreground/70" />
              </LiquidGlass>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modal de criação de bloco */}
      {onCreateBloco && (
        <CriarBlocoModal
          open={modalCriarAberto}
          onClose={() => setModalCriarAberto(false)}
          onConfirm={handleCriarBloco}
          nucleoId={nucleoId}
          isCreating={isCreating}
          parentId={modalTipo === "sub" ? bloco.id : null}
        />
      )}
    </>
  );
}
