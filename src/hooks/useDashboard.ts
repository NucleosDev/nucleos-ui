// src/hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import type { User } from "@/types/user";

// ---------------------------------------------------------------------------
// Usuário atual (autenticado)
// ---------------------------------------------------------------------------
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
