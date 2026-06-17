// src/components/document/document-types.ts

import type { Bloco } from "@/types/bloco";

export type DocumentBlockType =
  | "paragraph"
  | "h1"
  | "h2"
  | "h3"
  | "quote"
  | "code"
  | "bullet-list"
  | "numbered-list"
  | "todo"
  | "divider"
  | "header"
  | "column-layout"
  | "tarefas"
  | "calendario"
  | "habitos"
  | "habito"
  | "lista"
  | "timer"
  | "timers"
  | "colecoes"
  | "notas";

export const FUNCTIONAL_TYPES = new Set([
  "tarefas",
  "calendario",
  "habitos",
  "habito",
  "lista",
  "timer",
  "timers",
  "colecoes",
  "notas",
] as const);

export const TEXT_TYPES = new Set([
  "paragraph",
  "h1",
  "h2",
  "h3",
  "quote",
  "code",
  "divider",
  "bullet-list",
  "numbered-list",
  "todo",
] as const);

export function isFunctional(tipo: string): boolean {
  return FUNCTIONAL_TYPES.has(tipo as any);
}

export function isTextType(tipo: string): boolean {
  return TEXT_TYPES.has(tipo as any);
}

export interface DocumentBlock {
  id: string;
  nucleoId: string;
  tipo: DocumentBlockType;
  conteudo?: string;
  titulo?: string;
  posicao: number;
  isDeletable?: boolean;
  completed?: boolean;
  blocoRef?: Bloco;
  configuracoes?: Record<string, any>;
}

export interface NucleoDocumentState {
  blocks: DocumentBlock[];
  selectedIds: Set<string>;
  activeBlockId: string | null;
}

export interface LayoutColumn {
  id: string;
  width: number;
  blocks: DocumentBlock[];
}

export interface LayoutRow {
  id: string;
  type: "full" | "columns";
  blocks?: DocumentBlock[];
  columns?: LayoutColumn[];
}

export type DocumentLayout = LayoutRow[];
