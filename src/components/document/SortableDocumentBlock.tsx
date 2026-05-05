// src/components/document/SortableDocumentBlock.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import type { DocumentBlock } from "./document-types";
import { useState } from "react";

interface SortableDocumentBlockProps {
  block: DocumentBlock;
  isSelected?: boolean;
  isActive?: boolean;
  onSelect: (blockId: string, e: React.MouseEvent) => void;
  onUpdate: (updates: Partial<DocumentBlock>) => void;
  onDelete: () => void;
  readOnly?: boolean;
  children?: React.ReactNode;
}

export function SortableDocumentBlock({
  block,
  isSelected = false,
  isActive = false,
  onSelect,
  onUpdate,
  onDelete,
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
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(block.id, e);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative transition-all duration-150",
        isDragging && "z-50",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Barra lateral sutil de seleção (esquerda) */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-0.5 rounded-full transition-all duration-200",
          isSelected ? "bg-blue-500 opacity-100" : "bg-transparent opacity-0",
        )}
      />

      {/* Drag handle + Checkbox flutuantes no topo (estilo Notion) */}
      {!readOnly && isHovered && !isDragging && (
        <div className="absolute -top-2 left-0 flex items-center gap-1 px-2 z-20">
          <div
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-accent transition-colors"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
          </div>

          {/* Checkbox de seleção clicável (seleciona/desseleciona) */}
          <button
            onClick={handleCheckboxClick}
            className={cn(
              "w-4 h-4 rounded border transition-all duration-150 flex items-center justify-center",
              isSelected
                ? "bg-blue-500 border-blue-500 hover:bg-blue-600"
                : "border-muted-foreground/30 hover:border-blue-400 bg-background",
            )}
            title={isSelected ? "Desselecionar" : "Selecionar"}
          >
            {isSelected && (
              <svg
                className="w-2.5 h-2.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Conteúdo do bloco */}
      <div
        className={cn(
          "px-2 py-1 rounded-lg transition-all duration-150",
          isSelected
            ? "bg-blue-50/70 dark:bg-blue-950/30"
            : "hover:bg-muted/40",
          isActive && "bg-blue-50 dark:bg-blue-950/30",
        )}
        onClick={(e) => onSelect(block.id, e)}
      >
        {children}
      </div>
    </div>
  );
}
