// src/hooks/useBlocos.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blocosService } from "@/services/blocos.service"; // Certifique-se do caminho correto
import type {
  Bloco,
  CreateBlocoPayload,
  UpdateBlocoPayload,
  ReorderBlocosPayload,
} from "@/types/bloco";

export function useBlocos(nucleoId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<Bloco[]>({
    queryKey: ["blocos", nucleoId],
    queryFn: () => blocosService.listarPorNucleo(nucleoId!),
    enabled: !!nucleoId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateBlocoPayload) => blocosService.criar(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocos", nucleoId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateBlocoPayload;
    }) => blocosService.atualizar(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocos", nucleoId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blocosService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocos", nucleoId] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (payload: ReorderBlocosPayload) =>
      blocosService.reordenar(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocos", nucleoId] });
    },
  });

  return {
    blocos: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    reload: query.refetch,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    reorder: reorderMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReordering: reorderMutation.isPending,
  };
}

// Corrigido: aceita nucleoId opcional e passa para o serviço
export function useBloco(id: string, nucleoId?: string) {
  return useQuery<Bloco>({
    queryKey: ["blocos", id],
    queryFn: () => blocosService.buscarPorId(id, nucleoId),
    enabled: !!id,
  });
}
