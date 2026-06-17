// src/types/document.ts

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
  | "tarefas"
  | "calendario"
  | "habitos"
  | "lista"
  | "timer"
  | "colecoes"
  | "notas";

export interface DocumentBlock {
  id: string;
  nucleoId: string;
  tipo: DocumentBlockType;
  titulo?: string;
  conteudo?: string;
  configuracoes?: Record<string, any>;
  posicao: number;
  parentId?: string;
  layout?: "full" | "col-1-2" | "col-1-3" | "col-2-3";
  criado_em?: string;
  atualizado_em?: string;
}

export interface NucleoMetadata {
  id: string;
  titulo: string;
  descricao?: string;
  icone?: string;
  banner?: string;
  background_color?: string;
  cor?: string;
  criado_em?: string;
  atualizado_em?: string;
}
