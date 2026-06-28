// src/components/document/FunctionalBlockCard.tsx
"use client";

import { BlocoCard } from "@/components/blocos/BlocoCard";
import type { DocumentBlock } from "./document-types";
import type { Bloco } from "@/types/bloco";

interface FunctionalBlockCardProps {
  block: DocumentBlock;
  nucleoId: string;
  isDeleting?: boolean;
  onOpenFullPage: () => void;
  onDelete: () => void;
  onEditTitle: (titulo: string) => void;
}

export function FunctionalBlockCard({
  block,
  nucleoId,
  isDeleting = false,
  onOpenFullPage,
  onDelete,
  onEditTitle,
}: FunctionalBlockCardProps) {
  const bloco = block.blocoRef as Bloco;

  return (
    <BlocoCard
      bloco={bloco}
      nucleoId={nucleoId}
      onDelete={onDelete}
      onEdit={onOpenFullPage}
      onEditTitle={onEditTitle}
      isDeleting={isDeleting}
      compact={false}
      depth={0}
    />
  );
}
