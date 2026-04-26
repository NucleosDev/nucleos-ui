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
  | "canvas"; // NOVO TIPO

export interface Bloco {
  id: string;
  nucleoId: string;
  tipo: BlocoTipo;
  titulo: string | null;
  posicao: number;
  configuracoes: Record<string, any> | null;
  // NOVOS CAMPOS
  parentId?: string | null;
  path?: string | null;
  depth?: number;
  isCanvas?: boolean;
  children?: Bloco[]; // Para árvore no front-end
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  // Relacionamentos opcionais
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
  parentId?: string | null; // NOVO
}

export interface UpdateBlocoPayload {
  titulo?: string;
  posicao?: number;
  configuracoes?: Record<string, any>;
  parentId?: string | null; // NOVO
}

export interface ReorderBlocosPayload {
  nucleoId: string;
  orders: { id: string; posicao: number }[];
  parentId?: string | null; // NOVO - para reordenar dentro de um pai
}
