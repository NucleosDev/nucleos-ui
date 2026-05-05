// src/components/canvas/types.ts
import type { BlocoTipo } from "@/types/bloco";

export type TextBlockType =
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

export interface TextBlock {
  id: string;
  type: TextBlockType;
  content: string;
  completed?: boolean;
  x?: number;
  y?: number;
}

export interface FunctionalBlockRef {
  id: string;
  type: "functional";
  blockId: string;
  blockType: string;
  title: string;
   x?: number;
  y?: number;
}

export type CanvasItem = TextBlock | FunctionalBlockRef;
export type CanvasBlock = TextBlock; // Para compatibilidade