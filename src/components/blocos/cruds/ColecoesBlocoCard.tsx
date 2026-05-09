// src/components/blocos/cruds/ColecoesBlocoCard.tsx
"use client";

import { useState } from "react";
import { Plus, Zap, Layers, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useColecoes } from "@/hooks/useColecoes";
import { toast } from "@/hooks/use-toast";
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

export function ColecoesBlocoCard({ bloco }: ColecoesBlocoCardProps) {
  const [createOpen, setCreateOpen]         = useState(false);
  const [quickTableOpen, setQuickTableOpen] = useState(false);

  const { colecoes, isLoading, criarColecao, isCreating } = useColecoes(bloco.id);

  const handleCreate = async (nome: string) => {
    try {
      await criarColecao({ nome });
      setCreateOpen(false);
      toast({ title: "Coleção criada!" });
    } catch {
      toast({ title: "Erro ao criar coleção", variant: "destructive" });
    }
  };

  const handleQuickTable = async (nome: string, campos: { nome: string; tipoCampo: string }[]) => {
    try {
      const nova = await criarColecao({ nome });
      for (const campo of campos) {
        await colecoesService.createCampo(nova.id, campo.nome, campo.tipoCampo);
      }
      setQuickTableOpen(false);
      toast({ title: "Tabela criada!", description: `${campos.length} campo${campos.length !== 1 ? "s" : ""} adicionado${campos.length !== 1 ? "s" : ""}` });
    } catch {
      toast({ title: "Erro ao criar tabela", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  /* ── Empty state ── */
  if (colecoes.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4"
            style={{
              background: "linear-gradient(135deg, #10b98122, #10b98108)",
              border: "1px solid #10b98130",
            }}
          >
            <Layers className="h-6 w-6 text-emerald-500/70" />
          </div>
          <p className="text-sm font-medium text-foreground/70 mb-1">Nenhuma coleção ainda</p>
          <p className="text-xs text-muted-foreground/60 max-w-xs mb-5">
            Organize dados em tabelas flexíveis — como um banco de dados pessoal.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuickTableOpen(true)}
              disabled={isCreating}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold",
                "bg-emerald-500 text-white hover:opacity-90 transition-opacity",
                "shadow-[0_4px_12px_rgba(16,185,129,0.25)]",
              )}
            >
              <Zap className="h-3.5 w-3.5" />
              Tabela rápida
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              disabled={isCreating}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Vazia
            </button>
          </div>
        </div>

        <CriarColecaoModal open={createOpen} onClose={() => setCreateOpen(false)} onConfirm={handleCreate} isSubmitting={isCreating} />
        <CriarTabelaRapidaModal open={quickTableOpen} onClose={() => setQuickTableOpen(false)} onConfirm={handleQuickTable} isSubmitting={isCreating} />
      </>
    );
  }

  /* ── Com coleções ── */
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-1.5">
        <button
          onClick={() => setQuickTableOpen(true)}
          disabled={isCreating}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-500/8 border border-emerald-500/25 transition-colors"
        >
          {isCreating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
          Nova Tabela
        </button>
        <button
          onClick={() => setCreateOpen(true)}
          disabled={isCreating}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent border border-border/40 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Coleção
        </button>
      </div>

      {/* Boards */}
      <div className="space-y-4">
        {colecoes.map((colecao) => (
          <ColecaoBoard key={colecao.id} colecao={colecao} blocoId={bloco.id} />
        ))}
      </div>

      <CriarColecaoModal open={createOpen} onClose={() => setCreateOpen(false)} onConfirm={handleCreate} isSubmitting={isCreating} />
      <CriarTabelaRapidaModal open={quickTableOpen} onClose={() => setQuickTableOpen(false)} onConfirm={handleQuickTable} isSubmitting={isCreating} />
    </div>
  );
}
