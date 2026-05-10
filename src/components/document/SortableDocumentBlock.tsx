// src/components/document/SortableDocumentBlock.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { GripVertical, Plus } from "lucide-react";
import type { DocumentBlock } from "./document-types";
import { useState } from "react";

interface SortableDocumentBlockProps {
  block: DocumentBlock;
  isSelected?: boolean;
  isActive?: boolean;
  onSelect: (blockId: string, e: React.MouseEvent) => void;
  onUpdate: (updates: Partial<DocumentBlock>) => void;
  onDelete: () => void;
  onAddBelow?: () => void;
  readOnly?: boolean;
  children?: React.ReactNode;
}

export function SortableDocumentBlock({
  block,
  isSelected = false,
  isActive = false,
  onSelect,
  onAddBelow,
  readOnly = false,
  children,
}: SortableDocumentBlockProps) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const showGutter = !readOnly && (isHovered || isActive) && !isDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group relative", isDragging && "z-50")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Indicador de seleção (barra esquerda azul) */}
      <div
        className={cn(
          "absolute left-0 inset-y-0 w-0.5 rounded-full transition-all duration-150",
          isSelected ? "bg-blue-500 opacity-100" : "opacity-0",
        )}
      />

      {/* Gutter: drag handle + add below (aparecem no hover, na margem esquerda) */}
      {!readOnly && (
        <div
          className={cn(
            "absolute right-full top-1/2 -translate-y-1/2 pr-1.5 flex items-center gap-0.5 transition-opacity duration-150",
            showGutter ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          {/* Adicionar bloco abaixo */}
          {onAddBelow && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddBelow();
              }}
              title="Adicionar bloco abaixo"
              className="flex h-6 w-6 items-center justify-center rounded hover:bg-accent text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Drag handle */}
          <div
            title="Arrastar para reordenar"
            className="flex h-6 w-6 items-center justify-center rounded hover:bg-accent cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground transition-colors touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </div>
        </div>
      )}

      {/* Conteúdo do bloco */}
      <div
        className={cn(
          "rounded-md px-1 py-0.5 transition-colors duration-100 cursor-text",
          isSelected
            ? "bg-blue-50/70 dark:bg-blue-950/30"
            : isActive
              ? "bg-accent/20"
              : "hover:bg-accent/10",
        )}
        onClick={(e) => onSelect(block.id, e)}
      >
        {children}
      </div>
    </div>
  );
}
