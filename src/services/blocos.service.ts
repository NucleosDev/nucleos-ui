import api from './api'
import { API_ROUTES } from '@/constants/routes'
import type { Bloco, Colecao } from '@/types/bloco'

export const blocosService = {
  // Blocos
  async getBlocos(nucleoId: string): Promise<Bloco[]> {
    const response = await api.get<Bloco[]>(API_ROUTES.BLOCOS.LIST(nucleoId))
    return response.data
  },

  async getBloco(id: string): Promise<Bloco> {
    const response = await api.get<Bloco>(API_ROUTES.BLOCOS.GET(id))
    return response.data
  },

  async createBloco(nucleoId: string, data: Partial<Bloco>): Promise<Bloco> {
    const response = await api.post<Bloco>(API_ROUTES.BLOCOS.CREATE(nucleoId), data)
    return response.data
  },

  async updateBloco(id: string, data: Partial<Bloco>): Promise<Bloco> {
    const response = await api.put<Bloco>(API_ROUTES.BLOCOS.UPDATE(id), data)
    return response.data
  },

  async deleteBloco(id: string): Promise<void> {
    await api.delete(API_ROUTES.BLOCOS.DELETE(id))
  },

  async reorderBlocos(nucleoId: string, ordem: { id: string; posicao: number }[]): Promise<Bloco[]> {
    const response = await api.post<Bloco[]>(API_ROUTES.BLOCOS.REORDER(nucleoId), { ordem })
    return response.data
  },

  // Coleções dentro do bloco
  async getColecoes(blocoId: string): Promise<Colecao[]> {
    const response = await api.get<Colecao[]>(API_ROUTES.COLECOES.LIST(blocoId))
    return response.data
  },

  async createColecao(blocoId: string, data: Partial<Colecao>): Promise<Colecao> {
    const response = await api.post<Colecao>(API_ROUTES.COLECOES.CREATE(blocoId), data)
    return response.data
  }
}