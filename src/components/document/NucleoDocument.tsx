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
import { TiptapBlockEditor } from "./TiptapBlockEditor";
import { FunctionalBlockCard } from "./FunctionalBlockCard";
import { LayoutRowRenderer } from "./LayoutRowRenderer";
import { HeaderBlock } from "./HeaderBlock";
import { AddBlockTrigger } from "./AddBlockTrigger";
import { SlashMenu } from "./SlashMenu";
import { useDocumentBlocks } from "@/hooks/useDocumentBlocks";
import { useBlocos } from "@/hooks/useBlocos";
import { useNucleo } from "@/hooks/useNucleo";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { BLOCO_INITIALIZERS } from "@/lib/bloco-initializers";
import {
  isFunctional,
  type DocumentBlock,
  type DocumentBlockType,
  type LayoutColumn,
  type LayoutRow,
} from "./document-types";
import type { CreateBlocoPayload, Bloco } from "@/types/bloco";

const genId = () => crypto.randomUUID();

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
    blocks: docBlocks,
    isLoading: docLoading,
    isSaving,
    addBlock: addDocBlock,
    deleteBlock: deleteDocBlock,
    updateContent,
    updateConfiguracoes,
    reorder,
  } = useDocumentBlocks(nucleoId);

  // ── Blocos computados para render ──────────────────────────────────────
  const blocks = useMemo(() => {
    const headerBlock: DocumentBlock = {
      id: "header-block",
      nucleoId,
      tipo: "header",
      posicao: -1,
      isDeletable: false,
    };
    const funcDocBlocks: DocumentBlock[] = funcBlocos
      .filter((b: Bloco) => b.tipo !== "canvas")
      .map((b: Bloco, i: number): DocumentBlock => ({
        id: b.id,
        nucleoId,
        tipo: b.tipo as DocumentBlockType,
        titulo: b.titulo ?? undefined,
        posicao: docBlocks.length + i + 1,
        isDeletable: true,
        blocoRef: b,
      }));
    return [headerBlock, ...docBlocks, ...funcDocBlocks];
  }, [docBlocks, funcBlocos, nucleoId]);

  // ── Estado interno ─────────────────────────────────────────────────────
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

  // ── Handlers de bloco ─────────────────────────────────────────────────
  const handleUpdateBlock = useCallback(
    (id: string, updates: Partial<DocumentBlock>) => {
      if (updates.conteudo !== undefined) {
        updateContent(id, updates.conteudo, updates.tipo);
      } else if (updates.tipo !== undefined) {
        updateContent(id, "", updates.tipo);
      }
    },
    [updateContent],
  );

  const handleDeleteBlock = useCallback(
    (id: string) => {
      const block = blocks.find((b) => b.id === id);
      if ((block as DocumentBlock | undefined)?.isDeletable === false) return;
      deleteDocBlock(id);
      setActiveBlockId(null);
    },
    [blocks, deleteDocBlock],
  );

  const handleAddBlock = useCallback(
    (tipo: DocumentBlockType, afterId?: string) => {
      addDocBlock(tipo, afterId);
      setTimeout(() => {
        // Focus handled by the hook's optimistic insert — find the new block by type
      }, 80);
    },
    [addDocBlock],
  );

  // ── Helpers para column-layout: recalcular configuracoes e persistir ──
  const getUpdatedColumnConfig = useCallback(
    (
      columnLayoutId: string,
      updater: (cols: LayoutColumn[]) => LayoutColumn[],
    ) => {
      const block = blocks.find((b) => b.id === columnLayoutId);
      if (!block?.configuracoes?.columns) return null;
      return updater(block.configuracoes.columns as LayoutColumn[]);
    },
    [blocks],
  );

  // ── Handlers para blocos dentro de column-layout ──────────────────────
  const handleUpdateBlockInColumn = useCallback(
    (columnLayoutId: string, blockId: string, updates: Partial<DocumentBlock>) => {
      const columns = getUpdatedColumnConfig(columnLayoutId, (cols) =>
        cols.map((col) => ({
          ...col,
          blocks: col.blocks.map((cb) =>
            cb.id === blockId ? { ...cb, ...updates } : cb,
          ),
        })),
      );
      if (columns) updateConfiguracoes(columnLayoutId, { columns });
    },
    [getUpdatedColumnConfig, updateConfiguracoes],
  );

  const handleDeleteBlockInColumn = useCallback(
    (columnLayoutId: string, blockId: string) => {
      const columns = getUpdatedColumnConfig(columnLayoutId, (cols) =>
        cols.map((col) => ({
          ...col,
          blocks: col.blocks.filter((cb) => cb.id !== blockId),
        })),
      );
      if (columns) updateConfiguracoes(columnLayoutId, { columns });
    },
    [getUpdatedColumnConfig, updateConfiguracoes],
  );

  const handleAddBlockInColumn = useCallback(
    (columnLayoutId: string, tipo: DocumentBlockType, afterId: string, columnId?: string) => {
      const newBlock: DocumentBlock = {
        id: genId(),
        nucleoId,
        tipo,
        conteudo: "",
        posicao: 0,
      };
      const columns = getUpdatedColumnConfig(columnLayoutId, (cols) =>
        cols.map((col) => {
          if (columnId && col.id !== columnId) return col;
          const idx = col.blocks.findIndex((cb) => cb.id === afterId);
          const next = [...col.blocks];
          next.splice(idx + 1, 0, newBlock);
          return { ...col, blocks: next };
        }),
      );
      if (columns) updateConfiguracoes(columnLayoutId, { columns });
      setActiveBlockId(newBlock.id);
    },
    [nucleoId, getUpdatedColumnConfig, updateConfiguracoes],
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
      const fromIdx = docBlocks.findIndex((b) => b.id === active.id);
      const toIdx = docBlocks.findIndex((b) => b.id === over.id);
      if (fromIdx === -1 || toIdx === -1) return;
      const next = [...docBlocks];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      reorder(next.map((b, i) => ({ ...b, posicao: i })));
    },
    [docBlocks, reorder],
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

    const textBlocks = blocks.filter(
      (b) => !isFunctional(b.tipo) && b.tipo !== "header" && b.tipo !== "column-layout",
    );
    const idx = textBlocks.findIndex((b) => b.id === block.id);

    const focusBlock = (targetId: string) => {
      setActiveBlockId(targetId);
      setTimeout(() => document.getElementById(`block-${targetId}`)?.focus(), 30);
    };

    return (
      <TiptapBlockEditor
        blockId={block.id}
        tipo={block.tipo}
        content={block.conteudo ?? ""}
        isActive={activeBlockId === block.id}
        readOnly={readOnly}

        onActivate={() => setActiveBlockId(block.id)}
        onUpdate={(html) => handleUpdateBlock(block.id, { conteudo: html })}
        onDelete={() => handleDeleteBlock(block.id)}
        onAddBelow={(tipo: DocumentBlockType) => handleAddBlock(tipo, block.id)}
        onTypeChange={(tipo: DocumentBlockType) =>
          handleUpdateBlock(block.id, { tipo, conteudo: "" })
        }
        onSlashMenu={(pos) => handleSlashMenu(block.id, pos)}
        onArrowUp={idx > 0 ? () => focusBlock(textBlocks[idx - 1].id) : undefined}
        onArrowDown={idx < textBlocks.length - 1 ? () => focusBlock(textBlocks[idx + 1].id) : undefined}
      />
    );
  };

  // ── Loading ───────────────────────────────────────────────────────────
  if (nucleoLoading || docLoading || blocosLoading) {
    return (
      <div
        className={cn(
          "mx-auto px-6 pt-10 pb-8 space-y-4",
          fullWidth ? "max-w-full" : "max-w-[720px]",
        )}
      >
        <Skeleton className="h-12 w-1/2 rounded-lg" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-4/5 rounded" />
        <Skeleton className="h-5 w-3/5 rounded" />
        <div className="pt-4 space-y-3">
          <Skeleton className="h-[120px] w-full rounded-xl" />
          <Skeleton className="h-[80px]  w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen relative">
      {/* Save indicator — ultra-minimal, bottom-right corner */}
      <div
        aria-live="polite"
        className={cn(
          "fixed bottom-5 right-5 z-50 flex items-center gap-1.5",
          "text-[11px] font-medium text-muted-foreground/50",
          "transition-[opacity,transform] duration-[var(--duration-slow)]",
          savedIndicator === "idle"
            ? "opacity-0 translate-y-1 pointer-events-none"
            : "opacity-100 translate-y-0",
        )}
      >
        <span
          className={cn(
            "h-1 w-1 rounded-full",
            savedIndicator === "saving"
              ? "bg-primary/50 animate-pulse"
              : "bg-muted-foreground/30",
          )}
        />
        {savedIndicator === "saving" ? "Salvando" : "Salvo"}
      </div>

      {/* Multi-select toolbar */}
      {selectedIds.size > 0 && (
        <SelectionToolbar
          selectedCount={selectedIds.size}
          onDelete={handleDeleteSelected}
          onClearSelection={() => setSelectedIds(new Set())}
        />
      )}

      {/* Writing surface */}
      <div
        className={cn(
          "mx-auto pb-48",
          fullWidth
            ? "max-w-full px-6 md:px-10"
            : "max-w-[720px] px-6 md:px-10",
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
            <div className="flex flex-col">
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

          <DragOverlay dropAnimation={{ duration: 180, easing: "cubic-bezier(0.16,1,0.3,1)" }}>
            {draggingBlock && (
              <div className="rounded-[var(--radius-lg)] border border-primary/20 bg-card/90 backdrop-blur-[var(--glass-blur-sm)] px-4 py-2.5 shadow-[var(--shadow-lg)] opacity-95">
                <span className="text-sm text-muted-foreground">
                  {draggingBlock.titulo || draggingBlock.conteudo?.slice(0, 40) || draggingBlock.tipo}
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

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
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
