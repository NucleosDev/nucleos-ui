import api from './api'
import { API_ROUTES } from '@/constants/routes'
import type { 
  Nucleo, 
  NucleoIcon, 
  NucleoRelation, 
  NucleoAchievement 
} from '@/types/nucleo'
import type { XpLog, EnergyLog } from '@/types/logs'

export const nucleosService = {
  // CRUD básico
  async getNucleos(): Promise<Nucleo[]> {
    const response = await api.get<Nucleo[]>(API_ROUTES.NUCLEOS.LIST)
    return response.data
  },

  async getNucleo(id: string): Promise<Nucleo> {
    const response = await api.get<Nucleo>(API_ROUTES.NUCLEOS.GET(id))
    return response.data
  },

  async createNucleo(data: Partial<Nucleo>): Promise<Nucleo> {
    const response = await api.post<Nucleo>(API_ROUTES.NUCLEOS.CREATE, data)
    return response.data
  },

  async updateNucleo(id: string, data: Partial<Nucleo>): Promise<Nucleo> {
    const response = await api.put<Nucleo>(API_ROUTES.NUCLEOS.UPDATE(id), data)
    return response.data
  },

  async deleteNucleo(id: string): Promise<void> {
    await api.delete(API_ROUTES.NUCLEOS.DELETE(id))
  },

  // Ícones
  async getIcones(): Promise<NucleoIcon[]> {
    const response = await api.get<NucleoIcon[]>(API_ROUTES.ICONES.LIST)
    return response.data
  },

  async createIcone(data: Partial<NucleoIcon>): Promise<NucleoIcon> {
    const response = await api.post<NucleoIcon>(API_ROUTES.ICONES.CREATE, data)
    return response.data
  },

  // Relações entre núcleos
  async getRelacoes(nucleoId: string): Promise<NucleoRelation[]> {
    const response = await api.get<NucleoRelation[]>(API_ROUTES.RELACOES.LIST(nucleoId))
    return response.data
  },

  async createRelacao(data: Partial<NucleoRelation>): Promise<NucleoRelation> {
    const response = await api.post<NucleoRelation>(API_ROUTES.RELACOES.CREATE, data)
    return response.data
  },

  async deleteRelacao(id: string): Promise<void> {
    await api.delete(API_ROUTES.RELACOES.DELETE(id))
  },

  // Conquistas do núcleo
  async getAchievements(nucleoId: string): Promise<NucleoAchievement[]> {
    const response = await api.get<NucleoAchievement[]>(API_ROUTES.NUCLEOS.ACHIEVEMENTS(nucleoId))
    return response.data
  },

  // XP e Energy do núcleo
  async addXp(nucleoId: string, amount: number, source: string): Promise<XpLog> {
    const response = await api.post<XpLog>(API_ROUTES.NUCLEOS.XP(nucleoId), { amount, source })
    return response.data
  },

  async addEnergy(nucleoId: string, amount: number): Promise<EnergyLog> {
    const response = await api.post<EnergyLog>(API_ROUTES.NUCLEOS.ENERGY(nucleoId), { amount })
    return response.data
  }
}