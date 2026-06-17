"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus, GripVertical, Pencil, Trash2, CornerDownRight,
  ChevronRight, ChevronDown, Type, Copy, MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconBtn = "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-accent transition-colors";
const smIconBtn = "flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-accent transition-colors";

// ── Hover actions for functional blocks ──────────────────────────────────────
interface BlockHoverActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onAddSubBloco?: () => void;
  onDuplicate?: () => void;
  isVisible?: boolean;
  className?: string;
}

export function BlockHoverActions({
  onEdit, onDelete, onAddSubBloco, onDuplicate, isVisible = false, className,
}: BlockHoverActionsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 bg-popover border border-border/50 rounded-lg shadow-[var(--shadow-sm)] p-0.5 transition-all duration-150",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none",
        className,
      )}
    >
      {onEdit && (
        <button className={iconBtn} onClick={onEdit} title="Editar">
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}
      {onAddSubBloco && (
        <button className={iconBtn} onClick={onAddSubBloco} title="Adicionar sub-bloco">
          <CornerDownRight className="h-3.5 w-3.5" />
        </button>
      )}
      {onDuplicate && (
        <button className={iconBtn} onClick={onDuplicate} title="Duplicar">
          <Copy className="h-3.5 w-3.5" />
        </button>
      )}
      {(onEdit || onAddSubBloco || onDuplicate) && onDelete && (
        <div className="mx-0.5 h-4 w-px bg-border/60" />
      )}
      {onDelete && (
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={onDelete}
          title="Excluir"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// ── Drag handle + add-below ───────────────────────────────────────────────────
interface DragHandleProps {
  onAddBelow?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  isVisible?: boolean;
  className?: string;
}

export function DragHandle({ onAddBelow, onDragStart, isVisible = false, className }: DragHandleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 pt-1 transition-opacity",
        isVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        className,
      )}
    >
      <button
        className={cn(smIconBtn, "cursor-grab active:cursor-grabbing")}
        draggable
        onDragStart={onDragStart}
        title="Arrastar para reordenar"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      {onAddBelow && (
        <button className={smIconBtn} onClick={onAddBelow} title="Adicionar abaixo">
          <Plus className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// ── Expand/collapse toggle ────────────────────────────────────────────────────
interface ExpandCollapseButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
  isVisible?: boolean;
  className?: string;
}

export function ExpandCollapseButton({ isExpanded, onToggle, isVisible = false, className }: ExpandCollapseButtonProps) {
  return (
    <div className={cn("flex items-center gap-1 transition-opacity", isVisible ? "opacity-100" : "opacity-0", className)}>
      <button className={smIconBtn} onClick={onToggle} title={isExpanded ? "Colapsar" : "Expandir"}>
        {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

// ── Text format menu ──────────────────────────────────────────────────────────
interface TextFormatMenuProps {
  onTypeChange: (type: string) => void;
  onDelete: () => void;
  formatCommands: { type: string; label: string; icon: React.ComponentType<{ className?: string }> }[];
  isVisible?: boolean;
  className?: string;
}

export function TextFormatMenu({ onTypeChange, onDelete, formatCommands, isVisible = false, className }: TextFormatMenuProps) {
  if (!isVisible) return null;
  return (
    <div className={cn("flex items-center gap-0.5 bg-popover border border-border/50 rounded-lg shadow-[var(--shadow-sm)] p-0.5 z-50", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={iconBtn} title="Tipo de texto">
            <Type className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48 text-sm">
          {formatCommands
            .filter((c) => c.type !== "divider")
            .map((cmd) => {
              const Icon = cmd.icon;
              return (
                <DropdownMenuItem key={cmd.type} onClick={() => onTypeChange(cmd.type)} className="gap-2">
                  <Icon className="h-3.5 w-3.5" />
                  {cmd.label}
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="mx-0.5 h-4 w-px bg-border/60" />

      <button
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
        onClick={onDelete}
        title="Excluir"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ── Six-dot drag icon ─────────────────────────────────────────────────────────
export function DragDotsIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="9"  cy="6"  r="1.5" />
      <circle cx="9"  cy="12" r="1.5" />
      <circle cx="9"  cy="18" r="1.5" />
      <circle cx="15" cy="6"  r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

// ── More-actions dropdown (⋯) ─────────────────────────────────────────────────
interface MoreActionsMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onAddBelow?: () => void;
  onAddSubBloco?: () => void;
  onOpenFullScreen?: () => void;
  isDeleting?: boolean;
  compact?: boolean;
  className?: string;
}

export function MoreActionsMenu({
  onEdit, onDelete, onDuplicate, onAddBelow, onAddSubBloco, onOpenFullScreen,
  isDeleting = false, compact = true, className,
}: MoreActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(iconBtn, "h-8 w-8", className)}
          disabled={isDeleting}
          title="Mais ações"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 text-sm">
        {compact && onOpenFullScreen && (
          <DropdownMenuItem onClick={onOpenFullScreen} className="gap-2">
            <ExternalLink className="h-3.5 w-3.5" /> Abrir em tela cheia
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit} className="gap-2">
            <Pencil className="h-3.5 w-3.5" /> Editar
          </DropdownMenuItem>
        )}
        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate} className="gap-2">
            <Copy className="h-3.5 w-3.5" /> Duplicar
          </DropdownMenuItem>
        )}
        {onAddSubBloco && (
          <DropdownMenuItem onClick={onAddSubBloco} className="gap-2">
            <CornerDownRight className="h-3.5 w-3.5" /> Adicionar sub-bloco
          </DropdownMenuItem>
        )}
        {onAddBelow && (
          <DropdownMenuItem onClick={onAddBelow} className="gap-2">
            <Plus className="h-3.5 w-3.5" /> Adicionar bloco abaixo
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            <div className="my-1 h-px bg-border/60" />
            <DropdownMenuItem
              onClick={onDelete}
              disabled={isDeleting}
              className="gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {isDeleting ? "Excluindo..." : "Excluir"}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
