// src/hooks/useBlocoNotas.ts
import { useState } from "react";
import { colecoesService } from "@/services/colecoes.service";
import type { UpdateBlocoPayload } from "@/types/bloco";

interface BlocoNotas {
  id: string;
  titulo?: string;
  configuracoes?: {
    colecaoId?: string;
    campoId?: string;
  };
}

interface UseBlocoNotasProps {
  bloco: BlocoNotas;
  blocoId: string;
  onUpdateBloco: (payload: {
    id: string;
    payload: UpdateBlocoPayload;
  }) => Promise<any>;
}

export function useBlocoNotas({
  bloco,
  blocoId,
  onUpdateBloco,
}: UseBlocoNotasProps) {
  const [colecaoId, setColecaoId] = useState(bloco.configuracoes?.colecaoId);
  const [campoId, setCampoId] = useState(bloco.configuracoes?.campoId);

  const carregarConteudo = async (): Promise<string> => {
    if (!colecaoId || !campoId) return "";

    try {
      const itens = await colecoesService.getItens(colecaoId);
      if (itens.length === 0) return "";
      return itens[0]?.valores?.[campoId] || "";
    } catch {
      return "";
    }
  };

  const salvarConteudo = async (conteudo: string) => {
    if (!colecaoId || !campoId) {
      const novaColecao = await colecoesService.createColecao(
        blocoId,
        `Notas_${bloco.id}`,
      );
      const novoCampo = await colecoesService.createCampo(
        novaColecao.id,
        "conteudo",
        "texto",
      );

      setColecaoId(novaColecao.id);
      setCampoId(novoCampo.id);

      await onUpdateBloco({
        id: bloco.id,
        payload: {
          configuracoes: {
            colecaoId: novaColecao.id,
            campoId: novoCampo.id,
          },
        },
      });

      await colecoesService.createItem(novaColecao.id, {
        [novoCampo.id]: conteudo,
      });
    } else {
      const itens = await colecoesService.getItens(colecaoId);
      if (itens.length === 0) {
        await colecoesService.createItem(colecaoId, { [campoId]: conteudo });
      } else {
        await colecoesService.updateItem(itens[0].id, { [campoId]: conteudo });
      }
    }
  };

  return {
    carregarConteudo,
    salvarConteudo,
    hasColecao: !!colecaoId,
    colecaoId,
    campoId,
  };
}
