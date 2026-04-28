// src/types/canvas.ts

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
}

export interface FunctionalBlockRef {
  id: string;
  type: "functional";
  blockId: string;
  blockType: string;
  title?: string;
}

export type CanvasItem = TextBlock | FunctionalBlockRef;
