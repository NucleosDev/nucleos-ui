import api from "./api-auth";
import { API_ROUTES } from "@/constants/routes";
import type { Plan } from "@/types/plan";
import type { Subscription } from "@/types/user";

export const subscriptionsService = {
  // Planos
  async getPlans(): Promise<Plan[]> {
    const response = await api.get<Plan[]>(API_ROUTES.PLANS.LIST);
    return response.data;
  },

  async getPlan(id: string): Promise<Plan> {
    const response = await api.get<Plan>(`${API_ROUTES.PLANS.LIST}/${id}`);
    return response.data;
  },

  // Assinatura atual
  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      const response = await api.get<Subscription>(API_ROUTES.PLANS.CURRENT);
      return response.data;
    } catch {
      return null;
    }
  },

  async subscribe(planId: string): Promise<Subscription> {
    const response = await api.post<Subscription>(
      API_ROUTES.PLANS.SUBSCRIBE(planId),
    );
    return response.data;
  },

  async cancelSubscription(): Promise<void> {
    await api.post(API_ROUTES.PLANS.CANCEL);
  },

  async updatePaymentMethod(paymentMethodId: string): Promise<void> {
    await api.post("/subscriptions/payment-method", { paymentMethodId });
  },

  async getInvoices(): Promise<any[]> {
    const response = await api.get("/subscriptions/invoices");
    return response.data;
  },
};
