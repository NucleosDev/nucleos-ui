"use client";

import { useState } from "react";
import { Plus, LayoutGrid, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useColecoes } from "@/hooks/useColecoes";
import { toast } from "@/hooks/use-toast";
import { CriarColecaoModal } from "@/components/colecoes/CriarColecaoModal";
import { CriarTabelaRapidaModal } from "@/components/colecoes/CriarTabelaRapidaModal";
import { ColecaoBoard } from "@/components/colecoes/ColecaoBoard";
import { colecoesService } from "@/services/colecoes.service";
import type { Bloco } from "@/types/bloco";

interface GaleriaBlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete?: () => void;
  onEdit?: () => void;
  isDeleting?: boolean;
}

export function GaleriaBlocoCard({ bloco }: GaleriaBlocoCardProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [quickTableOpen, setQuickTableOpen] = useState(false);

  const { colecoes, isLoading, criarColecao, isCreating } = useColecoes(bloco.id);

  const handleCreate = async (nome: string) => {
    try {
      await criarColecao({ nome });
      setCreateOpen(false);
      toast({ title: "Galeria criada!" });
    } catch {
      toast({ title: "Erro ao criar galeria", variant: "destructive" });
    }
  };

  const handleQuickTable = async (
    nome: string,
    campos: { nome: string; tipoCampo: string }[],
  ) => {
    try {
      const nova = await criarColecao({ nome });
      for (const campo of campos) {
        await colecoesService.createCampo(nova.id, campo.nome, campo.tipoCampo);
      }
      setQuickTableOpen(false);
      toast({ title: "Galeria criada!" });
    } catch {
      toast({ title: "Erro ao criar galeria", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (colecoes.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4 bg-rose-500/10 border border-rose-500/20">
            <LayoutGrid className="h-6 w-6 text-rose-500/60" />
          </div>
          <p className="text-sm font-medium text-foreground/70 mb-1">
            Nenhuma galeria ainda
          </p>
          <p className="text-xs text-muted-foreground/60 max-w-xs mb-5">
            Visualize itens em grade de cards — ideal para coleções visuais com campos ricos.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuickTableOpen(true)}
              disabled={isCreating}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-500 text-white hover:opacity-90 transition-opacity shadow-[0_4px_12px_rgba(244,63,94,0.25)]"
            >
              <Plus className="h-3.5 w-3.5" />
              Com campos
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              disabled={isCreating}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Em branco
            </button>
          </div>
        </div>

        <CriarColecaoModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onConfirm={handleCreate}
          isSubmitting={isCreating}
        />
        <CriarTabelaRapidaModal
          open={quickTableOpen}
          onClose={() => setQuickTableOpen(false)}
          onConfirm={handleQuickTable}
          isSubmitting={isCreating}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCreateOpen(true)}
          disabled={isCreating}
          className="h-7 text-xs text-rose-500 hover:bg-rose-500/8 border border-rose-500/25"
        >
          {isCreating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
          ) : (
            <Plus className="h-3.5 w-3.5 mr-1" />
          )}
          Nova galeria
        </Button>
      </div>

      <div className="space-y-4">
        {colecoes.map((colecao) => (
          <ColecaoBoard
            key={colecao.id}
            colecao={colecao}
            blocoId={bloco.id}
            defaultView="board"
            hideViewToggle
          />
        ))}
      </div>

      <CriarColecaoModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onConfirm={handleCreate}
        isSubmitting={isCreating}
      />
      <CriarTabelaRapidaModal
        open={quickTableOpen}
        onClose={() => setQuickTableOpen(false)}
        onConfirm={handleQuickTable}
        isSubmitting={isCreating}
      />
    </div>
  );
}
