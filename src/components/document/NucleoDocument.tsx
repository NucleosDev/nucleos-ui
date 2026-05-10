// src/components/document/NucleoDocument.tsx
"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SortableDocumentBlock } from "./SortableDocumentBlock";
import { SelectionToolbar } from "./SelectionToolbar";
import { TextBlockRenderer } from "./TextBlockRenderer";
import { FunctionalBlockCard } from "./FunctionalBlockCard";
import { LayoutRowRenderer } from "./LayoutRowRenderer";
import { HeaderBlock } from "./HeaderBlock";
import { AddBlockTrigger } from "./AddBlockTrigger";
import { SlashMenu } from "./SlashMenu";
import { useCanvasBlocks } from "@/hooks/useCanvas";
import { useBlocos } from "@/hooks/useBlocos";
import { useNucleo } from "@/hooks/useNucleo";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { BLOCO_INITIALIZERS } from "@/lib/bloco-initializers";
import {
  isFunctional,
  isTextType,
  type DocumentBlock,
  type DocumentBlockType,
  type LayoutColumn,
  type LayoutRow,
} from "./document-types";
import type { CreateBlocoPayload, Bloco } from "@/types/bloco";

const genId = () => crypto.randomUUID();

function toCanvasItems(blocks: DocumentBlock[]) {
  return blocks
    .filter((b) => b.tipo !== "header" && !isFunctional(b.tipo))
    .map((b) => ({
      id: b.id,
      type: b.tipo,
      content: b.conteudo || "",
      completed: b.completed,
      ...(b.tipo === "column-layout" && b.configuracoes
        ? { configuracoes: b.configuracoes }
        : {}),
    }));
}

interface NucleoDocumentProps {
  nucleoId: string;
  readOnly?: boolean;
  fullWidth?: boolean;
}

export function NucleoDocument({
  nucleoId,
  readOnly = false,
  fullWidth = false,
}: NucleoDocumentProps) {
  const router = useRouter();

  // ═══════════════════════════════════════════════════════════════════════
  // HOOKS — TODOS os hooks devem ficar nesta seção, ANTES de qualquer return
  // ═══════════════════════════════════════════════════════════════════════

  // ── Hooks de dados ─────────────────────────────────────────────────────
  const { data: nucleo, isLoading: nucleoLoading } = useNucleo(nucleoId);
  const {
    blocos: funcBlocos,
    isLoading: blocosLoading,
    create: createBloco,
    remove: removeBloco,
    update: updateBloco,
    isCreating,
    isDeleting,
  } = useBlocos(nucleoId);
  const {
    items: savedCanvas,
    isLoading: canvasLoading,
    updateItems,
    isSaving,
  } = useCanvasBlocks(nucleoId);

  // ── Estado ─────────────────────────────────────────────────────────────
  const [blocks, setBlocks] = useState<DocumentBlock[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [draggingBlock, setDraggingBlock] = useState<DocumentBlock | null>(
    null,
  );
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [savedIndicator, setSavedIndicator] = useState<
    "saving" | "saved" | "idle"
  >("idle");

  const [viewMode, setViewMode] = useState<"list" | "grid">(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("nucleo-view-mode") as "list" | "grid") || "list"
      );
    }
    return "list";
  });

  const [slashMenu, setSlashMenu] = useState<{
    open: boolean;
    blockId: string;
    pos: { top: number; left: number };
    columnLayoutId?: string;
    columnId?: string;
  }>({ open: false, blockId: "", pos: { top: 0, left: 0 } });

  // ── Refs ───────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const savedIndicatorTimer = useRef<NodeJS.Timeout | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Sensores DnD ──────────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // ── Efeitos ────────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem("nucleo-view-mode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (isSaving) {
      setSavedIndicator("saving");
      if (savedIndicatorTimer.current)
        clearTimeout(savedIndicatorTimer.current);
    } else if (savedIndicator === "saving") {
      setSavedIndicator("saved");
      savedIndicatorTimer.current = setTimeout(
        () => setSavedIndicator("idle"),
        2000,
      );
    }
  }, [isSaving, savedIndicator]);

  // Inicialização com garantia de IDs únicos
  useEffect(() => {
    if (initialized || canvasLoading || blocosLoading || nucleoLoading) return;

    const usedIds = new Set<string>();
    const headerBlock: DocumentBlock = {
      id: "header-block",
      nucleoId,
      tipo: "header",
      posicao: -1,
      isDeletable: false,
    };
    usedIds.add("header-block");

    let textBlocks: DocumentBlock[] = [];
    if (savedCanvas.length > 0) {
      textBlocks = savedCanvas
        .filter(
          (item: any) => isTextType(item.type) || item.type === "column-layout",
        )
        .map((item: any, i: number) => {
          let id = item.id;
          if (!id || usedIds.has(id)) id = genId();
          usedIds.add(id);

          if (item.type === "column-layout") {
            const columns = ((item.configuracoes?.columns ?? []) as any[]).map(
              (col: any) => ({
                id: col.id ?? genId(),
                width: col.width ?? 50,
                blocks: ((col.blocks ?? []) as any[]).map(
                  (cb: any, j: number): DocumentBlock => {
                    let cbId = cb.id;
                    if (!cbId || usedIds.has(cbId)) cbId = genId();
                    usedIds.add(cbId);
                    return {
                      id: cbId,
                      nucleoId,
                      tipo: cb.type as DocumentBlockType,
                      conteudo: cb.content || "",
                      posicao: j,
                      completed: cb.completed,
                    };
                  },
                ),
              }),
            );
            return {
              id,
              nucleoId,
              tipo: "column-layout" as DocumentBlockType,
              posicao: i,
              configuracoes: { columns },
            };
          }

          return {
            id,
            nucleoId,
            tipo: item.type as DocumentBlockType,
            conteudo: item.content || "",
            posicao: i,
            completed: item.completed,
          };
        });
    } else {
      const newId = genId();
      usedIds.add(newId);
      textBlocks = [
        { id: newId, nucleoId, tipo: "paragraph", conteudo: "", posicao: 0 },
      ];
    }

    const funcDocBlocks: DocumentBlock[] = funcBlocos
      .filter((b: Bloco) => {
        if (b.tipo === "canvas") return false;
        if (usedIds.has(b.id)) return false;
        return true;
      })
      .map((b: Bloco, i: number) => {
        usedIds.add(b.id);
        return {
          id: b.id,
          nucleoId,
          tipo: b.tipo as DocumentBlockType,
          titulo: b.titulo ?? undefined,
          posicao: textBlocks.length + i + 1,
          isDeletable: true,
          blocoRef: b,
        };
      });

    const combined = [headerBlock, ...textBlocks, ...funcDocBlocks];
    const seen = new Set<string>();
    const unique = combined.filter((block) => {
      if (seen.has(block.id)) {
        console.warn(
          `[NucleoDocument] ⚠️ Bloco duplicado removido: ${block.id}`,
        );
        return false;
      }
      seen.add(block.id);
      return true;
    });

    setBlocks(unique);
    setInitialized(true);
  }, [
    canvasLoading,
    blocosLoading,
    nucleoLoading,
    initialized,
    savedCanvas,
    funcBlocos,
    nucleoId,
  ]);

  // ── Persistência ───────────────────────────────────────────────────────
  const save = useCallback(
    (newBlocks: DocumentBlock[]) => {
      updateItems(toCanvasItems(newBlocks) as any);
    },
    [updateItems],
  );

  const debouncedSave = useCallback(
    (newBlocks: DocumentBlock[]) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      setSavedIndicator("saving");
      debounceTimerRef.current = setTimeout(() => save(newBlocks), 500);
    },
    [save],
  );

  useEffect(() => {
    if (!initialized) return;
    debouncedSave(blocks);
  }, [blocks, initialized, debouncedSave]);

  // ── Índice de numbered-list ────────────────────────────────────────────
  const listIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    let count = 0;
    let lastType = "";
    for (const b of blocks) {
      if (b.tipo === "numbered-list") {
        count = lastType === "numbered-list" ? count + 1 : 1;
        map.set(b.id, count);
      } else {
        count = 0;
      }
      lastType = b.tipo;
    }
    return map;
  }, [blocks]);

  // ── Handlers de bloco ──────────────────────────────────────────────────
  const handleUpdateBlock = useCallback(
    (id: string, updates: Partial<DocumentBlock>) => {
      setBlocks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updates } : b)),
      );
    },
    [],
  );

  const handleDeleteBlock = useCallback((id: string) => {
    setBlocks((prev) => {
      const block = prev.find((b) => b.id === id);
      if (block?.isDeletable === false) return prev;
      return prev.filter((b) => b.id !== id);
    });
    setActiveBlockId(null);
  }, []);

  const handleAddBlock = useCallback(
    (tipo: DocumentBlockType, afterId?: string) => {
      const newBlock: DocumentBlock = {
        id: genId(),
        nucleoId,
        tipo,
        conteudo: tipo === "column-layout" ? undefined : "",
        posicao: 0,
        configuracoes:
          tipo === "column-layout"
            ? {
                columns: [
                  { id: genId(), width: 50, blocks: [] },
                  { id: genId(), width: 50, blocks: [] },
                ],
              }
            : undefined,
      };
      setBlocks((prev) => {
        let next: DocumentBlock[];
        if (afterId) {
          const idx = prev.findIndex((b) => b.id === afterId);
          if (idx === -1) return prev;
          next = [...prev];
          next.splice(idx + 1, 0, newBlock);
        } else {
          const lastTextIdx = [...prev]
            .reverse()
            .findIndex((b) => !isFunctional(b.tipo) && b.tipo !== "header");
          const insertAt =
            lastTextIdx === -1 ? prev.length : prev.length - lastTextIdx;
          next = [...prev];
          next.splice(insertAt, 0, newBlock);
        }
        return next.map((b, i) => ({ ...b, posicao: i }));
      });
      setActiveBlockId(newBlock.id);
      if (tipo !== "column-layout") {
        setTimeout(
          () => document.getElementById(`block-${newBlock.id}`)?.focus(),
          50,
        );
      }
    },
    [nucleoId],
  );

  // ── Handlers column-layout ─────────────────────────────────────────────
  const handleUpdateBlockInColumn = useCallback(
    (
      columnLayoutId: string,
      blockId: string,
      updates: Partial<DocumentBlock>,
    ) => {
      setBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== columnLayoutId || !b.configuracoes?.columns) return b;
          const columns = (b.configuracoes.columns as LayoutColumn[]).map(
            (col) => ({
              ...col,
              blocks: col.blocks.map((cb) =>
                cb.id === blockId ? { ...cb, ...updates } : cb,
              ),
            }),
          );
          return { ...b, configuracoes: { ...b.configuracoes, columns } };
        }),
      );
    },
    [],
  );

  const handleDeleteBlockInColumn = useCallback(
    (columnLayoutId: string, blockId: string) => {
      setBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== columnLayoutId || !b.configuracoes?.columns) return b;
          const columns = (b.configuracoes.columns as LayoutColumn[]).map(
            (col) => ({
              ...col,
              blocks: col.blocks.filter((cb) => cb.id !== blockId),
            }),
          );
          return { ...b, configuracoes: { ...b.configuracoes, columns } };
        }),
      );
    },
    [],
  );

  const handleAddBlockInColumn = useCallback(
    (
      columnLayoutId: string,
      tipo: DocumentBlockType,
      afterId: string,
      columnId?: string,
    ) => {
      const newBlock: DocumentBlock = {
        id: genId(),
        nucleoId,
        tipo,
        conteudo: "",
        posicao: 0,
      };
      setBlocks((prev) =>
        prev.map((b) => {
          if (b.id !== columnLayoutId || !b.configuracoes?.columns) return b;
          const columns = (b.configuracoes.columns as LayoutColumn[]).map(
            (col) => {
              if (columnId && col.id !== columnId) return col;
              const idx = col.blocks.findIndex((cb) => cb.id === afterId);
              if (idx === -1) return col;
              const newColBlocks = [...col.blocks];
              newColBlocks.splice(idx + 1, 0, newBlock);
              return { ...col, blocks: newColBlocks };
            },
          );
          return { ...b, configuracoes: { ...b.configuracoes, columns } };
        }),
      );
      setActiveBlockId(newBlock.id);
    },
    [nucleoId],
  );

  // ── Blocos funcionais ──────────────────────────────────────────────────
  const handleAddFunctional = useCallback(
    async (tipo: string, titulo?: string) => {
      try {
        const payload: CreateBlocoPayload = {
          nucleoId,
          tipo: tipo as any,
          titulo,
        };
        const criado = await createBloco(payload);
        const initializer =
          BLOCO_INITIALIZERS[tipo as keyof typeof BLOCO_INITIALIZERS];
        if (initializer) await initializer(criado.id, titulo);
        toast({ title: `Bloco "${titulo || tipo}" criado!` });
      } catch {
        toast({ title: "Erro ao criar bloco", variant: "destructive" });
      }
    },
    [nucleoId, createBloco],
  );

  const handleDeleteFunctional = useCallback(
    (id: string) => setDeleteTarget(id),
    [],
  );

  const confirmDeleteFunctional = useCallback(async () => {
    if (!deleteTarget) return;
    const id = deleteTarget;
    setDeleteTarget(null);
    try {
      await removeBloco(id);
      toast({ title: "Bloco excluído" });
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  }, [deleteTarget, removeBloco]);

  const handleEditTitle = useCallback(
    async (blockId: string, titulo: string) => {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === blockId
            ? {
                ...b,
                titulo,
                blocoRef: b.blocoRef ? { ...b.blocoRef, titulo } : undefined,
              }
            : b,
        ),
      );
      try {
        await updateBloco({ id: blockId, payload: { titulo, nucleoId } });
      } catch {
        toast({ title: "Erro ao editar título", variant: "destructive" });
      }
    },
    [updateBloco, nucleoId],
  );

  // ── Multi-seleção ──────────────────────────────────────────────────────
  const handleBlockClick = useCallback(
    (blockId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (e.ctrlKey || e.metaKey) {
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.has(blockId) ? next.delete(blockId) : next.add(blockId);
          return next;
        });
      } else if (e.shiftKey && lastSelectedId) {
        const startIdx = blocks.findIndex((b) => b.id === lastSelectedId);
        const endIdx = blocks.findIndex((b) => b.id === blockId);
        if (startIdx === -1 || endIdx === -1) return;
        const [min, max] =
          startIdx < endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
        setSelectedIds(new Set(blocks.slice(min, max + 1).map((b) => b.id)));
      } else {
        setSelectedIds(new Set([blockId]));
      }
      setLastSelectedId(blockId);
      setActiveBlockId(blockId);
    },
    [blocks, lastSelectedId],
  );

  const handleDeleteSelected = useCallback(() => {
    selectedIds.forEach((id) => {
      const block = blocks.find((b) => b.id === id);
      if (block && isFunctional(block.tipo)) handleDeleteFunctional(id);
      else handleDeleteBlock(id);
    });
    setSelectedIds(new Set());
  }, [selectedIds, blocks, handleDeleteBlock, handleDeleteFunctional]);

  const handleContainerClick = useCallback(() => setSelectedIds(new Set()), []);

  // ── Atalhos de teclado ─────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIds(new Set());
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        const active = document.activeElement as HTMLElement | null;
        if (active?.contentEditable === "true") return;
        e.preventDefault();
        setSelectedIds(
          new Set(blocks.filter((b) => b.tipo !== "header").map((b) => b.id)),
        );
      }
      if (e.key === "Delete" && selectedIds.size > 0) {
        e.preventDefault();
        handleDeleteSelected();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [blocks, selectedIds, handleDeleteSelected]);

  // ── Drag & Drop ────────────────────────────────────────────────────────
  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const block = blocks.find((b) => b.id === active.id);
      if (block) setDraggingBlock(block);
    },
    [blocks],
  );

  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    setDraggingBlock(null);
    if (!over || active.id === over.id) return;
    setBlocks((prev) => {
      const fromIdx = prev.findIndex((b) => b.id === active.id);
      const toIdx = prev.findIndex((b) => b.id === over.id);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next.map((b, i) => ({ ...b, posicao: i }));
    });
  }, []);

  // ── Slash menu ─────────────────────────────────────────────────────────
  const handleSlashMenu = useCallback(
    (
      blockId: string,
      pos: { top: number; left: number },
      columnLayoutId?: string,
      columnId?: string,
    ) => {
      setSlashMenu({ open: true, blockId, pos, columnLayoutId, columnId });
    },
    [],
  );

  // ── Renderização de conteúdo (arrow function, não é hook) ──────────────
  const renderBlockContent = (block: DocumentBlock) => {
    if (block.tipo === "header") return <HeaderBlock />;

    if (block.tipo === "column-layout" && nucleo) {
      const row: LayoutRow = {
        id: block.id,
        type: "columns",
        columns: (block.configuracoes?.columns ?? []) as LayoutColumn[],
      };
      return (
        <LayoutRowRenderer
          row={row}
          nucleo={nucleo}
          nucleoId={nucleoId}
          activeBlockId={activeBlockId}
          readOnly={readOnly}
          onActivateBlock={setActiveBlockId}
          onUpdateBlock={(id, updates) =>
            handleUpdateBlockInColumn(block.id, id, updates)
          }
          onDeleteBlock={(id) => handleDeleteBlockInColumn(block.id, id)}
          onDeleteFunctional={(id) => handleDeleteBlockInColumn(block.id, id)}
          onAddBlockAfter={(tipo, afterId, _rowId, colId) =>
            handleAddBlockInColumn(block.id, tipo, afterId, colId)
          }
          onTypeChange={(id, tipo) =>
            handleUpdateBlockInColumn(block.id, id, { tipo, conteudo: "" })
          }
          onSlashMenu={(blockId, _rowId, colId, pos) =>
            handleSlashMenu(blockId, pos, block.id, colId)
          }
          onOpenFullPage={(blockId) =>
            router.push(`/dashboard/nucleos/${nucleoId}/blocos/${blockId}`)
          }
          onEditTitle={handleEditTitle}
          isDeleting={isDeleting}
        />
      );
    }

    if (isFunctional(block.tipo)) {
      return (
        <FunctionalBlockCard
          block={block}
          nucleoId={nucleoId}
          isDeleting={isDeleting}
          onOpenFullPage={() =>
            router.push(`/dashboard/nucleos/${nucleoId}/blocos/${block.id}`)
          }
          onDelete={() => handleDeleteFunctional(block.id)}
          onEditTitle={(titulo: string) => handleEditTitle(block.id, titulo)}
        />
      );
    }

    return (
      <TextBlockRenderer
        block={block}
        isActive={activeBlockId === block.id}
        onActivate={() => setActiveBlockId(block.id)}
        onUpdate={handleUpdateBlock}
        onDelete={handleDeleteBlock}
        onAddBelow={(tipo: DocumentBlockType) => handleAddBlock(tipo, block.id)}
        onTypeChange={(id: string, tipo: DocumentBlockType) =>
          handleUpdateBlock(id, { tipo, conteudo: "" })
        }
        onSlashMenu={(pos: { top: number; left: number }) =>
          handleSlashMenu(block.id, pos)
        }
        readOnly={readOnly}
        listIndex={listIndexMap.get(block.id)}
      />
    );
  };

  // ── Memos de unicidade (ANTES do return condicional) ───────────────────
  const uniqueBlocks = useMemo(() => {
    const seen = new Set<string>();
    return blocks.filter((block) => {
      if (seen.has(block.id)) {
        console.error(`[NucleoDocument] 🔴 Bloco duplicado: ${block.id}`);
        return false;
      }
      seen.add(block.id);
      return true;
    });
  }, [blocks]);

  const gridBlocks = useMemo(
    () => uniqueBlocks.filter((b) => b.tipo !== "header"),
    [uniqueBlocks],
  );

  // ═══════════════════════════════════════════════════════════════════════
  // RETURN CONDICIONAL (Loading) — DEPOIS de todos os hooks
  // ═══════════════════════════════════════════════════════════════════════
  if (nucleoLoading || canvasLoading || blocosLoading || !initialized) {
    return (
      <div
        className={cn(
          "mx-auto px-4 py-8 space-y-3",
          fullWidth ? "max-w-full" : "max-w-3xl",
        )}
      >
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-8 w-2/3 rounded-lg" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-4/5 rounded" />
        <Skeleton className="h-32 w-full rounded-xl mt-6" />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen relative">
      {/* Indicador de salvamento */}

      {/* Toolbar de seleção múltipla */}
      {selectedIds.size > 0 && (
        <SelectionToolbar
          selectedCount={selectedIds.size}
          onDelete={handleDeleteSelected}
          onClearSelection={() => setSelectedIds(new Set())}
        />
      )}

      {/* Toggle Grid/Lista */}
      {!readOnly && (
        <div
          className={cn(
            "mx-auto flex items-center justify-end gap-2 pb-2",
            fullWidth ? "max-w-full" : "max-w-4xl xl:max-w-5xl 2xl:max-w-6xl",
            "px-6 md:pl-20 md:pr-8",
          )}
        >
          <span className="text-xs text-muted-foreground/60 mr-1">
            {viewMode === "list" ? "Lista" : "Grade"}
          </span>
          <div className="flex items-center bg-muted/50 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === "list"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground/60 hover:text-foreground",
              )}
              title="Visualização em lista"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                viewMode === "grid"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground/60 hover:text-foreground",
              )}
              title="Visualização em grade"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div
        className={cn(
          "mx-auto pb-32",
          fullWidth
            ? "max-w-full px-6"
            : viewMode === "grid"
              ? "max-w-[95%] px-6 md:px-10"
              : "max-w-[90%] px-6 md:pl-20 md:pr-8",
        )}
        onClick={handleContainerClick}
        ref={containerRef}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={uniqueBlocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {viewMode === "grid" ? (
              <div
                className={cn(
                  "grid gap-4",
                  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                )}
              >
                {gridBlocks.map((block) => (
                  <div key={block.id} className="h-full">
                    <SortableDocumentBlock
                      block={block}
                      isSelected={selectedIds.has(block.id)}
                      isActive={activeBlockId === block.id}
                      onSelect={handleBlockClick}
                      onUpdate={(updates) =>
                        handleUpdateBlock(block.id, updates)
                      }
                      onDelete={() =>
                        isFunctional(block.tipo)
                          ? handleDeleteFunctional(block.id)
                          : handleDeleteBlock(block.id)
                      }
                      onAddBelow={
                        block.tipo !== "header" && !readOnly
                          ? () => handleAddBlock("paragraph", block.id)
                          : undefined
                      }
                      readOnly={readOnly}
                    >
                      {renderBlockContent(block)}
                    </SortableDocumentBlock>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-0.5">
                {uniqueBlocks.map((block) => (
                  <SortableDocumentBlock
                    key={block.id}
                    block={block}
                    isSelected={selectedIds.has(block.id)}
                    isActive={activeBlockId === block.id}
                    onSelect={handleBlockClick}
                    onUpdate={(updates) => handleUpdateBlock(block.id, updates)}
                    onDelete={() =>
                      isFunctional(block.tipo)
                        ? handleDeleteFunctional(block.id)
                        : handleDeleteBlock(block.id)
                    }
                    onAddBelow={
                      block.tipo !== "header" && !readOnly
                        ? () => handleAddBlock("paragraph", block.id)
                        : undefined
                    }
                    readOnly={readOnly}
                  >
                    {renderBlockContent(block)}
                  </SortableDocumentBlock>
                ))}
              </div>
            )}
          </SortableContext>
          <DragOverlay>
            {draggingBlock && (
              <div className="rounded-lg border border-primary/30 bg-card/80 backdrop-blur px-4 py-2 shadow-xl opacity-90">
                <span className="text-sm text-muted-foreground">
                  {draggingBlock.titulo ||
                    draggingBlock.conteudo ||
                    draggingBlock.tipo}
                </span>
              </div>
            )}
          </DragOverlay>
        </DndContext>
        {!readOnly && (
          <AddBlockTrigger
            onAddText={(tipo: DocumentBlockType) => handleAddBlock(tipo)}
            onAddFunctional={(tipo: string) => handleAddFunctional(tipo)}
            isCreating={isCreating}
          />
        )}
      </div>

      <SlashMenu
        open={slashMenu.open}
        position={slashMenu.pos}
        onSelect={(tipo: string) => {
          setSlashMenu((s) => ({ ...s, open: false }));
          if (isFunctional(tipo)) handleAddFunctional(tipo);
          else if (slashMenu.columnLayoutId)
            handleAddBlockInColumn(
              slashMenu.columnLayoutId,
              tipo as DocumentBlockType,
              slashMenu.blockId,
              slashMenu.columnId,
            );
          else handleAddBlock(tipo as DocumentBlockType, slashMenu.blockId);
        }}
        onClose={() => setSlashMenu((s) => ({ ...s, open: false }))}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir bloco?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteFunctional}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
