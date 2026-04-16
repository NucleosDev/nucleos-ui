import api from "@/services/api";
import { API_ROUTES } from "@/constants/routes";
import type { Colecao, Campo, Item } from "@/types/colecao";

export const colecoesService = {
  // ===========================================================================
  // COLEÇÕES
  // ===========================================================================

  /**
   * Lista todas as coleções de um bloco específico.
   */
  async listByBloco(blocoId: string): Promise<Colecao[]> {
    const response = await api.get<Colecao[]>(
      API_ROUTES.COLECOES.LIST_BY_BLOCO(blocoId),
    );
    return response.data;
  },

  async getColecao(id: string): Promise<Colecao> {
    const response = await api.get<Colecao>(API_ROUTES.COLECOES.GET(id));
    return response.data;
  },

  /**
   * Cria uma nova coleção dentro de um bloco.
   */
  async createColecao(blocoId: string, nome: string): Promise<Colecao> {
    const response = await api.post<Colecao>(API_ROUTES.COLECOES.CREATE, {
      blocoId,
      nome,
    });
    return response.data;
  },

  /**
   * Atualiza o nome de uma coleção.
   */
  async updateColecao(id: string, nome: string): Promise<Colecao> {
    const response = await api.put<Colecao>(API_ROUTES.COLECOES.UPDATE(id), {
      nome,
    });
    return response.data;
  },

  /**
   * Remove uma coleção.
   */
  async deleteColecao(id: string): Promise<void> {
    await api.delete(API_ROUTES.COLECOES.DELETE(id));
  },

  // ===========================================================================
  // CAMPOS
  // ===========================================================================

  /**
   * Lista os campos de uma coleção.
   */
  async getCampos(colecaoId: string): Promise<Campo[]> {
    const response = await api.get<Campo[]>(
      API_ROUTES.COLECOES.CAMPOS.LIST(colecaoId),
    );
    return response.data;
  },

  /**
   * Cria um novo campo em uma coleção.
   */
  async createCampo(
    colecaoId: string,
    nome: string,
    tipoCampo: string,
  ): Promise<Campo> {
    const response = await api.post<Campo>(API_ROUTES.COLECOES.CAMPOS.CREATE, {
      colecaoId,
      nome,
      tipoCampo,
    });
    return response.data;
  },

  /**
   * Atualiza um campo existente.
   */
  async updateCampo(
    id: string,
    data: { nome?: string; tipoCampo?: string },
  ): Promise<Campo> {
    const response = await api.put<Campo>(
      API_ROUTES.COLECOES.CAMPOS.UPDATE(id),
      data,
    );
    return response.data;
  },

  /**
   * Remove um campo.
   */
  async deleteCampo(id: string): Promise<void> {
    await api.delete(API_ROUTES.COLECOES.CAMPOS.DELETE(id));
  },

  // ===========================================================================
  // ITENS
  // ===========================================================================

  /**
   * Lista os itens de uma coleção.
   */
  async getItens(colecaoId: string): Promise<Item[]> {
    const response = await api.get<Item[]>(
      API_ROUTES.COLECOES.ITENS.LIST(colecaoId),
    );
    return response.data;
  },

  /**
   * Cria um novo item com os valores fornecidos.
   * @param colecaoId ID da coleção
   * @param valores Objeto mapeando campoId -> valor
   */
  async createItem(
    colecaoId: string,
    valores: Record<string, any>,
  ): Promise<Item> {
    const response = await api.post<Item>(API_ROUTES.COLECOES.ITENS.CREATE, {
      colecaoId,
      valores,
    });
    return response.data;
  },

  /**
   * Atualiza os valores de um item existente.
   */
  async updateItem(id: string, valores: Record<string, any>): Promise<Item> {
    const response = await api.put<Item>(API_ROUTES.COLECOES.ITENS.UPDATE(id), {
      valores,
    });
    return response.data;
  },

  /**
   * Remove um item.
   */
  async deleteItem(id: string): Promise<void> {
    await api.delete(API_ROUTES.COLECOES.ITENS.DELETE(id));
  },
};
