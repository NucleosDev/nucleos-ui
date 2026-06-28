// src/lib/document-styles.ts

import type { DocumentBlockType } from "@/types/document";

interface BlockStyle {
  container: string;
  tag: string;
  defaultContent: string;
}

export function getBlockStyles(blockType: DocumentBlockType): BlockStyle {
  const styles: Record<DocumentBlockType, BlockStyle> = {
    header: {
      container: "",
      tag: "div",
      defaultContent: "",
    },
    paragraph: {
      container: "text-base leading-7",
      tag: "p",
      defaultContent: "",
    },
    h1: {
      container: "text-4xl font-bold leading-tight",
      tag: "h1",
      defaultContent: "",
    },
    h2: {
      container: "text-3xl font-bold leading-tight mt-6 mb-2",
      tag: "h2",
      defaultContent: "",
    },
    h3: {
      container: "text-2xl font-bold leading-tight mt-4 mb-2",
      tag: "h3",
      defaultContent: "",
    },
    quote: {
      container:
        "text-base leading-7 italic border-l-4 border-muted-foreground pl-4 py-1",
      tag: "blockquote",
      defaultContent: "",
    },
    code: {
      container:
        "text-sm font-mono bg-muted p-3 rounded-md overflow-x-auto",
      tag: "pre",
      defaultContent: "",
    },
    divider: {
      container: "my-4",
      tag: "hr",
      defaultContent: "",
    },
    "bullet-list": {
      container: "text-base leading-7 list-disc list-inside",
      tag: "ul",
      defaultContent: "",
    },
    "numbered-list": {
      container: "text-base leading-7 list-decimal list-inside",
      tag: "ol",
      defaultContent: "",
    },
    todo: {
      container: "text-base leading-7 flex items-center gap-2",
      tag: "div",
      defaultContent: "",
    },
    tarefas: {
      container: "",
      tag: "div",
      defaultContent: "",
    },
    calendario: {
      container: "",
      tag: "div",
      defaultContent: "",
    },
    habitos: {
      container: "",
      tag: "div",
      defaultContent: "",
    },
    lista: {
      container: "",
      tag: "div",
      defaultContent: "",
    },
    timer: {
      container: "",
      tag: "div",
      defaultContent: "",
    },
    colecoes: {
      container: "",
      tag: "div",
      defaultContent: "",
    },
    notas: {
      container: "",
      tag: "div",
      defaultContent: "",
    },
  };

  return styles[blockType];
}

export const TEXT_BLOCK_TYPES = [
  "paragraph",
  "h1",
  "h2",
  "h3",
  "quote",
  "code",
  "bullet-list",
  "numbered-list",
  "todo",
  "divider",
] as const;

export const FUNCTIONAL_BLOCK_TYPES = [
  "tarefas",
  "calendario",
  "habitos",
  "lista",
  "timer",
  "colecoes",
  "notas",
] as const;
