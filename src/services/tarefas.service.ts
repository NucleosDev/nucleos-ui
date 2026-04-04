import api from "@/services/api"
import type { Tarefa, CreateTarefaPayload, UpdateTarefaPayload } from "@/types/tarefas"

export const tarefasService = {
  async getByBloco(blocoId: string): Promise<Tarefa[]> {
    const { data } = await api.get<Tarefa[]>(`/Tarefas/bloco/${blocoId}`)
    return data
  },

  /** Tarefas próximas ao vencimento (todos os blocos do usuário) */
  async getVencendo(): Promise<Tarefa[]> {
    const { data } = await api.get<Tarefa[]>("/Tarefas/vencendo")
    return data
  },

  async getById(id: string): Promise<Tarefa> {
    const { data } = await api.get<Tarefa>(`/Tarefas/${id}`)
    return data
  },

  async create(payload: CreateTarefaPayload): Promise<Tarefa> {
    const { data } = await api.post<Tarefa>("/Tarefas", payload)
    return data
  },

  async update(id: string, payload: UpdateTarefaPayload): Promise<Tarefa> {
    const { data } = await api.put<Tarefa>(`/Tarefas/${id}`, payload)
    return data
  },

  async concluir(id: string): Promise<Tarefa> {
    const { data } = await api.patch<Tarefa>(`/Tarefas/${id}/concluir`)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/Tarefas/${id}`)
  },
}
