"use client";

import { Plus, GripVertical, Trash2 } from "lucide-react";

interface CanvasDividerProps {
  onAddBelow?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export function CanvasDivider({ onAddBelow, onDelete, onClick }: CanvasDividerProps) {
  return (
    <div className="group relative py-2 cursor-pointer" onClick={onClick}>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {onAddBelow && (
            <button
              onClick={(e) => { e.stopPropagation(); onAddBelow(); }}
              className="flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground/50 hover:text-muted-foreground hover:bg-accent transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          )}
          <GripVertical className="h-3 w-3 text-muted-foreground/40" />
        </div>
        <div className="flex-1 border-t border-border/50" />
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground/30 opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
