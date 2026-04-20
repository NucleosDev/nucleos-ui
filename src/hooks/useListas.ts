// src/hooks/useListas.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listasService } from "@/services/lista.service";
import type {
  Lista,
  CreateListaPayload,
  UpdateListaPayload,
} from "@/types/lista";

// --------------------------------------------------------------------------
// Hook para listar listas de um bloco e gerenciar mutations
// --------------------------------------------------------------------------
export function useListas(blocoId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<Lista[]>({
    queryKey: ["listas", blocoId],
    queryFn: () => listasService.listarPorBloco(blocoId!),
    enabled: !!blocoId,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateListaPayload) => listasService.criar(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listas", blocoId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateListaPayload;
    }) => listasService.atualizar(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listas", blocoId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => listasService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listas", blocoId] });
    },
  });

  return {
    listas: query.data ?? [],
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

// --------------------------------------------------------------------------
// Hook para buscar uma lista específica por ID
// --------------------------------------------------------------------------
export function useLista(id: string) {
  return useQuery<Lista>({
    queryKey: ["listas", id],
    queryFn: () => listasService.buscarPorId(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}
