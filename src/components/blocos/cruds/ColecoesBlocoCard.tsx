// src/components/blocos/cruds/ColecoesBlocoCard.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  LayoutGrid,
  Table as TableIcon,
  GripVertical,
  Copy,
  Zap,
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
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CriarColecaoModal } from "@/components/colecoes/CriarColecaoModal";
import { CriarTabelaRapidaModal } from "@/components/colecoes/CriarTabelaRapidaModal";
import { ColecaoBoard } from "@/components/colecoes/ColecaoBoard";
import { colecoesService } from "@/services/colecoes.service";
import type { Bloco } from "@/types/bloco";

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
  const [viewMode, setViewMode] = useState<"board" | "table">("board");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [quickTableModalOpen, setQuickTableModalOpen] = useState(false);

  const { colecoes, isLoading, criarColecao, isCreating } = useColecoes(
    bloco.id,
  );

  const handleCreateColecao = async (nome: string) => {
    try {
      await criarColecao({ nome });
      setCreateModalOpen(false);
      toast({ title: "Coleção criada com sucesso!" });
    } catch (error) {
      toast({ title: "Erro ao criar coleção", variant: "destructive" });
    }
  };

  const handleCreateTabelaRapida = async (
    nome: string,
    campos: { nome: string; tipoCampo: string }[],
  ) => {
    try {
      const novaColecao = await criarColecao({ nome });

      for (const campo of campos) {
        await colecoesService.createCampo(
          novaColecao.id,
          campo.nome,
          campo.tipoCampo,
        );
      }

      setQuickTableModalOpen(false);
      toast({
        title: "Tabela criada com sucesso!",
        description: `${campos.length} campo${campos.length !== 1 ? "s" : ""} adicionado${campos.length !== 1 ? "s" : ""}`,
      });
    } catch (error) {
      console.error("[v0] Erro ao criar tabela rápida:", error);
      toast({ title: "Erro ao criar tabela", variant: "destructive" });
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
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

  // ── Estado vazio ─────────────────────────────────────────────────────────
  if (colecoes.length === 0) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div className="absolute -top-4 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
            {onEdit && (
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-white shadow-md border-slate-200"
                onClick={onEdit}
              >
                <Pencil className="h-4 w-4 text-slate-700" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 bg-white shadow-md border-slate-200 text-destructive hover:text-destructive hover:bg-destructive/5"
                onClick={onDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <div className="cursor-move h-9 w-9 flex items-center justify-center">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <Card className="border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 hover:border-blue-400 transition-all hover:shadow-lg">
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-5">
                <LayoutGrid className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Crie sua primeira coleção
              </h3>
              <p className="text-sm text-slate-600 mb-6 max-w-sm leading-relaxed">
                Organize dados em tabelas intuitivas. Adicione campos, itens e
                gerencie tudo em um só lugar, como no Notion.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => setQuickTableModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Criar Tabela Rápida
                </Button>
                <Button
                  onClick={() => setCreateModalOpen(true)}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Coleção Vazia
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <CriarColecaoModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onConfirm={handleCreateColecao}
          isSubmitting={isCreating}
        />

        <CriarTabelaRapidaModal
          open={quickTableModalOpen}
          onClose={() => setQuickTableModalOpen(false)}
          onConfirm={handleCreateTabelaRapida}
          isSubmitting={isCreating}
        />
      </>
    );
  }

  // ── Com coleções ─────────────────────────────────────────────────────────
  return (
    <div className="p-3">
      <div className="flex items-center justify-between px-">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2"></div>
        </div>

        <div className="flex items-center gap-2 py-2">
          {/* <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("board")}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                viewMode === "board"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-slate-600 hover:text-slate-900",
              )}
            >
              <LayoutGrid className="h-4 w-4 inline mr-1.5" />
              Quadro
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                viewMode === "table"
                  ? "bg-white shadow-sm text-blue-600"
                  : "text-slate-600 hover:text-slate-900",
              )}
            >
              <TableIcon className="h-4 w-4 inline mr-1.5" />
              Tabela
            </button>
          </div> */}

          <Button
            size="sm"
            onClick={() => setQuickTableModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Zap className="h-4 w-4 mr-1.5" />
            Nova Tabela
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            variant="outline"
            className="border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Nova Coleção
          </Button>

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

      <div className="space-y-4">
        {colecoes.map((colecao) => (
          <ColecaoBoard key={colecao.id} colecao={colecao} blocoId={bloco.id} />
        ))}
      </div>

      <CriarColecaoModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onConfirm={handleCreateColecao}
        isSubmitting={isCreating}
      />

      <CriarTabelaRapidaModal
        open={quickTableModalOpen}
        onClose={() => setQuickTableModalOpen(false)}
        onConfirm={handleCreateTabelaRapida}
        isSubmitting={isCreating}
      />
    </div>
  );
}
