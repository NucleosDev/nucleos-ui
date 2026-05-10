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

// Headings get structural breathing room above them
const BLOCK_TOP_SPACING: Partial<Record<string, string>> = {
  h1: "mt-10 first:mt-0",
  h2: "mt-7  first:mt-0",
  h3: "mt-5  first:mt-0",
  divider: "my-6",
  header: "",
};

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
    opacity: isDragging ? 0.3 : 1,
  };

  const showGutter = !readOnly && (isHovered || isActive) && !isDragging;
  const topSpacing = BLOCK_TOP_SPACING[block.tipo] ?? "";
  const isFunctional =
    block.tipo !== "header" &&
    ![
      "paragraph",
      "h1",
      "h2",
      "h3",
      "bullet",
      "numbered",
      "quote",
      "callout",
      "code",
      "divider",
      "todo",
      "column-layout",
    ].includes(block.tipo);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group relative", topSpacing, isDragging && "z-50")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection rail — left edge, minimal */}
      {isSelected && (
        <div className="absolute left-0 inset-y-1 w-[2.5px] rounded-full bg-primary/50 -translate-x-1" />
      )}

      {/* Gutter — floats to the left, revealed on hover */}
      {!readOnly && block.tipo !== "header" && (
        <div
          className={cn(
            "absolute right-full top-1/2 -translate-y-1/2 pr-1.5",
            "flex items-center gap-0.5",
            "transition-opacity duration-[var(--duration-fast)]",
            showGutter ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          {/* Add below */}
          {onAddBelow && !isFunctional && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddBelow();
              }}
              title="Adicionar bloco"
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-md",
                "text-muted-foreground/30 hover:text-muted-foreground hover:bg-accent",
                "transition-colors duration-[var(--duration-fast)]",
              )}
            >
              <Plus className="h-3 w-3" />
            </button>
          )}

          {/* Drag handle */}
          <div
            title="Arrastar"
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-md cursor-grab active:cursor-grabbing",
              "text-muted-foreground/30 hover:text-muted-foreground hover:bg-accent",
              "transition-colors duration-[var(--duration-fast)] touch-none",
            )}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </div>
        </div>
      )}

      {/* Content wrapper */}
      <div
        className={cn(
          "rounded-md px-1 transition-colors duration-75",
          isSelected && "bg-primary/[0.035]",
        )}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (
            target.closest("[contenteditable]") ||
            target.closest(".ProseMirror")
          )
            return;
          onSelect(block.id, e);
        }}
      >
        {children}
      </div>
    </div>
  );
}
