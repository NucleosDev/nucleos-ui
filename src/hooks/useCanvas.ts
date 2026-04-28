// src/hooks/useCanvas.ts — VERSÃO CORRIGIDA
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
// ⚠️ useRef é do React, não do tanstack
import { useRef } from "react";
import { canvasService } from "@/services/canvas.service";
import type { CanvasItem } from "@/components/canvas/types";

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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["canvas-blocks", nucleoId] }),
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
