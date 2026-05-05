// src/components/document/SelectionToolbar.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";

interface SelectionToolbarProps {
  selectedCount: number;
  onDelete: () => void;
  onClearSelection: () => void;
}

export function SelectionToolbar({
  selectedCount,
  onDelete,
  onClearSelection,
}: SelectionToolbarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="sticky top-20 z-40 flex justify-center mb-2"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-background border border-border rounded-xl shadow-lg">
            <span className="text-sm font-medium text-foreground">
              {selectedCount}{" "}
              {selectedCount === 1
                ? "bloco selecionado"
                : "blocos selecionados"}
            </span>

            <div className="w-px h-5 bg-border" />

            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Excluir
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-muted-foreground hover:text-foreground gap-1.5"
              onClick={onClearSelection}
            >
              <X className="h-3.5 w-3.5" />
              Limpar
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
