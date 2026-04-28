"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCanvasBlocks } from "@/hooks/useCanvas";
import { UnifiedItem } from "@/components/canvas/UnifiedItem";
import type { CanvasItem, TextBlock } from "@/components/canvas/types";

const genId = () => crypto.randomUUID();

interface NucleoCanvasProps {
  nucleoId: string;
  onAddFunctionalBlock: () => void;
  isLoading?: boolean;
}

export function NucleoCanvas({
  nucleoId,
  onAddFunctionalBlock,
  isLoading,
}: NucleoCanvasProps) {
  const {
    items: saved,
    isLoading: canvasLoading,
    updateItems,
    isSaving,
  } = useCanvasBlocks(nucleoId);
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Sensors com suporte a teclado (acessibilidade)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (!initialized && !canvasLoading && !isLoading) {
      setItems(
        saved.length > 0
          ? saved
          : [{ id: genId(), type: "paragraph", content: "" }],
      );
      setInitialized(true);
    }
  }, [saved, canvasLoading, isLoading, initialized]);

  const save = useCallback(
    (next: CanvasItem[]) => {
      setItems(next);
      updateItems(next);
    },
    [updateItems],
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    save(next);
  };

  const handleUpdate = (id: string, content: string) =>
    save(
      items.map((i) =>
        i.id === id && i.type !== "functional" ? { ...i, content } : i,
      ),
    );

  const handleDelete = (id: string) => {
    if (items.length === 1) {
      const cur = items[0];
      if (cur.type !== "functional") save([{ ...cur, content: "" }]);
      return;
    }
    save(items.filter((i) => i.id !== id));
  };

  const handleAddBelow = (id: string) => {
    const idx = items.findIndex((i) => i.id === id);
    const block: TextBlock = { id: genId(), type: "paragraph", content: "" };
    const next = [...items];
    next.splice(idx + 1, 0, block);
    save(next);
    setActiveId(block.id);
  };

  if (canvasLoading || isLoading)
    return <Skeleton className="h-40 w-full rounded-xl" />;

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {items.map((item) => (
              <UnifiedItem
                key={item.id}
                item={item}
                isActive={activeId === item.id}
                onActivate={() => setActiveId(item.id)}
                onUpdate={(content) => handleUpdate(item.id, content)}
                onDelete={() => handleDelete(item.id)}
                onAddBelow={() => handleAddBelow(item.id)}
                onOpenFunctionalBlock={
                  item.type === "functional" ? onAddFunctionalBlock : undefined
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-2"
          onClick={() =>
            save([...items, { id: genId(), type: "paragraph", content: "" }])
          }
        >
          <Plus className="h-4 w-4" /> Adicionar texto
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground gap-2"
          onClick={onAddFunctionalBlock}
        >
          <Sparkles className="h-4 w-4" /> Inserir bloco funcional
        </Button>
      </div>

      {isSaving && (
        <p className="text-xs text-muted-foreground text-right">Salvando...</p>
      )}
    </div>
  );
}
