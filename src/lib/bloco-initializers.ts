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
      // Opcional: criar uma tarefa de exemplo
    },

    colecoes: async (blocoId, titulo) => {
      // Cria automaticamente uma coleção padrão
      const colecao = await colecoesService.createColecao(
        blocoId,
        titulo || "Minha Tabela",
      );
      // Cria um campo "Nome" do tipo texto para que o usuário possa começar a usar imediatamente
      await colecoesService.createCampo(colecao.id, "Nome", "texto");
    },

    notas: undefined,
    calendario: undefined,
    calculo: undefined,
  };
