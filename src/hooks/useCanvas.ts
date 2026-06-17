// src/hooks/useCanvas.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRef, useMemo, useCallback } from "react";
import { canvasService } from "@/services/canvas.service";
import type { CanvasItem, TextBlock } from "@/components/canvas/types";
import type { JSONContent } from "@tiptap/core";

// ── Legacy block array → TipTap JSON migration ────────────────────────────────

const LEGACY_TEXT_TYPES = new Set([
  "paragraph", "h1", "h2", "h3", "quote", "code",
  "bullet-list", "numbered-list", "todo", "divider",
]);

function isTextBlock(item: CanvasItem): item is TextBlock {
  return LEGACY_TEXT_TYPES.has(item.type);
}

function legacyToTiptap(items: CanvasItem[]): JSONContent {
  const nodes: JSONContent[] = items
    .filter(isTextBlock)
    .map((item): JSONContent => {
      const raw = item.content ?? "";
      const textNode: JSONContent[] = raw ? [{ type: "text", text: raw }] : [];

      switch (item.type) {
        case "h1":
          return { type: "heading", attrs: { level: 1 }, content: textNode.length ? textNode : undefined };
        case "h2":
          return { type: "heading", attrs: { level: 2 }, content: textNode.length ? textNode : undefined };
        case "h3":
          return { type: "heading", attrs: { level: 3 }, content: textNode.length ? textNode : undefined };
        case "quote":
          return {
            type: "blockquote",
            content: [{ type: "paragraph", content: textNode.length ? textNode : undefined }],
          };
        case "code":
          return { type: "codeBlock", attrs: { language: null }, content: textNode.length ? textNode : undefined };
        case "bullet-list":
          return {
            type: "bulletList",
            content: [{ type: "listItem", content: [{ type: "paragraph", content: textNode.length ? textNode : undefined }] }],
          };
        case "numbered-list":
          return {
            type: "orderedList",
            content: [{ type: "listItem", content: [{ type: "paragraph", content: textNode.length ? textNode : undefined }] }],
          };
        case "todo":
          return {
            type: "taskList",
            content: [{
              type: "taskItem",
              attrs: { checked: item.completed ?? false },
              content: [{ type: "paragraph", content: textNode.length ? textNode : undefined }],
            }],
          };
        case "divider":
          return { type: "horizontalRule" };
        default:
          return { type: "paragraph", content: textNode.length ? textNode : undefined };
      }
    });

  return {
    type: "doc",
    content: nodes.length > 0 ? nodes : [{ type: "paragraph" }],
  };
}

// ── useDocumentContent — unified TipTap document persistence ─────────────────

export function useDocumentContent(nucleoId: string) {
  const queryClient = useQueryClient();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const { data: rawContent, isLoading } = useQuery({
    queryKey: ["doc-content", nucleoId],
    queryFn: async () => {
      const data = await canvasService.getCanvas(nucleoId);
      return data?.content ?? null;
    },
    enabled: !!nucleoId,
    staleTime: 1000 * 60,
  });

  const tiptapContent = useMemo<JSONContent | null>(() => {
    if (!rawContent) return null;
    try {
      const parsed = JSON.parse(rawContent);
      if (Array.isArray(parsed)) return legacyToTiptap(parsed as CanvasItem[]);
      if (parsed?.type === "doc") return parsed as JSONContent;
    } catch {}
    return null;
  }, [rawContent]);

  const saveMutation = useMutation({
    mutationFn: (json: JSONContent) =>
      canvasService.saveCanvas(nucleoId, JSON.stringify(json)),
    onMutate: (json: JSONContent) => {
      queryClient.setQueryData(["doc-content", nucleoId], JSON.stringify(json));
    },
  });

  const save = useCallback(
    (json: JSONContent) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => saveMutation.mutate(json), 700);
    },
    [saveMutation],
  );

  return {
    tiptapContent,
    isLoading,
    save,
    isSaving: saveMutation.isPending,
  };
}

export function useCanvasBlocks(nucleoId: string) {
  const queryClient = useQueryClient();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null); // ← FIX: useRef

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["canvas-blocks", nucleoId],
    queryFn: async () => {
      const data = await canvasService.getCanvas(nucleoId);
      if (!data?.content) return [];
      try {
        return JSON.parse(data.content) as CanvasItem[];
      } catch {
        return []; // JSON corrompido não quebra o canvas
      }
    },
    enabled: !!nucleoId,
    staleTime: 1000 * 60,
  });

  const saveMutation = useMutation({
    mutationFn: (newItems: CanvasItem[]) =>
      canvasService.saveCanvas(nucleoId, JSON.stringify(newItems)),
    onMutate: (newItems: CanvasItem[]) => {
      queryClient.setQueryData(["canvas-blocks", nucleoId], newItems);
    },
  });

  const updateItems = (newItems: CanvasItem[]) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current); // ← FIX
    debounceTimer.current = setTimeout(() => {
      saveMutation.mutate(newItems);
    }, 800);
  };

  const saveNow = (newItems: CanvasItem[]) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    saveMutation.mutate(newItems);
  };

  return {
    items,
    isLoading,
    error,
    updateItems,
    saveNow,
    isSaving: saveMutation.isPending,
  };
}
