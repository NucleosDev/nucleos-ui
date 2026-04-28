// src/lib/canvas-utils.ts
import type { Bloco } from "@/types/bloco";
import type {
  CanvasItem,
  FunctionalBlockRef,
  TextBlock,
} from "@/components/canvas/types";

export function blocoToFunctionalBlockRef(bloco: Bloco): FunctionalBlockRef {
  return {
    id: `ref-${bloco.id}`,
    type: "functional",
    blockId: bloco.id,
    blockType: bloco.tipo,
    title: bloco.titulo || `Bloco ${bloco.tipo}`,
  };
}

export function isTextBlock(item: CanvasItem): item is TextBlock {
  return item.type !== "functional";
}

export function isFunctionalBlockRef(
  item: CanvasItem,
): item is FunctionalBlockRef {
  return item.type === "functional";
}
