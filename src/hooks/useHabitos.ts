import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { habitosService } from "@/services/index.service";
import type {
  Habito,
  CreateHabitoPayload,
  RegistrarHabitoPayload,
} from "@/types/habitos";

export function useHabitos(blocoId?: string) {
  const queryClient = useQueryClient();

  // Listar hábitos de um bloco específico
  const porBlocoQuery = useQuery<Habito[]>({
    queryKey: ["habitos", "bloco", blocoId],
    queryFn: () => habitosService.listarPorBloco(blocoId!),
    enabled: !!blocoId,
  });

  // Criar hábito
  const createMutation = useMutation({
    mutationFn: (payload: CreateHabitoPayload) => habitosService.criar(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habitos"] });
    },
  });

  // Registrar conclusão do hábito
  const registrarMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: RegistrarHabitoPayload;
    }) => habitosService.registrar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habitos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-level"] });
      queryClient.invalidateQueries({ queryKey: ["user-streaks"] });
    },
  });

  // Excluir hábito
  const deleteMutation = useMutation({
    mutationFn: (id: string) => habitosService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habitos"] });
    },
  });

  return {
    // Dados
    habitosPorBloco: porBlocoQuery.data ?? [],

    // Estados de carregamento
    isLoadingPorBloco: porBlocoQuery.isLoading,

    // Recarregar
    recarregarPorBloco: porBlocoQuery.refetch,

    // Mutations
    criar: createMutation.mutateAsync,
    registrar: registrarMutation.mutateAsync,
    excluir: deleteMutation.mutateAsync,

    // Estados das mutations
    isCreating: createMutation.isPending,
    isRegistrando: registrarMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
