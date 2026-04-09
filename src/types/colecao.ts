// src/types/colecao.ts
export type TipoCampo =
  | "texto"
  | "numero"
  | "data"
  | "booleano"
  | "arquivo"
  | "select"
  | "relacao";

export interface Colecao {
  id: string;
  blocoId: string;
  nome?: string;
  createdAt: string;
  updatedAt: string;
  campos?: Campo[];
  itens?: Item[];
}

export interface Campo {
  id: string;
  colecaoId: string;
  nome?: string;
  tipoCampo: TipoCampo;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  colecaoId: string;
  createdAt: string;
  updatedAt: string;
  valores?: ItemValor[];
}

export interface ItemValor {
  id: string;
  itemId: string;
  campoId: string;
  valorTexto?: string;
  valorNumerico?: number;
  valorData?: string;
  valorBooleano?: boolean;
  campo?: Campo;
}
