// src/types/bloco.ts
import { Tarefa } from "./tarefas";
import { Lista } from "./lista";
import { Habito } from "./habitos";
import { Colecao } from "./colecao";

export type BlocoTipo =
  | "tarefas"
  | "habitos"
  | "habito"
  | "timer"
  | "timers"
  | "notas"
  | "lista"
  | "calendario"
  | "calculo"
  | "colecoes"
  | "tabela"
  | "galeria"
  | "quadro"
  | "exercicios"
  | "canvas"
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
  | "column-layout";

export interface Bloco {
  id: string;
  nucleoId: string;
  tipo: BlocoTipo;
  titulo: string | null;
  conteudo?: string | null;
  posicao: number;
  configuracoes: Record<string, any> | null;
  parentId?: string | null;
  path?: string | null;
  depth?: number;
  isCanvas?: boolean;
  children?: Bloco[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  tarefas?: Tarefa[];
  listas?: Lista[];
  habitos?: Habito[];
  colecoes?: Colecao[];
  calculo?: BlocoCalculo;
}

export interface BlocoCalculo {
  id: string;
  blocoId: string;
  tipoOperacao: string;
  campo?: string;
  agruparPor?: string;
  config?: Record<string, any>;
  createdAt: string;
}

export interface CreateBlocoPayload {
  nucleoId: string;
  tipo: BlocoTipo;
  titulo?: string;
  posicao?: number;
  configuracoes?: Record<string, any>;
  parentId?: string | null;
}

export interface UpdateBlocoPayload {
  nucleoId?: string; // ✅ ADICIONADO - exigido pelo backend no update
  titulo?: string;
  tipo?: string; // ✅ também pode ser útil
  posicao?: number;
  configuracoes?: Record<string, any>;
  parentId?: string | null;
}

export interface ReorderBlocosPayload {
  nucleoId: string;
  orders: { id: string; posicao: number }[];
  parentId?: string | null;
}
