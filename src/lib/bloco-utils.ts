// lib/bloco-utils.ts
import {
  CheckSquare,
  ListChecks,
  Calendar,
  Timer,
  Layers,
  BookOpen,
  Calculator,
  type LucideIcon,
} from "lucide-react";
import type { BlocoTipo } from "@/types/bloco"; // 👈 importa o tipo oficial

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
