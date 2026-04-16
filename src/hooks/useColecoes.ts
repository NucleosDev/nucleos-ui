// hooks/useColecoes.ts
import { useState, useCallback } from "react";
import { colecoesService } from "@/services/colecoes.service";
import type { Colecao, Campo, Item } from "@/types/colecao";

interface UseColecoesState {
  loading: boolean;
  error: string | null;
}

export function useColecoes() {
  const [state, setState] = useState<UseColecoesState>({
    loading: false,
    error: null,
  });

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, loading: isLoading }));
  };

  const setError = (error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  };

  const wrapRequest = useCallback(
    async <T>(request: () => Promise<T>): Promise<T | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const result = await request();
        return result;
      } catch (err: any) {
        const message =
          err?.response?.data?.message || err.message || "Erro desconhecido";
        setError(message);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==================== COLEÇÕES ====================
  const listColecoesByBloco = useCallback(
    (blocoId: string) =>
      wrapRequest(() => colecoesService.listByBloco(blocoId)),
    [wrapRequest],
  );

  const getColecao = useCallback(
    (id: string) => wrapRequest(() => colecoesService.getColecao(id)),
    [wrapRequest],
  );

  const createColecao = useCallback(
    (blocoId: string, nome: string) =>
      wrapRequest(() => colecoesService.createColecao(blocoId, nome)),
    [wrapRequest],
  );

  const updateColecao = useCallback(
    (id: string, nome: string) =>
      wrapRequest(() => colecoesService.updateColecao(id, nome)),
    [wrapRequest],
  );

  const deleteColecao = useCallback(
    (id: string) => wrapRequest(() => colecoesService.deleteColecao(id)),
    [wrapRequest],
  );

  // ==================== CAMPOS ====================
  const getCampos = useCallback(
    (colecaoId: string) =>
      wrapRequest(() => colecoesService.getCampos(colecaoId)),
    [wrapRequest],
  );

  const createCampo = useCallback(
    (colecaoId: string, nome: string, tipoCampo: string) =>
      wrapRequest(() =>
        colecoesService.createCampo(colecaoId, nome, tipoCampo),
      ),
    [wrapRequest],
  );

  const updateCampo = useCallback(
    (id: string, data: { nome?: string; tipoCampo?: string }) =>
      wrapRequest(() => colecoesService.updateCampo(id, data)),
    [wrapRequest],
  );

  const deleteCampo = useCallback(
    (id: string) => wrapRequest(() => colecoesService.deleteCampo(id)),
    [wrapRequest],
  );

  // ==================== ITENS ====================
  const getItens = useCallback(
    (colecaoId: string) =>
      wrapRequest(() => colecoesService.getItens(colecaoId)),
    [wrapRequest],
  );

  const createItem = useCallback(
    (colecaoId: string, valores: Record<string, any>) =>
      wrapRequest(() => colecoesService.createItem(colecaoId, valores)),
    [wrapRequest],
  );

  const updateItem = useCallback(
    (id: string, valores: Record<string, any>) =>
      wrapRequest(() => colecoesService.updateItem(id, valores)),
    [wrapRequest],
  );

  const deleteItem = useCallback(
    (id: string) => wrapRequest(() => colecoesService.deleteItem(id)),
    [wrapRequest],
  );

  return {
    loading: state.loading,
    error: state.error,
    // Coleções
    listColecoesByBloco,
    getColecao,
    createColecao,
    updateColecao,
    deleteColecao,
    // Campos
    getCampos,
    createCampo,
    updateCampo,
    deleteCampo,
    // Itens
    getItens,
    createItem,
    updateItem,
    deleteItem,
  };
}
