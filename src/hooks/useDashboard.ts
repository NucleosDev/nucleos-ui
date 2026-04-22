import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import type { User } from "@/types/user";
import type { Plan } from "@/types/plan";
import { usersService } from "@/services/index.service";

interface UserPlanResponse {
  plan: Plan;
  startedAt: string;
  expiresAt?: string;
}

// Usuário atual (autenticado)

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: ["current-user"],
    staleTime: 1000 * 60 * 5,
    retry: false,

    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),

    placeholderData: () => authService.getStoredUser(),

    queryFn: async () => {
      try {
        return await authService.getCurrentUser();
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return null;
      }
    },
  });
}

// Plano do usuário atual

export function useUserPlan() {
  return useQuery({
    queryKey: ["user-plan"],
    queryFn: async () => {
      try {
        const response = await usersService.getCurrentPlan();

        // Se a API retornar diretamente o plano
        if (response && !response.plan) {
          return {
            plan: response as Plan,
            startedAt: new Date().toISOString(),
          };
        }

        return response as UserPlanResponse;
      } catch (error) {
        console.error("Erro ao buscar plano do usuário:", error);
        return {
          plan: {
            id: "free",
            name: "Grátis",
            price: 0,
            created_at: new Date().toISOString(),
            max_nucleos: 3,
          },
          startedAt: new Date().toISOString(),
        };
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
