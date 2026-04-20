import {
  CheckSquare,
  ListChecks,
  Calendar,
  Calculator,
  Table2,
  StickyNote,
  Clock,
  Repeat,
  type LucideIcon,
} from "lucide-react";
import type { TipoBloco } from "@/types/index";

export const TIPO_BLOCO_META: Record<
  TipoBloco,
  { rotulo: string; descricao: string; icon: LucideIcon }
> = {
  tarefas: {
    rotulo: "Tarefas",
    descricao: "Lista de afazeres com prioridades e datas",
    icon: CheckSquare,
  },
  habitos: {
    rotulo: "Hábitos",
    descricao: "Acompanhamento de rotinas diárias/semanais",
    icon: Repeat,
  },
  notas: {
    rotulo: "Notas",
    descricao: "Anotações rápidas e documentos",
    icon: StickyNote,
  },
  lista: {
    rotulo: "Lista",
    descricao: "Lista de compras, tarefas simples ou itens",
    icon: ListChecks,
  },
  calendario: {
    rotulo: "Calendário",
    descricao: "Eventos e compromissos",
    icon: Calendar,
  },
  calculo: {
    rotulo: "Cálculo",
    descricao: "Planilhas e operações matemáticas",
    icon: Calculator,
  },
  colecoes: {
    rotulo: "Coleções",
    descricao: "Banco de dados personalizado com campos",
    icon: Table2,
  },
  timer: {
    rotulo: "Timer",
    descricao: "Timers",
    icon: Clock,
  },
};

export const TIPOS_BLOCO = Object.keys(TIPO_BLOCO_META) as TipoBloco[];
