// services/calendario.service.ts
import { api } from "@/lib/api";
import { API_ROUTES } from "@/constants/routes";
import type {
  CalendarioEvento,
  CreateEventoPayload,
  UpdateEventoPayload,
} from "@/types/calendar";

export const calendarioService = {
  async listarPorNucleo(nucleoId: string): Promise<CalendarioEvento[]> {
    const res = await api.get<
      { success: boolean; data: CalendarioEvento[] } | CalendarioEvento[]
    >(API_ROUTES.CALENDARIO.LIST(nucleoId));
    // Trata tanto array direto quanto envelope { success, data }
    if (Array.isArray(res)) return res;
    if (res && typeof res === "object" && "data" in res) {
      return Array.isArray(res.data) ? res.data : [];
    }
    return [];
  },

  async criar(payload: CreateEventoPayload): Promise<CalendarioEvento> {
    const res = await api.post<
      { success: boolean; data: CalendarioEvento } | CalendarioEvento
    >(API_ROUTES.CALENDARIO.CREATE, payload);
    if (res && typeof res === "object" && "data" in res) return res.data;
    return res as CalendarioEvento;
  },

  async atualizar(
    id: string,
    payload: UpdateEventoPayload,
  ): Promise<CalendarioEvento> {
    const res = await api.put<
      { success: boolean; data: CalendarioEvento } | CalendarioEvento
    >(API_ROUTES.CALENDARIO.UPDATE(id), payload);
    if (res && typeof res === "object" && "data" in res) return res.data;
    return res as CalendarioEvento;
  },

  async deletar(id: string): Promise<void> {
    await api.delete(API_ROUTES.CALENDARIO.DELETE(id));
  },
};
