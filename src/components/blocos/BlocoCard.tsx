// src/components/blocos/BlocoCard.tsx
"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GripVertical,
  CornerDownRight,
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
    gradient: string;
    descricao: string;
  }
> = {
  tarefas: {
    label: "Tarefas",
    icon: CheckSquare,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    gradient: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
    descricao: "Gerencie suas tarefas e projetos",
  },
  calendario: {
    label: "Calendário",
    icon: CalendarDays,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    gradient: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20",
    descricao: "Visualize e organize eventos",
  },
  habitos: {
    label: "Hábitos",
    icon: Activity,
    color: "text-green-500",
    bg: "bg-green-500/10",
    gradient: "from-green-500/10 to-green-500/5 border-green-500/20",
    descricao: "Acompanhe seus hábitos diários",
  },
  habito: {
    label: "Hábito",
    icon: Activity,
    color: "text-green-500",
    bg: "bg-green-500/10",
    gradient: "from-green-500/10 to-green-500/5 border-green-500/20",
    descricao: "Monitore um hábito específico",
  },
  lista: {
    label: "Lista",
    icon: ListTodo,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    gradient: "from-cyan-500/10 to-cyan-500/5 border-cyan-500/20",
    descricao: "Crie listas organizadas",
  },
  timer: {
    label: "Timer",
    icon: Timer,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    gradient: "from-orange-500/10 to-orange-500/5 border-orange-500/20",
    descricao: "Gerencie seu tempo com timers",
  },
  timers: {
    label: "Timers",
    icon: Timer,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    gradient: "from-orange-500/10 to-orange-500/5 border-orange-500/20",
    descricao: "Múltiplos timers para produtividade",
  },
  colecoes: {
    label: "Base de Dados",
    icon: Layers,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    gradient: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
    descricao: "Crie bases de dados flexíveis e veja como tabela ou cards",
  },
  notas: {
    label: "Notas",
    icon: BookOpen,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    gradient: "from-purple-500/10 to-purple-500/5 border-purple-500/20",
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
        <div className="py-8 text-center">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-40 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Bloco: {bloco.tipo}</p>
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

  const meta = BLOCK_META[bloco.tipo] || {
    label: bloco.tipo || "Bloco",
    icon: FileText,
    color: "text-muted-foreground",
    bg: "bg-muted/40",
    gradient: "from-muted/20 to-muted/10 border-border",
    descricao: "",
  };

  const IconComponent = meta.icon;
  const tituloExibicao = titleValue || meta.label; // ✅ Usa titleValue para refletir edições instantâneas

  // ✅ Sincroniza titleValue quando bloco.titulo muda externamente
  useEffect(() => {
    setTitleValue(bloco.titulo || "");
  }, [bloco.titulo]);

  // Foca o input ao entrar em modo de edição
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
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="group relative my-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Drag Handle externo */}
        <div
          className={cn(
            "absolute -left-8 top-1/2 -translate-y-1/2 transition-all duration-200 md:-left-10",
            isHovered
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-1",
            "z-10",
          )}
        >
          <div
            className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-accent/50 transition-colors"
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            title="Arraste para reordenar"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Card Principal */}
        <div
          className={cn(
            "relative rounded-xl border bg-card transition-all duration-200",
            meta.gradient,
            isDragging &&
              "opacity-50 shadow-lg ring-2 ring-primary scale-[1.02]",
            isHovered && "shadow-md border-border",
          )}
          style={{ marginLeft: depth > 0 ? `${depth * 24}px` : undefined }}
        >
          {/* Link para tela cheia (apenas no modo compacto) */}
          {compact && (
            <Link
              href={`/dashboard/nucleos/${nucleoId}/blocos/${bloco.id}`}
              className="absolute inset-0 z-0 rounded-xl"
              aria-label={`Abrir bloco ${tituloExibicao}`}
            />
          )}

          {/* BlocoHoverActions no topo direito (modo não-compacto) */}
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

          {/* Header do card */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {depth > 0 && (
                  <CornerDownRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                )}

                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 blur-sm" />
                  <div className={cn("relative rounded-lg p-2", meta.bg)}>
                    <IconComponent className={cn("h-4 w-4", meta.color)} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={titleValue}
                      onChange={(e) => setTitleValue(e.target.value)}
                      onBlur={handleSaveTitle}
                      onKeyDown={handleKeyDown}
                      className="font-semibold text-sm md:text-base bg-transparent border-b border-primary outline-none w-full max-w-[300px] px-0 py-0.5"
                      placeholder={meta.label}
                    />
                  ) : (
                    <h3
                      className={cn(
                        "font-semibold truncate",
                        compact ? "text-sm" : "text-base",
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
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {meta.descricao}
                    </p>
                  )}
                </div>
              </div>

              {/* Menu dropdown (modo compacto) */}
              {compact && (
                <div className="relative z-10 shrink-0" data-no-nav="true">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={cn(
                          "p-1.5 rounded-lg transition-all duration-200 hover:bg-accent/50",
                          isHovered ? "opacity-100" : "opacity-0",
                        )}
                        disabled={isDeleting}
                      >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {onEdit && (
                        <DropdownMenuItem onClick={onEdit} className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          <span>Abrir em tela cheia</span>
                        </DropdownMenuItem>
                      )}
                      {onEditTitle && (
                        <DropdownMenuItem
                          onClick={() => setIsEditing(true)}
                          className="gap-2"
                        >
                          <Pencil className="h-4 w-4" />
                          <span>Editar título</span>
                        </DropdownMenuItem>
                      )}
                      {onDuplicate && (
                        <DropdownMenuItem
                          onClick={onDuplicate}
                          className="gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          <span>Duplicar</span>
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
                            <span>Adicionar sub-bloco</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={handleOpenAbaixoModal}
                            className="gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            <span>Adicionar abaixo</span>
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
                        <span>{isDeleting ? "Excluindo..." : "Excluir"}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Controles de expansão (modo não-compacto) */}
            {!compact && (
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                  <span>
                    {isCollapsed ? "Expandir conteúdo" : "Recolher conteúdo"}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Conteúdo expansível (apenas modo não-compacto) */}
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
                  <div>{renderContent(bloco, nucleoId, handleDelete)}</div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Botão "+" flutuante inferior (modo compacto) */}
        <AnimatePresence>
          {isHovered && compact && (onAddBelow || onCreateBloco) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.15 }}
              onClick={onAddBelow || handleOpenAbaixoModal}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20"
            >
              <div className="bg-background border border-border rounded-full shadow-md hover:shadow-lg transition-shadow">
                <div className="p-1">
                  <Plus className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
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
