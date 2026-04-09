import api from './api'
import { API_ROUTES } from '@/constants/routes'

export interface Tarefa {
  id: string
  blocoId: string
  titulo: string
  descricao?: string
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente'
  status: 'pendente' | 'em_progresso' | 'concluida' | 'cancelada'
  dataVencimento?: string
  concluidaEm?: string
  posicao: number
  createdAt: string
}

export interface Habito {
  id: string
  blocoId: string
  nome: string
  frequencia: string
  metaVezes?: number
  createdAt: string
}

export interface HabitoRegistro {
  id: string
  habitoId: string
  data: string
  vezesCompletadas: number
}

export interface Lista {
  id: string
  blocoId: string
  nome: string
  tipoLista?: string
  createdAt: string
}

export interface ItemLista {
  id: string
  listaId: string
  categoriaId?: string
  nome: string
  quantidade?: number
  valorUnitario?: number
  valorTotal?: number
  checked: boolean
  createdAt: string
}

export const tarefasService = {
  async getTarefas(blocoId: string): Promise<Tarefa[]> {
    const r = await api.get<Tarefa[]>(API_ROUTES.TAREFAS.BY_BLOCO(blocoId))
    return r.data
  },
  async createTarefa(data: Partial<Tarefa>): Promise<Tarefa> {
    const r = await api.post<Tarefa>(API_ROUTES.TAREFAS.BASE, data)
    return r.data
  },
  async updateTarefa(id: string, data: Partial<Tarefa>): Promise<Tarefa> {
    const r = await api.put<Tarefa>(API_ROUTES.TAREFAS.BY_ID(id), data)
    return r.data
  },
  async deleteTarefa(id: string): Promise<void> {
    await api.delete(API_ROUTES.TAREFAS.BY_ID(id))
  },
  async concluirTarefa(id: string): Promise<void> {
    await api.post(API_ROUTES.TAREFAS.CONCLUDE(id))
  },
  async getTarefasVencendo(): Promise<Tarefa[]> {
    const r = await api.get<Tarefa[]>(API_ROUTES.TAREFAS.VENCENDO)
    return r.data
  },
}

export const habitosService = {
  async getHabitos(blocoId: string): Promise<Habito[]> {
    const r = await api.get<Habito[]>(API_ROUTES.HABITOS.BY_BLOCO(blocoId))
    return r.data
  },
  async createHabito(data: Partial<Habito>): Promise<Habito> {
    const r = await api.post<Habito>(API_ROUTES.HABITOS.BASE, data)
    return r.data
  },
  async updateHabito(id: string, data: Partial<Habito>): Promise<Habito> {
    const r = await api.put<Habito>(API_ROUTES.HABITOS.BY_ID(id), data)
    return r.data
  },
  async deleteHabito(id: string): Promise<void> {
    await api.delete(API_ROUTES.HABITOS.BY_ID(id))
  },
  async registrarHabito(id: string, data: { data: string; vezesCompletadas: number }): Promise<void> {
    await api.post(API_ROUTES.HABITOS.REGISTER(id), data)
  },
}

export const listasService = {
  async getListas(blocoId: string): Promise<Lista[]> {
    const r = await api.get<Lista[]>(API_ROUTES.LISTAS.BY_BLOCO(blocoId))
    return r.data
  },
  async createLista(data: Partial<Lista>): Promise<Lista> {
    const r = await api.post<Lista>(API_ROUTES.LISTAS.BASE, data)
    return r.data
  },
  async getItens(listaId: string): Promise<ItemLista[]> {
    const r = await api.get<ItemLista[]>(API_ROUTES.LISTAS.ITEMS(listaId))
    return r.data
  },
  async toggleItem(id: string): Promise<ItemLista> {
    const r = await api.patch<ItemLista>(`/v1/itenslista/${id}/toggle`)
    return r.data
  },
}

export const gamificacaoService = {
  async getLevel() {
    const r = await api.get(API_ROUTES.GAMIFICACAO.LEVEL)
    return r.data
  },
  async getConquistas() {
    const r = await api.get(API_ROUTES.GAMIFICACAO.CONQUISTAS)
    return r.data
  },
  async getStreaks() {
    const r = await api.get(API_ROUTES.GAMIFICACAO.STREAKS)
    return r.data
  },
}

export const notificacoesService = {
  async getNotificacoes() {
    const r = await api.get(API_ROUTES.NOTIFICATIONS.LIST)
    return r.data
  },
  async marcarLida(id: string) {
    await api.patch(API_ROUTES.NOTIFICATIONS.MARK_READ(id))
  },
  async marcarTodasLidas() {
    await api.patch(API_ROUTES.NOTIFICATIONS.MARK_ALL_READ)
  },
}

export const insightsService = {
  async getInsights() {
    const r = await api.get(API_ROUTES.INSIGHTS.BASE)
    return r.data
  },
  async gerarInsight(nucleoId?: string) {
    const r = await api.post(API_ROUTES.INSIGHTS.GENERATE, { nucleoId })
    return r.data
  },
  async chat(mensagem: string) {
    const r = await api.post(API_ROUTES.INSIGHTS.CHAT, { mensagem })
    return r.data
  },
  async aplicarInsight(id: string) {
    await api.post(API_ROUTES.INSIGHTS.APPLY(id))
  },
}
