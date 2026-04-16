// src/hooks/useTarefas.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tarefasService } from "@/services/index.service";
import type { Tarefa, CreateTarefaPayload, UpdateTarefaPayload } from "@/types";

export function useTarefas(blocoId?: string) {
  const queryClient = useQueryClient();

  // Listar tarefas de um bloco específico
  const porBlocoQuery = useQuery<Tarefa[]>({
    queryKey: ["tarefas", "bloco", blocoId],
    queryFn: () => tarefasService.listarPorBloco(blocoId!),
    enabled: !!blocoId,
  });

  // Listar tarefas vencendo (próximas ou atrasadas)
  const vencendoQuery = useQuery<Tarefa[]>({
    queryKey: ["tarefas", "vencendo"],
    queryFn: () => tarefasService.listarVencendo(),
  });

  // Criar tarefa
  const createMutation = useMutation({
    mutationFn: (payload: CreateTarefaPayload) => tarefasService.criar(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });

  // Atualizar tarefa
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTarefaPayload;
    }) => tarefasService.atualizar(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });

  // Concluir tarefa
  const concluirMutation = useMutation({
    mutationFn: (id: string) => tarefasService.concluir(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-level"] });
      queryClient.invalidateQueries({ queryKey: ["user-streaks"] });
    },
  });

  // Excluir tarefa
  const deleteMutation = useMutation({
    mutationFn: (id: string) => tarefasService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });

  return {
    // Dados
    tarefasPorBloco: porBlocoQuery.data ?? [],
    tarefasVencendo: vencendoQuery.data ?? [],

    // Estados de carregamento
    isLoadingPorBloco: porBlocoQuery.isLoading,
    isLoadingVencendo: vencendoQuery.isLoading,

    // Recarregar
    recarregarPorBloco: porBlocoQuery.refetch,
    recarregarVencendo: vencendoQuery.refetch,

    // Mutations
    criar: createMutation.mutateAsync,
    atualizar: updateMutation.mutateAsync,
    concluir: concluirMutation.mutateAsync,
    excluir: deleteMutation.mutateAsync,

    // Estados das mutations
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isConcluindo: concluirMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
