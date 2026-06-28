import {
  Layers,
  CheckSquare,
  Activity,
  ListTodo,
  CalendarDays,
  Timer,
  BookOpen,
  Calculator,
  GripVertical,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const blocoIconMap: Record<string, LucideIcon> = {
  tarefas: CheckSquare,
  habitos: Activity,
  habito: Activity,
  timer: Timer,
  timers: Timer,
  notas: BookOpen,
  lista: ListTodo,
  calendario: CalendarDays,
  calculo: Calculator,
  colecoes: Layers,
};

export function getBlocoIcon(tipo: string): LucideIcon {
  const icon = blocoIconMap[tipo];
  if (icon) return icon;
  return GripVertical;
}

export function getBlocoTitle(tipo: string): string {
  const titles: Record<string, string> = {
    tarefas: "Tarefas",
    habitos: "Hábitos",
    habito: "Hábito",
    timer: "Timer",
    timers: "Timers",
    notas: "Notas",
    lista: "Lista",
    calendario: "Calendário",
    calculo: "Calculadora",
    colecoes: "Coleções",
  };
  return titles[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1);
}
