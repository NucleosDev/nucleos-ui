// src/hooks/useCanvasBlocks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { canvasService } from "@/services/canvas.service";
import type { CanvasBlock } from "@/components/canvas/types";

export function useCanvasBlocks(nucleoId: string) {
  const queryClient = useQueryClient();
  let debounceTimer: NodeJS.Timeout | null = null;

  // 📖 Buscar blocks - igual ao useColecoes
  const {
    data: blocks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["canvas-blocks", nucleoId],
    queryFn: async () => {
      console.log("🔍 Buscando blocks do canvas...");
      const data = await canvasService.getCanvas(nucleoId);
      console.log("📥 Dados brutos:", data);

      if (!data || !data.content) return [];

      const parsed = JSON.parse(data.content);
      console.log("📦 Parsed:", parsed);

      // 🔥 Garante que os tipos estão corretos
      const typedBlocks: CanvasBlock[] = parsed.map((block: any) => ({
        id: block.id,
        type: block.type as CanvasBlock["type"],
        content: block.content || "",
        completed: block.completed || false,
      }));

      console.log("✅ Blocks tipados:", typedBlocks);
      return typedBlocks;
    },
    enabled: !!nucleoId,
    staleTime: 1000 * 60,
  });

  // 💾 Salvar blocks
  const saveMutation = useMutation({
    mutationFn: async (newBlocks: CanvasBlock[]) => {
      console.log("💾 Salvando blocks:", newBlocks);
      const content = JSON.stringify(newBlocks);
      await canvasService.saveCanvas(nucleoId, content);
    },
    onSuccess: () => {
      console.log("✅ Canvas salvo com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["canvas-blocks", nucleoId] });
    },
    onError: (error) => {
      console.error("❌ Erro ao salvar canvas:", error);
    },
  });

  // Função para atualizar os blocks com debounce
  const updateBlocks = (newBlocks: CanvasBlock[]) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      saveMutation.mutate(newBlocks);
    }, 800);
  };

  // Salvar imediatamente
  const saveNow = (newBlocks: CanvasBlock[]) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    saveMutation.mutate(newBlocks);
  };

  return {
    blocks,
    isLoading,
    error,
    updateBlocks,
    saveNow,
    isSaving: saveMutation.isPending,
  };
}
