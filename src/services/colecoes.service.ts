import api from './api'
import { API_ROUTES } from '@/constants/routes'
import type { Colecao, Campo, Item, ItemValor } from '@/types/bloco'

export const colecoesService = {
  // Coleções
  async getColecao(id: string): Promise<Colecao> {
    const response = await api.get<Colecao>(API_ROUTES.COLECOES.GET(id))
    return response.data
  },

  async updateColecao(id: string, data: Partial<Colecao>): Promise<Colecao> {
    const response = await api.put<Colecao>(API_ROUTES.COLECOES.UPDATE(id), data)
    return response.data
  },

  async deleteColecao(id: string): Promise<void> {
    await api.delete(API_ROUTES.COLECOES.DELETE(id))
  },

  // Campos
  async getCampos(colecaoId: string): Promise<Campo[]> {
    const response = await api.get<Campo[]>(API_ROUTES.CAMPOS.LIST(colecaoId))
    return response.data
  },

  async createCampo(colecaoId: string, data: Partial<Campo>): Promise<Campo> {
    const response = await api.post<Campo>(API_ROUTES.CAMPOS.CREATE(colecaoId), data)
    return response.data
  },

  async updateCampo(id: string, data: Partial<Campo>): Promise<Campo> {
    const response = await api.put<Campo>(API_ROUTES.CAMPOS.UPDATE(id), data)
    return response.data
  },

  async deleteCampo(id: string): Promise<void> {
    await api.delete(API_ROUTES.CAMPOS.DELETE(id))
  },

  // Itens
  async getItens(colecaoId: string): Promise<Item[]> {
    const response = await api.get<Item[]>(API_ROUTES.ITENS.LIST(colecaoId))
    return response.data
  },

  async createItem(colecaoId: string, data: Partial<Item>): Promise<Item> {
    const response = await api.post<Item>(API_ROUTES.ITENS.CREATE(colecaoId), data)
    return response.data
  },

  async updateItem(id: string, data: Partial<Item>): Promise<Item> {
    const response = await api.put<Item>(API_ROUTES.ITENS.UPDATE(id), data)
    return response.data
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(API_ROUTES.ITENS.DELETE(id))
  },

  // Valores dos itens
  async getValores(itemId: string): Promise<ItemValor[]> {
    const response = await api.get<ItemValor[]>(API_ROUTES.ITEM_VALORES.LIST(itemId))
    return response.data
  },

  async createValor(itemId: string, campoId: string, data: Partial<ItemValor>): Promise<ItemValor> {
    const response = await api.post<ItemValor>(
      API_ROUTES.ITEM_VALORES.CREATE(itemId, campoId), 
      data
    )
    return response.data
  },

  async updateValor(id: string, data: Partial<ItemValor>): Promise<ItemValor> {
    const response = await api.put<ItemValor>(API_ROUTES.ITEM_VALORES.UPDATE(id), data)
    return response.data
  },

  async deleteValor(id: string): Promise<void> {
    await api.delete(API_ROUTES.ITEM_VALORES.DELETE(id))
  }
}