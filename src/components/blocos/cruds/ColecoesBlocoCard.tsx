// src/components/blocos/cruds/ColecoesBlocoCard.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  LayoutGrid,
  Table as TableIcon,
  ChevronDown,
  GripVertical,
  Settings,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useColecoes } from "@/hooks/useColecoes";
import { useBlocos } from "@/hooks/useBlocos";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CriarColecaoModal } from "@/components/colecoes/CriarColecaoModal";
import { ColecaoBoard } from "@/components/colecoes/ColecaoBoard";
import type { Bloco } from "@/types/bloco";
import type { Colecao } from "@/types/colecao";

interface ColecoesBlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete?: () => void;
  onEdit?: () => void;
  isDeleting?: boolean;
}

export function ColecoesBlocoCard({
  bloco,
  nucleoId,
  onDelete,
  onEdit,
  isDeleting,
}: ColecoesBlocoCardProps) {
  const { update } = useBlocos();
  const [viewMode, setViewMode] = useState<"board" | "table">("board");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedColecao, setSelectedColecao] = useState<Colecao | null>(null);

  const { colecoes, isLoading, criarColecao, isCreating } = useColecoes(
    bloco.id,
  );

  const handleCreateColecao = async (nome: string) => {
    try {
      const novaColecao = await criarColecao({ nome });
      await update({
        id: bloco.id,
        payload: {
          configuracoes: {
            ...bloco.configuracoes,
            colecaoId: novaColecao.id,
          },
        },
      });
      setCreateModalOpen(false);
      toast({ title: "Coleção criada com sucesso!" });
    } catch (error) {
      toast({ title: "Erro ao criar coleção", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (colecoes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
          {onEdit && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-background shadow-sm"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-background shadow-sm text-destructive hover:text-destructive"
              onClick={onDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <div className="cursor-move">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <Card className="border-2 border-dashed border-border bg-muted/20 hover:bg-muted/30 transition-colors">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <LayoutGrid className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhuma coleção ainda</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Crie sua primeira coleção para começar a organizar seus dados como
              uma planilha, banco de dados ou quadro kanban.
            </p>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Criar coleção
            </Button>
          </div>
        </Card>

        <CriarColecaoModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onConfirm={handleCreateColecao}
          isSubmitting={isCreating}
        />
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            <h3 className="font-medium">{bloco.titulo || "Coleções"}</h3>
            <Badge variant="secondary" className="text-xs">
              {colecoes.length} {colecoes.length === 1 ? "coleção" : "coleções"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode("board")}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                viewMode === "board"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="h-4 w-4 inline mr-1" />
              Quadro
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                viewMode === "table"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <TableIcon className="h-4 w-4 inline mr-1" />
              Tabela
            </button>
          </div>

          <Button size="sm" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Nova coleção
          </Button>

          {/* Menu do bloco */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar bloco
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir bloco
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Coleções */}
      <div className="space-y-4">
        {colecoes.map((colecao) => (
          <ColecaoBoard
            key={colecao.id}
            colecao={colecao}
            blocoId={bloco.id}
            // viewMode={viewMode}
          />
        ))}
      </div>

      <CriarColecaoModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onConfirm={handleCreateColecao}
        isSubmitting={isCreating}
      />
    </div>
  );
}
