
import api from "./api";
import { API_ROUTES } from "@/constants/routes"; // ← CORRIGIDO
import type {
  Nucleo,
  NucleoIcon,
  NucleoRelation,
  NucleoAchievement,
} from "@/types/nucleo";
import type { XpLog, EnergyLog } from "@/types/logs";

export const nucleosService = {
  async getNucleos(): Promise<Nucleo[]> {
    const response = await api.get<Nucleo[]>(API_ROUTES.NUCLEOS.LIST);
    return response.data;
  },

  async getNucleo(id: string): Promise<Nucleo> {
    const response = await api.get<Nucleo>(API_ROUTES.NUCLEOS.GET(id));
    return response.data;
  },

  async createNucleo(data: Partial<Nucleo>): Promise<Nucleo> {
    const response = await api.post<Nucleo>(API_ROUTES.NUCLEOS.CREATE, data);
    return response.data;
  },

  async updateNucleo(id: string, data: Partial<Nucleo>): Promise<Nucleo> {
    const response = await api.put<Nucleo>(API_ROUTES.NUCLEOS.UPDATE(id), data);
    return response.data;
  },

  async deleteNucleo(id: string): Promise<void> {
    await api.delete(API_ROUTES.NUCLEOS.DELETE(id));
  },

  async getIcones(): Promise<NucleoIcon[]> {
    const response = await api.get<NucleoIcon[]>(API_ROUTES.NUCLEOS.ICONES);
    return response.data;
  },

  async addXp(
    nucleoId: string,
    amount: number,
    source: string,
  ): Promise<XpLog> {
    const response = await api.post<XpLog>(API_ROUTES.NUCLEOS.XP(nucleoId), {
      amount,
      source,
    });
    return response.data;
  },

  async addEnergy(nucleoId: string, amount: number): Promise<EnergyLog> {
    const response = await api.post<EnergyLog>(
      API_ROUTES.NUCLEOS.ENERGY(nucleoId),
      {
        amount,
      },
    );
    return response.data;
  },
};
