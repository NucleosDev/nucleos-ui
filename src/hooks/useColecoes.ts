// hooks/useColecoes.ts (CORRIGIDO)
import { useState } from "react";
import { api } from "@/lib/api";
import type { Campo, Colecao, TipoCampo } from "@/types/colecao";
import { AxiosResponse } from "axios";

export function useColecoes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Listar coleções por bloco
  const listColecoesByBloco = async (
    blocoId: string,
  ): Promise<Colecao[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const response: AxiosResponse<Colecao[]> = await api.get(
        `/colecoes/bloco/${blocoId}`, // ✅ rota correta
      );
      return response.data;
    } catch (err: any) {
      setError(err.message || "Erro ao carregar coleções");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Criar coleção
  const createColecao = async (
    blocoId: string,
    nome: string,
  ): Promise<Colecao | null> => {
    setLoading(true);
    setError(null);
    try {
      const response: AxiosResponse<Colecao> = await api.post("/colecoes", {
        nome,
        blocoId,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || "Erro ao criar coleção");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar coleção
  const updateColecao = async (
    id: string,
    nome: string,
  ): Promise<Colecao | null> => {
    setLoading(true);
    setError(null);
    try {
      const response: AxiosResponse<Colecao> = await api.put(
        `/colecoes/${id}`,
        { nome },
      );
      return response.data;
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar coleção");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Deletar coleção
  const deleteColecao = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/colecoes/${id}`);
      return true;
    } catch (err: any) {
      setError(err.message || "Erro ao deletar coleção");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Buscar campos de uma coleção
  const getCampos = async (colecaoId: string): Promise<Campo[] | null> => {
    try {
      const response: AxiosResponse<Campo[]> = await api.get(
        `/colecoes/${colecaoId}/campos`,
      );
      return response.data;
    } catch (err: any) {
      setError(err.message || "Erro ao carregar campos");
      return null;
    }
  };

  // Criar campo
  const createCampo = async (
    colecaoId: string,
    nome: string,
    tipoCampo: TipoCampo,
  ): Promise<Campo | null> => {
    try {
      const response: AxiosResponse<Campo> = await api.post(
        `/colecoes/campos`,
        {
          colecaoId,
          nome,
          tipoCampo,
        },
      );
      return response.data;
    } catch (err: any) {
      setError(err.message || "Erro ao criar campo");
      return null;
    }
  };

  // Atualizar campo (opcional, se necessário)
  const updateCampo = async (
    campoId: string,
    nome?: string,
    tipoCampo?: TipoCampo,
  ): Promise<Campo | null> => {
    try {
      const response: AxiosResponse<Campo> = await api.put(
        `/colecoes/campos/${campoId}`,
        {
          nome,
          tipoCampo,
        },
      );
      return response.data;
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar campo");
      return null;
    }
  };

  // Deletar campo
  const deleteCampo = async (campoId: string): Promise<boolean> => {
    try {
      await api.delete(`/colecoes/campos/${campoId}`);
      return true;
    } catch (err: any) {
      setError(err.message || "Erro ao deletar campo");
      return false;
    }
  };

  // Buscar itens de uma coleção
  const getItens = async (colecaoId: string): Promise<any[] | null> => {
    try {
      const response: AxiosResponse<any[]> = await api.get(
        `/colecoes/${colecaoId}/items`,
      );
      return response.data;
    } catch (err: any) {
      setError(err.message || "Erro ao carregar itens");
      return null;
    }
  };

  // Criar item
  const createItem = async (
    colecaoId: string,
    valores: Record<string, any>,
  ): Promise<any | null> => {
    try {
      const response: AxiosResponse<any> = await api.post(`/colecoes/items`, {
        colecaoId,
        valores,
      });
      return response.data;
    } catch (err: any) {
      setError(err.message || "Erro ao criar item");
      return null;
    }
  };

  // Atualizar item
  const updateItem = async (
    itemId: string,
    valores: Record<string, any>,
  ): Promise<any | null> => {
    try {
      const response: AxiosResponse<any> = await api.put(
        `/colecoes/items/${itemId}`,
        {
          valores,
        },
      );
      return response.data;
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar item");
      return null;
    }
  };

  // Deletar item
  const deleteItem = async (itemId: string): Promise<boolean> => {
    try {
      await api.delete(`/colecoes/items/${itemId}`);
      return true;
    } catch (err: any) {
      setError(err.message || "Erro ao deletar item");
      return false;
    }
  };

  // Buscar uma coleção específica
  const getColecao = async (id: string): Promise<Colecao | null> => {
    try {
      const response: AxiosResponse<Colecao> = await api.get(`/colecoes/${id}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || "Erro ao carregar coleção");
      return null;
    }
  };

  return {
    loading,
    error,
    isLoading,
    listColecoesByBloco,
    createColecao,
    updateColecao,
    deleteColecao,
    getColecao,
    getCampos,
    createCampo,
    updateCampo,
    deleteCampo,
    getItens,
    createItem,
    updateItem,
    deleteItem,
  };
}
