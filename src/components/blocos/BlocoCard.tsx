"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MoreHorizontal,
  GripVertical,
  Plus,
  ExternalLink,
  Pencil,
  Trash2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TIPO_BLOCO_META } from "@/lib/bloco-utils";
import { CriarBlocoModal } from "@/components/blocos/CriarBlocoModal";
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
}: BlocoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const {
    icon: IconComponent,
    rotulo,
    descricao,
  } = TIPO_BLOCO_META[bloco.tipo];
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

  const handleCriarBlocoAbaixo = async (payload: CreateBlocoPayload) => {
    if (onCreateBloco) {
      await onCreateBloco({
        ...payload,
        posicao: (bloco.posicao || 0) + 1,
      });
    }
    setModalCriarAberto(false);
  };

  // Impedir que o clique no drag handle ou menu navegue para o link
  const handleContainerClick = (e: React.MouseEvent) => {
    if (compact && (e.target as HTMLElement).closest('[data-no-nav="true"]')) {
      e.preventDefault();
    }
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleContainerClick}
      >
        {compact && (
          <Link
            href={`/dashboard/nucleos/${nucleoId}/blocos/${bloco.id}`}
            className="absolute inset-0 z-0"
            aria-label={`Abrir bloco ${tituloExibicao}`}
          />
        )}
        <CardHeader
          className={cn(
            "flex flex-row items-start justify-between",
            compact ? "space-y-0 pb-2" : "pb-3",
          )}
        >
          <div className="flex items-center gap-2">
            {/* Drag handle (6 pontinhos) */}
            <div
              className={cn(
                "cursor-grab transition-opacity",
                isHovered ? "opacity-100" : "opacity-0",
                compact && "relative z-10",
              )}
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              title="Arraste para reordenar"
              data-no-nav="true"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </div>

            {/* Ícone do tipo */}
            <div className="rounded-md bg-primary/10 p-1.5" data-no-nav="true">
              <IconComponent className="h-4 w-4 text-primary" />
            </div>

            {/* Título */}
            <CardTitle
              className={cn("font-medium", compact ? "text-base" : "text-lg")}
              data-no-nav="true"
            >
              {tituloExibicao}
            </CardTitle>
          </div>

          {/* Menu de ações (3 pontinhos) */}
          <div data-no-nav="true">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative z-10 h-8 w-8 transition-opacity",
                    !isHovered && "opacity-0",
                  )}
                  disabled={isDeleting}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-20 w-48">
                {compact && (
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/nucleos/${nucleoId}/blocos/${bloco.id}`}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Abrir em tela cheia
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                {onDuplicate && (
                  <DropdownMenuItem onClick={onDuplicate}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicar
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setModalCriarAberto(true)}
                  className="text-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar bloco abaixo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent data-no-nav="true">
          <p className="text-xs text-muted-foreground">{descricao}</p>

          {/* Botão "+" flutuante no hover (adicionar bloco abaixo) */}
          {isHovered && onCreateBloco && compact && (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
              <Button
                size="icon"
                className="h-6 w-6 rounded-full shadow-md"
                onClick={() => setModalCriarAberto(true)}
                data-no-nav="true"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para criar bloco abaixo */}
      {onCreateBloco && (
        <CriarBlocoModal
          open={modalCriarAberto}
          onClose={() => setModalCriarAberto(false)}
          onConfirm={handleCriarBlocoAbaixo}
          nucleoId={nucleoId}
          isCreating={isCreating}
        />
      )}
    </>
  );
}
