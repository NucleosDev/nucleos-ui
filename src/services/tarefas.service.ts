// src/services/tarefasService.ts
import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/routes";
import type {
  Tarefa,
  CreateTarefaPayload,
  UpdateTarefaPayload,
  TarefaPrioridade,
} from "@/types/tarefas";

// Storage local para tarefas recorrentes
const RECORRENT_STORAGE_KEY = "@taskflow/recorrent_tasks";

export const tarefasService = {
  async getTarefas(blocoId: string): Promise<Tarefa[]> {
    try {
      const res = await api.get<
        Tarefa[] | { success: boolean; data: Tarefa[] }
      >(API_ROUTES.TAREFAS.BY_BLOCO(blocoId));
      let tasks: Tarefa[] = [];

      if (Array.isArray(res)) {
        tasks = res;
      } else if (res && typeof res === "object" && "data" in res) {
        tasks = Array.isArray((res as any).data) ? (res as any).data : [];
      }

      // Limpa metadados que o backend não precisa (opcional)
      return tasks.map((task) => {
        // Remove qualquer metadata que possa ter vindo do frontend
        const { metadata, ...cleanTask } = task as any;
        return cleanTask as Tarefa;
      });
    } catch (error) {
      console.warn("Erro ao buscar tarefas:", error);
      return [];
    }
  },

  async createTarefa(payload: CreateTarefaPayload): Promise<Tarefa> {
    // Remove campos que o backend pode não aceitar
    const cleanPayload: any = {
      blocoId: payload.blocoId,
      titulo: payload.titulo,
      prioridade: payload.prioridade || "media",
    };

    if (payload.descricao) cleanPayload.descricao = payload.descricao;
    if (payload.dataVencimento)
      cleanPayload.dataVencimento = payload.dataVencimento;

    try {
      const res = await api.post<Tarefa | { success: boolean; data: Tarefa }>(
        API_ROUTES.TAREFAS.BASE,
        cleanPayload,
      );

      let newTask: Tarefa;
      if (res && typeof res === "object" && "data" in res) {
        newTask = (res as any).data;
      } else {
        newTask = res as Tarefa;
      }

      return newTask;
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      throw error;
    }
  },

  async updateTarefa(
    id: string,
    payload: UpdateTarefaPayload,
  ): Promise<Tarefa> {
    // Remove campos que o backend pode não aceitar
    const cleanPayload: any = {};

    if (payload.titulo) cleanPayload.titulo = payload.titulo;
    if (payload.descricao) cleanPayload.descricao = payload.descricao;
    if (payload.prioridade) cleanPayload.prioridade = payload.prioridade;
    if (payload.status) cleanPayload.status = payload.status;
    if (payload.dataVencimento)
      cleanPayload.dataVencimento = payload.dataVencimento;

    try {
      const res = await api.put<Tarefa | { success: boolean; data: Tarefa }>(
        API_ROUTES.TAREFAS.BY_ID(id),
        cleanPayload,
      );

      if (res && typeof res === "object" && "data" in res) {
        return (res as any).data;
      }
      return res as Tarefa;
    } catch (error: any) {
      console.error("Erro ao atualizar tarefa:", error?.message || error?.statusCode || error);
      throw error;
    }
  },

  async deleteTarefa(id: string): Promise<void> {
    await api.delete(API_ROUTES.TAREFAS.BY_ID(id));
  },

  async concluirTarefa(id: string): Promise<Tarefa> {
    const res = await api.post<Tarefa | { success: boolean; data: Tarefa }>(
      API_ROUTES.TAREFAS.CONCLUDE(id),
    );
    if (res && typeof res === "object" && "data" in res) {
      return (res as any).data;
    }
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

// Service separado para tarefas recorrentes (apenas frontend)
export const tarefasRecorrentesService = {
  getRecorrentes(blocoId: string): TarefaRecorrente[] {
    try {
      const stored = localStorage.getItem(RECORRENT_STORAGE_KEY);
      const all = stored ? JSON.parse(stored) : [];
      return all.filter((t: any) => t.blocoId === blocoId);
    } catch {
      return [];
    }
  },

  saveRecorrente(
    tarefa: Omit<TarefaRecorrente, "id" | "createdAt">,
  ): TarefaRecorrente {
    const newTask: TarefaRecorrente = {
      ...tarefa,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const stored = localStorage.getItem(RECORRENT_STORAGE_KEY);
    const all = stored ? JSON.parse(stored) : [];
    all.push(newTask);
    localStorage.setItem(RECORRENT_STORAGE_KEY, JSON.stringify(all));

    return newTask;
  },

  deleteRecorrente(id: string): void {
    const stored = localStorage.getItem(RECORRENT_STORAGE_KEY);
    const all = stored ? JSON.parse(stored) : [];
    const filtered = all.filter((t: any) => t.id !== id);
    localStorage.setItem(RECORRENT_STORAGE_KEY, JSON.stringify(filtered));
  },

  updateRecorrente(
    id: string,
    updates: Partial<TarefaRecorrente>,
  ): TarefaRecorrente | null {
    const stored = localStorage.getItem(RECORRENT_STORAGE_KEY);
    const all = stored ? JSON.parse(stored) : [];
    const index = all.findIndex((t: any) => t.id === id);

    if (index === -1) return null;

    all[index] = { ...all[index], ...updates };
    localStorage.setItem(RECORRENT_STORAGE_KEY, JSON.stringify(all));

    return all[index];
  },
};

// Tipo para tarefas recorrentes no frontend
export interface TarefaRecorrente {
  id: string;
  blocoId: string;
  titulo: string;
  descricao?: string;
  prioridade: TarefaPrioridade;
  recorrenciaTipo: "diaria" | "semanal" | "mensal";
  createdAt: string;
}
