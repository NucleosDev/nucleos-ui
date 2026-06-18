// src/types/lista.ts

export type TipoLista = "financeiro" | "compras" | "generico";

export interface Lista {
  id: string;
  blocoId: string;
  nome: string;
  tipoLista: TipoLista;
  orcamento?: number;
  metadata?: ListaMetadata;
  itens?: ItemLista[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ListaMetadata {
  localCompra?: string;
  dataLimite?: string;
  tags?: string[];
  moeda?: string;
  icone?: string;
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

// ── Payloads ─────────────────────────────────────────────────────────────

export interface CreateListaPayload {
  blocoId: string;
  nome: string;
  tipoLista?: TipoLista;
}

export interface UpdateListaPayload extends Partial<
  Omit<CreateListaPayload, "blocoId">
> {
  orcamento?: number;
  metadata?: ListaMetadata;
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
