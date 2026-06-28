// src/components/canvas/UnifiedItem.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { TextBlockEditor } from "./TextBlockEditor";
import { FunctionalBlockPreview } from "./FunctionalBlockPreview";
import type { CanvasItem, TextBlock } from "./types";

interface UnifiedItemProps {
  item: CanvasItem;
  isActive: boolean;
  onActivate: () => void;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  onAddBelow: () => void;
  onOpenFunctionalBlock?: () => void;
  readOnly?: boolean;
}

export function UnifiedItem({
  item,
  isActive,
  onActivate,
  onUpdate,
  onDelete,
  onAddBelow,
  onOpenFunctionalBlock,
  readOnly = false,
}: UnifiedItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const isFunctional = item.type === "functional";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex items-start gap-2 py-1.5 rounded-lg transition-colors",
        isActive && "bg-muted/30",
      )}
      onClick={onActivate}
    >
      {!readOnly && (
        <div
          className={cn(
            "flex items-center gap-0.5 pt-1 transition-opacity",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-grab"
            {...listeners}
            {...attributes}
          >
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onAddBelow}
          >
            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      )}

      <div className="flex-1 min-w-0">
        {isFunctional ? (
          <FunctionalBlockPreview
            blockId={(item as any).blockId}
            blockType={(item as any).blockType}
            title={(item as any).title}
            onOpen={onOpenFunctionalBlock}
          />
        ) : (
          <TextBlockEditor
            block={item as TextBlock}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onAddBelow={onAddBelow}
            readOnly={readOnly}
          />
        )}
      </div>

      {!readOnly && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-6 w-6 transition-opacity",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      )}
    </div>
  );
}
