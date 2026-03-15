import api from './api'
import { API_ROUTES } from '@/constants/routes'
import type { UserLevel } from '@/types/user'
import type { XpLog, EnergyLog } from '@/types/logs'

export const progressService = {
  // XP
  async addXp(amount: number, source: string, nucleoId?: string): Promise<XpLog> {
    const response = await api.post<XpLog>(API_ROUTES.LOGS.XP, { amount, source, nucleoId })
    return response.data
  },

  async getXpHistory(params?: { 
    page?: number; 
    limit?: number; 
    startDate?: Date; 
    endDate?: Date 
  }): Promise<XpLog[]> {
    const response = await api.get<XpLog[]>(API_ROUTES.LOGS.XP, { params })
    return response.data
  },

  // Energy
  async addEnergy(amount: number, nucleoId?: string): Promise<EnergyLog> {
    const response = await api.post<EnergyLog>(API_ROUTES.LOGS.ENERGY, { amount, nucleoId })
    return response.data
  },

  async getEnergyHistory(params?: { 
    page?: number; 
    limit?: number; 
    startDate?: Date; 
    endDate?: Date 
  }): Promise<EnergyLog[]> {
    const response = await api.get<EnergyLog[]>(API_ROUTES.LOGS.ENERGY, { params })
    return response.data
  },

  // Level
  async getUserLevel(userId?: string): Promise<UserLevel> {
    const url = userId ? `/users/${userId}/level` : API_ROUTES.USERS.LEVEL
    const response = await api.get<UserLevel>(url)
    return response.data
  },

  async getLevelProgress(): Promise<{
    currentLevel: number
    currentXp: number
    nextLevelXp: number
    progress: number // 0-100
  }> {
    const level = await this.getUserLevel()
    const progress = (level.current_xp / level.next_level_xp) * 100
    
    return {
      currentLevel: level.level,
      currentXp: level.current_xp,
      nextLevelXp: level.next_level_xp,
      progress: Math.min(progress, 100)
    }
  }
}