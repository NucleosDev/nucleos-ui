"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
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
import type { JSONContent } from "@tiptap/core";

// Derive Editor type from useEditor to avoid pnpm dual-package path mismatch
type TiptapEditor = NonNullable<ReturnType<typeof useEditor>>;
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Code,
  Highlighter,
  Link as LinkIcon,
  Strikethrough,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SlashMenu } from "./SlashMenu";

// ── Apply block type command ──────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyChain = any;

function applyBlockType(editor: TiptapEditor, tipo: string) {
  const c: AnyChain = editor.chain().focus();
  switch (tipo) {
    case "h1": c.setHeading({ level: 1 }).run(); break;
    case "h2": c.setHeading({ level: 2 }).run(); break;
    case "h3": c.setHeading({ level: 3 }).run(); break;
    case "paragraph": c.setParagraph().run(); break;
    case "quote": c.setBlockquote().run(); break;
    case "code": c.setCodeBlock().run(); break;
    case "bullet-list": c.toggleBulletList().run(); break;
    case "numbered-list": c.toggleOrderedList().run(); break;
    case "todo": c.toggleTaskList().run(); break;
    case "divider": c.setHorizontalRule().run(); break;
  }
}

const FUNCTIONAL_BLOCK_TYPES = new Set([
  "tarefas", "calendario", "habitos", "lista",
  "timer", "colecoes", "notas", "kanban",
]);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NucleoEditorRef {
  addBlock: (tipo: string) => void;
  focus: () => void;
}

export interface NucleoEditorProps {
  initialContent: JSONContent | null;
  readOnly?: boolean;
  onSave?: (json: JSONContent) => void;
  onAddFunctional?: (tipo: string) => void;
  className?: string;
}

// ── NucleoEditor ─────────────────────────────────────────────────────────────

export const NucleoEditor = forwardRef<NucleoEditorRef, NucleoEditorProps>(
  function NucleoEditor(
    { initialContent, readOnly = false, onSave, onAddFunctional, className },
    ref,
  ) {
    const [slashOpen, setSlashOpen] = useState(false);
    const [slashPos, setSlashPos] = useState({ top: 0, left: 0 });
    const slashAnchor = useRef<number | null>(null);
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const debouncedSave = useCallback(
      (json: JSONContent) => {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => onSave?.(json), 600);
      },
      [onSave],
    );

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
        }),
        Underline,
        Highlight.configure({ multicolor: false }),
        Link.configure({ openOnClick: false, autolink: true }),
        TaskList,
        TaskItem.configure({ nested: false }),
        Typography,
        Placeholder.configure({
          showOnlyCurrent: true,
          emptyNodeClass: "is-empty",
          placeholder: ({ node }) => {
            if (node.type.name === "heading") {
              return `Título ${(node.attrs as { level: number }).level}`;
            }
            return "Escreva algo, ou pressione '/' para comandos…";
          },
        }),
      ],
      content: initialContent ?? { type: "doc", content: [{ type: "paragraph" }] },
      editable: !readOnly,
      immediatelyRender: false,
      onUpdate: ({ editor: ed }) => {
        const { $anchor } = ed.state.selection;
        const nodeText = $anchor.parent.textContent;
        const atEnd = $anchor.parentOffset === nodeText.length;

        if (nodeText === "/" && atEnd && !ed.isActive("codeBlock")) {
          const coords = ed.view.coordsAtPos($anchor.pos);
          slashAnchor.current = $anchor.pos;
          setSlashPos({ top: coords.bottom + 8, left: coords.left });
          setSlashOpen(true);
        } else if (slashOpen) {
          setSlashOpen(false);
        }

        debouncedSave(ed.getJSON());
      },
    });

    // Sync when content changes externally (e.g. after initial data load)
    useEffect(() => {
      if (!editor || !initialContent || editor.isFocused) return;
      const current = JSON.stringify(editor.getJSON());
      const next = JSON.stringify(initialContent);
      if (current !== next) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (editor.commands as any).setContent(initialContent);
      }
    }, [initialContent]); // eslint-disable-line react-hooks/exhaustive-deps

    // Imperative API for AddBlockTrigger integration
    useImperativeHandle(ref, () => ({
      addBlock(tipo: string) {
        if (!editor) return;
        const { doc } = editor.state;
        const lastChild = doc.lastChild;

        if (lastChild?.textContent !== "") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (editor.chain().focus() as any).insertContentAt(doc.content.size, { type: "paragraph" }).run();
        } else {
          editor.commands.focus("end");
        }

        if (tipo !== "paragraph") {
          setTimeout(() => applyBlockType(editor, tipo), 20);
        }
      },
      focus() {
        editor?.commands.focus("end");
      },
    }));

    const handleSlashSelect = useCallback(
      (tipo: string) => {
        setSlashOpen(false);
        if (!editor) return;

        const anchor = slashAnchor.current;
        if (anchor !== null) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (editor.chain().focus() as any).deleteRange({ from: anchor - 1, to: anchor }).run();
        }
        slashAnchor.current = null;

        if (FUNCTIONAL_BLOCK_TYPES.has(tipo)) {
          onAddFunctional?.(tipo);
          return;
        }

        applyBlockType(editor, tipo);
      },
      [editor, onAddFunctional],
    );

    return (
      <div className={cn("nucleo-editor relative", className)}>
        {/* Floating formatting toolbar on selection */}
        {editor && !readOnly && (
          <BubbleMenu
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            editor={editor as any}
            className="flex items-center gap-0.5 px-1.5 py-1.5 bg-popover/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl"
          >
            <BlockTypePicker editor={editor} />
            <div className="w-px h-4 bg-border/50 mx-1" />
            <FmtBtn
              active={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Negrito ⌘B"
            >
              <Bold className="h-3.5 w-3.5" />
            </FmtBtn>
            <FmtBtn
              active={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Itálico ⌘I"
            >
              <Italic className="h-3.5 w-3.5" />
            </FmtBtn>
            <FmtBtn
              active={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="Sublinhado ⌘U"
            >
              <UnderlineIcon className="h-3.5 w-3.5" />
            </FmtBtn>
            <FmtBtn
              active={editor.isActive("strike")}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="Tachado"
            >
              <Strikethrough className="h-3.5 w-3.5" />
            </FmtBtn>
            <FmtBtn
              active={editor.isActive("highlight")}
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              title="Destacar"
            >
              <Highlighter className="h-3.5 w-3.5" />
            </FmtBtn>
            <div className="w-px h-4 bg-border/50 mx-1" />
            <FmtBtn
              active={editor.isActive("code")}
              onClick={() => editor.chain().focus().toggleCode().run()}
              title="Código inline"
            >
              <Code className="h-3.5 w-3.5" />
            </FmtBtn>
            <FmtBtn
              active={editor.isActive("link")}
              onClick={() => {
                const url = window.prompt("URL:");
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
              title="Link"
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </FmtBtn>
          </BubbleMenu>
        )}

        {/* Editor content */}
        <EditorContent
          editor={editor}
          className={cn(
            // Base
            "[&_.ProseMirror]:outline-none",
            "[&_.ProseMirror]:min-h-[6rem]",
            // Paragraphs
            "[&_.ProseMirror_p]:text-[15px] [&_.ProseMirror_p]:leading-[1.75] [&_.ProseMirror_p]:text-foreground/90 [&_.ProseMirror_p]:my-0.5",
            // Headings
            "[&_.ProseMirror_h1]:text-[2rem] [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:leading-[1.2] [&_.ProseMirror_h1]:tracking-tight [&_.ProseMirror_h1]:mt-9 [&_.ProseMirror_h1]:mb-1",
            "[&_.ProseMirror_h2]:text-[1.5rem] [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:leading-[1.3] [&_.ProseMirror_h2]:mt-7 [&_.ProseMirror_h2]:mb-1",
            "[&_.ProseMirror_h3]:text-[1.25rem] [&_.ProseMirror_h3]:font-medium [&_.ProseMirror_h3]:leading-[1.4] [&_.ProseMirror_h3]:mt-5 [&_.ProseMirror_h3]:mb-0.5",
            // First heading has no top margin
            "[&_.ProseMirror_h1:first-child]:mt-0 [&_.ProseMirror_h2:first-child]:mt-0 [&_.ProseMirror_h3:first-child]:mt-0",
            // Blockquote
            "[&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-foreground/20 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-foreground/55 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:my-3",
            "[&_.ProseMirror_blockquote_p]:my-0",
            // Code block
            "[&_.ProseMirror_pre]:bg-muted/60 [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:px-4 [&_.ProseMirror_pre]:py-3 [&_.ProseMirror_pre]:my-3 [&_.ProseMirror_pre]:font-mono [&_.ProseMirror_pre]:text-[13px] [&_.ProseMirror_pre]:leading-relaxed [&_.ProseMirror_pre]:border [&_.ProseMirror_pre]:border-border/30",
            "[&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:p-0",
            // Lists
            "[&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ul]:my-1",
            "[&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_ol]:my-1",
            "[&_.ProseMirror_li]:my-0.5 [&_.ProseMirror_li_p]:my-0",
            // Task list
            "[&_.ProseMirror_ul[data-type='taskList']]:pl-0 [&_.ProseMirror_ul[data-type='taskList']]:list-none [&_.ProseMirror_ul[data-type='taskList']]:my-1",
            "[&_.ProseMirror_li[data-type='taskItem']]:flex [&_.ProseMirror_li[data-type='taskItem']]:items-start [&_.ProseMirror_li[data-type='taskItem']]:gap-2 [&_.ProseMirror_li[data-type='taskItem']]:my-0.5",
            "[&_.ProseMirror_li[data-type='taskItem']_label]:mt-[3px] [&_.ProseMirror_li[data-type='taskItem']_label]:flex [&_.ProseMirror_li[data-type='taskItem']_label]:items-center",
            "[&_.ProseMirror_li[data-type='taskItem']_input]:w-4 [&_.ProseMirror_li[data-type='taskItem']_input]:h-4 [&_.ProseMirror_li[data-type='taskItem']_input]:accent-primary [&_.ProseMirror_li[data-type='taskItem']_input]:cursor-pointer",
            "[&_.ProseMirror_li[data-type='taskItem'][data-checked='true']_p]:line-through [&_.ProseMirror_li[data-type='taskItem'][data-checked='true']_p]:text-muted-foreground/60",
            // Horizontal rule
            "[&_.ProseMirror_hr]:border-t [&_.ProseMirror_hr]:border-border/50 [&_.ProseMirror_hr]:my-7",
            "[&_.ProseMirror_hr.ProseMirror-selectednode]:border-primary/60",
            // Inline code
            "[&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1.5 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:text-[13px] [&_.ProseMirror_code]:font-mono",
            // Links
            "[&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:underline-offset-2 [&_.ProseMirror_a]:decoration-primary/50",
            // Highlight
            "[&_mark]:bg-yellow-200/70 dark:[&_mark]:bg-yellow-400/25 [&_mark]:rounded-sm [&_mark]:px-0.5",
            // Placeholder
            "[&_.ProseMirror_.is-empty::before]:content-[attr(data-placeholder)]",
            "[&_.ProseMirror_.is-empty::before]:text-muted-foreground/35",
            "[&_.ProseMirror_.is-empty::before]:float-left",
            "[&_.ProseMirror_.is-empty::before]:h-0",
            "[&_.ProseMirror_.is-empty::before]:pointer-events-none",
          )}
        />

        {/* Slash command menu */}
        <SlashMenu
          open={slashOpen}
          position={slashPos}
          onSelect={handleSlashSelect}
          onClose={() => {
            setSlashOpen(false);
            editor?.commands.focus();
          }}
        />
      </div>
    );
  },
);

// ── Format button ─────────────────────────────────────────────────────────────

function FmtBtn({
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
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={cn(
        "p-1.5 rounded-lg transition-colors",
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

// ── Block type picker in BubbleMenu ───────────────────────────────────────────

function BlockTypePicker({ editor }: { editor: TiptapEditor }) {
  const label = (() => {
    if (editor.isActive("heading", { level: 1 })) return "H1";
    if (editor.isActive("heading", { level: 2 })) return "H2";
    if (editor.isActive("heading", { level: 3 })) return "H3";
    if (editor.isActive("blockquote")) return "Citação";
    if (editor.isActive("codeBlock")) return "Código";
    if (editor.isActive("bulletList")) return "Lista";
    if (editor.isActive("orderedList")) return "Lista N.";
    if (editor.isActive("taskList")) return "Checklist";
    return "Texto";
  })();

  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (editor.chain().focus() as any).setParagraph().run();
      }}
      title="Converter para parágrafo"
      className="px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg transition-colors min-w-[3rem] text-center"
    >
      {label}
    </button>
  );
}
