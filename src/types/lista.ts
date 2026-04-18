// src/types/lista.ts
export type TipoLista = "generica" | "compras" | "financeiro";

export interface Lista {
  id: string;
  blocoId: string;
  nome: string;
  tipoLista: TipoLista;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  itens?: ItemLista[];
  categorias?: Categoria[];
}

export interface ItemLista {
  id: string;
  listaId: string;
  categoriaId?: string;
  nome: string;
  quantidade: number;
  valorUnitario?: number;
  valorTotal?: number;
  checked: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  categoria?: Categoria;
}

export interface Categoria {
  id: string;
  listaId: string;
  nome: string;
  cor?: string;
  createdAt: string;
}

export interface CreateListaPayload {
  blocoId: string;
  nome: string;
  tipoLista?: TipoLista;
}

export interface CreateItemListaPayload {
  listaId: string;
  nome: string;
  quantidade?: number;
  valorUnitario?: number;
  categoriaId?: string;
}

export interface UpdateItemListaPayload extends Partial<
  Omit<CreateItemListaPayload, "listaId">
> {
  checked?: boolean;
}

export interface UpdateListaPayload extends Partial<
  Omit<CreateListaPayload, "blocoId">
> {
  id: string;
}
