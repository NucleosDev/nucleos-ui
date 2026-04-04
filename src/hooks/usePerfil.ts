import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usersService } from "@/services/users.service";
import type { UpdateUserPayload } from "@/src/types/test";
import { User } from "@/src/types/user";

export function useUpdatePerfil() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<User>) => usersService.updateProfile(payload),
    onSuccess: (updatedUser) => {
      qc.setQueryData(["user", "me"], updatedUser);
    },
  });
}
