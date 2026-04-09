import api from "./api";
import { API_ROUTES } from "@/constants/routes";
import type { Bloco, Colecao } from "@/types/bloco";

export const blocosService = {
  async getBlocos(nucleoId: string): Promise<Bloco[]> {
    const response = await api.get<Bloco[]>(API_ROUTES.BLOCOS.LIST(nucleoId));
    return response.data;
  },

  async getBloco(id: string): Promise<Bloco> {
    const response = await api.get<Bloco>(API_ROUTES.BLOCOS.GET(id));
    return response.data;
  },

  async createBloco(nucleoId: string, data: Partial<Bloco>): Promise<Bloco> {
    // Backend: POST /api/v1/blocos with NucleoId in body
    const response = await api.post<Bloco>("/v1/blocos", { ...data, nucleoId });
    return response.data;
  },

  async updateBloco(id: string, data: Partial<Bloco>): Promise<Bloco> {
    const response = await api.put<Bloco>(API_ROUTES.BLOCOS.UPDATE(id), data);
    return response.data;
  },

  async deleteBloco(id: string): Promise<void> {
    await api.delete(API_ROUTES.BLOCOS.DELETE(id));
  },

  async reorderBlocos(
    nucleoId: string,
    ordem: { id: string; posicao: number }[],
  ): Promise<void> {
    await api.put("/v1/blocos/reorder", { nucleoId, orders: ordem });
  },

  async getColecoes(blocoId: string): Promise<Colecao[]> {
    const response = await api.get<Colecao[]>(
      API_ROUTES.COLECOES.LIST(blocoId),
    );
    return response.data;
  },

  async createColecao(
    blocoId: string,
    data: Partial<Colecao>,
  ): Promise<Colecao> {
    const response = await api.post<Colecao>(
      API_ROUTES.COLECOES.CREATE(blocoId),
      data,
    );
    return response.data;
  },
};
