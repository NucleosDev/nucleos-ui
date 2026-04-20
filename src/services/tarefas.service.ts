import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/routes";
import type {
  Tarefa,
  CreateTarefaPayload,
  UpdateTarefaPayload,
} from "@/types/tarefas";

export const tarefasService = {
  async getTarefas(blocoId: string): Promise<Tarefa[]> {
    const res = await api.get<Tarefa[] | { success: boolean; data: Tarefa[] }>(
      API_ROUTES.TAREFAS.BY_BLOCO(blocoId),
    );
    if (Array.isArray(res)) return res;
    if (res && typeof res === "object" && "data" in res) {
      return Array.isArray((res as any).data) ? (res as any).data : [];
    }
    console.warn("Formato inesperado de getTarefas:", res);
    return [];
  },

  async createTarefa(payload: CreateTarefaPayload): Promise<Tarefa> {
    const res = await api.post<Tarefa | { success: boolean; data: Tarefa }>(
      API_ROUTES.TAREFAS.BASE,
      payload,
    );
    if (res && typeof res === "object" && "data" in res)
      return (res as any).data;
    return res as Tarefa;
  },

  async updateTarefa(
    id: string,
    payload: UpdateTarefaPayload,
  ): Promise<Tarefa> {
    const res = await api.put<Tarefa | { success: boolean; data: Tarefa }>(
      API_ROUTES.TAREFAS.BY_ID(id),
      payload,
    );
    if (res && typeof res === "object" && "data" in res)
      return (res as any).data;
    return res as Tarefa;
  },

  async deleteTarefa(id: string): Promise<void> {
    await api.delete(API_ROUTES.TAREFAS.BY_ID(id));
  },

  async concluirTarefa(id: string): Promise<Tarefa> {
    const res = await api.post<Tarefa | { success: boolean; data: Tarefa }>(
      API_ROUTES.TAREFAS.CONCLUDE(id),
    );
    if (res && typeof res === "object" && "data" in res)
      return (res as any).data;
    return res as Tarefa;
  },

  async listarVencendo(): Promise<Tarefa[]> {
    const res = await api.get<Tarefa[] | { success: boolean; data: Tarefa[] }>(
      API_ROUTES.TAREFAS.VENCENDO,
    );
    if (Array.isArray(res)) return res;
    if (res && typeof res === "object" && "data" in res) {
      return Array.isArray((res as any).data) ? (res as any).data : [];
    }
    return [];
  },
};
