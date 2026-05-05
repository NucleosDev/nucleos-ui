// src/components/document/LayoutRowRenderer.tsx
"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { SortableDocumentBlock } from "./SortableDocumentBlock";
import { TextBlockRenderer } from "./TextBlockRenderer";
import { FunctionalBlockCard } from "./FunctionalBlockCard";
import { HeaderBlock } from "./HeaderBlock";
import { ColecoesBlocoCard } from "@/components/blocos/cruds/ColecoesBlocoCard";
import type { Nucleo } from "@/types/nucleo";
import type {
  DocumentBlock,
  DocumentBlockType,
  LayoutRow,
  LayoutColumn,
} from "./document-types";

const FUNCTIONAL_TYPES = new Set([
  "tarefas",
  "calendario",
  "habitos",
  "habito",
  "lista",
  "timer",
  "timers",
  "colecoes",
  "notas",
]);

function criarBlocoFallback(block: DocumentBlock): any {
  return {
    id: block.id,
    nucleoId: block.nucleoId,
    tipo: block.tipo,
    titulo: block.titulo || null,
    posicao: 0,
    configuracoes: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

interface LayoutRowRendererProps {
  row: LayoutRow;
  nucleo: Nucleo;
  nucleoId: string;
  activeBlockId: string | null;
  readOnly?: boolean;
  fullWidth?: boolean;
  onActivateBlock: (id: string) => void;
  onUpdateBlock: (id: string, updates: Partial<DocumentBlock>) => void;
  onDeleteBlock: (id: string) => void;
  onDeleteFunctional: (id: string) => void;
  onAddBlockAfter: (
    tipo: DocumentBlockType,
    afterBlockId: string,
    rowId: string,
    columnId?: string,
  ) => void;
  onTypeChange: (id: string, tipo: DocumentBlockType) => void;
  onSlashMenu: (
    blockId: string,
    rowId: string,
    columnId: string | undefined,
    pos: { top: number; left: number },
  ) => void;
  onOpenFullPage: (blockId: string) => void;
  onEditTitle: (blockId: string, titulo: string) => void;
  isDeleting?: boolean;
}

export function LayoutRowRenderer({
  row,
  nucleo,
  nucleoId,
  activeBlockId,
  readOnly = false,
  onActivateBlock,
  onUpdateBlock,
  onDeleteBlock,
  onDeleteFunctional,
  onAddBlockAfter,
  onTypeChange,
  onSlashMenu,
  onOpenFullPage,
  onEditTitle,
  isDeleting = false,
}: LayoutRowRendererProps) {
  const { setNodeRef: setRowRef, isOver: isRowOver } = useDroppable({
    id: `row-${row.id}`,
  });

  const renderBlock = (block: DocumentBlock, columnId?: string) => {
    if (block.tipo === "header") {
      return <HeaderBlock key={block.id} nucleo={nucleo} fullWidth={false} />;
    }

    // Coleções renderizam como tabela completa inline
    if (block.tipo === "colecoes") {
      return (
        <SortableDocumentBlock
          key={block.id}
          block={block}
          isActive={activeBlockId === block.id}
          onSelect={(id: string, e: React.MouseEvent) => onActivateBlock(id)}
          onUpdate={(updates: Partial<DocumentBlock>) =>
            onUpdateBlock(block.id, updates)
          }
          onDelete={() => onDeleteFunctional(block.id)}
          readOnly={readOnly}
        >
          <div className="w-full border border-border/40 rounded-xl overflow-hidden bg-card">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-muted/20">
              <span className="text-sm font-medium">
                {block.titulo || block.blocoRef?.titulo || "Coleção"}
              </span>
              <button
                onClick={() => onOpenFullPage(block.id)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Abrir em tela cheia →
              </button>
            </div>
            <ColecoesBlocoCard
              bloco={block.blocoRef || criarBlocoFallback(block)}
              nucleoId={nucleoId}
              onDelete={() => onDeleteFunctional(block.id)}
              onEdit={() => onOpenFullPage(block.id)}
              isDeleting={isDeleting}
            />
          </div>
        </SortableDocumentBlock>
      );
    }

    // Outros blocos funcionais
    if (FUNCTIONAL_TYPES.has(block.tipo)) {
      return (
        <SortableDocumentBlock
          key={block.id}
          block={block}
          isActive={activeBlockId === block.id}
          onSelect={(id: string, e: React.MouseEvent) => onActivateBlock(id)}
          onUpdate={(updates: Partial<DocumentBlock>) =>
            onUpdateBlock(block.id, updates)
          }
          onDelete={() => onDeleteFunctional(block.id)}
          readOnly={readOnly}
        >
          <FunctionalBlockCard
            block={block}
            nucleoId={nucleoId}
            isDeleting={isDeleting}
            onOpenFullPage={() => onOpenFullPage(block.id)}
            onDelete={() => onDeleteFunctional(block.id)}
            onEditTitle={(titulo: string) => onEditTitle(block.id, titulo)}
          />
        </SortableDocumentBlock>
      );
    }

    // Blocos de texto
    return (
      <SortableDocumentBlock
        key={block.id}
        block={block}
        isActive={activeBlockId === block.id}
        onSelect={(id: string, e: React.MouseEvent) => onActivateBlock(id)}
        onUpdate={(updates: Partial<DocumentBlock>) =>
          onUpdateBlock(block.id, updates)
        }
        onDelete={() => onDeleteBlock(block.id)}
        readOnly={readOnly}
      >
        <TextBlockRenderer
          block={block}
          isActive={activeBlockId === block.id}
          onActivate={() => onActivateBlock(block.id)}
          onUpdate={onUpdateBlock}
          onDelete={onDeleteBlock}
          onAddBelow={(tipo: DocumentBlockType) =>
            onAddBlockAfter(tipo, block.id, row.id, columnId)
          }
          onTypeChange={onTypeChange}
          onSlashMenu={(pos: { top: number; left: number }) =>
            onSlashMenu(block.id, row.id, columnId, pos)
          }
          readOnly={readOnly}
        />
      </SortableDocumentBlock>
    );
  };

  // Layout full-width
  if (row.type === "full" && row.blocks) {
    return (
      <div
        ref={setRowRef}
        className={cn(
          "transition-colors duration-200 rounded-lg",
          isRowOver && "bg-primary/5 ring-2 ring-primary/20",
        )}
      >
        {row.blocks.map((block: DocumentBlock) => renderBlock(block))}
      </div>
    );
  }

  // Layout em colunas
  if (row.type === "columns" && row.columns) {
    return (
      <div
        ref={setRowRef}
        className={cn(
          "flex gap-4 mb-4 transition-colors duration-200 rounded-lg p-2",
          isRowOver && "bg-primary/5 ring-2 ring-primary/20",
        )}
      >
        {row.columns.map((column: LayoutColumn) => (
          <ColumnRenderer
            key={column.id}
            column={column}
            renderBlock={renderBlock}
          />
        ))}
      </div>
    );
  }

  return null;
}

// Subcomponente para coluna droppable
function ColumnRenderer({
  column,
  renderBlock,
}: {
  column: LayoutColumn;
  renderBlock: (block: DocumentBlock, columnId: string) => React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `col-${column.id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 flex flex-col gap-2 min-w-0 transition-colors duration-200 rounded-lg p-1",
        isOver && "bg-accent/30",
      )}
      style={{ flexBasis: `${column.width}%` }}
    >
      {column.blocks.map((block: DocumentBlock) =>
        renderBlock(block, column.id),
      )}
    </div>
  );
}
