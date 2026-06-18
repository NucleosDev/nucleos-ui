import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import type { UpdateUserPayload } from "@/types/user";
import type { User } from "@/types/user";

export function useUpdatePerfil() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<User>) => usersService.updateProfile(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user", "me"], updatedUser);
      // Também invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
}
