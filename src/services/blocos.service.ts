// src/services/blocos.service.ts
import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/routes";
import type {
  Bloco,
  CreateBlocoPayload,
  UpdateBlocoPayload,
  ReorderBlocosPayload,
} from "@/types/bloco";

export const blocosService = {
  async listarPorNucleo(nucleoId: string): Promise<Bloco[]> {
    return api.get<Bloco[]>(API_ROUTES.BLOCOS.LIST(nucleoId));
  },

  async buscarPorId(id: string, nucleoId?: string): Promise<Bloco> {
    const params = nucleoId ? { nucleoId } : undefined;
    return api.get<Bloco>(API_ROUTES.BLOCOS.GET(id), params);
  },

  async criar(payload: CreateBlocoPayload): Promise<Bloco> {
    return api.post<Bloco>(API_ROUTES.BLOCOS.CREATE, payload);
  },

  async atualizar(id: string, payload: UpdateBlocoPayload): Promise<Bloco> {
    return api.put<Bloco>(API_ROUTES.BLOCOS.UPDATE(id), payload);
  },

  async deletar(id: string): Promise<void> {
    return api.delete(API_ROUTES.BLOCOS.DELETE(id));
  },

  async reordenar(payload: ReorderBlocosPayload): Promise<void> {
    return api.post(API_ROUTES.BLOCOS.REORDER, payload);
  },

  // NOVOS MÉTODOS
  async listarFilhos(parentId: string, nucleoId: string): Promise<Bloco[]> {
    return api.get<Bloco[]>(`/blocos/parent/${parentId}`, { nucleoId });
  },

  async listarRaizes(nucleoId: string): Promise<Bloco[]> {
    return api.get<Bloco[]>(`/blocos/roots/${nucleoId}`);
  },

  async moverParaParent(
    blocoId: string,
    newParentId: string | null,
    position: number,
  ): Promise<void> {
    return api.put(`/blocos/${blocoId}/move`, { newParentId, position });
  },
};
