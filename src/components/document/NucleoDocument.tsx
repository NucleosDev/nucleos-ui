// src/components/document/NucleoDocument.tsx
"use client";

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
import { TextBlockRenderer } from "./TextBlockRenderer";
import { FunctionalBlockCard } from "./FunctionalBlockCard";
import { HeaderBlock } from "./HeaderBlock";
import { AddBlockTrigger } from "./AddBlockTrigger";
import { SlashMenu } from "./SlashMenu";
import { useCanvasBlocks } from "@/hooks/useCanvas";
import { useBlocos } from "@/hooks/useBlocos";
import { useNucleo } from "@/hooks/useNucleo";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { BLOCO_INITIALIZERS } from "@/lib/bloco-initializers";
import type { DocumentBlock, DocumentBlockType } from "./document-types";
import type { CreateBlocoPayload, Bloco } from "@/types/bloco";

const genId = () => crypto.randomUUID();

const FUNCTIONAL_TYPES = new Set([
  "tarefas",
  "calendario",
  "habitos",
  "habito",
  "lista",
  "timer",
  "timers",
  "colecoes",
  "notas",
]);

function isFunctional(tipo: string): boolean {
  return FUNCTIONAL_TYPES.has(tipo);
}

const TEXT_TYPES = new Set([
  "paragraph",
  "h1",
  "h2",
  "h3",
  "quote",
  "code",
  "divider",
  "bullet-list",
  "numbered-list",
  "todo",
]);

function isTextType(tipo: string): boolean {
  return TEXT_TYPES.has(tipo);
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
  const containerRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Slash menu
  const [slashMenu, setSlashMenu] = useState<{
    open: boolean;
    blockId: string;
    pos: { top: number; left: number };
  }>({ open: false, blockId: "", pos: { top: 0, left: 0 } });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // ── Inicialização (único useEffect) ────────────────────────────────────
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
        .filter((item: any) => isTextType(item.type))
        .map((item: any, i: number) => {
          let id = item.id;
          if (usedIds.has(id)) id = genId();
          usedIds.add(id);
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

  // ── Auto-save ──────────────────────────────────────────────────────────
  const scheduleSave = useCallback(
    (newBlocks: DocumentBlock[]) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        const textOnly = newBlocks
          .filter(
            (b) =>
              b.tipo !== "header" &&
              !isFunctional(b.tipo) &&
              isTextType(b.tipo),
          )
          .map((b) => ({
            id: b.id,
            type: b.tipo,
            content: b.conteudo || "",
            completed: b.completed,
          }));
        updateItems(textOnly as any);
      }, 600);
    },
    [updateItems],
  );

  // ── Handlers de bloco ─────────────────────────────────────────────────
  const handleUpdateBlock = useCallback(
    (id: string, updates: Partial<DocumentBlock>) => {
      setBlocks((prev) => {
        const next = prev.map((b) => (b.id === id ? { ...b, ...updates } : b));
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave],
  );

  const handleDeleteBlock = useCallback(
    (id: string) => {
      setBlocks((prev) => {
        const block = prev.find((b) => b.id === id);
        if (block?.isDeletable === false) return prev;
        const next = prev.filter((b) => b.id !== id);
        scheduleSave(next);
        return next;
      });
      setActiveBlockId(null);
    },
    [scheduleSave],
  );

  const handleAddBlock = useCallback(
    (tipo: DocumentBlockType, afterId?: string) => {
      const newBlock: DocumentBlock = {
        id: genId(),
        nucleoId,
        tipo,
        conteudo: "",
        posicao: 0,
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
        scheduleSave(next);
        return next;
      });
      setActiveBlockId(newBlock.id);
      setTimeout(() => {
        document.getElementById(`block-${newBlock.id}`)?.focus();
      }, 50);
    },
    [nucleoId, scheduleSave],
  );

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
    async (id: string) => {
      if (!confirm("Excluir este bloco? Esta ação não pode ser desfeita."))
        return;
      try {
        await removeBloco(id);
        toast({ title: "Bloco excluído" });
      } catch {
        toast({ title: "Erro ao excluir", variant: "destructive" });
      }
    },
    [removeBloco],
  );


  const handleEditTitle = useCallback(
    async (blockId: string, titulo: string) => {
      // 1. Atualiza o estado local IMEDIATAMENTE
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
        // 2. Persiste no backend
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
        scheduleSave(reindexed);
        return reindexed;
      });
    },
    [scheduleSave],
  );

  // ── Slash menu ────────────────────────────────────────────────────────
  const handleSlashMenu = useCallback(
    (blockId: string, pos: { top: number; left: number }) => {
      setSlashMenu({ open: true, blockId, pos });
    },
    [],
  );

  // ── Renderização de conteúdo ──────────────────────────────────────────
  const renderBlockContent = (block: DocumentBlock) => {
    if (block.tipo === "header" && nucleo) {
      return <HeaderBlock nucleo={nucleo} fullWidth={fullWidth} />;
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
    <div className="min-h-screen bg-background relative">
      {/* Indicador de salvamento */}
      <div
        className={cn(
          "fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500",
          isSaving
            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20 opacity-100"
            : "opacity-0 pointer-events-none",
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
        Salvando...
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
          "mx-auto px-0 pb-32",
          fullWidth ? "max-w-full" : "max-w-3xl",
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
            <div className="space-y-0">
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
          } else {
            handleAddBlock(tipo as DocumentBlockType, slashMenu.blockId);
          }
        }}
        onClose={() => setSlashMenu((s) => ({ ...s, open: false }))}
      />
    </div>
  );
}
