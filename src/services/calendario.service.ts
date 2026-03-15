import api from './api'
import { API_ROUTES } from '@/constants/routes'
import type { CalendarioEvento } from '@/types/calendar'

export const calendarioService = {
  async getEventos(
    nucleoId: string, 
    params?: { start?: Date; end?: Date }
  ): Promise<CalendarioEvento[]> {
    const searchParams = new URLSearchParams()
    if (params?.start) searchParams.append('start', params.start.toISOString())
    if (params?.end) searchParams.append('end', params.end.toISOString())
    
    const response = await api.get<CalendarioEvento[]>(
      `${API_ROUTES.CALENDARIO.LIST(nucleoId)}?${searchParams.toString()}`
    )
    return response.data
  },

  async getEvento(id: string): Promise<CalendarioEvento> {
    const response = await api.get<CalendarioEvento>(API_ROUTES.CALENDARIO.GET(id))
    return response.data
  },

  async createEvento(nucleoId: string, data: Partial<CalendarioEvento>): Promise<CalendarioEvento> {
    const response = await api.post<CalendarioEvento>(API_ROUTES.CALENDARIO.CREATE(nucleoId), data)
    return response.data
  },

  async updateEvento(id: string, data: Partial<CalendarioEvento>): Promise<CalendarioEvento> {
    const response = await api.put<CalendarioEvento>(API_ROUTES.CALENDARIO.UPDATE(id), data)
    return response.data
  },

  async deleteEvento(id: string): Promise<void> {
    await api.delete(API_ROUTES.CALENDARIO.DELETE(id))
  }
}