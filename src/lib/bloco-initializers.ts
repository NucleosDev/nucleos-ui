// lib/bloco-initializers.ts
import { listasService } from "@/services/index.service";
import { tarefasService } from "@/services/tarefas.service";
import { colecoesService } from "@/services/colecoes.service";
import { habitosService } from "@/services/habitos.service";
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
    habitos: async (blocoId, titulo) => {
      await habitosService.criar({
        blocoId,
        nome: titulo || "Beber água",
        frequencia: "diaria",
        metaVezes: 8,
      });
      await habitosService.criar({
        blocoId,
        nome: "Meditar",
        frequencia: "diaria",
        metaVezes: 1,
      });
    },
    timers: async () => {
      // opcional
    },
    timer: async () => {
      // opcional
    },
    habito: async () => {
      // opcional
    },
    notas: async (blocoId, titulo) => {
      // Bloco de notas - a coleção será criada sob demanda pelo componente
      console.log(`Bloco de notas ${blocoId} criado: ${titulo || "Notas"}`);
    },
    calculo: async () => {
      // opcional
    },
  };
