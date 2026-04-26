// src/components/nucleo/NucleoCanvas.tsx
"use client";

import { useState, useEffect } from "react";
import { useCanvasBlocks } from "@/hooks/useCanvas";
import { CanvasEditor } from "@/components/canvas/CanvasEditor";
import type { CanvasBlock } from "@/components/canvas/types";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const generateId = () => crypto.randomUUID();

// 🔥 Block inicial com tipagem correta
const INITIAL_BLOCK: CanvasBlock = {
  id: generateId(),
  type: "paragraph",
  content: "",
};

interface NucleoCanvasProps {
  nucleoId: string;
  onAddFunctionalBlock: () => void;
  isLoading?: boolean;
}

export function NucleoCanvas({
  nucleoId,
  onAddFunctionalBlock,
  isLoading,
}: NucleoCanvasProps) {
  const {
    blocks: savedBlocks,
    isLoading: blocksLoading,
    updateBlocks,
    isSaving,
  } = useCanvasBlocks(nucleoId);
  const [localBlocks, setLocalBlocks] = useState<CanvasBlock[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  console.log("📦 NucleoCanvas - savedBlocks recebidos:", savedBlocks);
  console.log("📦 NucleoCanvas - localBlocks:", localBlocks);

  // Carregar os blocks salvos
  useEffect(() => {
    if (!isInitialized && !blocksLoading && !isLoading) {
      if (savedBlocks && savedBlocks.length > 0) {
        console.log("✅ Carregando blocks salvos:", savedBlocks);
        setLocalBlocks(savedBlocks);
      } else {
        console.log("📝 Criando block inicial");
        setLocalBlocks([INITIAL_BLOCK]);
      }
      setIsInitialized(true);
    }
  }, [savedBlocks, blocksLoading, isLoading, isInitialized]);

  const handleCanvasChange = (blocks: CanvasBlock[]) => {
    console.log("📝 Canvas alterado:", blocks);
    setLocalBlocks(blocks);
    updateBlocks(blocks);
  };

  if (blocksLoading || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-border/50" />
        </div>
      </div>
    );
  }

  // 🔥 Garantir que sempre temos blocks para mostrar
  const displayBlocks = localBlocks.length > 0 ? localBlocks : [INITIAL_BLOCK];

  return (
    <div className="space-y-6">
      <CanvasEditor
        blocks={displayBlocks}
        onBlocksChange={handleCanvasChange}
        onAddFunctionalBlock={onAddFunctionalBlock}
        placeholder="Digite '/' para comandos..."
      />
      {isSaving && (
        <div className="fixed bottom-4 right-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded shadow-md">
          Salvando...
        </div>
      )}
      <div className="flex items-center gap-4">
        <div className="flex-1 border-t border-border/50" />
        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          BLOCOS FUNCIONAIS
        </span>
        <div className="flex-1 border-t border-border/50" />
      </div>
    </div>
  );
}
