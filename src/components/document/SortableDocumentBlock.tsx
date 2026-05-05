// src/components/document/SortableDocumentBlock.tsx
"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  GripVertical, Trash2, Copy, MoreHorizontal, Plus,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DocumentBlock } from "./document-types";

interface SortableDocumentBlockProps {
  block: DocumentBlock;
  isActive: boolean;
  onActivate: () => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  children: React.ReactNode;
  readOnly?: boolean;
}

export function SortableDocumentBlock({
  block,
  isActive,
  onActivate,
  onDelete,
  onDuplicate,
  children,
  readOnly = false,
}: SortableDocumentBlockProps) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    disabled: block.tipo === "header",
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isHeader = block.tipo === "header";
  const showActions = !isHeader && !readOnly && (isHovered || isActive);

  if (isHeader) {
    return <div ref={setNodeRef} style={style}>{children}</div>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative",
        isDragging && "opacity-40 z-50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative flex items-start gap-0 rounded-lg transition-colors duration-100",
          isActive && !isHeader && "bg-muted/30",
        )}
        onClick={onActivate}
      >
        {/* Coluna esquerda — handle + botão + */}
        <div
          className={cn(
            "flex flex-col items-center gap-0.5 pt-[5px] w-10 flex-shrink-0 transition-opacity duration-150",
            showActions ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Drag handle */}
          <button
            className="p-1 rounded cursor-grab active:cursor-grabbing hover:bg-accent transition-colors"
            title="Arrastar"
            {...listeners}
            {...attributes}
          >
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground/60" />
          </button>

          {/* Menu de ações via 3-pontos */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-1 rounded hover:bg-accent transition-colors"
                title="Mais ações"
              >
                <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground/60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right" className="w-44">
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(block.id)}>
                  <Copy className="mr-2 h-3.5 w-3.5" />
                  Duplicar
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(block.id)}
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Excluir bloco
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Conteúdo do bloco */}
        <div className="flex-1 min-w-0 pr-2">
          {children}
        </div>
      </div>
    </div>
  );
}
