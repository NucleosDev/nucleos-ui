
export type DocumentBlockType = 
  | "paragraph" | "h1" | "h2" | "h3" | "quote" | "code" 
  | "bullet-list" | "numbered-list" | "todo" | "divider" | "header"
  | "tarefas" | "calendario" | "habitos" | "habito" | "lista" | "timer" | "timers" | "colecoes" | "notas";

export interface DocumentBlock {
  id: string;
  nucleoId: string;
  tipo: DocumentBlockType;
  conteudo?: string;
  titulo?: string;
  posicao: number;
  isDeletable?: boolean;
  completed?: boolean;
  blocoRef?: any;
}

export interface NucleoDocumentState {
  blocks: DocumentBlock[];
  selectedIds: Set<string>;
  activeBlockId: string | null;
}

// "use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SortableDocumentBlock } from "./SortableDocumentBlock";
import { SelectionToolbar } from "./SelectionToolbar";
import type { DocumentBlock, DocumentBlockType } from "./document-types";

const genId = () => crypto.randomUUID();

const FUNCTIONAL_TYPES = new Set([
  "tarefas", "calendario", "habitos", "habito",
  "lista", "timer", "timers", "colecoes", "notas",
]);

function isFunctional(tipo: string) {
  return FUNCTIONAL_TYPES.has(tipo);
}

interface NucleoDocumentProps {
  nucleoId: string;
  readOnly?: boolean;
  fullWidth?: boolean;
  blocks: DocumentBlock[];
  onUpdateBlock: (id: string, updates: Partial<DocumentBlock>) => void;
  onDeleteBlock: (id: string) => void;
  onAddBlock: (tipo: DocumentBlockType, afterId?: string) => void;
  isLoading?: boolean;
}

export function NucleoDocument({
  nucleoId,
  readOnly = false,
  fullWidth = false,
  blocks,
  onUpdateBlock,
  onDeleteBlock,
  onAddBlock,
  isLoading = false,
}: NucleoDocumentProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [draggingBlock, setDraggingBlock] = useState<DocumentBlock | null>(null);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Multi-select handlers
  const handleBlockClick = useCallback((blockId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd + Click: Toggle seleção individual
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(blockId)) {
          next.delete(blockId);
        } else {
          next.add(blockId);
        }
        return next;
      });
    } else if (e.shiftKey && lastSelectedId) {
      // Shift + Click: Seleção por range
      const startIdx = blocks.findIndex((b) => b.id === lastSelectedId);
      const endIdx = blocks.findIndex((b) => b.id === blockId);
      const [min, max] = startIdx < endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
      const rangeIds = blocks.slice(min, max + 1).map((b) => b.id);
      setSelectedIds(new Set(rangeIds));
    } else {
      // Click normal: Seleção única
      setSelectedIds(new Set([blockId]));
      setActiveBlockId(blockId);
    }
    setLastSelectedId(blockId);
  }, [blocks, lastSelectedId]);

  // Delete múltiplos blocos selecionados
  const handleDeleteSelected = useCallback(() => {
    selectedIds.forEach((id) => onDeleteBlock(id));
    setSelectedIds(new Set());
  }, [selectedIds, onDeleteBlock]);

  // Deselecionar ao clicar no vazio
  const handleContainerClick = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIds(new Set());
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        const allBlockIds = blocks
          .filter((b) => b.tipo !== "header")
          .map((b) => b.id);
        setSelectedIds(new Set(allBlockIds));
      }
      if (e.key === "Delete" && selectedIds.size > 0) {
        e.preventDefault();
        handleDeleteSelected();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [blocks, selectedIds, handleDeleteSelected]);

  // Loading
  if (isLoading) {
    return (
      <div className={cn("mx-auto px-4 py-8 space-y-3", fullWidth ? "max-w-full" : "max-w-3xl")}>
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-8 w-2/3 rounded-lg" />
        <Skeleton className="h-5 w-full rounded" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-background relative"
      onClick={handleContainerClick}
      ref={containerRef}
    >
      {/* Toolbar de seleção múltipla */}
      {selectedIds.size > 0 && (
        <SelectionToolbar
          selectedCount={selectedIds.size}
          onDelete={handleDeleteSelected}
          onClearSelection={() => setSelectedIds(new Set())}
        />
      )}

      <div className={cn("mx-auto px-0 pb-32", fullWidth ? "max-w-full" : "max-w-3xl")}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={({ active }) => {
            const block = blocks.find((b) => b.id === active.id);
            if (block) setDraggingBlock(block);
          }}
          onDragEnd={({ active, over }) => {
            setDraggingBlock(null);
            if (!over || active.id === over.id) return;

            const fromIdx = blocks.findIndex((b) => b.id === active.id);
            const toIdx = blocks.findIndex((b) => b.id === over.id);

            const newBlocks = [...blocks];
            const [moved] = newBlocks.splice(fromIdx, 1);
            newBlocks.splice(toIdx, 0, moved);

            newBlocks.forEach((b, i) => {
              if (b.posicao !== i) onUpdateBlock(b.id, { posicao: i });
            });
          }}
        >
          <SortableContext
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-0">
              {blocks.map((block) => (
                <SortableDocumentBlock
                  key={block.id}
                  block={block}
                  isSelected={selectedIds.has(block.id)}
                  isActive={activeBlockId === block.id}
                  onSelect={handleBlockClick}
                  onUpdate={(updates) => onUpdateBlock(block.id, updates)}
                  onDelete={() => onDeleteBlock(block.id)}
                  readOnly={readOnly}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {draggingBlock && (
              <div className="rounded-lg border border-primary/30 bg-card/80 backdrop-blur px-4 py-2 shadow-xl opacity-90">
                <span className="text-sm text-muted-foreground">
                  {draggingBlock.titulo || draggingBlock.conteudo || draggingBlock.tipo}
                </span>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
 //
"use client";

import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed top-20 left-1/2 z-50 -translate-x-1/2"
    >
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg",
        "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
      )}>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {selectedCount} {selectedCount === 1 ? "bloco" : "blocos"} selecionado{selectedCount === 1 ? "" : "s"}
        </span>

        <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />

        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950 gap-2"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          Deletar
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 gap-2"
          onClick={onClearSelection}
        >
          <X className="h-4 w-4" />
          Limpar
        </Button>
      </div>
    </motion.div>
  );
}
//

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { GripVertical, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DocumentBlock } from "./document-types";

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative py-1 transition-all duration-200",
        isSelected && "bg-blue-50 dark:bg-blue-950/20 rounded-lg",
        isActive && "ring-2 ring-blue-400 dark:ring-blue-600 rounded-lg"
      )}
      onClick={(e) => onSelect(block.id, e)}
    >
      <div className="flex items-start gap-2 px-2">
        {/* Drag handle & checkbox */}
        <div className="flex items-center gap-1 pt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <div
            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4 text-slate-400" />
          </div>

          {/* Selection checkbox */}
          <div
            className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors",
              isSelected
                ? "bg-blue-600 border-blue-600"
                : "border-slate-300 dark:border-slate-600 hover:border-blue-400"
            )}
          >
            {isSelected && (
              <span className="text-white text-xs font-bold">✓</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* Actions */}
        {!readOnly && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
              onClick={(e) => {
                e.stopPropagation();
                // Duplicate logic would go here
              }}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
