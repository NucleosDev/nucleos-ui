// src/types/bloco.ts
import { Tarefa } from "./tarefas";
import { Lista } from "./lista";
import { Habito } from "./habitos";
import { Colecao } from "./colecao";

export type BlocoTipo =
  | "tarefas"
  | "habitos"
  | "notas"
  | "lista"
  | "calendario"
  | "calculo";

export interface Bloco {
  id: string;
  nucleoId: string;
  tipo: BlocoTipo;
  titulo?: string;
  posicao: number;
  configuracoes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  // Relacionamentos
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
}

export interface UpdateBlocoPayload extends Partial<
  Omit<CreateBlocoPayload, "nucleoId">
> {
  id: string;
}

export interface ReorderBlocosPayload {
  nucleoId: string;
  orders: { id: string; posicao: number }[];
}
