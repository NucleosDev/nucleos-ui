"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { Extension } from "@tiptap/core";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Highlighter,
  Code,
} from "lucide-react";
import type { DocumentBlockType } from "./document-types";

// ── Tipos ────────────────────────────────────────────────────────────────────

interface TiptapBlockEditorProps {
  blockId: string;
  tipo: DocumentBlockType;
  content: string;
  isActive: boolean;
  readOnly?: boolean;
  placeholder?: string;
  onActivate: () => void;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  onAddBelow: (tipo: DocumentBlockType) => void;
  onTypeChange: (tipo: DocumentBlockType) => void;
  onSlashMenu: (pos: { top: number; left: number }) => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
}

// ── Extensão de atalhos de navegação entre blocos ────────────────────────────

function makeNavigationExtension(
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onAddBelow?: (tipo: DocumentBlockType) => void,
  onDelete?: () => void,
) {
  return Extension.create({
    name: "blockNavigation",
    addKeyboardShortcuts() {
      return {
        ArrowUp: ({ editor }) => {
          const { $anchor } = editor.state.selection;
          const isAtStart = $anchor.parentOffset === 0;
          if (isAtStart && onArrowUp) {
            onArrowUp();
            return true;
          }
          return false;
        },
        ArrowDown: ({ editor }) => {
          const { $anchor } = editor.state.selection;
          const isAtEnd = $anchor.parentOffset === $anchor.parent.content.size;
          if (isAtEnd && onArrowDown) {
            onArrowDown();
            return true;
          }
          return false;
        },
        Enter: () => {
          if (onAddBelow) {
            onAddBelow("paragraph");
            return true;
          }
          return false;
        },
        Backspace: ({ editor }) => {
          if (editor.isEmpty && onDelete) {
            onDelete();
            return true;
          }
          return false;
        },
      };
    },
  });
}

// ── Detecção de markdown shortcuts ───────────────────────────────────────────

const MARKDOWN_SHORTCUTS: Record<string, DocumentBlockType> = {
  "#": "h1",
  "##": "h2",
  "###": "h3",
  ">": "quote",
  "```": "code",
  "---": "divider",
  "-": "bullet-list",
  "*": "bullet-list",
  "[]": "todo",
  "[ ]": "todo",
};

function detectMarkdown(text: string): DocumentBlockType | null {
  const t = text.trimEnd();
  if (MARKDOWN_SHORTCUTS[t]) return MARKDOWN_SHORTCUTS[t];
  if (/^\d+\.$/.test(t)) return "numbered-list";
  return null;
}

// ── Placeholder por tipo ──────────────────────────────────────────────────────

const PLACEHOLDERS: Partial<Record<DocumentBlockType, string>> = {
  paragraph: "Digite '/' para comandos ou comece a escrever…",
  h1: "Título 1",
  h2: "Título 2",
  h3: "Título 3",
  quote: "Citação…",
  code: "// código",
  "bullet-list": "Item da lista",
  "numbered-list": "Item numerado",
  todo: "Tarefa…",
};

// ── Estilos por tipo — ritmo e hierarquia visual ──────────────────────────────

const TYPE_PROSE: Partial<Record<DocumentBlockType, string>> = {
  h1: "[&_.ProseMirror_h1]:text-[1.875rem] [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:leading-[1.2] [&_.ProseMirror_h1]:tracking-tight [&_.ProseMirror_h1]:text-foreground",
  h2: "[&_.ProseMirror_h2]:text-[1.375rem] [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:leading-[1.3] [&_.ProseMirror_h2]:text-foreground",
  h3: "[&_.ProseMirror_h3]:text-[1.125rem] [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:leading-[1.4] [&_.ProseMirror_h3]:text-foreground",
  paragraph: "[&_.ProseMirror_p]:text-[15px] [&_.ProseMirror_p]:leading-[1.75] [&_.ProseMirror_p]:text-foreground/90",
  quote: "[&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-foreground/20 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-foreground/60 [&_.ProseMirror_blockquote]:leading-[1.75] [&_.ProseMirror_blockquote]:text-[15px]",
  code: "[&_.ProseMirror_pre]:bg-muted/50 [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:px-4 [&_.ProseMirror_pre]:py-3 [&_.ProseMirror_pre]:text-[13px] [&_.ProseMirror_pre]:font-mono [&_.ProseMirror_pre]:leading-relaxed [&_.ProseMirror_pre]:border [&_.ProseMirror_pre]:border-border/30 [&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:p-0",
  "bullet-list": "[&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_li]:text-[15px] [&_.ProseMirror_li]:leading-[1.75]",
  "numbered-list": "[&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_li]:text-[15px] [&_.ProseMirror_li]:leading-[1.75]",
  todo: "[&_.ProseMirror_ul[data-type='taskList']]:pl-0 [&_.ProseMirror_ul[data-type='taskList']]:list-none [&_.ProseMirror_li[data-type='taskItem']]:flex [&_.ProseMirror_li[data-type='taskItem']]:gap-2 [&_.ProseMirror_li[data-type='taskItem']]:items-start",
};

// ── Componente principal ──────────────────────────────────────────────────────

export function TiptapBlockEditor({
  blockId,
  tipo,
  content,
  isActive,
  readOnly = false,
  onActivate,
  onUpdate,
  onDelete,
  onAddBelow,
  onTypeChange,
  onSlashMenu,
  onArrowUp,
  onArrowDown,
}: TiptapBlockEditorProps) {
  const suppressNextUpdate = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // StarterKit inclui history (undo/redo), bold, italic, code, blockquote, etc.
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      Link.configure({ openOnClick: false }),
      TaskList,
      TaskItem.configure({ nested: false }),
      Typography,
      Placeholder.configure({
        placeholder: PLACEHOLDERS[tipo] ?? PLACEHOLDERS.paragraph,
        emptyNodeClass: "is-empty",
      }),
      makeNavigationExtension(onArrowUp, onArrowDown, onAddBelow, onDelete),
    ],
    content: contentToTiptap(tipo, content),
    editable: !readOnly,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (suppressNextUpdate.current) {
        suppressNextUpdate.current = false;
        return;
      }
      const text = editor.getText();

      // Detecção de slash command
      if (text === "/" && onSlashMenu) {
        const domPos = editor.view.coordsAtPos(editor.state.selection.anchor);
        onSlashMenu({ top: domPos.bottom + 4, left: domPos.left });
        return;
      }

      // Detecção de markdown shortcut
      const md = detectMarkdown(text);
      if (md) {
        suppressNextUpdate.current = true;
        onTypeChange(md);
        editor.commands.clearContent();
        return;
      }

      onUpdate(editor.getHTML());
    },
    onFocus: onActivate,
  });

  // Sincroniza conteúdo quando o bloco muda (ex: undo externo, refetch)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const target = contentToTiptap(tipo, content);
    if (current !== target && !editor.isFocused) {
      suppressNextUpdate.current = true;
      editor.commands.setContent(target);
    }
  }, [content, tipo]); // eslint-disable-line react-hooks/exhaustive-deps

  // Foca o bloco quando ativado externamente
  useEffect(() => {
    if (!editor || !isActive || editor.isFocused) return;
    editor.commands.focus("end");
  }, [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Divider não precisa de editor
  if (tipo === "divider") {
    return (
      <div className="py-3 px-1 group">
        <div className="border-t border-border/60 transition-colors group-hover:border-border" />
      </div>
    );
  }

  return (
    <div className={cn("relative", TYPE_PROSE[tipo])}>
      {/* Floating formatting toolbar — aparece na seleção de texto */}
      {editor && !readOnly && (
        <BubbleMenu
          editor={editor}
          className="flex items-center gap-0.5 px-1.5 py-1 bg-popover border border-border rounded-lg shadow-xl"
        >
          <FormatButton
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Negrito (⌘B)"
          >
            <Bold className="h-3.5 w-3.5" />
          </FormatButton>
          <FormatButton
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Itálico (⌘I)"
          >
            <Italic className="h-3.5 w-3.5" />
          </FormatButton>
          <FormatButton
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Sublinhado (⌘U)"
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </FormatButton>
          <FormatButton
            active={editor.isActive("highlight")}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            title="Destacar"
          >
            <Highlighter className="h-3.5 w-3.5" />
          </FormatButton>
          <div className="w-px h-4 bg-border mx-0.5" />
          <FormatButton
            active={editor.isActive("code")}
            onClick={() => editor.chain().focus().toggleCode().run()}
            title="Código inline"
          >
            <Code className="h-3.5 w-3.5" />
          </FormatButton>
          <FormatButton
            active={editor.isActive("link")}
            onClick={() => {
              const url = window.prompt("URL:");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            title="Link"
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </FormatButton>
        </BubbleMenu>
      )}

      <EditorContent
        editor={editor}
        id={`block-${blockId}`}
        className={cn(
          "outline-none",
          // Placeholder via CSS (injetado pelo extension)
          "[&_.is-empty::before]:content-[attr(data-placeholder)]",
          "[&_.is-empty::before]:text-muted-foreground/40",
          "[&_.is-empty::before]:float-left",
          "[&_.is-empty::before]:h-0",
          "[&_.is-empty::before]:pointer-events-none",
          // Remove outline padrão do ProseMirror
          "[&_.ProseMirror]:outline-none",
          "[&_.ProseMirror]:min-h-[1.5em]",
          // Links
          "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
          // Highlight
          "[&_mark]:bg-yellow-200/60 dark:[&_mark]:bg-yellow-400/30 [&_mark]:rounded-sm [&_mark]:px-0.5",
          // Code inline
          "[&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono",
          // Task list checkboxes
          "[&_input[type='checkbox']]:accent-primary",
        )}
      />
    </div>
  );
}

// ── Botão de formatação do BubbleMenu ────────────────────────────────────────

function FormatButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault(); // Evita perder o foco do editor
        onClick();
      }}
      title={title}
      className={cn(
        "p-1.5 rounded transition-colors",
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

// ── Helpers de conversão de conteúdo ─────────────────────────────────────────

function contentToTiptap(tipo: DocumentBlockType, content: string): string {
  if (!content) return "";

  // Se já é HTML (começa com <), retorna diretamente
  if (content.trimStart().startsWith("<")) return content;

  // Texto puro: envolve no nó correto
  const escaped = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  switch (tipo) {
    case "h1": return `<h1>${escaped}</h1>`;
    case "h2": return `<h2>${escaped}</h2>`;
    case "h3": return `<h3>${escaped}</h3>`;
    case "quote": return `<blockquote><p>${escaped}</p></blockquote>`;
    case "code": return `<pre><code>${escaped}</code></pre>`;
    case "bullet-list": return `<ul><li><p>${escaped}</p></li></ul>`;
    case "numbered-list": return `<ol><li><p>${escaped}</p></li></ol>`;
    case "todo": return `<ul data-type="taskList"><li data-type="taskItem" data-checked="false"><p>${escaped}</p></li></ul>`;
    default: return `<p>${escaped}</p>`;
  }
}
