// src/components/blocos/BlocoCard.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { GripVertical, CornerDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TIPO_BLOCO_META } from "@/lib/bloco-utils";
import { CriarBlocoModal } from "@/components/blocos/CriarBlocoModal";
import { BlocoHoverActions } from "@/components/blocos/BlocoHoverActions";
import { cn } from "@/lib/utils";
import type { Bloco, CreateBlocoPayload } from "@/types/bloco";

interface BlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onCreateBloco?: (payload: CreateBlocoPayload) => Promise<void>;
  isDeleting?: boolean;
  isCreating?: boolean;
  compact?: boolean;
  depth?: number;
}

export function BlocoCard({
  bloco,
  nucleoId,
  onDelete,
  onEdit,
  onDuplicate,
  onCreateBloco,
  isDeleting = false,
  isCreating = false,
  compact = true,
  depth = 0,
}: BlocoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState<"sub" | "abaixo">("sub");
  const [isDragging, setIsDragging] = useState(false);

  const {
    icon: IconComponent,
    rotulo,
    descricao,
  } = TIPO_BLOCO_META[bloco.tipo] || {
    icon: GripVertical,
    rotulo: bloco.tipo,
    descricao: "",
  };
  const tituloExibicao = bloco.titulo || rotulo;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", bloco.id);
    e.dataTransfer.effectAllowed = "move";
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleOpenSubBlocoModal = () => {
    setModalTipo("sub");
    setModalCriarAberto(true);
  };

  const handleOpenAbaixoModal = () => {
    setModalTipo("abaixo");
    setModalCriarAberto(true);
  };

  const handleCriarBloco = async (payload: CreateBlocoPayload) => {
    if (onCreateBloco) {
      if (modalTipo === "sub") {
        await onCreateBloco({
          ...payload,
          parentId: bloco.id,
        });
      } else {
        await onCreateBloco({
          ...payload,
          posicao: (bloco.posicao || 0) + 1,
          parentId: bloco.parentId,
        });
      }
    }
    setModalCriarAberto(false);
  };

  return (
    <>
      <Card
        className={cn(
          "group relative transition-all duration-200",
          "hover:shadow-md border-border/50",
          isDragging && "opacity-50 shadow-lg ring-2 ring-primary",
          !compact && "shadow-sm",
        )}
        style={{ marginLeft: depth > 0 ? `${depth * 24}px` : undefined }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Link para tela cheia (apenas no modo compacto) */}
        {compact && (
          <Link
            href={`/dashboard/nucleos/${nucleoId}/blocos/${bloco.id}`}
            className="absolute inset-0 z-0"
            aria-label={`Abrir bloco ${tituloExibicao}`}
          />
        )}

        {/* Ações de hover no topo direito */}
        <BlocoHoverActions
          bloco={bloco}
          nucleoId={nucleoId}
          onOpenFullPage={
            compact
              ? undefined
              : () => {
                  // Já está em tela cheia (não-compacto)
                }
          }
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onAddBelow={handleOpenAbaixoModal}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />

        <CardHeader
          className={cn(
            "flex flex-row items-start justify-between",
            compact ? "space-y-0 pb-2" : "pb-3",
          )}
        >
          <div className="flex items-center gap-2">
            {/* Indicador de profundidade */}
            {depth > 0 && (
              <CornerDownRight
                className="h-4 w-4 text-muted-foreground"
                data-no-nav="true"
              />
            )}

            {/* Drag handle */}
            <div
              className={cn(
                "cursor-grab transition-all duration-200",
                isHovered ? "opacity-100" : "opacity-0",
                compact && "relative z-10",
              )}
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              title="Arraste para reordenar"
              data-no-nav="true"
            >
              <div className="p-1 rounded-md hover:bg-accent/50 transition-colors">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Ícone do tipo de bloco */}
            <div className="rounded-lg bg-primary/10 p-1.5" data-no-nav="true">
              <IconComponent className="h-4 w-4 text-primary" />
            </div>

            {/* Título */}
            <CardTitle
              className={cn("font-semibold", compact ? "text-sm" : "text-base")}
              data-no-nav="true"
            >
              {tituloExibicao}
            </CardTitle>
          </div>
        </CardHeader>

        {/* Descrição (apenas quando não compacto ou com descrição) */}
        {(!compact || descricao) && (
          <CardContent data-no-nav="true">
            <p className="text-xs text-muted-foreground">{descricao}</p>
          </CardContent>
        )}
      </Card>

      {/* Modal de criação de bloco */}
      {onCreateBloco && (
        <CriarBlocoModal
          open={modalCriarAberto}
          onClose={() => setModalCriarAberto(false)}
          onConfirm={handleCriarBloco}
          nucleoId={nucleoId}
          isCreating={isCreating}
          parentId={modalTipo === "sub" ? bloco.id : null}
        />
      )}
    </>
  );
}
