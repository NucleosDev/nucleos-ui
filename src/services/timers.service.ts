import api from './api'
import { API_ROUTES } from '@/constants/routes'
import type { Timer } from '@/types/calendar'

export const timersService = {
  async getTimers(nucleoId: string): Promise<Timer[]> {
    const response = await api.get<Timer[]>(API_ROUTES.TIMERS.LIST(nucleoId))
    return response.data
  },

  async getTimer(id: string): Promise<Timer> {
    const response = await api.get<Timer>(API_ROUTES.TIMERS.GET(id))
    return response.data
  },

  async createTimer(nucleoId: string, data: Partial<Timer>): Promise<Timer> {
    const response = await api.post<Timer>(API_ROUTES.TIMERS.CREATE(nucleoId), data)
    return response.data
  },

  async updateTimer(id: string, data: Partial<Timer>): Promise<Timer> {
    const response = await api.put<Timer>(API_ROUTES.TIMERS.UPDATE(id), data)
    return response.data
  },

  async deleteTimer(id: string): Promise<void> {
    await api.delete(API_ROUTES.TIMERS.DELETE(id))
  },

  async startTimer(id: string): Promise<Timer> {
    const response = await api.post<Timer>(API_ROUTES.TIMERS.START(id))
    return response.data
  },

  async pauseTimer(id: string): Promise<Timer> {
    const response = await api.post<Timer>(API_ROUTES.TIMERS.PAUSE(id))
    return response.data
  },

  async resumeTimer(id: string): Promise<Timer> {
    const response = await api.post<Timer>(API_ROUTES.TIMERS.RESUME(id))
    return response.data
  },

  async stopTimer(id: string): Promise<Timer> {
    const response = await api.post<Timer>(API_ROUTES.TIMERS.STOP(id))
    return response.data
  }
}