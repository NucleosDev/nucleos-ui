// src/hooks/useBlocos.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blocosService } from "@/services/blocos.service";
import type {
  Bloco,
  CreateBlocoPayload,
  UpdateBlocoPayload,
  ReorderBlocosPayload,
} from "@/types/bloco";

export function useBlocos(nucleoId?: string, parentId?: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery<Bloco[]>({
    queryKey: ["blocos", nucleoId, parentId ?? "root"],
    queryFn: () => {
      if (parentId) {
        // Buscar filhos de um parent específico
        return blocosService.listarFilhos(parentId, nucleoId!);
      }
      if (parentId === null) {
        // Buscar apenas raízes (sem parent)
        return blocosService.listarRaizes(nucleoId!);
      }
      // Comportamento original: todos os blocos
      return blocosService.listarPorNucleo(nucleoId!);
    },
    enabled: !!nucleoId,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateBlocoPayload) => blocosService.criar(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocos", nucleoId] });
      queryClient.invalidateQueries({ queryKey: ["nucleo", nucleoId] });
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
      queryClient.invalidateQueries({ queryKey: ["bloco"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blocosService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocos", nucleoId] });
      queryClient.invalidateQueries({ queryKey: ["nucleo", nucleoId] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (payload: ReorderBlocosPayload) =>
      blocosService.reordenar(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocos", nucleoId] });
    },
  });

  const moveMutation = useMutation({
    mutationFn: ({
      blocoId,
      newParentId,
      position,
    }: {
      blocoId: string;
      newParentId: string | null;
      position: number;
    }) => blocosService.moverParaParent(blocoId, newParentId, position),
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
    move: moveMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isReordering: reorderMutation.isPending,
    isMoving: moveMutation.isPending,
  };
}

// Hook para buscar um bloco específico
export function useBloco(id: string, nucleoId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<Bloco>({
    queryKey: ["bloco", id, nucleoId],
    queryFn: () => blocosService.buscarPorId(id, nucleoId),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation({
    mutationFn: ({ payload }: { payload: UpdateBlocoPayload }) =>
      blocosService.atualizar(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bloco", id, nucleoId] });
      queryClient.invalidateQueries({ queryKey: ["blocos", nucleoId] });
    },
  });

  return {
    bloco: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
}

// Hook para sub-blocos - CORRIGIDO
export function useSubBlocos(parentId: string, nucleoId: string) {
  const queryClient = useQueryClient();

  const query = useQuery<Bloco[]>({
    queryKey: ["sub-blocos", parentId, nucleoId],
    queryFn: () => blocosService.listarFilhos(parentId, nucleoId), // ✅ Agora com 2 argumentos
    enabled: !!parentId && !!nucleoId,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateBlocoPayload) =>
      blocosService.criar({ ...payload, parentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sub-blocos", parentId, nucleoId],
      });
      queryClient.invalidateQueries({ queryKey: ["bloco", parentId] });
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
      queryClient.invalidateQueries({
        queryKey: ["sub-blocos", parentId, nucleoId],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blocosService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sub-blocos", parentId, nucleoId],
      });
      queryClient.invalidateQueries({ queryKey: ["blocos", nucleoId] });
    },
  });

  return {
    subBlocos: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

export function useTotalBlocosCount(nucleos: { id: string }[]) {
  const queryClient = useQueryClient();
  const total = nucleos.reduce((sum, n) => {
    const cached = queryClient.getQueryData<Bloco[]>(["blocos", n.id, "root"]);
    return sum + (cached?.length ?? 0);
  }, 0);
  return { data: total };
}
