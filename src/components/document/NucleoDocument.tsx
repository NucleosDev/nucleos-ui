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
import { HeaderBlock } from "./HeaderBlock";
import { TextBlockRenderer } from "./TextBlockRenderer";
import { FunctionalBlockCard } from "./FunctionalBlockCard";
import { AddBlockTrigger } from "./AddBlockTrigger";
import { SlashMenu } from "./SlashMenu";
import { useCanvasBlocks } from "@/hooks/useCanvas";
import { useBlocos } from "@/hooks/useBlocos";
import { useNucleo } from "@/hooks/useNucleo";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { BLOCO_INITIALIZERS } from "@/lib/bloco-initializers";
import type { CreateBlocoPayload } from "@/types/bloco";
import type { DocumentBlock, DocumentBlockType, NucleoDocumentState } from "./document-types";

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
}

export function NucleoDocument({
  nucleoId,
  readOnly = false,
  fullWidth = false,
}: NucleoDocumentProps) {
  const router = useRouter();
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

  // ── Estado local do documento ──────────────────────────────────────────────
  const [blocks, setBlocks] = useState<DocumentBlock[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [draggingBlock, setDraggingBlock] = useState<DocumentBlock | null>(null);

  // Slash menu
  const [slashMenu, setSlashMenu] = useState<{
    open: boolean;
    blockId: string;
    pos: { top: number; left: number };
  }>({ open: false, blockId: "", pos: { top: 0, left: 0 } });

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // ── Inicialização ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (initialized || canvasLoading || blocosLoading || nucleoLoading) return;

    const headerBlock: DocumentBlock = {
      id: "header-block",
      nucleoId,
      tipo: "header",
      posicao: -1,
      isDeletable: false,
    };

    // Blocos de texto do canvas
    let textBlocks: DocumentBlock[] = [];
    if (savedCanvas.length > 0) {
      textBlocks = savedCanvas
        .filter((item) => item.type !== "functional")
        .map((item, i) => ({
          id: item.id,
          nucleoId,
          tipo: item.type as DocumentBlockType,
          conteudo: "content" in item ? (item as any).content : "",
          posicao: i,
          completed: (item as any).completed,
        }));
    } else {
      textBlocks = [{ id: genId(), nucleoId, tipo: "paragraph", conteudo: "", posicao: 0 }];
    }

    // Blocos funcionais do banco
    const funcDocBlocks: DocumentBlock[] = funcBlocos.map((b, i) => ({
      id: b.id,
      nucleoId,
      tipo: b.tipo as DocumentBlockType,
      titulo: b.titulo ?? undefined,
      posicao: textBlocks.length + i,
      isDeletable: true,
      blocoRef: b,
    }));

    setBlocks([headerBlock, ...textBlocks, ...funcDocBlocks]);
    setInitialized(true);
  }, [canvasLoading, blocosLoading, nucleoLoading, initialized, savedCanvas, funcBlocos, nucleoId]);

  // Sincronizar blocos funcionais quando mudarem no servidor
  useEffect(() => {
    if (!initialized) return;
    setBlocks((prev) => {
      const nonFunc = prev.filter((b) => b.tipo === "header" || !isFunctional(b.tipo));
      const funcDocBlocks: DocumentBlock[] = funcBlocos.map((b, i) => ({
        id: b.id,
        nucleoId,
        tipo: b.tipo as DocumentBlockType,
        titulo: b.titulo ?? undefined,
        posicao: nonFunc.length + i,
        isDeletable: true,
        blocoRef: b,
      }));
      return [...nonFunc, ...funcDocBlocks];
    });
  }, [funcBlocos, initialized, nucleoId]);

  // ── Auto-save canvas (texto) ───────────────────────────────────────────────
  const scheduleSave = useCallback((newBlocks: DocumentBlock[]) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const textOnly = newBlocks
        .filter((b) => b.tipo !== "header" && !isFunctional(b.tipo))
        .map((b) => ({ id: b.id, type: b.tipo, content: b.conteudo || "", completed: b.completed }));
      updateItems(textOnly as any);
    }, 600);
  }, [updateItems]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleUpdate = useCallback((id: string, updates: Partial<DocumentBlock>) => {
    setBlocks((prev) => {
      const next = prev.map((b) => b.id === id ? { ...b, ...updates } : b);
      scheduleSave(next);
      return next;
    });
  }, [scheduleSave]);

  const handleDelete = useCallback((id: string) => {
    setBlocks((prev) => {
      if (prev.find((b) => b.id === id)?.isDeletable === false) return prev;
      const next = prev.filter((b) => b.id !== id);
      scheduleSave(next);
      return next;
    });
    setActiveBlockId(null);
  }, [scheduleSave]);

  const handleDeleteFunctional = useCallback(async (id: string) => {
    if (!confirm("Excluir este bloco? Esta ação não pode ser desfeita.")) return;
    try {
      await removeBloco(id);
      toast({ title: "Bloco excluído" });
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  }, [removeBloco]);

  const handleAddText = useCallback((tipo: DocumentBlockType, afterId?: string) => {
    const newBlock: DocumentBlock = {
      id: genId(), nucleoId, tipo, conteudo: "", posicao: 0,
    };
    setBlocks((prev) => {
      let next: DocumentBlock[];
      if (afterId) {
        const idx = prev.findIndex((b) => b.id === afterId);
        next = [...prev];
        next.splice(idx + 1, 0, newBlock);
      } else {
        // Inserir antes dos blocos funcionais
        const lastTextIdx = [...prev].reverse().findIndex((b) => !isFunctional(b.tipo) && b.tipo !== "header");
        const insertAt = lastTextIdx === -1 ? prev.length : prev.length - lastTextIdx;
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
  }, [nucleoId, scheduleSave]);

  const handleAddFunctional = useCallback(async (tipo: string, titulo?: string) => {
    try {
      const payload: CreateBlocoPayload = { nucleoId, tipo: tipo as any, titulo };
      const criado = await createBloco(payload);
      const initializer = BLOCO_INITIALIZERS[tipo as keyof typeof BLOCO_INITIALIZERS];
      if (initializer) await initializer(criado.id, titulo);
      toast({ title: `Bloco "${titulo || tipo}" criado!` });
    } catch {
      toast({ title: "Erro ao criar bloco", variant: "destructive" });
    }
  }, [nucleoId, createBloco]);

  const handleDuplicate = useCallback((id: string) => {
    const block = blocks.find((b) => b.id === id);
    if (!block || isFunctional(block.tipo)) return;
    const copy: DocumentBlock = { ...block, id: genId() };
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      scheduleSave(next);
      return next;
    });
  }, [blocks, scheduleSave]);

  const handleTypeChange = useCallback((id: string, tipo: DocumentBlockType) => {
    handleUpdate(id, { tipo, conteudo: "" });
  }, [handleUpdate]);

  const handleSlashMenu = useCallback((blockId: string, pos: { top: number; left: number }) => {
    setSlashMenu({ open: true, blockId, pos });
  }, []);

  // ── DnD ────────────────────────────────────────────────────────────────────
  const handleDragStart = ({ active }: DragStartEvent) => {
    const block = blocks.find((b) => b.id === active.id);
    if (block) setDraggingBlock(block);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setDraggingBlock(null);
    if (!over || active.id === over.id) return;

    setBlocks((prev) => {
      const from = prev.find((b) => b.id === active.id);
      if (!from || from.tipo === "header") return prev;

      const oldIdx = prev.findIndex((b) => b.id === active.id);
      const newIdx = prev.findIndex((b) => b.id === over.id);

      const next = [...prev];
      const [moved] = next.splice(oldIdx, 1);
      next.splice(newIdx, 0, moved);
      const reindexed = next.map((b, i) => ({ ...b, posicao: i }));
      scheduleSave(reindexed);
      return reindexed;
    });
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (nucleoLoading || canvasLoading || blocosLoading || !initialized) {
    return (
      <div className={cn("mx-auto px-4 py-8 space-y-3", fullWidth ? "max-w-full" : "max-w-3xl")}>
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-8 w-2/3 rounded-lg" />
        <Skeleton className="h-5 w-full rounded" />
        <Skeleton className="h-5 w-4/5 rounded" />
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-32 w-full rounded-xl mt-6" />
      </div>
    );
  }

  const nonHeaderBlocks = blocks.filter((b) => b.tipo !== "header");

  return (
    <div className={cn("min-h-screen bg-background relative")}>
      {/* Indicador de salvamento */}
      <div
        className={cn(
          "fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500",
          isSaving
            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20 opacity-100"
            : "opacity-0 pointer-events-none"
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
        Salvando...
      </div>

      <div className={cn("mx-auto px-0 pb-32", fullWidth ? "max-w-full" : "max-w-3xl")}>
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
              {blocks.map((block) => {
                if (block.tipo === "header") {
                  return (
                    <HeaderBlock
                      key={block.id}
                      nucleo={nucleo!}
                      fullWidth={fullWidth}
                    />
                  );
                }

                if (isFunctional(block.tipo)) {
                  return (
                    <SortableDocumentBlock
                      key={block.id}
                      block={block}
                      isActive={activeBlockId === block.id}
                      onActivate={() => setActiveBlockId(block.id)}
                      readOnly={readOnly}
                    >
                      <FunctionalBlockCard
                        block={block}
                        nucleoId={nucleoId}
                        isDeleting={isDeleting}
                        onOpenFullPage={() =>
                          router.push(`/dashboard/nucleos/${nucleoId}/blocos/${block.id}`)
                        }
                        onDelete={() => handleDeleteFunctional(block.id)}
                        onEditTitle={(titulo) => {
                          updateBloco({ id: block.id, payload: { titulo } });
                        }}
                      />
                    </SortableDocumentBlock>
                  );
                }

                return (
                  <SortableDocumentBlock
                    key={block.id}
                    block={block}
                    isActive={activeBlockId === block.id}
                    onActivate={() => setActiveBlockId(block.id)}
                    onDelete={!readOnly ? handleDelete : undefined}
                    onDuplicate={!readOnly ? handleDuplicate : undefined}
                    readOnly={readOnly}
                  >
                    <TextBlockRenderer
                      block={block}
                      isActive={activeBlockId === block.id}
                      onActivate={() => setActiveBlockId(block.id)}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                      onAddBelow={(tipo) => handleAddText(tipo as DocumentBlockType, block.id)}
                      onTypeChange={handleTypeChange}
                      onSlashMenu={(pos) => handleSlashMenu(block.id, pos)}
                      readOnly={readOnly}
                    />
                  </SortableDocumentBlock>
                );
              })}
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

        {/* AddBlockTrigger — sempre visível no final */}
        {!readOnly && (
          <AddBlockTrigger
            onAddText={handleAddText}
            onAddFunctional={handleAddFunctional}
            isCreating={isCreating}
          />
        )}
      </div>

      {/* Slash Menu */}
      <SlashMenu
        open={slashMenu.open}
        position={slashMenu.pos}
        onSelect={(tipo) => {
          setSlashMenu((s) => ({ ...s, open: false }));
          if (isFunctional(tipo)) {
            handleAddFunctional(tipo);
          } else {
            handleAddText(tipo as DocumentBlockType, slashMenu.blockId);
          }
        }}
        onClose={() => setSlashMenu((s) => ({ ...s, open: false }))}
      />
    </div>
  );
}
