"use client";

import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Trash2 } from "lucide-react";

interface CanvasDividerProps {
  onAddBelow?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export function CanvasDivider({
  onAddBelow,
  onDelete,
  onClick,
}: CanvasDividerProps) {
  return (
    <div className="group relative py-2 cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-3">
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          {onAddBelow && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                onAddBelow();
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>
        <div className="flex-1 border-t border-border" />
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3 text-muted-foreground" />
          </Button>
        )}
      </div>
    </div>
  );
}
