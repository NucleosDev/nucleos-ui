import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/index.service";
import type { UpdateUserPayload } from "@/src/types/user";
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
