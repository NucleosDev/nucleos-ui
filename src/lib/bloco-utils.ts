// lib/bloco-utils.ts
import {
  CheckSquare,
  ListChecks,
  Calendar,
  FileText,
  Timer,
  Layers,
  BookOpen,
  Calculator,
  type LucideIcon,
} from "lucide-react";
import type { BlocoTipo } from "@/types/bloco";
import { listasService } from "@/services/index.service";
import { tarefasService } from "@/services/tarefas.service";
import { colecoesService } from "@/services/colecoes.service";
import { habitosService } from "@/services/habitos.service";

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
      // Bloco de notas - coleção será criada sob demanda
      console.log(`Bloco de notas ${blocoId} criado: ${titulo || "Notas"}`);
    },
    calculo: async () => {
      // opcional
    },
  };

export const TIPO_BLOCO_META: Record<
  BlocoTipo,
  { rotulo: string; descricao: string; icon: LucideIcon }
> = {
  tarefas: {
    rotulo: "Tarefas",
    descricao: "Gerencie suas tarefas diárias com prioridades e prazos",
    icon: CheckSquare,
  },
  lista: {
    rotulo: "Listas",
    descricao: "Crie listas de compras, tarefas e organize itens",
    icon: ListChecks,
  },
  calendario: {
    rotulo: "Calendário",
    descricao: "Organize eventos e compromissos com data e hora",
    icon: Calendar,
  },
  timer: {
    rotulo: "Timer",
    descricao: "Cronômetro e temporizador para foco e produtividade",
    icon: Timer,
  },
  timers: {
    rotulo: "Timers",
    descricao: "Cronômetro e temporizador para foco e produtividade",
    icon: Timer,
  },
  colecoes: {
    rotulo: "Coleções",
    descricao: "Crie bancos de dados personalizados com campos flexíveis",
    icon: Layers,
  },
  habitos: {
    rotulo: "Hábitos",
    descricao: "Acompanhe e crie hábitos saudáveis com streaks",
    icon: CheckSquare,
  },
  habito: {
    rotulo: "Hábitos",
    descricao: "Acompanhe e crie hábitos saudáveis com streaks",
    icon: CheckSquare,
  },
  notas: {
    rotulo: "Notas",
    descricao: "Anotações rápidas e documentos com formatação",
    icon: BookOpen,
  },
  calculo: {
    rotulo: "Cálculos",
    descricao: "Fórmulas e operações matemáticas com referências",
    icon: Calculator,
  },
};

export const TIPOS_BLOCO = Object.keys(TIPO_BLOCO_META) as BlocoTipo[];
