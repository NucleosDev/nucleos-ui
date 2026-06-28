// src/hooks/useDocumentBlocks.ts
//
// Manages document text blocks as individual DB records (parent_id = canvas_id).
// Falls back to JSON blob for nucleos not yet migrated, and migrates lazily on
// first load.
//
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRef, useCallback } from "react";
import { canvasService } from "@/services/canvas.service";
import { blocosService } from "@/services/blocos.service";
import type { DocumentBlock, DocumentBlockType, LayoutColumn } from "@/components/document/document-types";
import type { CreateBlocoPayload, UpdateBlocoPayload } from "@/types/bloco";

const TEXT_BLOCK_TYPES = new Set([
  "paragraph", "h1", "h2", "h3", "quote", "code",
  "bullet-list", "numbered-list", "todo", "divider", "column-layout",
]);

function isTextBlockType(tipo: string): tipo is DocumentBlockType {
  return TEXT_BLOCK_TYPES.has(tipo);
}

const QUERY_KEY = (nucleoId: string) => ["document-blocks", nucleoId];

export function useDocumentBlocks(nucleoId: string) {
  const queryClient = useQueryClient();
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // ── Fetch: canvas bloco → children, or migrate from blob ────────────────
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEY(nucleoId),
    queryFn: async () => {
      const canvas = await canvasService.getCanvas(nucleoId);
      if (!canvas?.id) return { canvasId: null, blocks: [] as DocumentBlock[] };

      const canvasId = canvas.id;

      // Try to load individual sub-blocks first
      const children = await blocosService.listarFilhos(canvasId, nucleoId);
      const textChildren = children.filter((b) => isTextBlockType(b.tipo));

      if (textChildren.length > 0) {
        return {
          canvasId,
          blocks: textChildren
            .sort((a, b) => a.posicao - b.posicao)
            .map((b, i) => ({
              id: b.id,
              nucleoId,
              tipo: b.tipo as DocumentBlockType,
              conteudo: b.conteudo ?? "",
              titulo: b.titulo ?? undefined,
              posicao: i,
              completed: (b as any).completed ?? false,
              configuracoes: b.configuracoes ?? undefined,
            } satisfies DocumentBlock)),
        };
      }

      // No individual records — migrate from blob
      if (!canvas.content) {
        return { canvasId, blocks: [] as DocumentBlock[] };
      }

      let blobItems: any[] = [];
      try {
        blobItems = JSON.parse(canvas.content);
      } catch {
        return { canvasId, blocks: [] as DocumentBlock[] };
      }

      if (!Array.isArray(blobItems) || blobItems.length === 0) {
        return { canvasId, blocks: [] as DocumentBlock[] };
      }

      // Migrate: create individual records for each blob item
      const created: DocumentBlock[] = [];
      for (let i = 0; i < blobItems.length; i++) {
        const item = blobItems[i];
        if (!isTextBlockType(item.type)) continue;
        try {
          const payload: CreateBlocoPayload = {
            nucleoId,
            tipo: item.type as any,
            posicao: i,
            parentId: canvasId,
          };
          const bloco = await blocosService.criar(payload);
          // Set content immediately after creation
          if (item.content) {
            await blocosService.patchContent(bloco.id, item.content);
          }
          created.push({
            id: bloco.id,
            nucleoId,
            tipo: item.type as DocumentBlockType,
            conteudo: item.content || "",
            posicao: i,
            completed: item.completed ?? false,
          });
        } catch {
          // skip failed migrations
        }
      }

      // Clear the blob now that records exist
      if (created.length > 0) {
        await canvasService.saveCanvas(nucleoId, "[]");
      }

      return { canvasId, blocks: created };
    },
    enabled: !!nucleoId,
    staleTime: 1000 * 60,
  });

  const canvasId = data?.canvasId ?? null;
  const blocks = data?.blocks ?? [];

  // ── Optimistic helpers ───────────────────────────────────────────────────
  const setBlocks = useCallback(
    (updater: DocumentBlock[] | ((prev: DocumentBlock[]) => DocumentBlock[])) => {
      queryClient.setQueryData(QUERY_KEY(nucleoId), (old: typeof data) => {
        if (!old) return old;
        const next =
          typeof updater === "function" ? updater(old.blocks) : updater;
        return { ...old, blocks: next };
      });
    },
    [queryClient, nucleoId],
  );

  // ── Create ───────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: async ({
      tipo,
      afterId,
      posicao,
    }: {
      tipo: DocumentBlockType;
      afterId?: string;
      posicao: number;
    }) => {
      if (!canvasId) throw new Error("Canvas não encontrado");
      const bloco = await blocosService.criar({
        nucleoId,
        tipo: tipo as any,
        posicao,
        parentId: canvasId,
      });
      return bloco;
    },
    onMutate: ({ tipo, afterId }) => {
      const tempId = crypto.randomUUID();
      const newBlock: DocumentBlock = {
        id: tempId,
        nucleoId,
        tipo,
        conteudo: "",
        posicao: 0,
      };
      setBlocks((prev) => {
        const idx = afterId ? prev.findIndex((b) => b.id === afterId) : prev.length - 1;
        const next = [...prev];
        next.splice(idx + 1, 0, newBlock);
        return next.map((b, i) => ({ ...b, posicao: i }));
      });
      return { tempId };
    },
    onSuccess: (bloco, _vars, ctx) => {
      // Replace temp ID with real one
      setBlocks((prev) =>
        prev.map((b) => (b.id === ctx?.tempId ? { ...b, id: bloco.id } : b)),
      );
    },
    onError: (_err, _vars, ctx) => {
      setBlocks((prev) => prev.filter((b) => b.id !== ctx?.tempId));
    },
  });

  // ── Delete ───────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => blocosService.deletar(id),
    onMutate: (id) => {
      const snapshot = blocks;
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      return { snapshot };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.snapshot) setBlocks(ctx.snapshot);
    },
  });

  // ── Update content (debounced per block) ─────────────────────────────────
  const updateContent = useCallback(
    (id: string, html: string, tipo?: DocumentBlockType) => {
      // Optimistic
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, conteudo: html, ...(tipo ? { tipo } : {}) } : b,
        ),
      );

      // Debounced persist
      const existing = debounceTimers.current.get(id);
      if (existing) clearTimeout(existing);
      const timer = setTimeout(async () => {
        debounceTimers.current.delete(id);
        try {
          await blocosService.patchContent(id, html, tipo);
        } catch {
          // silently fail — next save will retry
        }
      }, 600);
      debounceTimers.current.set(id, timer);
    },
    [setBlocks],
  );

  // ── Update configuracoes (column-layout inner blocks) ────────────────────
  const configTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const updateConfiguracoes = useCallback(
    (id: string, configuracoes: UpdateBlocoPayload["configuracoes"]) => {
      setBlocks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, configuracoes } : b)),
      );

      const existing = configTimers.current.get(id);
      if (existing) clearTimeout(existing);
      const timer = setTimeout(async () => {
        configTimers.current.delete(id);
        try {
          await blocosService.atualizar(id, { nucleoId, configuracoes });
        } catch {
          // silently retry on next save
        }
      }, 600);
      configTimers.current.set(id, timer);
    },
    [setBlocks, nucleoId],
  );

  // ── Reorder (drag & drop) ────────────────────────────────────────────────
  const reorderMutation = useMutation({
    mutationFn: async (reordered: DocumentBlock[]) => {
      if (!canvasId) return;
      await blocosService.reordenar({
        nucleoId,
        orders: reordered.map((b, i) => ({ id: b.id, posicao: i })),
      });
    },
  });

  const reorder = useCallback(
    (reordered: DocumentBlock[]) => {
      setBlocks(reordered.map((b, i) => ({ ...b, posicao: i })));
      reorderMutation.mutate(reordered);
    },
    [setBlocks, reorderMutation],
  );

  // ── Add block ────────────────────────────────────────────────────────────
  const addBlock = useCallback(
    (tipo: DocumentBlockType, afterId?: string) => {
      const afterIdx = afterId
        ? blocks.findIndex((b) => b.id === afterId)
        : blocks.length - 1;
      createMutation.mutate({ tipo, afterId, posicao: afterIdx + 1 });
    },
    [blocks, createMutation],
  );

  // ── Delete block ─────────────────────────────────────────────────────────
  const deleteBlock = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  return {
    canvasId,
    blocks,
    isLoading,
    error,
    addBlock,
    deleteBlock,
    updateContent,
    updateConfiguracoes,
    reorder,
    isSaving:
      createMutation.isPending ||
      deleteMutation.isPending ||
      reorderMutation.isPending,
  };
}
