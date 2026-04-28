// src/components/canvas/TextBlockEditor.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import type { TextBlock, TextBlockType } from "./types";

interface TextBlockEditorProps {
  block: TextBlock;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  onAddBelow: () => void;
  readOnly?: boolean;
  placeholder?: string;
}

const FORMAT_COMMANDS = [
  { type: "h1" as TextBlockType, label: "Título 1", icon: Heading1 },
  { type: "h2" as TextBlockType, label: "Título 2", icon: Heading2 },
  { type: "h3" as TextBlockType, label: "Título 3", icon: Heading3 },
  { type: "paragraph" as TextBlockType, label: "Parágrafo", icon: Type },
  { type: "quote" as TextBlockType, label: "Citação", icon: Quote },
  { type: "code" as TextBlockType, label: "Código", icon: Code2 },
  { type: "divider" as TextBlockType, label: "Divisor", icon: Minus },
  { type: "bullet-list" as TextBlockType, label: "Lista", icon: List },
  {
    type: "numbered-list" as TextBlockType,
    label: "Lista numerada",
    icon: ListOrdered,
  },
  { type: "todo" as TextBlockType, label: "Checklist", icon: CheckSquare },
];

export function TextBlockEditor({
  block,
  onUpdate,
  onDelete,
  onAddBelow,
  readOnly = false,
  placeholder = "Digite '/' para comandos...",
}: TextBlockEditorProps) {
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      contentRef.current &&
      contentRef.current.textContent !== block.content
    ) {
      contentRef.current.textContent = block.content;
    }
  }, [block.content]);

  const handleInput = () => {
    const content = contentRef.current?.textContent || "";
    if (content.startsWith("/") && content.length <= 10 && !readOnly) {
      setShowSlashMenu(true);
      const rect = contentRef.current?.getBoundingClientRect();
      if (rect) setSlashPosition({ top: rect.bottom + 4, left: rect.left });
    } else {
      setShowSlashMenu(false);
    }
    onUpdate(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (readOnly) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onAddBelow();
    }
    if (e.key === "Backspace" && !contentRef.current?.textContent?.trim()) {
      e.preventDefault();
      onDelete();
    }
  };

  const handleTypeChange = (type: TextBlockType) => {
    onUpdate("");
    setShowSlashMenu(false);
    setTimeout(() => contentRef.current?.focus(), 50);
  };

  const getPlaceholder = () => {
    switch (block.type) {
      case "h1":
        return "Título 1...";
      case "h2":
        return "Título 2...";
      case "h3":
        return "Título 3...";
      case "quote":
        return "Citação...";
      case "code":
        return "Código...";
      case "bullet-list":
        return "Item da lista...";
      case "numbered-list":
        return "Item numerado...";
      case "todo":
        return "Tarefa...";
      default:
        return placeholder;
    }
  };

  if (block.type === "divider") {
    return (
      <div className="py-2">
        <div className="border-t border-border" />
      </div>
    );
  }

  const typeClasses: Record<TextBlockType, string> = {
    h1: "text-4xl font-bold leading-tight",
    h2: "text-3xl font-semibold leading-tight",
    h3: "text-2xl font-medium leading-tight",
    paragraph: "text-base leading-relaxed",
    quote: "border-l-4 border-primary pl-4 italic text-muted-foreground",
    code: "font-mono text-sm bg-muted/50 rounded-lg px-3 py-1.5",
    divider: "",
    "bullet-list": "",
    "numbered-list": "",
    todo: "",
  };

  return (
    <div className="relative">
      <div className={cn("flex-1 min-w-0", typeClasses[block.type])}>
        {block.type === "bullet-list" ? (
          <div className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <div
              ref={contentRef}
              contentEditable={!readOnly}
              suppressContentEditableWarning
              className="outline-none flex-1 min-w-0"
              data-placeholder={getPlaceholder()}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
            />
          </div>
        ) : block.type === "todo" ? (
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 mt-1 rounded border-2 border-muted-foreground/30" />
            <div
              ref={contentRef}
              contentEditable={!readOnly}
              suppressContentEditableWarning
              className="outline-none flex-1 min-w-0"
              data-placeholder={getPlaceholder()}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
            />
          </div>
        ) : block.type === "numbered-list" ? (
          <div className="flex items-start gap-2">
            <span className="text-primary font-medium min-w-[24px]">1.</span>
            <div
              ref={contentRef}
              contentEditable={!readOnly}
              suppressContentEditableWarning
              className="outline-none flex-1 min-w-0"
              data-placeholder={getPlaceholder()}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
            />
          </div>
        ) : (
          <div
            ref={contentRef}
            contentEditable={!readOnly}
            suppressContentEditableWarning
            className="outline-none"
            data-placeholder={getPlaceholder()}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          />
        )}
      </div>

      <AnimatePresence>
        {showSlashMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50 w-72 bg-popover border rounded-xl shadow-xl overflow-hidden"
            style={{ top: slashPosition.top, left: slashPosition.left }}
          >
            <div className="p-2 max-h-96 overflow-y-auto">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1 uppercase">
                Blocos de texto
              </p>
              {FORMAT_COMMANDS.map((cmd) => (
                <button
                  key={cmd.type}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent text-left"
                  onClick={() => handleTypeChange(cmd.type)}
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <cmd.icon className="h-4 w-4" />
                  </div>a
                  <div>
                    <p className="text-sm font-medium">{cmd.label}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
