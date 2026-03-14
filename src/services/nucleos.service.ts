import { api } from './api'
import { API_ROUTES } from '@/constants/routes'
import type { Core, Habit, Activity } from '@/types'

export const nucleosService = {
  // Cores
  async getCores(): Promise<Core[]> {
    return api.get<Core[]>(API_ROUTES.CORES.LIST)
  },

  async getCore(id: string): Promise<Core> {
    return api.get<Core>(API_ROUTES.CORES.GET(id))
  },

  async createCore(data: Partial<Core>): Promise<Core> {
    return api.post<Core>(API_ROUTES.CORES.CREATE, data)
  },

  async updateCore(id: string, data: Partial<Core>): Promise<Core> {
    return api.put<Core>(API_ROUTES.CORES.UPDATE(id), data)
  },

  async deleteCore(id: string): Promise<void> {
    return api.delete(API_ROUTES.CORES.DELETE(id))
  },

  // Habits
  async getHabits(): Promise<Habit[]> {
    return api.get<Habit[]>(API_ROUTES.HABITS.LIST)
  },

  async getHabit(id: string): Promise<Habit> {
    return api.get<Habit>(API_ROUTES.HABITS.GET(id))
  },

  async createHabit(data: Partial<Habit>): Promise<Habit> {
    return api.post<Habit>(API_ROUTES.HABITS.CREATE, data)
  },

  async updateHabit(id: string, data: Partial<Habit>): Promise<Habit> {
    return api.put<Habit>(API_ROUTES.HABITS.UPDATE(id), data)
  },

  async deleteHabit(id: string): Promise<void> {
    return api.delete(API_ROUTES.HABITS.DELETE(id))
  },

  // Activities
  async getActivities(): Promise<Activity[]> {
    return api.get<Activity[]>(API_ROUTES.ACTIVITIES.LIST)
  },

  async getActivity(id: string): Promise<Activity> {
    return api.get<Activity>(API_ROUTES.ACTIVITIES.GET(id))
  },

  async createActivity(data: Partial<Activity>): Promise<Activity> {
    return api.post<Activity>(API_ROUTES.ACTIVITIES.CREATE, data)
  },
}
