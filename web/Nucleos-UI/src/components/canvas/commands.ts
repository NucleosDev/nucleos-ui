import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code2,
  Minus,
  CalendarDays,
  Timer,
  Activity,
  Table,
  FileText,
} from "lucide-react";

export const FORMAT_COMMANDS = [
  { type: "h1", label: "Título 1", icon: Heading1, shortcut: "#" },
  { type: "h2", label: "Título 2", icon: Heading2, shortcut: "##" },
  { type: "h3", label: "Título 3", icon: Heading3, shortcut: "###" },
  { type: "paragraph", label: "Parágrafo", icon: Type, shortcut: "P" },
  { type: "quote", label: "Citação", icon: Quote, shortcut: '"' },
  { type: "code", label: "Código", icon: Code2, shortcut: "```" },
  { type: "divider", label: "Divisor", icon: Minus, shortcut: "---" },
  { type: "bullet-list", label: "Lista", icon: List, shortcut: "-" },
  {
    type: "numbered-list",
    label: "Lista numerada",
    icon: ListOrdered,
    shortcut: "1.",
  },
  { type: "todo", label: "Checklist", icon: CheckSquare, shortcut: "[]" },
];

export const BLOCK_COMMANDS = [
  {
    type: "tarefas",
    label: "Tarefas",
    icon: CheckSquare,
    desc: "Gerenciador de tarefas",
  },
  {
    type: "calendario",
    label: "Calendário",
    icon: CalendarDays,
    desc: "Eventos e datas",
  },
  { type: "lista", label: "Lista", icon: Table, desc: "Lista de itens" },
  { type: "timer", label: "Timer", icon: Timer, desc: "Cronômetro/Pomodoro" },
  {
    type: "habitos",
    label: "Hábitos",
    icon: Activity,
    desc: "Tracker de hábitos",
  },
  {
    type: "colecoes",
    label: "Coleções",
    icon: Table,
    desc: "Dados estruturados",
  },
  { type: "notas", label: "Notas", icon: FileText, desc: "Bloco de notas" },
];
