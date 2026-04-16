// src/services/bloco.service.ts
import { api } from "@/lib/api"; // ajuste o caminho conforme seu projeto
import { API_ROUTES } from "@/constants/routes";
import type {
  Bloco,
  CreateBlocoPayload,
  UpdateBlocoPayload,
  ReorderBlocosPayload,
} from "@/types/bloco";

export const blocosService = {
  /**
   * Lista todos os blocos de um núcleo
   */
  async listarPorNucleo(nucleoId: string): Promise<Bloco[]> {
    return api.get<Bloco[]>(API_ROUTES.BLOCOS.LIST(nucleoId));
  },

  /**
   * Busca um bloco específico por ID
   */
  async buscarPorId(id: string, nucleoId?: string): Promise<Bloco> {
    const params = nucleoId ? { nucleoId } : undefined;
    return api.get<Bloco>(API_ROUTES.BLOCOS.GET(id), params);
  },

  /**
   * Cria um novo bloco
   */
  async criar(payload: CreateBlocoPayload): Promise<Bloco> {
    return api.post<Bloco>(API_ROUTES.BLOCOS.CREATE, payload);
  },

  /**
   * Atualiza um bloco existente
   */
  async atualizar(id: string, payload: UpdateBlocoPayload): Promise<Bloco> {
    return api.put<Bloco>(API_ROUTES.BLOCOS.UPDATE(id), payload);
  },

  /**
   * Remove um bloco (soft delete)
   */
  async deletar(id: string): Promise<void> {
    return api.delete(API_ROUTES.BLOCOS.DELETE(id));
  },

  /**
   * Reordena os blocos dentro de um núcleo
   */
  async reordenar(payload: ReorderBlocosPayload): Promise<void> {
    // O backend espera { nucleoId, orders } no corpo da requisição
    return api.post(API_ROUTES.BLOCOS.REORDER, {
      nucleoId: payload.nucleoId,
      orders: payload.orders,
    });
  },
};
