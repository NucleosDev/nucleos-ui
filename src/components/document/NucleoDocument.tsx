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

// Serializa blocks para o formato persistido no canvas
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

  // ── Estado interno ─────────────────────────────────────────────────────
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
  const containerRef = useRef<HTMLDivElement>(null);
  const savedIndicatorTimer = useRef<NodeJS.Timeout | null>(null);

  const [slashMenu, setSlashMenu] = useState<{
    open: boolean;
    blockId: string;
    pos: { top: number; left: number };
    columnLayoutId?: string;
    columnId?: string;
  }>({ open: false, blockId: "", pos: { top: 0, left: 0 } });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // ── Inicialização ──────────────────────────────────────────────────────
  useEffect(() => {
    if (initialized || canvasLoading || blocosLoading || nucleoLoading) return;

    const headerBlock: DocumentBlock = {
      id: "header-block",
      nucleoId,
      tipo: "header",
      posicao: -1,
      isDeletable: false,
    };

    const usedIds = new Set<string>();
    usedIds.add("header-block");

    let textBlocks: DocumentBlock[] = [];
    if (savedCanvas.length > 0) {
      textBlocks = savedCanvas
        .filter(
          (item: any) => isTextType(item.type) || item.type === "column-layout",
        )
        .map((item: any, i: number) => {
          let id = item.id;
          if (usedIds.has(id)) id = genId();
          usedIds.add(id);

          if (item.type === "column-layout") {
            const columns = ((item.configuracoes?.columns ?? []) as any[]).map(
              (col: any) => ({
                id: col.id ?? genId(),
                width: col.width ?? 50,
                blocks: ((col.blocks ?? []) as any[]).map(
                  (cb: any, j: number): DocumentBlock => ({
                    id: cb.id ?? genId(),
                    nucleoId,
                    tipo: cb.type as DocumentBlockType,
                    conteudo: cb.content || "",
                    posicao: j,
                    completed: cb.completed,
                  }),
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
        usedIds.add(b.id);
        return true;
      })
      .map((b: Bloco, i: number) => ({
        id: b.id,
        nucleoId,
        tipo: b.tipo as DocumentBlockType,
        titulo: b.titulo ?? undefined,
        posicao: textBlocks.length + i + 1,
        isDeletable: true,
        blocoRef: b,
      }));

    setBlocks([headerBlock, ...textBlocks, ...funcDocBlocks]);
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

  // ── Save com indicador ─────────────────────────────────────────────────
  const save = useCallback(
    (newBlocks: DocumentBlock[]) => {
      updateItems(toCanvasItems(newBlocks) as any);
    },
    [updateItems],
  );

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
  }, [isSaving]);

  // ── Índice de numbered-list ─────────────────────────────────────────────
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

  // ── Handlers de bloco ─────────────────────────────────────────────────
  const handleUpdateBlock = useCallback(
    (id: string, updates: Partial<DocumentBlock>) => {
      setBlocks((prev) => {
        const next = prev.map((b) => (b.id === id ? { ...b, ...updates } : b));
        save(next);
        return next;
      });
    },
    [save],
  );

  const handleDeleteBlock = useCallback(
    (id: string) => {
      setBlocks((prev) => {
        const block = prev.find((b) => b.id === id);
        if (block?.isDeletable === false) return prev;
        const next = prev.filter((b) => b.id !== id);
        save(next);
        return next;
      });
      setActiveBlockId(null);
    },
    [save],
  );

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
        next = next.map((b, i) => ({ ...b, posicao: i }));
        save(next);
        return next;
      });
      setActiveBlockId(newBlock.id);
      if (tipo !== "column-layout") {
        setTimeout(() => {
          document.getElementById(`block-${newBlock.id}`)?.focus();
        }, 50);
      }
    },
    [nucleoId, save],
  );

  // ── Handlers para blocos dentro de column-layout ──────────────────────
  const handleUpdateBlockInColumn = useCallback(
    (
      columnLayoutId: string,
      blockId: string,
      updates: Partial<DocumentBlock>,
    ) => {
      setBlocks((prev) => {
        const next = prev.map((b) => {
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
        });
        save(next);
        return next;
      });
    },
    [save],
  );

  const handleDeleteBlockInColumn = useCallback(
    (columnLayoutId: string, blockId: string) => {
      setBlocks((prev) => {
        const next = prev.map((b) => {
          if (b.id !== columnLayoutId || !b.configuracoes?.columns) return b;
          const columns = (b.configuracoes.columns as LayoutColumn[]).map(
            (col) => ({
              ...col,
              blocks: col.blocks.filter((cb) => cb.id !== blockId),
            }),
          );
          return { ...b, configuracoes: { ...b.configuracoes, columns } };
        });
        save(next);
        return next;
      });
    },
    [save],
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
      setBlocks((prev) => {
        const next = prev.map((b) => {
          if (b.id !== columnLayoutId || !b.configuracoes?.columns) return b;
          const columns = (b.configuracoes.columns as LayoutColumn[]).map(
            (col) => {
              if (columnId && col.id !== columnId) return col;
              const idx = col.blocks.findIndex((cb) => cb.id === afterId);
              const newColBlocks = [...col.blocks];
              newColBlocks.splice(idx + 1, 0, newBlock);
              return { ...col, blocks: newColBlocks };
            },
          );
          return { ...b, configuracoes: { ...b.configuracoes, columns } };
        });
        save(next);
        return next;
      });
      setActiveBlockId(newBlock.id);
    },
    [nucleoId, save],
  );

  // ── Blocos funcionais ─────────────────────────────────────────────────
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

  // Substituiu confirm() nativo — usa AlertDialog via deleteTarget
  const handleDeleteFunctional = useCallback((id: string) => {
    setDeleteTarget(id);
  }, []);

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

  // ── Multi-seleção ─────────────────────────────────────────────────────
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
        const [min, max] =
          startIdx < endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
        const rangeIds = blocks.slice(min, max + 1).map((b) => b.id);
        setSelectedIds(new Set(rangeIds));
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
      if (block && isFunctional(block.tipo)) {
        handleDeleteFunctional(id);
      } else {
        handleDeleteBlock(id);
      }
    });
    setSelectedIds(new Set());
  }, [selectedIds, blocks, handleDeleteBlock, handleDeleteFunctional]);

  const handleContainerClick = useCallback(() => setSelectedIds(new Set()), []);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIds(new Set());

      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        // Não rouba seleção de texto dentro de contentEditable
        const active = document.activeElement as HTMLElement | null;
        if (active?.contentEditable === "true") return;
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

  // ── Drag & Drop ───────────────────────────────────────────────────────
  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const block = blocks.find((b) => b.id === active.id);
      if (block) setDraggingBlock(block);
    },
    [blocks],
  );

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setDraggingBlock(null);
      if (!over || active.id === over.id) return;
      setBlocks((prev) => {
        const fromIdx = prev.findIndex((b) => b.id === active.id);
        const toIdx = prev.findIndex((b) => b.id === over.id);
        if (fromIdx === -1 || toIdx === -1) return prev;
        const next = [...prev];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        const reindexed = next.map((b, i) => ({ ...b, posicao: i }));
        save(reindexed);
        return reindexed;
      });
    },
    [save],
  );

  // ── Slash menu ────────────────────────────────────────────────────────
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

  // ── Renderização de conteúdo ──────────────────────────────────────────
  const renderBlockContent = (block: DocumentBlock) => {
    if (block.tipo === "header") {
      return <HeaderBlock />;
    }

    // Column-layout: renderizado via LayoutRowRenderer
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

  // ── Loading ───────────────────────────────────────────────────────────
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

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative">
      {/* Indicador de salvamento */}
      <div
        className={cn(
          "fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500",
          savedIndicator === "saving"
            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20 opacity-100"
            : savedIndicator === "saved"
              ? "bg-green-500/10 text-green-600 border border-green-500/20 opacity-100"
              : "opacity-0 pointer-events-none",
        )}
      >
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            savedIndicator === "saving"
              ? "bg-amber-500 animate-pulse"
              : "bg-green-500",
          )}
        />
        {savedIndicator === "saving" ? "Salvando..." : "Salvo ✓"}
      </div>

      {/* Toolbar de seleção múltipla */}
      {selectedIds.size > 0 && (
        <SelectionToolbar
          selectedCount={selectedIds.size}
          onDelete={handleDeleteSelected}
          onClearSelection={() => setSelectedIds(new Set())}
        />
      )}

      <div
        className={cn(
          "mx-auto pb-32",
          fullWidth
            ? "max-w-full px-6"
            : "max-w-4xl xl:max-w-5xl 2xl:max-w-6xl px-6 md:pl-20 md:pr-8",
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
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-0.5">
              {blocks.map((block) => (
                <SortableDocumentBlock
                  key={block.id}
                  block={block}
                  isSelected={selectedIds.has(block.id)}
                  isActive={activeBlockId === block.id}
                  onSelect={handleBlockClick}
                  onUpdate={(updates) => handleUpdateBlock(block.id, updates)}
                  onDelete={() => {
                    if (isFunctional(block.tipo)) {
                      handleDeleteFunctional(block.id);
                    } else {
                      handleDeleteBlock(block.id);
                    }
                  }}
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
          if (isFunctional(tipo)) {
            handleAddFunctional(tipo);
          } else if (slashMenu.columnLayoutId) {
            handleAddBlockInColumn(
              slashMenu.columnLayoutId,
              tipo as DocumentBlockType,
              slashMenu.blockId,
              slashMenu.columnId,
            );
          } else {
            handleAddBlock(tipo as DocumentBlockType, slashMenu.blockId);
          }
        }}
        onClose={() => setSlashMenu((s) => ({ ...s, open: false }))}
      />

      {/* AlertDialog para exclusão de blocos funcionais */}
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
