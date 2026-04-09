// src/services/listas.service.ts
import api from "@/services/api";
import { API_ROUTES } from "@/constants/routes";
import type {
  Lista,
  ItemLista,
  Categoria,
  CreateListaPayload,
  CreateItemListaPayload,
} from "@/types/lista";

export const listasService = {
  // ===========================================================================
  // LISTAS
  // ===========================================================================

  /**
   * Busca todas as listas de um bloco
   */
  async getListasByBloco(blocoId: string): Promise<Lista[]> {
    const response = await api.get<Lista[]>(
      API_ROUTES.LISTAS.BY_BLOCO(blocoId),
    );
    return response.data;
  },

  /**
   * Busca uma lista específica por ID
   */
  async getLista(id: string): Promise<Lista> {
    const response = await api.get<Lista>(API_ROUTES.LISTAS.BY_ID(id));
    return response.data;
  },

  /**
   * Cria uma nova lista em um bloco
   */
  async createLista(payload: CreateListaPayload): Promise<Lista> {
    const response = await api.post<Lista>(API_ROUTES.LISTAS.BASE, payload);
    return response.data;
  },

  /**
   * Atualiza uma lista existente
   */
  async updateLista(
    id: string,
    payload: Partial<CreateListaPayload>,
  ): Promise<Lista> {
    const response = await api.put<Lista>(API_ROUTES.LISTAS.BY_ID(id), payload);
    return response.data;
  },

  /**
   * Remove uma lista (soft delete)
   */
  async deleteLista(id: string): Promise<void> {
    await api.delete(API_ROUTES.LISTAS.BY_ID(id));
  },

  // ===========================================================================
  // ITENS DA LISTA
  // ===========================================================================

  /**
   * Busca todos os itens de uma lista
   */
  async getItensByLista(listaId: string): Promise<ItemLista[]> {
    const response = await api.get<ItemLista[]>(
      API_ROUTES.LISTAS.ITEMS(listaId),
    );
    return response.data;
  },

  /**
   * Busca um item específico por ID
   */
  async getItem(id: string): Promise<ItemLista> {
    const response = await api.get<ItemLista>(`/v1/itens-lista/${id}`);
    return response.data;
  },

  /**
   * Cria um novo item em uma lista
   */
  async createItem(payload: CreateItemListaPayload): Promise<ItemLista> {
    const response = await api.post<ItemLista>("/v1/itens-lista", payload);
    return response.data;
  },

  /**
   * Atualiza um item da lista
   */
  async updateItem(
    id: string,
    payload: Partial<CreateItemListaPayload>,
  ): Promise<ItemLista> {
    const response = await api.put<ItemLista>(`/v1/itens-lista/${id}`, payload);
    return response.data;
  },

  /**
   * Marca/desmarca um item como concluído
   */
  async toggleItemChecked(id: string, checked: boolean): Promise<ItemLista> {
    const response = await api.patch<ItemLista>(
      `/v1/itens-lista/${id}/toggle`,
      { checked },
    );
    return response.data;
  },

  /**
   * Remove um item da lista (soft delete)
   */
  async deleteItem(id: string): Promise<void> {
    await api.delete(`/v1/itens-lista/${id}`);
  },

  /**
   * Reordena os itens de uma lista
   */
  async reorderItems(
    listaId: string,
    orders: { id: string; ordem: number }[],
  ): Promise<ItemLista[]> {
    const response = await api.post<ItemLista[]>(
      `/v1/listas/${listaId}/reorder`,
      { orders },
    );
    return response.data;
  },

  /**
   * Atualiza múltiplos itens em lote (ex: marcar vários como concluídos)
   */
  async bulkUpdateItems(
    items: { id: string; checked?: boolean; quantidade?: number }[],
  ): Promise<void> {
    await api.post("/v1/itens-lista/bulk", { items });
  },

  // ===========================================================================
  // CATEGORIAS
  // ===========================================================================

  /**
   * Busca todas as categorias de uma lista
   */
  async getCategorias(listaId: string): Promise<Categoria[]> {
    const response = await api.get<Categoria[]>(
      `/v1/listas/${listaId}/categorias`,
    );
    return response.data;
  },

  /**
   * Cria uma nova categoria para a lista
   */
  async createCategoria(
    listaId: string,
    nome: string,
    cor?: string,
  ): Promise<Categoria> {
    const response = await api.post<Categoria>(
      `/v1/listas/${listaId}/categorias`,
      { nome, cor },
    );
    return response.data;
  },

  /**
   * Atualiza uma categoria
   */
  async updateCategoria(
    id: string,
    nome?: string,
    cor?: string,
  ): Promise<Categoria> {
    const response = await api.put<Categoria>(`/v1/categorias/${id}`, {
      nome,
      cor,
    });
    return response.data;
  },

  /**
   * Remove uma categoria
   */
  async deleteCategoria(id: string): Promise<void> {
    await api.delete(`/v1/categorias/${id}`);
  },
};

export default listasService;
