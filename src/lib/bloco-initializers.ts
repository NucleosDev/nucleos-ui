// src/lib/bloco-initializers.ts
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

    tarefas: async (blocoId, titulo) => {
      console.log(`Bloco de tarefas criado: ${blocoId}`);
    },

    colecoes: async (blocoId, titulo) => {
      const colecao = await colecoesService.createColecao(
        blocoId,
        titulo || "Minha Tabela",
      );
      await colecoesService.createCampo(colecao.id, "Nome", "texto");
    },

    calendario: async (blocoId, titulo) => {
      console.log(`Bloco de calendário criado: ${blocoId}`);
    },

    // ✅ CORRIGIDO: Payload compatível com CreateHabitoDto
    habitos: async (blocoId, titulo) => {
      await habitosService.criar({
        blocoId,
        nome: titulo || "Beber água",
        frequencia: "diaria",
        metaVezes: 8,
      });
    },

    // ✅ CORRIGIDO: Singular também funciona
    habito: async (blocoId, titulo) => {
      await habitosService.criar({
        blocoId,
        nome: titulo || "Novo Hábito",
        frequencia: "diaria",
        metaVezes: 1,
      });
    },

    timer: async (blocoId, titulo) => {
      console.log(`Bloco de timer criado: ${blocoId}`);
    },

    timers: async (blocoId, titulo) => {
      console.log(`Bloco de timers criado: ${blocoId}`);
    },

    notas: async (blocoId, titulo) => {
      console.log(`Bloco de notas criado: ${blocoId} - ${titulo || "Notas"}`);
    },

    calculo: async (blocoId, titulo) => {
      console.log(`Bloco de cálculo criado: ${blocoId}`);
    },

    canvas: async (blocoId, titulo) => {
      console.log(`Canvas criado: ${blocoId}`);
    },
  };
