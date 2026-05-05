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
  | "tarefas"
  | "calendario"
  | "habitos"
  | "habito"
  | "lista"
  | "timer"
  | "timers"
  | "colecoes"
  | "notas";

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
}

export interface NucleoDocumentState {
  blocks: DocumentBlock[];
  selectedIds: Set<string>;
  activeBlockId: string | null;
}

// Tipos para layout em colunas (uso futuro)
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
