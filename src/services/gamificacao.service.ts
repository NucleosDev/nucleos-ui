import api from "@/services/api";
import type { UserLevel, Streak, Conquista } from "@/types/tarefas";

export const gamificacaoService = {
  async getLevel(): Promise<UserLevel> {
    const { data } = await api.get<UserLevel>("/Gamificacao/level");
    return data;
  },

  async getStreaks(): Promise<Streak[]> {
    const { data } = await api.get<Streak[]>("/Gamificacao/streaks");
    return data;
  },

  async getConquistas(): Promise<Conquista[]> {
    const { data } = await api.get<Conquista[]>("/Gamificacao/conquistas");
    return data;
  },
};
