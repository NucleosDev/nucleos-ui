import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { timersService } from "@/services/timers.service";
import type { StartTimerPayload } from "@/types/timer";

export function useTimers(nucleoId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["timers", nucleoId],
    queryFn: async () => {
      const result = await timersService.listarPorNucleo(nucleoId!);
      return Array.isArray(result) ? result : [];
    },
    enabled: !!nucleoId,
  });

  const startMutation = useMutation({
    mutationFn: (payload: StartTimerPayload) => timersService.start(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timers", nucleoId] });
    },
  });

  const stopMutation = useMutation({
    mutationFn: (id: string) => timersService.stop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timers", nucleoId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => timersService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timers", nucleoId] });
    },
  });

  // 👇 NOVO
  const updateMutation = useMutation({
    mutationFn: ({ id, titulo }: { id: string; titulo: string }) =>
      timersService.atualizar(id, titulo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timers", nucleoId] });
    },
  });

  return {
    timers: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    reload: query.refetch,
    start: startMutation.mutateAsync,
    stop: stopMutation.mutateAsync,
    deletar: deleteMutation.mutateAsync,
    atualizar: updateMutation.mutateAsync, // 👈 NOVO
    isStarting: startMutation.isPending,
    isStopping: stopMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUpdating: updateMutation.isPending, // 👈 NOVO
  };
}
