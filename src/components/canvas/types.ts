// src/components/canvas/types.ts
export type CanvasBlockType =
  | "h1"
  | "h2"
  | "h3"
  | "paragraph"
  | "quote"
  | "code"
  | "divider"
  | "bullet-list"
  | "numbered-list"
  | "todo";

import type { BlocoTipo } from "@/types/bloco";

export interface CanvasBlock {
  id: string;
  type: CanvasBlockType | BlocoTipo;
  content: string;
  completed?: boolean;
  blockId?: string;
}
