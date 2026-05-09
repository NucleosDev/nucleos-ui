import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tarefasService } from "@/services/tarefas.service";
import type { CreateTarefaPayload, UpdateTarefaPayload, Tarefa } from "@/types/tarefas";

export function useTarefas(blocoId?: string) {
  const queryClient = useQueryClient();
  const queryKey = ["tarefas", blocoId] as const;

  const query = useQuery({
    queryKey,
    queryFn: () => tarefasService.getTarefas(blocoId!),
    enabled: !!blocoId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateTarefaPayload) =>
      tarefasService.createTarefa(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTarefaPayload;
    }) => tarefasService.updateTarefa(id, payload),

    // Optimistic update: patch the cache immediately so the UI responds without waiting for the server
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Tarefa[]>(queryKey);
      if (previous && payload.status !== undefined) {
        queryClient.setQueryData<Tarefa[]>(queryKey, (old) =>
          old?.map((t) => (t.id === id ? { ...t, ...payload } : t)) ?? [],
        );
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKey, ctx.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tarefasService.deleteTarefa(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const concluirMutation = useMutation({
    mutationFn: (id: string) => tarefasService.concluirTarefa(id),
    // Optimistic update for concluir as well
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Tarefa[]>(queryKey);
      if (previous) {
        queryClient.setQueryData<Tarefa[]>(queryKey, (old) =>
          old?.map((t) =>
            t.id === id ? { ...t, status: "concluida" as const } : t,
          ) ?? [],
        );
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKey, ctx.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    tarefas: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    reload: query.refetch,
    criar: createMutation.mutateAsync,
    atualizar: updateMutation.mutateAsync,
    excluir: deleteMutation.mutateAsync,
    concluir: concluirMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isConcluindo: concluirMutation.isPending,
  };
}
