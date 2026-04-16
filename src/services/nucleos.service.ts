import api from "@/services/api";
import type {
  Nucleo,
  CreateNucleoPayload,
  UpdateNucleoPayload,
} from "@/types/nucleo";

export const nucleosService = {
  async getNucleos(): Promise<Nucleo[]> {
    try {
      const { data } = await api.get<Nucleo[]>("/nucleos");
      return data || [];
    } catch (error) {
      console.warn("Erro ao buscar núcleos:", error);
      return [];
    }
  },

  async getNucleo(id: string): Promise<Nucleo | null> {
    try {
      const { data } = await api.get<Nucleo>(`/nucleos/${id}`);
      return data;
    } catch (error) {
      console.warn(`Erro ao buscar núcleo ${id}:`, error);
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

  async delete(id: string): Promise<void> {
    await api.delete(`/nucleos/${id}`);
  },

  // Método alternativo para compatibilidade com o hook existente
  async createNucleo(payload: CreateNucleoPayload): Promise<Nucleo> {
    return this.create(payload);
  },

  async updateNucleo(
    id: string,
    payload: UpdateNucleoPayload,
  ): Promise<Nucleo> {
    return this.update(id, payload);
  },

  async deleteNucleo(id: string): Promise<void> {
    return this.delete(id);
  },
};
