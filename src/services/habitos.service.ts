import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/routes";
import type {
  Habito,
  CreateHabitoPayload,
  UpdateHabitoPayload,
  RegistrarHabitoPayload,
} from "@/types/habitos";

export const habitosService = {
  async listarPorBloco(blocoId: string): Promise<Habito[]> {
    const res = await api.get<{ success: boolean; data: Habito[] } | Habito[]>(
      API_ROUTES.HABITOS.BY_BLOCO(blocoId),
    );
    if (Array.isArray(res)) return res;
    if (res && typeof res === "object" && "data" in res) {
      return Array.isArray(res.data) ? res.data : [];
    }
    return [];
  },

  async criar(payload: CreateHabitoPayload): Promise<Habito> {
    const res = await api.post<{ success: boolean; data: Habito } | Habito>(
      API_ROUTES.HABITOS.BASE,
      payload,
    );
    if (res && typeof res === "object" && "data" in res) return res.data;
    return res as Habito;
  },

  async atualizar(id: string, payload: UpdateHabitoPayload): Promise<Habito> {
    const res = await api.put<{ success: boolean; data: Habito } | Habito>(
      API_ROUTES.HABITOS.BY_ID(id),
      payload,
    );
    if (res && typeof res === "object" && "data" in res) return res.data;
    return res as Habito;
  },

  async deletar(id: string): Promise<void> {
    await api.delete(API_ROUTES.HABITOS.BY_ID(id));
  },

  async registrar(payload: RegistrarHabitoPayload): Promise<Habito> {
    const res = await api.post<{ success: boolean; data: Habito } | Habito>(
      API_ROUTES.HABITOS.REGISTER(payload.habitoId),
      { data: payload.data, vezesCompletadas: payload.vezesCompletadas || 1 },
    );
    if (res && typeof res === "object" && "data" in res) return res.data;
    return res as Habito;
  },
};
