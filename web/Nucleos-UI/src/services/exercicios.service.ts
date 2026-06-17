import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/routes";
import type {
  TreinoTemplate,
  CreateTreinoPayload,
  UpdateTreinoPayload,
  AddExercicioPayload,
  TreinoExercicio,
} from "@/types/exercicios";

export const exerciciosService = {
  async listarPorBloco(blocoId: string): Promise<TreinoTemplate[]> {
    try {
      const res = await api.get<{ success: boolean; data: TreinoTemplate[] } | TreinoTemplate[]>(
        API_ROUTES.EXERCICIOS.BY_BLOCO(blocoId),
      );
      if (Array.isArray(res)) return res;
      if (res && typeof res === "object" && "data" in res) {
        return Array.isArray(res.data) ? res.data : [];
      }
      return [];
    } catch (error: any) {
      if (error?.response?.status === 400) return [];
      throw error;
    }
  },

  async criarTreino(payload: CreateTreinoPayload): Promise<TreinoTemplate> {
    const res = await api.post<{ success: boolean; data: TreinoTemplate } | TreinoTemplate>(
      API_ROUTES.EXERCICIOS.BASE,
      payload,
    );
    if (res && typeof res === "object" && "data" in res) return res.data;
    return res as TreinoTemplate;
  },

  async atualizarTreino(id: string, payload: UpdateTreinoPayload): Promise<TreinoTemplate> {
    const res = await api.put<{ success: boolean; data: TreinoTemplate } | TreinoTemplate>(
      API_ROUTES.EXERCICIOS.BY_ID(id),
      payload,
    );
    if (res && typeof res === "object" && "data" in res) return res.data;
    return res as TreinoTemplate;
  },

  async deletarTreino(id: string): Promise<void> {
    await api.delete(API_ROUTES.EXERCICIOS.BY_ID(id));
  },

  async adicionarExercicio(payload: AddExercicioPayload): Promise<TreinoExercicio> {
    const res = await api.post<{ success: boolean; data: TreinoExercicio } | TreinoExercicio>(
      API_ROUTES.EXERCICIOS.ADD_EXERCICIO(payload.templateId),
      {
        nome: payload.nome,
        series: payload.series,
        repeticoes: payload.repeticoes,
        pesoKg: payload.pesoKg,
        ordem: payload.ordem,
      },
    );
    if (res && typeof res === "object" && "data" in res) return res.data;
    return res as TreinoExercicio;
  },

  async removerExercicio(exercicioId: string): Promise<void> {
    await api.delete(API_ROUTES.EXERCICIOS.REMOVE_EXERCICIO(exercicioId));
  },
};
