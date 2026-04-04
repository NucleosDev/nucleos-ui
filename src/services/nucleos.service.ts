// =============================================================================
// Núcleos – Types centralizados
// Espelho dos DTOs retornados pela API ASP.NET
// =============================================================================

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
import api from "@/services/api";
import type {
  Nucleo,
  CreateNucleoPayload,
  UpdateNucleoPayload,
} from "@/types/tarefas";

export const nucleosService = {
  async getNucleos(): Promise<Nucleo[]> {
    const { data } = await api.get<Nucleo[]>("/Nucleos");
    return data;
  },

  async getNucleo(id: string): Promise<Nucleo> {
    const { data } = await api.get<Nucleo>(`/Nucleos/${id}`);
    return data;
  },

  async createNucleo(payload: CreateNucleoPayload): Promise<Nucleo> {
    const { data } = await api.post<Nucleo>("/Nucleos", payload);
    return data;
  },

  async updateNucleo(
    id: string,
    payload: UpdateNucleoPayload,
  ): Promise<Nucleo> {
    const { data } = await api.put<Nucleo>(`/Nucleos/${id}`, payload);
    return data;
  },

  async deleteNucleo(id: string): Promise<void> {
    await api.delete(`/Nucleos/${id}`);
  },
};
