// src/components/document/document-types.ts

import type { Bloco } from "@/types/bloco";

export type DocumentBlockType =
  | "header"
  | "paragraph"
  | "h1"
  | "h2"
  | "h3"
  | "quote"
  | "code"
  | "divider"
  | "bullet-list"
  | "numbered-list"
  | "todo"
  // Funcionais (do banco)
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
  titulo?: string;
  conteudo?: string;
  posicao: number;
  completed?: boolean; // Para todo
  isDeletable?: boolean;
  /** Referência ao bloco original do banco (blocos funcionais) */
  blocoRef?: Bloco;
}

export type TextDocumentBlockType = Exclude<
  DocumentBlockType,
  "header" | "tarefas" | "calendario" | "habitos" | "habito" | "lista" | "timer" | "timers" | "colecoes" | "notas"
>;

export const TEXT_BLOCK_TYPES: TextDocumentBlockType[] = [
  "paragraph", "h1", "h2", "h3", "quote", "code",
  "divider", "bullet-list", "numbered-list", "todo",
];

export const FUNCTIONAL_BLOCK_TYPES = [
  "tarefas", "calendario", "habitos", "habito",
  "lista", "timer", "timers", "colecoes", "notas",
] as const;
