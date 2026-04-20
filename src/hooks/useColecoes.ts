import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { colecoesService } from "@/services/colecoes.service";
import type { Colecao, Campo, Item } from "@/types/colecao";

export function useColecoes(blocoId?: string) {
  const queryClient = useQueryClient();

  const { data: colecoes = [], isLoading } = useQuery({
    queryKey: ["colecoes", blocoId],
    queryFn: () => colecoesService.listByBloco(blocoId!),
    enabled: !!blocoId,
  });

  const createMutation = useMutation({
    mutationFn: ({ nome }: { nome: string }) =>
      colecoesService.createColecao(blocoId!, nome),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colecoes", blocoId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, nome }: { id: string; nome: string }) =>
      colecoesService.updateColecao(id, nome),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colecoes", blocoId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => colecoesService.deleteColecao(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["colecoes", blocoId] });
    },
  });

  return {
    colecoes,
    isLoading,
    criarColecao: createMutation.mutateAsync,
    atualizarColecao: updateMutation.mutateAsync,
    excluirColecao: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// Hook para uma coleção específica
export function useColecao(id: string) {
  return useQuery({
    queryKey: ["colecao", id],
    queryFn: () => colecoesService.getColecao(id),
    enabled: !!id,
  });
}

// Hook para campos de uma coleção
export function useCampos(colecaoId: string) {
  const queryClient = useQueryClient();

  const { data: campos = [], isLoading } = useQuery({
    queryKey: ["campos", colecaoId],
    queryFn: () => colecoesService.getCampos(colecaoId),
    enabled: !!colecaoId,
  });

  const createMutation = useMutation({
    mutationFn: ({ nome, tipoCampo }: { nome: string; tipoCampo: string }) =>
      colecoesService.createCampo(colecaoId, nome, tipoCampo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campos", colecaoId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      colecoesService.updateCampo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campos", colecaoId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => colecoesService.deleteCampo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campos", colecaoId] });
    },
  });

  return {
    campos,
    isLoading,
    criarCampo: createMutation.mutateAsync,
    atualizarCampo: updateMutation.mutateAsync,
    excluirCampo: deleteMutation.mutateAsync,
  };
}

// Hook para itens de uma coleção
export function useItensColecao(colecaoId: string) {
  const queryClient = useQueryClient();

  const { data: itens = [], isLoading } = useQuery({
    queryKey: ["itens", colecaoId],
    queryFn: () => colecoesService.getItens(colecaoId),
    enabled: !!colecaoId,
  });

  const createMutation = useMutation({
    mutationFn: (valores: Record<string, any>) =>
      colecoesService.createItem(colecaoId, valores),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itens", colecaoId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      valores,
    }: {
      id: string;
      valores: Record<string, any>;
    }) => colecoesService.updateItem(id, valores),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itens", colecaoId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => colecoesService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itens", colecaoId] });
    },
  });

  return {
    itens,
    isLoading,
    criarItem: createMutation.mutateAsync,
    atualizarItem: updateMutation.mutateAsync,
    excluirItem: deleteMutation.mutateAsync,
  };
}
