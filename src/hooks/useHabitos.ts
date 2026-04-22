import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { habitosService } from "@/services/habitos.service";
import type {
  CreateHabitoPayload,
  UpdateHabitoPayload,
  RegistrarHabitoPayload,
} from "@/types/habitos";

export function useHabitos(blocoId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["habitos", blocoId],
    queryFn: async () => {
      const result = await habitosService.listarPorBloco(blocoId!);
      return Array.isArray(result) ? result : [];
    },
    enabled: !!blocoId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateHabitoPayload) => habitosService.criar(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["habitos", blocoId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateHabitoPayload;
    }) => habitosService.atualizar(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["habitos", blocoId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => habitosService.deletar(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["habitos", blocoId] }),
  });

  const registrarMutation = useMutation({
    mutationFn: (payload: RegistrarHabitoPayload) =>
      habitosService.registrar(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habitos", blocoId] });
    },
  });

  return {
    habitos: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    reload: query.refetch,
    criar: createMutation.mutateAsync,
    atualizar: updateMutation.mutateAsync,
    deletar: deleteMutation.mutateAsync,
    registrar: registrarMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isRegistering: registrarMutation.isPending,
  };
}
