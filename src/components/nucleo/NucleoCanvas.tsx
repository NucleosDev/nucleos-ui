"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code2,
  List,
  CheckSquare,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCanvasBlocks } from "@/hooks/useCanvas";
import type {
  CanvasItem,
  TextBlock,
  TextBlockType,
} from "@/components/canvas/types";

const genId = () => crypto.randomUUID();

interface NucleoCanvasProps {
  nucleoId: string;
  onAddFunctionalBlock?: () => void; // ← opcional agora
  isLoading?: boolean;
}

const BLOCK_TYPES: {
  type: TextBlockType;
  label: string;
  icon: React.ElementType;
}[] = [
  { type: "paragraph", label: "Parágrafo", icon: Type },
  { type: "h1", label: "Título 1", icon: Heading1 },
  { type: "h2", label: "Título 2", icon: Heading2 },
  { type: "h3", label: "Título 3", icon: Heading3 },
  { type: "quote", label: "Citação", icon: Quote },
  { type: "code", label: "Código", icon: Code2 },
  { type: "bullet-list", label: "Lista", icon: List },
  { type: "todo", label: "Checklist", icon: CheckSquare },
];

export function NucleoCanvas({
  nucleoId,
  isLoading,
  onAddFunctionalBlock,
}: NucleoCanvasProps) {
  const {
    items: saved,
    isLoading: canvasLoading,
    updateItems,
    isSaving,
  } = useCanvasBlocks(nucleoId);

  const [items, setItems] = useState<CanvasItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  useEffect(() => {
    if (!initialized && !canvasLoading && !isLoading) {
      const textOnly = saved.filter((i) => i.type !== "functional");
      setItems(
        textOnly.length > 0
          ? textOnly
          : [
              {
                id: genId(),
                type: "paragraph" as TextBlockType,
                content: "",
                x: 120,
                y: 80,
              },
            ],
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;
    const delta = (event as DragEndEvent & { delta: { x: number; y: number } })
      .delta;
    if (!delta) return;

    save(
      items.map(
        (item): CanvasItem =>
          item.id === active.id
            ? {
                ...item,
                x: (item.x ?? 0) + delta.x,
                y: (item.y ?? 0) + delta.y,
              }
            : item,
      ),
    );
  };

  const handleUpdate = (id: string, content: string) =>
    save(
      items.map((i) =>
        i.id === id && i.type !== "functional" ? { ...i, content } : i,
      ),
    );

  const handleDelete = (id: string) => {
    if (items.length <= 1) return;
    save(items.filter((i) => i.id !== id));
  };

  const handleAddBlock = (type: TextBlockType) => {
    const canvas = canvasRef.current;
    const cx = canvas ? canvas.clientWidth / 2 - 150 : 200;
    const cy = canvas ? canvas.clientHeight / 2 - 40 : 200;

    const block: TextBlock = {
      id: genId(),
      type,
      content: "",
      x: cx + Math.random() * 40 - 20,
      y: cy + Math.random() * 40 - 20,
    };
    save([...items, block]);
    setShowAddMenu(false);
  };

  if (canvasLoading || isLoading)
    return <Skeleton className="h-full w-full rounded-none" />;

  return (
    <div
      className="relative w-full h-full bg-muted/10 overflow-hidden"
      ref={canvasRef}
      onClick={() => setShowAddMenu(false)}
    >
      {/* Grid de pontos */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--muted-foreground) / 0.15) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {items.map((item) => {
          if (item.type === "functional") return null;
          return (
            <CanvasTextBlock
              key={item.id}
              item={item as TextBlock}
              onUpdate={(content) => handleUpdate(item.id, content)}
              onDelete={() => handleDelete(item.id)}
            />
          );
        })}
      </DndContext>

      {/* Botão + flutuante */}
      <div
        className="absolute bottom-8 right-8 flex flex-col items-end gap-2 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {showAddMenu && (
          <div className="bg-popover border rounded-xl shadow-2xl p-2 flex flex-col gap-1 min-w-[180px]">
            {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => handleAddBlock(type)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent text-sm text-left transition-colors"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </button>
            ))}
          </div>
        )}
        <Button
          size="icon"
          className="rounded-full h-12 w-12 shadow-xl"
          onClick={() => setShowAddMenu((v) => !v)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {isSaving && (
        <div className="absolute top-4 right-4 text-xs text-muted-foreground bg-background/80 px-3 py-1 rounded-full border">
          Salvando...
        </div>
      )}
    </div>
  );
}

/* ================================ */
/*  Bloco arrastável no canvas      */
/* ================================ */

interface CanvasTextBlockProps {
  item: TextBlock;
  onUpdate: (content: string) => void;
  onDelete: () => void;
}

function CanvasTextBlock({ item, onUpdate, onDelete }: CanvasTextBlockProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
    });

  const x = (item.x ?? 0) + (transform?.x ?? 0);
  const y = (item.y ?? 0) + (transform?.y ?? 0);

  const typeClasses: Record<TextBlockType, string> = {
    h1: "text-3xl font-bold",
    h2: "text-2xl font-semibold",
    h3: "text-xl font-medium",
    paragraph: "text-base",
    quote: "border-l-4 border-primary pl-3 italic text-muted-foreground",
    code: "font-mono text-sm bg-muted px-3 py-1 rounded",
    divider: "",
    "bullet-list": "text-base",
    "numbered-list": "text-base",
    todo: "text-base",
  };

  if (item.type === "divider") {
    return (
      <div
        ref={setNodeRef}
        className="absolute"
        style={{ transform: `translate(${x}px, ${y}px)`, width: 300 }}
      >
        <div className="border-t border-border" />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className="absolute group"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 100 : 1,
        minWidth: 200,
        maxWidth: 500,
      }}
    >
      <div className="relative bg-background/80 backdrop-blur-sm border rounded-xl shadow-sm hover:shadow-md transition-shadow">
        {/* Drag handle */}
        <div
          {...listeners}
          {...attributes}
          className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-background border rounded-full px-2 py-0.5 flex gap-1 items-center z-10 select-none"
        >
          <span className="text-muted-foreground text-xs">⠿⠿</span>
        </div>

        {/* Deletar */}
        <button
          onClick={onDelete}
          className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs z-10 hover:scale-110"
        >
          ×
        </button>

        {/* Conteúdo */}
        <div className={`p-3 flex items-start gap-1 ${typeClasses[item.type]}`}>
          {item.type === "bullet-list" && (
            <span className="text-primary font-bold shrink-0">•</span>
          )}
          {item.type === "numbered-list" && (
            <span className="text-primary font-medium shrink-0">1.</span>
          )}
          {item.type === "todo" && <span className="shrink-0 mt-0.5">☐</span>}
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate(e.currentTarget.textContent ?? "")}
            className="outline-none min-w-[120px] empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40"
            data-placeholder="Digite aqui..."
          >
            {item.content}
          </div>
        </div>
      </div>
    </div>
  );
}
