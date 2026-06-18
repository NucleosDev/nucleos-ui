// src/components/document/TextBlockRenderer.tsx
"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocumentBlock, DocumentBlockType } from "./document-types";

interface TextBlockRendererProps {
  block: DocumentBlock;
  isActive: boolean;
  onActivate: () => void;
  onUpdate: (id: string, updates: Partial<DocumentBlock>) => void;
  onDelete: (id: string) => void;
  onAddBelow: (tipo: DocumentBlockType) => void;
  onTypeChange: (id: string, tipo: DocumentBlockType) => void;
  onSlashMenu?: (pos: { top: number; left: number }) => void;
  readOnly?: boolean;
  listIndex?: number;
  sectionCollapsed?: boolean;
  sectionCollapsedCount?: number;
  onToggleSection?: () => void;
}

const TYPE_CLASSES: Record<string, string> = {
  h1: "text-[2rem] font-bold leading-tight tracking-tight",
  h2: "text-[1.5rem] font-semibold leading-tight",
  h3: "text-[1.25rem] font-medium leading-tight",
  paragraph: "text-base leading-7",
  quote:
    "border-l-[3px] border-primary/50 pl-4 italic text-muted-foreground leading-7",
  code: "font-mono text-sm bg-muted/60 rounded-lg px-3 py-2 block",
  "bullet-list": "text-base leading-7",
  "numbered-list": "text-base leading-7",
  todo: "text-base leading-7",
};

const PLACEHOLDER_MAP: Record<string, string> = {
  h1: "Título 1",
  h2: "Título 2",
  h3: "Título 3",
  paragraph: "Digite '/' para comandos...",
  quote: "Citação...",
  code: "Código...",
  "bullet-list": "Item da lista",
  "numbered-list": "Item numerado",
  todo: "Tarefa...",
};

// Markdown shortcuts que convertem o tipo do bloco ao digitar
function detectMarkdownShortcut(text: string): DocumentBlockType | null {
  const t = text.trim();
  if (t === "#") return "h1";
  if (t === "##") return "h2";
  if (t === "###") return "h3";
  if (t === ">" || t === '"') return "quote";
  if (t === "```") return "code";
  if (t === "---") return "divider";
  if (t === "-" || t === "*") return "bullet-list";
  if (/^\d+\.$/.test(t)) return "numbered-list";
  if (t === "[]" || t === "[ ]") return "todo";
  return null;
}

// innerText normalizado — remove trailing \n que browsers adicionam
function readInnerText(el: HTMLElement): string {
  const raw = el.innerText ?? "";
  return raw.endsWith("\n") ? raw.slice(0, -1) : raw;
}

export function TextBlockRenderer({
  block,
  isActive,
  onActivate,
  onUpdate,
  onDelete,
  onAddBelow,
  onTypeChange,
  onSlashMenu,
  readOnly = false,
  listIndex = 1,
  sectionCollapsed = false,
  sectionCollapsedCount = 0,
  onToggleSection,
}: TextBlockRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [localCompleted, setLocalCompleted] = useState(
    block.completed ?? false,
  );

  // Sincroniza conteúdo apenas quando o bloco muda de ID (sem matar cursor)
  useEffect(() => {
    if (!contentRef.current) return;
    const current = readInnerText(contentRef.current);
    const target = block.conteudo ?? "";
    if (current !== target) {
      contentRef.current.innerText = target;
    }
  }, [block.id]);

  // Sincroniza completed com o estado do bloco (evita desync após refetch)
  useEffect(() => {
    setLocalCompleted(block.completed ?? false);
  }, [block.completed]);

  useEffect(() => {
    if (
      isActive &&
      contentRef.current &&
      document.activeElement !== contentRef.current
    ) {
      contentRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(contentRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isActive]);

  const handleInput = useCallback(() => {
    if (!contentRef.current) return;
    const text = readInnerText(contentRef.current);

    if (!readOnly) {
      const shortcut = detectMarkdownShortcut(text);
      if (shortcut) {
        onTypeChange(block.id, shortcut);
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.innerText = "";
            contentRef.current.focus();
          }
        }, 10);
        return;
      }

      if (text === "/") {
        const rect = contentRef.current?.getBoundingClientRect();
        if (rect && onSlashMenu) {
          onSlashMenu({ top: rect.bottom + 4, left: rect.left });
        }
        return;
      }
    }

    onUpdate(block.id, { conteudo: text });
  }, [block.id, onUpdate, onTypeChange, onSlashMenu, readOnly]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (readOnly) return;

      if (e.key === "Enter") {
        if (e.shiftKey) {
          // Shift+Enter: quebra de linha dentro do bloco — browser lida nativamente
          // handleInput dispara depois e persiste o \n via innerText
          return;
        }
        e.preventDefault();
        onAddBelow("paragraph");
      }

      if (e.key === "Backspace") {
        const text = readInnerText(contentRef.current!);
        if (!text.trim()) {
          e.preventDefault();
          onDelete(block.id);
        }
      }

      if (e.key === "Escape") {
        contentRef.current?.blur();
      }
    },
    [readOnly, block.id, onAddBelow, onDelete],
  );

  // ── Divider ──────────────────────────────────────────────────────────────
  if (block.tipo === "divider") {
    return (
      <div className="py-3 px-1">
        <div className="border-t border-border/60" />
      </div>
    );
  }

  // ── Todo ─────────────────────────────────────────────────────────────────
  if (block.tipo === "todo") {
    return (
      <div className="flex items-start gap-2.5 py-0.5">
        <button
          className={cn(
            "mt-[3px] h-4 w-4 flex-shrink-0 rounded border-2 transition-colors duration-200",
            localCompleted
              ? "bg-primary border-primary"
              : "border-muted-foreground/40 hover:border-primary/60",
          )}
          onClick={() => {
            const next = !localCompleted;
            setLocalCompleted(next);
            onUpdate(block.id, { completed: next });
          }}
        >
          {localCompleted && (
            <svg viewBox="0 0 10 8" fill="none" className="text-">
              <path
                d="M1 4l3 3 5-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <div
          id={`block-${block.id}`}
          ref={contentRef}
          contentEditable={!readOnly}
          suppressContentEditableWarning
          className={cn(
            "outline-none flex-1 min-w-0 space-pre-wrap",
            "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40",
            TYPE_CLASSES.todo,
            localCompleted && "line-through text-muted-foreground",
          )}
          data-placeholder={PLACEHOLDER_MAP.todo}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onClick={onActivate}
        />
      </div>
    );
  }

  // ── Bullet list ──────────────────────────────────────────────────────────
  if (block.tipo === "bullet-list") {
    return (
      <div className="flex items-start gap-2 py-0.5">
        <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground/70" />
        <div
          id={`block-${block.id}`}
          ref={contentRef}
          contentEditable={!readOnly}
          suppressContentEditableWarning
          className={cn(
            "outline-none flex-1 min-w-0 space-pre-wrap",
            "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40",
            TYPE_CLASSES["bullet-list"],
          )}
          data-placeholder={PLACEHOLDER_MAP["bullet-list"]}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onClick={onActivate}
        />
      </div>
    );
  }

  // ── Numbered list ────────────────────────────────────────────────────────
  if (block.tipo === "numbered-list") {
    return (
      <div className="flex items-start gap-2 py-0.5">
        <span className="mt-[2px] min-w-[1.5rem] text-right text-sm font-medium text-foreground/70 flex-shrink-0">
          {listIndex}.
        </span>
        <div
          id={`block-${block.id}`}
          ref={contentRef}
          contentEditable={!readOnly}
          suppressContentEditableWarning
          className={cn(
            "outline-none flex-1 min-w-0 space-pre-wrap",
            "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40",
            TYPE_CLASSES["numbered-list"],
          )}
          data-placeholder={PLACEHOLDER_MAP["numbered-list"]}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onClick={onActivate}
        />
      </div>
    );
  }

  // ── Quote ────────────────────────────────────────────────────────────────
  if (block.tipo === "quote") {
    return (
      <div className={cn(TYPE_CLASSES.quote, "py-1 my-1")}>
        <div
          id={`block-${block.id}`}
          ref={contentRef}
          contentEditable={!readOnly}
          suppressContentEditableWarning
          className="outline-none space-pre-wrap empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40"
          data-placeholder={PLACEHOLDER_MAP.quote}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onClick={onActivate}
        />
      </div>
    );
  }

  // ── Code ─────────────────────────────────────────────────────────────────
  if (block.tipo === "code") {
    return (
      <div className="my-1 rounded-lg bg-muted/60 border border-border/40 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/40 bg-muted/40">
          <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
            código
          </span>
        </div>
        <div
          id={`block-${block.id}`}
          ref={contentRef}
          contentEditable={!readOnly}
          suppressContentEditableWarning
          className="outline-none font-mono text-sm px-3 py-2 leading-relaxed space-pre-wrap empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40"
          data-placeholder="// Seu código aqui..."
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onClick={onActivate}
        />
      </div>
    );
  }

  // ── h1 / h2 / h3 — with collapsible section toggle ──────────────────────
  if (block.tipo === "h1" || block.tipo === "h2" || block.tipo === "h3") {
    return (
      <div className="group/heading flex items-center gap-1 py-0.5">
        {onToggleSection && (
          <button
            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onClick={(e) => { e.stopPropagation(); onToggleSection(); }}
            className={cn(
              "shrink-0 flex h-5 w-5 items-center justify-center rounded transition-all duration-150",
              "text-muted-foreground/25 hover:text-muted-foreground/60 hover:bg-muted/40",
              "opacity-0 group-hover/heading:opacity-100",
              sectionCollapsed && "opacity-100 text-muted-foreground/40",
            )}
            title={sectionCollapsed ? "Expandir seção" : "Recolher seção"}
          >
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200",
                sectionCollapsed && "-rotate-90",
              )}
            />
          </button>
        )}
        <div
          id={`block-${block.id}`}
          ref={contentRef}
          contentEditable={!readOnly}
          suppressContentEditableWarning
          className={cn(
            "outline-none flex-1 min-w-0 space-pre-wrap",
            "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40",
            TYPE_CLASSES[block.tipo],
          )}
          data-placeholder={PLACEHOLDER_MAP[block.tipo]}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onClick={onActivate}
        />
        {sectionCollapsed && sectionCollapsedCount > 0 && (
          <span className="shrink-0 text-[11px] font-normal text-muted-foreground/30 ml-1.5 tabular-nums">
            {sectionCollapsedCount} oculto{sectionCollapsedCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    );
  }

  // ── paragraph ─────────────────────────────────────────────────────────────
  return (
    <div
      id={`block-${block.id}`}
      ref={contentRef}
      contentEditable={!readOnly}
      suppressContentEditableWarning
      className={cn(
        "outline-none py-0.5 space-pre-wrap",
        "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40",
        TYPE_CLASSES[block.tipo] ?? TYPE_CLASSES.paragraph,
      )}
      data-placeholder={
        PLACEHOLDER_MAP[block.tipo] ?? PLACEHOLDER_MAP.paragraph
      }
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onClick={onActivate}
    />
  );
}
