"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  CornerDownRight,
  ChevronRight,
  ChevronDown,
  Type,
  Copy,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";


// ============ Ações de hover para blocos funcionais ============
interface BlockHoverActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onAddSubBloco?: () => void;
  onDuplicate?: () => void;
  isVisible?: boolean;
  className?: string;
}

export function BlockHoverActions({
  onEdit,
  onDelete,
  onAddSubBloco,
  onDuplicate,
  isVisible = false,
  className,
}: BlockHoverActionsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 bg-popover border rounded-lg shadow-sm p-1 transition-all duration-200",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
        className,
      )}
    >
      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onEdit}
          title="Editar"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      )}

      {onAddSubBloco && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onAddSubBloco}
          title="Adicionar sub-bloco"
        >
          <CornerDownRight className="h-3.5 w-3.5" />
        </Button>
      )}

      {onDuplicate && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onDuplicate}
          title="Duplicar"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      )}

      {(onEdit || onAddSubBloco || onDuplicate) && onDelete && (
        <div className="w-px h-4 bg-border mx-0.5" />
      )}

      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={onDelete}
          title="Excluir"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

// ============ Ações de arraste (6 pontinhos + botão +) ============
interface DragHandleProps {
  onAddBelow?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  isVisible?: boolean;
  className?: string;
}

export function DragHandle({
  onAddBelow,
  onDragStart,
  isVisible = false,
  className,
}: DragHandleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 pt-1 transition-opacity",
        isVisible ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 cursor-grab active:cursor-grabbing"
        draggable
        onDragStart={onDragStart}
        title="Arrastar para reordenar"
      >
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>

      {onAddBelow && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onAddBelow}
          title="Adicionar abaixo"
        >
          <Plus className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
}

// ============ Botão expandir/colapsar (para nesting) ============
interface ExpandCollapseButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
  isVisible?: boolean;
  className?: string;
}

export function ExpandCollapseButton({
  isExpanded,
  onToggle,
  isVisible = false,
  className,
}: ExpandCollapseButtonProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 transition-opacity",
        isVisible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={onToggle}
        title={isExpanded ? "Colapsar" : "Expandir"}
      >
        {isExpanded ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
}

// ============ Menu de formatação de texto (aparece ao focar/digitar) ============
interface TextFormatMenuProps {
  onTypeChange: (type: string) => void;
  onDelete: () => void;
  formatCommands: {
    type: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  isVisible?: boolean;
  className?: string;
}

export function TextFormatMenu({
  onTypeChange,
  onDelete,
  formatCommands,
  isVisible = false,
  className,
}: TextFormatMenuProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1 bg-popover border rounded-lg shadow-lg p-1 z-50",
        className,
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            title="Tipo de texto"
          >
            <Type className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {formatCommands
            .filter((c) => c.type !== "divider")
            .map((cmd) => {
              const Icon = cmd.icon;
              return (
                <DropdownMenuItem
                  key={cmd.type}
                  onClick={() => onTypeChange(cmd.type)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{cmd.label}</span>
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-4 bg-border mx-1" />

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-destructive hover:text-destructive"
        onClick={onDelete}
        title="Excluir"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

// ============ Ícone de 6 pontinhos para drag (SVG inline) ============
export function DragDotsIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <circle cx="9" cy="6" r="1.5" fill="currentColor" />
      <circle cx="9" cy="12" r="1.5" fill="currentColor" />
      <circle cx="9" cy="18" r="1.5" fill="currentColor" />
      <circle cx="15" cy="6" r="1.5" fill="currentColor" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" />
      <circle cx="15" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

// ============ Menu de ações estilo Notion (3 pontinhos) ============
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
  onEdit,
  onDelete,
  onDuplicate,
  onAddBelow,
  onAddSubBloco,
  onOpenFullScreen,
  isDeleting = false,
  compact = true,
  className,
}: MoreActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", className)}
          disabled={isDeleting}
          title="Mais ações"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {compact && onOpenFullScreen && (
          <DropdownMenuItem onClick={onOpenFullScreen}>
            <ExternalLinkIcon className="mr-2 h-4 w-4" />
            Abrir em tela cheia
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
        )}
        {onDuplicate && (
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicar
          </DropdownMenuItem>
        )}
        {onAddSubBloco && (
          <DropdownMenuItem onClick={onAddSubBloco}>
            <CornerDownRight className="mr-2 h-4 w-4" />
            Adicionar sub-bloco
          </DropdownMenuItem>
        )}
        {onAddBelow && (
          <DropdownMenuItem onClick={onAddBelow}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar bloco abaixo
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            <div className="h-px bg-border my-1" />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive"
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Excluindo..." : "Excluir"}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Ícone inline para ExternalLink (evita import extra)
function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
