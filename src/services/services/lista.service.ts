// src/services/lista.service.ts
import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/routes";
import type {
  Lista,
  ItemLista,
  Categoria,
  CreateListaPayload,
  UpdateListaPayload,
  CreateItemListaPayload,
  UpdateItemListaPayload,
} from "@/types/lista";

export const listasService = {
  // ===== LISTAS =====
  async listarPorBloco(blocoId: string): Promise<Lista[]> {
    return api.get(API_ROUTES.LISTAS.LIST(blocoId));
  },

  async buscarPorId(id: string): Promise<Lista> {
    return api.get(API_ROUTES.LISTAS.BY_ID(id));
  },

  async criar(payload: CreateListaPayload): Promise<Lista> {
    return api.post(API_ROUTES.LISTAS.CREATE, payload);
  },

  async atualizar(id: string, payload: UpdateListaPayload): Promise<Lista> {
    return api.put(API_ROUTES.LISTAS.UPDATE(id), payload);
  },

  async deletar(id: string): Promise<void> {
    return api.delete(API_ROUTES.LISTAS.DELETE(id));
  },

  // ===== ITENS =====
  async listarItens(listaId: string): Promise<ItemLista[]> {
    return api.get(API_ROUTES.LISTAS.ITENS.LIST(listaId));
  },

  async criarItem(payload: CreateItemListaPayload): Promise<ItemLista> {
    return api.post(API_ROUTES.LISTAS.ITENS.CREATE, payload);
  },

  async atualizarItem(
    id: string,
    payload: UpdateItemListaPayload,
  ): Promise<ItemLista> {
    return api.put(API_ROUTES.LISTAS.ITENS.UPDATE(id), payload);
  },

  async toggleItem(id: string): Promise<ItemLista> {
    return api.patch(API_ROUTES.LISTAS.ITENS.TOGGLE(id));
  },

  async deletarItem(id: string): Promise<void> {
    return api.delete(API_ROUTES.LISTAS.ITENS.DELETE(id));
  },

  // ===== CATEGORIAS =====
  async listarCategorias(listaId: string): Promise<Categoria[]> {
    return api.get(API_ROUTES.LISTAS.CATEGORIAS.LIST(listaId));
  },

  async criarCategoria(payload: {
    listaId: string;
    nome: string;
    cor?: string;
  }): Promise<Categoria> {
    return api.post(API_ROUTES.LISTAS.CATEGORIAS.CREATE, payload);
  },

  async deletarCategoria(id: string): Promise<void> {
    return api.delete(API_ROUTES.LISTAS.CATEGORIAS.DELETE(id));
  },
};
