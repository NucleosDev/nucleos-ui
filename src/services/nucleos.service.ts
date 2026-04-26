// src/services/nucleos.service.ts
import api from "@/services/api-auth";
import type {
  Nucleo,
  CreateNucleoPayload,
  UpdateNucleoPayload,
} from "@/types/nucleo";
import type { CanvasBlock } from "@/components/canvas/types";

export const nucleosService = {
  async getNucleos(): Promise<Nucleo[]> {
    try {
      const { data } = await api.get<Nucleo[]>("/nucleos");
      return data || [];
    } catch (error) {
      console.warn("Erro ao buscar Nucleos:", error);
      return [];
    }
  },

  async getNucleo(id: string): Promise<Nucleo | null> {
    try {
      const { data } = await api.get<Nucleo>(`/nucleos/${id}`);
      return data;
    } catch (error) {
      console.warn(`Erro ao buscar Nucleo ${id}:`, error);
      return null;
    }
  },

  async create(payload: CreateNucleoPayload): Promise<Nucleo> {
    const { data } = await api.post<Nucleo>("/nucleos", payload);
    return data;
  },

  async update(id: string, payload: UpdateNucleoPayload): Promise<Nucleo> {
    const { data } = await api.put<Nucleo>(`/nucleos/${id}`, payload);
    return data;
  },

  async updateCanvas(id: string, canvasBlocks: CanvasBlock[]): Promise<Nucleo> {
    return this.update(id, {
      configuracoes: { canvasBlocks }
    });
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/nucleos/${id}`);
  },

  // Métodos de compatibilidade
  async createNucleo(payload: CreateNucleoPayload): Promise<Nucleo> {
    return this.create(payload);
  },

  async updateNucleo(id: string, payload: UpdateNucleoPayload): Promise<Nucleo> {
    return this.update(id, payload);
  },

  async deleteNucleo(id: string): Promise<void> {
    return this.delete(id);
  },
};