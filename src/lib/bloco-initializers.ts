// lib/bloco-initializers.ts
import { listasService } from "@/services/index.service";
import { tarefasService } from "@/services/tarefas.service";
// import { habitosService } from "@/services/habitos.service";
import { colecoesService } from "@/services/colecoes.service";
import type { BlocoTipo } from "@/types/bloco";

export type BlocoInitializer = (
  blocoId: string,
  titulo?: string,
) => Promise<void>;

export const BLOCO_INITIALIZERS: Partial<Record<BlocoTipo, BlocoInitializer>> =
  {
    lista: async (blocoId, titulo) => {
      await listasService.criar({
        blocoId,
        nome: titulo || "Minha Lista",
        tipoLista: "generica",
      });
    },

    tarefas: async (blocoId, titulo) => {
      // Tarefas geralmente não precisam de inicialização automática.
      // Opcional: criar uma tarefa de exemplo ou configuração padrão.
    },

    // habitos: async (blocoId, titulo) => {
    //   await habitosService.criar({
    //     blocoId,
    //     nome: "Novo Hábito",
    //     frequencia: "diaria",
    //     metaVeces: 1,
    //   });
    // },

    colecoes: async (blocoId, titulo) => {
      // ✅ Descomentado e ajustado para corresponder ao serviço real
      const colecao = await colecoesService.createColecao(
        blocoId,
        titulo || "Minha Coleção",
      );
      // Opcional: criar campo padrão
      await colecoesService.createCampo(colecao.id, "Nome", "texto");
    },

    notas: undefined,
    calendario: undefined,
    calculo: undefined,
  };
