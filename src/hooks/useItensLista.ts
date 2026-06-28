// src/hooks/useItensLista.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listasService } from "@/services/lista.service";
import type {
  ItemLista,
  CreateItemListaPayload,
  UpdateItemListaPayload,
} from "@/types/lista";

// --------------------------------------------------------------------------
// Hook para gerenciar itens de uma lista
// --------------------------------------------------------------------------
export function useItensLista(listaId: string) {
  const queryClient = useQueryClient();

  const query = useQuery<ItemLista[]>({
    queryKey: ["itens", listaId],
    queryFn: () => listasService.listarItens(listaId),
    enabled: !!listaId,
    staleTime: 1000 * 60 * 2,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateItemListaPayload) =>
      listasService.criarItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itens", listaId] });
      // Também invalidamos a lista pai para atualizar contagem de itens
      queryClient.invalidateQueries({ queryKey: ["listas"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateItemListaPayload;
    }) => listasService.atualizarItem(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itens", listaId] });
      queryClient.invalidateQueries({ queryKey: ["listas"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => listasService.toggleItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itens", listaId] });
      queryClient.invalidateQueries({ queryKey: ["listas"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => listasService.deletarItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itens", listaId] });
      queryClient.invalidateQueries({ queryKey: ["listas"] });
    },
  });

  return {
    itens: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    reload: query.refetch,
    criarItem: createMutation.mutateAsync,
    atualizarItem: updateMutation.mutateAsync,
    toggleItem: toggleMutation.mutateAsync,
    excluirItem: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isToggling: toggleMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
