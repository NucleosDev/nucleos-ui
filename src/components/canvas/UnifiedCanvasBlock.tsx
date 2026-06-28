// src/components/canvas/UnifiedCanvasBlock.tsx (corrigido)
"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  CanvasItem,
  TextBlockType,
  TextBlock,
  FunctionalBlockRef,
} from "./types";
import type { BlocoTipo } from "@/types/bloco";
import { FORMAT_COMMANDS, BLOCK_COMMANDS } from "./commands";
import {
  DragHandle,
  BlockHoverActions,
  MoreActionsMenu,
  TextFormatMenu,
  CanvasSlashMenu,
  CanvasDivider,
} from "@/components/canvas/";

interface UnifiedCanvasBlockProps {
  block: CanvasItem;
  isActive: boolean;
  onActivate: () => void;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onAddBelow: (id: string, type: TextBlockType) => void;
  onTypeChange: (id: string, type: TextBlockType) => void;
  onOpenFunctionalBlock?: (blockId: string) => void;
  onDuplicate?: () => void;
  nucleoId?: string;
  readOnly?: boolean;
  placeholder?: string;
}

const FUNCTIONAL_BLOCK_TYPES: BlocoTipo[] = [
  "tarefas",
  "habitos",
  "lista",
  "calendario",
  "timer",
  "colecoes",
  "notas",
];

export function UnifiedCanvasBlock({
  block,
  isActive,
  onActivate,
  onUpdate,
  onDelete,
  onAddBelow,
  onTypeChange,
  onOpenFunctionalBlock,
  onDuplicate,
  nucleoId,
  readOnly = false,
  placeholder = "Digite '/' para comandos...",
}: UnifiedCanvasBlockProps) {
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [slashPosition, setSlashPosition] = useState({ top: 0, left: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const isFunctionalBlock = block.type === "functional";
  const textBlock = isFunctionalBlock ? null : (block as TextBlock);
  const functionalBlock = isFunctionalBlock
    ? (block as FunctionalBlockRef)
    : null;

  // Atualizar conteúdo do DOM (apenas para blocos de texto)
  useEffect(() => {
    if (
      !isFunctionalBlock &&
      contentRef.current &&
      contentRef.current.textContent !== (block as TextBlock).content
    ) {
      contentRef.current.textContent = (block as TextBlock).content;
    }
  }, [block, isFunctionalBlock]);

  const handleInput = () => {
    if (isFunctionalBlock || readOnly) return;
    const content = contentRef.current?.textContent || "";

    // Detectar slash command
    if (content === "/" && content.length <= 10) {
      const rect = contentRef.current?.getBoundingClientRect();
      if (rect) {
        setSlashPosition({ top: rect.bottom + 4, left: rect.left });
        setShowSlashMenu(true);
      }
    } else {
      setShowSlashMenu(false);
    }

    onUpdate(block.id, content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isFunctionalBlock || readOnly) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onAddBelow(block.id, "paragraph");
    }

    if (e.key === "Backspace" && !contentRef.current?.textContent?.trim()) {
      e.preventDefault();
      onDelete(block.id);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", block.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const getPlaceholder = () => {
    if (isFunctionalBlock) return "";
    switch ((block as TextBlock).type) {
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

  // Bloco funcional
  if (isFunctionalBlock && functionalBlock) {
    // Usa blockId diretamente, sem tentar acessar content
    const blockId = functionalBlock.blockId;

    return (
      <div
        className="group relative my-2"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <BlockHoverActions
          onEdit={() => onOpenFunctionalBlock?.(blockId)}
          onDelete={() => onDelete(block.id)}
          onAddSubBloco={() => onAddBelow(block.id, "paragraph")}
          onDuplicate={onDuplicate}
          isVisible={isActive || isHovered}
          className="absolute -top-3 right-2 z-20"
        />
        <div
          className="rounded-lg border border-primary/20 bg-primary/5 p-4 cursor-pointer hover:shadow-md transition-all"
          onClick={() => onOpenFunctionalBlock?.(blockId)}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="text-lg">📦</span>
              Bloco:{" "}
              <span className="font-medium text-foreground">
                {String(functionalBlock.blockType)}
              </span>
            </p>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
          {functionalBlock.title && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {functionalBlock.title}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Divisor
  if (!isFunctionalBlock && (block as TextBlock).type === "divider") {
    return (
      <CanvasDivider
        onAddBelow={() => onAddBelow(block.id, "paragraph")}
        onDelete={() => onDelete(block.id)}
        onClick={onActivate}
      />
    );
  }

  // Se chegou aqui e não é bloco funcional, é TextBlock
  if (isFunctionalBlock || !textBlock) return null;

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
    <div
      className={cn(
        "group relative flex items-start gap-2 py-1.5 rounded-lg transition-colors",
        isActive && "bg-muted/30",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onActivate}
    >
      {/* Drag Handle */}
      {!readOnly && (
        <DragHandle
          onAddBelow={() => onAddBelow(block.id, "paragraph")}
          onDragStart={handleDragStart}
          isVisible={isActive || isHovered}
        />
      )}
      {/* Conteúdo editável */}
      <div className={cn("flex-1 min-w-0", typeClasses[textBlock.type])}>
        {textBlock.type === "bullet-list" ? (
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
              onFocus={() => setShowFormatMenu(true)}
              onBlur={() => setTimeout(() => setShowFormatMenu(false), 200)}
            />
          </div>
        ) : textBlock.type === "todo" ? (
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
              onFocus={() => setShowFormatMenu(true)}
              onBlur={() => setTimeout(() => setShowFormatMenu(false), 200)}
            />
          </div>
        ) : textBlock.type === "numbered-list" ? (
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
              onFocus={() => setShowFormatMenu(true)}
              onBlur={() => setTimeout(() => setShowFormatMenu(false), 200)}
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
            onFocus={() => setShowFormatMenu(true)}
            onBlur={() => setTimeout(() => setShowFormatMenu(false), 200)}
          />
        )}
      </div>
      {/* Menu de ações (3 pontinhos) */}
      {!readOnly && (
        <MoreActionsMenu
          onEdit={onActivate}
          onDelete={() => onDelete(block.id)}
          onDuplicate={onDuplicate}
          onAddBelow={() => onAddBelow(block.id, "paragraph")}
          className={cn(
            "absolute -top-8 right-0 transition-opacity",
            isActive || isHovered ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      {/* Menu de formatação flutuante */}
      <TextFormatMenu
        onTypeChange={(type) => onTypeChange(block.id, type as TextBlockType)}
        onDelete={() => onDelete(block.id)}
        formatCommands={FORMAT_COMMANDS}
        isVisible={showFormatMenu && isActive && !readOnly}
        className="absolute -top-10 left-0 z-50"
      />
      {/* Slash Menu - CORRIGIDO */}

      <CanvasSlashMenu
        isOpen={showSlashMenu}
        position={slashPosition}
        commands={FORMAT_COMMANDS} // ← mudou de formatCommands para commands
        blockCommands={BLOCK_COMMANDS}
        onSelect={(type) => {
          onTypeChange(block.id, type as TextBlockType);
          setShowSlashMenu(false);
        }}
        onSelectBlock={(tipo: string) => {
          onOpenFunctionalBlock?.(tipo);
          setShowSlashMenu(false);
        }}
        onClose={() => setShowSlashMenu(false)}
      />
    </div>
  );
}
