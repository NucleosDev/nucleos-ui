// src/components/canvas/CanvasToolbar.tsx
"use client";

import {
  Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Heading1, Heading2, Heading3,
  Quote, Code2, Minus, CheckSquare, Type, ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface CanvasToolbarProps {
  onFormat?: (format: string) => void;
  onAlign?: (align: "left" | "center" | "right") => void;
  onInsertBlock?: (type: string) => void;
  className?: string;
}

const INSERT_COMMANDS = [
  { type: "h1",            label: "Título 1",      icon: Heading1    },
  { type: "h2",            label: "Título 2",      icon: Heading2    },
  { type: "h3",            label: "Título 3",      icon: Heading3    },
  { type: "paragraph",     label: "Parágrafo",     icon: Type        },
  { type: "quote",         label: "Citação",       icon: Quote       },
  { type: "code",          label: "Código",        icon: Code2       },
  { type: "divider",       label: "Divisor",       icon: Minus       },
  { type: "bullet-list",   label: "Lista",         icon: List        },
  { type: "numbered-list", label: "Lista numerada",icon: ListOrdered },
  { type: "todo",          label: "Checklist",     icon: CheckSquare },
];

const toolbarBtn =
  "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors";

export function CanvasToolbar({
  onFormat,
  onAlign,
  onInsertBlock,
  className,
}: CanvasToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 p-1 bg-popover border border-border/50 rounded-xl shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      <button className={toolbarBtn} onClick={() => onFormat?.("bold")}      title="Negrito">      <Bold      className="h-3.5 w-3.5" /></button>
      <button className={toolbarBtn} onClick={() => onFormat?.("italic")}    title="Itálico">     <Italic    className="h-3.5 w-3.5" /></button>
      <button className={toolbarBtn} onClick={() => onFormat?.("underline")} title="Sublinhado">  <Underline className="h-3.5 w-3.5" /></button>

      <div className="mx-1 h-5 w-px bg-border/60" />

      <button className={toolbarBtn} onClick={() => onAlign?.("left")}   title="Esquerda">  <AlignLeft   className="h-3.5 w-3.5" /></button>
      <button className={toolbarBtn} onClick={() => onAlign?.("center")} title="Centro">    <AlignCenter className="h-3.5 w-3.5" /></button>
      <button className={toolbarBtn} onClick={() => onAlign?.("right")}  title="Direita">   <AlignRight  className="h-3.5 w-3.5" /></button>

      <div className="mx-1 h-5 w-px bg-border/60" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <List className="h-3.5 w-3.5" />
            <span>Inserir</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52 text-sm">
          {INSERT_COMMANDS.map((cmd) => (
            <DropdownMenuItem key={cmd.type} onClick={() => onInsertBlock?.(cmd.type)} className="gap-2">
              <cmd.icon className="h-3.5 w-3.5" />
              {cmd.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
