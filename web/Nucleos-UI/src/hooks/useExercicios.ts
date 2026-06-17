import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { exerciciosService } from "@/services/exercicios.service";
import type {
  CreateTreinoPayload,
  UpdateTreinoPayload,
  AddExercicioPayload,
} from "@/types/exercicios";

export function useExercicios(blocoId?: string) {
  const queryClient = useQueryClient();
  const qk = ["exercicios", blocoId] as const;

  const query = useQuery({
    queryKey: qk,
    queryFn: async () => {
      const result = await exerciciosService.listarPorBloco(blocoId!);
      return Array.isArray(result) ? result : [];
    },
    enabled: !!blocoId,
  });

  const criarMutation = useMutation({
    mutationFn: (payload: CreateTreinoPayload) => exerciciosService.criarTreino(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  const atualizarMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTreinoPayload }) =>
      exerciciosService.atualizarTreino(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  const deletarMutation = useMutation({
    mutationFn: (id: string) => exerciciosService.deletarTreino(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  const adicionarExercicioMutation = useMutation({
    mutationFn: (payload: AddExercicioPayload) => exerciciosService.adicionarExercicio(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  const removerExercicioMutation = useMutation({
    mutationFn: (exercicioId: string) => exerciciosService.removerExercicio(exercicioId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk }),
  });

  return {
    treinos: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    reload: query.refetch,
    criarTreino: criarMutation.mutateAsync,
    atualizarTreino: atualizarMutation.mutateAsync,
    deletarTreino: deletarMutation.mutateAsync,
    adicionarExercicio: adicionarExercicioMutation.mutateAsync,
    removerExercicio: removerExercicioMutation.mutateAsync,
    isCreating: criarMutation.isPending,
    isDeleting: deletarMutation.isPending,
  };
}
