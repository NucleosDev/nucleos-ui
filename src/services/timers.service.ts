import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/routes";
import type { Timer, StartTimerPayload } from "@/types/timer";

export const timersService = {
  async listarPorNucleo(nucleoId: string): Promise<Timer[]> {
    const res = await api.get<{ success: boolean; data: Timer[] } | Timer[]>(
      API_ROUTES.TIMERS.LIST(nucleoId),
    );
    if (Array.isArray(res)) return res;
    if (res && typeof res === "object" && "data" in res) {
      return Array.isArray(res.data) ? res.data : [];
    }
    return [];
  },

  async start(payload: StartTimerPayload): Promise<Timer> {
    const res = await api.post<{ success: boolean; data: Timer } | Timer>(
      API_ROUTES.TIMERS.START,
      payload, // agora envia titulo, não descricao
    );
    if (res && typeof res === "object" && "data" in res) return res.data;
    return res as Timer;
  },

  async stop(id: string): Promise<Timer> {
    const res = await api.post<{ success: boolean; data: Timer } | Timer>(
      API_ROUTES.TIMERS.STOP(id),
    );
    if (res && typeof res === "object" && "data" in res) return res.data;
    return res as Timer;
  },

  async deletar(id: string): Promise<void> {
    await api.delete(`/timers/${id}`);
  },

  // 👇 NOVO MÉTODO
  async atualizar(id: string, titulo: string): Promise<Timer> {
    const res = await api.put<{ success: boolean; data: Timer } | Timer>(
      `/timers/${id}`,
      { titulo },
    );
    if (res && typeof res === "object" && "data" in res) return res.data;
    return res as Timer;
  },
};
