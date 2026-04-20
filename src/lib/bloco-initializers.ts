import { listasService } from "@/services/index.service";
import { tarefasService } from "@/services/tarefas.service";
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
    tarefas: async () => {
      // opcional
    },
    colecoes: async (blocoId, titulo) => {
      const colecao = await colecoesService.createColecao(
        blocoId,
        titulo || "Minha Tabela",
      );
      await colecoesService.createCampo(colecao.id, "Nome", "texto");
    },
    calendario: async () => {
      // Calendário não precisa de inicialização automática
    },
    notas: undefined,
    calculo: undefined,
  };
