// src/services/habitos.service.ts
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
    try {
      const res = await api.get<
        { success: boolean; data: Habito[] } | Habito[]
      >(API_ROUTES.HABITOS.BY_BLOCO(blocoId));
      if (Array.isArray(res)) return res;
      if (res && typeof res === "object" && "data" in res) {
        return Array.isArray(res.data) ? res.data : [];
      }
      return [];
    } catch (error: any) {
      // 400 = bloco não encontrado, retorna vazio
      if (error?.response?.status === 400) {
        console.warn("⚠️ Bloco de hábitos não acessível:", blocoId);
        return [];
      }
      throw error;
    }
  },

  async criar(payload: CreateHabitoPayload): Promise<Habito> {
    // ✅ Garantir que diasSemana é array de números
    let diasSemana: number[] | undefined = undefined;
    if (payload.diasSemana) {
      if (Array.isArray(payload.diasSemana)) {
        diasSemana = payload.diasSemana.map(Number);
      } else if (typeof payload.diasSemana === "string") {
        try {
          const parsed = JSON.parse(payload.diasSemana);
          diasSemana = Array.isArray(parsed) ? parsed.map(Number) : undefined;
        } catch {
          diasSemana = undefined;
        }
      }
    }

    const body = {
      blocoId: payload.blocoId,
      nome: payload.nome,
      frequencia: payload.frequencia || "diaria",
      diasSemana: diasSemana,
      metaVezes: payload.metaVezes ? Number(payload.metaVezes) : undefined,
    };

    console.log("📤 Criando hábito - Payload:", JSON.stringify(body));

    const res = await api.post<{ success: boolean; data: Habito } | Habito>(
      API_ROUTES.HABITOS.BASE,
      body,
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
      {
        data: payload.data,
        vezesCompletadas: payload.vezesCompletadas || 1,
      },
    );
    if (res && typeof res === "object" && "data" in res) return res.data;
    return res as Habito;
  },
};
