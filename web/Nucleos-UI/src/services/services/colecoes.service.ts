// services/colecoes.service.ts
import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/routes";
import type { Colecao, Campo, Item } from "@/types/colecao";

export const colecoesService = {
  // COLEÇÕES
  async listByBloco(blocoId: string): Promise<Colecao[]> {
    const res = await api.get<{ success: boolean; data: Colecao[] }>(
      API_ROUTES.COLECOES.LIST_BY_BLOCO(blocoId),
    );
    return res.data;
  },

  async getColecao(id: string): Promise<Colecao> {
    const res = await api.get<{ success: boolean; data: Colecao }>(
      API_ROUTES.COLECOES.GET(id),
    );
    return res.data;
  },

  async createColecao(blocoId: string, nome: string): Promise<Colecao> {
    const res = await api.post<{ success: boolean; data: Colecao }>(
      API_ROUTES.COLECOES.CREATE,
      { blocoId, nome },
    );
    return res.data;
  },

  async updateColecao(id: string, nome: string): Promise<Colecao> {
    const res = await api.put<{ success: boolean; data: Colecao }>(
      API_ROUTES.COLECOES.UPDATE(id),
      { nome },
    );
    return res.data;
  },

  async deleteColecao(id: string): Promise<void> {
    await api.delete(API_ROUTES.COLECOES.DELETE(id));
  },

  // CAMPOS
  async getCampos(colecaoId: string): Promise<Campo[]> {
    const res = await api.get<{ success: boolean; data: Campo[] }>(
      API_ROUTES.COLECOES.CAMPOS.LIST(colecaoId),
    );
    return res.data;
  },

  async createCampo(
    colecaoId: string,
    nome: string,
    tipoCampo: string,
  ): Promise<Campo> {
    const payload = { colecaoId, nome, tipoCampo };
    console.log("📦 createCampo payload:", payload);
    const res = await api.post<{ success: boolean; data: Campo }>(
      API_ROUTES.COLECOES.CAMPOS.CREATE,
      payload,
    );
    return res.data;
  },

  async updateCampo(
    id: string,
    data: { nome?: string; tipoCampo?: string },
  ): Promise<Campo> {
    const res = await api.put<{ success: boolean; data: Campo }>(
      API_ROUTES.COLECOES.CAMPOS.UPDATE(id),
      data,
    );
    return res.data;
  },

  async deleteCampo(id: string): Promise<void> {
    await api.delete(API_ROUTES.COLECOES.CAMPOS.DELETE(id));
  },

  // ITENS
  async getItens(colecaoId: string): Promise<Item[]> {
    const res = await api.get<{ success: boolean; data: Item[] }>(
      API_ROUTES.COLECOES.ITENS.LIST(colecaoId),
    );
    return res.data;
  },

  async createItem(
    colecaoId: string,
    valores: Record<string, any>,
  ): Promise<Item> {
    const res = await api.post<{ success: boolean; data: Item }>(
      API_ROUTES.COLECOES.ITENS.CREATE,
      { colecaoId, valores },
    );
    return res.data;
  },

  async updateItem(id: string, valores: Record<string, any>): Promise<Item> {
    const res = await api.put<{ success: boolean; data: Item }>(
      API_ROUTES.COLECOES.ITENS.UPDATE(id),
      { valores },
    );
    return res.data;
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(API_ROUTES.COLECOES.ITENS.DELETE(id));
  },
};
