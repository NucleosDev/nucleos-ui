"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService, type ReentryStatus, type ReentryResult } from "@/services/users.service";

export function useReentryCheck() {
  return useQuery<ReentryStatus>({
    queryKey: ["reentry-status"],
    queryFn: () => usersService.getReentryStatus(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useProcessReentry() {
  const queryClient = useQueryClient();
  return useMutation<ReentryResult>({
    mutationFn: () => usersService.processReentry(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      queryClient.invalidateQueries({ queryKey: ["tarefas", "vencendo"] });
      queryClient.invalidateQueries({ queryKey: ["reentry-status"] });
    },
  });
}
