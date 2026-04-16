"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tarefasService } from "@/services/tarefas.service";
import type {
  CreateTarefaPayload,
  UpdateTarefaPayload,
} from "@/types/tarefa";

export function useTarefas(blocoId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["tarefas", blocoId],
    queryFn: () => tarefasService.getTarefas(blocoId!),
    enabled: !!blocoId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateTarefaPayload) =>
      tarefasService.createTarefa(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tarefas", blocoId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTarefaPayload;
    }) => tarefasService.updateTarefa(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tarefas", blocoId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tarefasService.deleteTarefa(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tarefas", blocoId] }),
  });

  return {
    tarefas: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    reload: query.refetch,
    criar: createMutation.mutateAsync,
    atualizar: updateMutation.mutateAsync,
    excluir: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}