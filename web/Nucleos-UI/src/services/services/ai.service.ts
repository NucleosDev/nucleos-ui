import api from "./api-auth";
import { API_ROUTES } from "@/constants/routes";
import type { AiInteraction, AiContext, AiInsight } from "@/types/ai";

export const aiService = {
  // Interações
  async sendMessage(
    message: string,
    contexto?: Record<string, any>,
  ): Promise<AiInteraction> {
    const response = await api.post<AiInteraction>(API_ROUTES.AI.INTERACT, {
      mensagem: message,
      contexto,
    });
    return response.data;
  },

  async getHistory(params?: {
    page?: number;
    limit?: number;
  }): Promise<AiInteraction[]> {
    const response = await api.get<AiInteraction[]>(API_ROUTES.AI.INTERACT, {
      params,
    });
    return response.data;
  },

  // Contexto
  async getContext(): Promise<AiContext> {
    const response = await api.get<AiContext>(API_ROUTES.AI.CONTEXT);
    return response.data;
  },

  async updateContext(data: Partial<AiContext>): Promise<AiContext> {
    const response = await api.put<AiContext>(API_ROUTES.AI.CONTEXT, data);
    return response.data;
  },

  // Insights
  async getInsights(): Promise<AiInsight[]> {
    const response = await api.get<AiInsight[]>(API_ROUTES.AI.INSIGHTS);
    return response.data;
  },

  async applyInsight(id: string): Promise<void> {
    await api.post(API_ROUTES.AI.INSIGHT_APPLY(id));
  },

  async dismissInsight(id: string): Promise<void> {
    await api.delete(`${API_ROUTES.AI.INSIGHTS}/${id}`);
  },
};
