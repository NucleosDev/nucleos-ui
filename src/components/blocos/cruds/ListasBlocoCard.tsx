// src/components/blocos/cruds/ListasBlocoCard.tsx
"use client";

import { useState } from "react";
import { Plus, Check, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CriarListaModal } from "@/components/lista/CriarListaModal";
import { ListaFinanceiraInteligente } from "@/components/lista/ListaFinanceiraInteligente";
import { useListas } from "@/hooks/useListas";
import { useItensLista } from "@/hooks/useItensLista";
import { toast } from "@/hooks/use-toast";
import type { Bloco } from "@/types/bloco";

interface ListasBlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete?: () => void;
  onEdit?: () => void;
  isDeleting?: boolean;
}

export function ListasBlocoCard({
  bloco,
  nucleoId,
  onDelete,
  onEdit,
  isDeleting,
}: ListasBlocoCardProps) {
  const { listas, isLoading, criar, isCreating } = useListas(bloco.id);
  const [modalCriarAberta, setModalCriarAberta] = useState(false);
  const [listasColapsadas, setListasColapsadas] = useState<Set<string>>(
    new Set(),
  );

  const toggleLista = (listaId: string) => {
    setListasColapsadas((prev) => {
      const next = new Set(prev);
      if (next.has(listaId)) next.delete(listaId);
      else next.add(listaId);
      return next;
    });
  };

  const handleCriarLista = async (nome: string, tipoLista: string) => {
    try {
      await criar({ blocoId: bloco.id, nome, tipoLista: tipoLista as any });
      toast({ title: "Lista criada com sucesso!" });
      setModalCriarAberta(false);
    } catch (error: any) {
      toast({
        title: "Erro ao criar lista",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2 px-1">
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    );
  }

  if (listas.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center mb-2">
            <Check className="h-5 w-5 text-cyan-600" />
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Nenhuma lista ainda
          </p>
          <Button
            size="sm"
            onClick={() => setModalCriarAberta(true)}
            className="bg-cyan-600 hover:bg-cyan-700"
            disabled={isCreating}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Criar primeira lista
          </Button>
        </div>
        <CriarListaModal
          open={modalCriarAberta}
          onClose={() => setModalCriarAberta(false)}
          onConfirm={handleCriarLista}
          isSubmitting={isCreating}
        />
      </>
    );
  }

  return (
    <div className="space-y-3">
      {listas.map((lista) => (
        <ListaExpandivel
          key={lista.id}
          lista={lista}
          isExpanded={!listasColapsadas.has(lista.id)}
          onToggle={() => toggleLista(lista.id)}
        />
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="w-full gap-1.5 text-muted-foreground hover:text-foreground"
        onClick={() => setModalCriarAberta(true)}
        disabled={isCreating}
      >
        <Plus className="h-3.5 w-3.5" />
        Nova lista
      </Button>
      <CriarListaModal
        open={modalCriarAberta}
        onClose={() => setModalCriarAberta(false)}
        onConfirm={handleCriarLista}
        isSubmitting={isCreating}
      />
    </div>
  );
}

// ── Lista Expansível ─────────────────────────────────────────────────────

function ListaExpandivel({
  lista,
  isExpanded,
  onToggle,
}: {
  lista: any;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { itens, criarItem, atualizarItem, excluirItem, toggleItem } =
    useItensLista(lista.id);

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div
        className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="text-muted-foreground">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
        <div className="p-1 rounded-md bg-cyan-100 shrink-0">
          <Check className="h-3.5 w-3.5 text-cyan-600" />
        </div>
        <span className="text-sm font-medium flex-1 truncate">
          {lista.nome}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {lista.tipoLista === "compras"
            ? "Compras"
            : lista.tipoLista === "financeiro"
              ? "Financeiro"
              : "Geral"}
          {itens.length > 0 ? ` · ${itens.length}` : ""}
        </span>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 pt-2">
          <ListaFinanceiraInteligente
            lista={lista}
            itens={itens}
            onAddItem={async (p) => {
              await criarItem(p as any);
            }}
            onUpdateItem={async (id, p) => {
              await atualizarItem({ id, payload: p });
            }}
            onDeleteItem={async (id) => {
              await excluirItem(id);
            }}
            onToggleItem={async (id) => {
              await toggleItem(id);
            }}
          />
        </div>
      )}
    </div>
  );
}
