// components/colecoes/ColecaoList.tsx
"use client";

import { useState, useEffect } from "react";
import { useColecoes } from "@/hooks/useColecoes";
import { ColecaoCard } from "./ColecaoCard";
import { ColecaoForm } from "./ColecaoForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Colecao } from "@/types/colecao";

interface ColecaoListProps {
  nucleoId: string; // necessário para o link do card
  blocoId: string;
  onSelectColecao?: (colecao: Colecao) => void;
}

export function ColecaoList({
  nucleoId,
  blocoId,
  onSelectColecao,
}: ColecaoListProps) {
  const {
    loading,
    error,
    listColecoesByBloco,
    createColecao,
    updateColecao,
    deleteColecao,
  } = useColecoes();

  const [colecoes, setColecoes] = useState<Colecao[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingColecao, setEditingColecao] = useState<Colecao | null>(null);

  const loadColecoes = async () => {
    const data = await listColecoesByBloco(blocoId);
    if (data) setColecoes(data);
  };

  useEffect(() => {
    loadColecoes();
  }, [blocoId]);

  const handleCreate = async (nome: string) => {
    const nova = await createColecao(blocoId, nome);
    if (nova) {
      setColecoes((prev) => [...prev, nova]);
    }
  };

  const handleUpdate = async (nome: string) => {
    if (!editingColecao) return;
    const atualizada = await updateColecao(editingColecao.id, nome);
    if (atualizada) {
      setColecoes((prev) =>
        prev.map((c) => (c.id === atualizada.id ? atualizada : c)),
      );
    }
    setEditingColecao(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta coleção?")) return;
    await deleteColecao(id);
    setColecoes((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEdit = (colecao: Colecao) => {
    setEditingColecao(colecao);
    setFormOpen(true);
  };

  if (loading && colecoes.length === 0) {
    return <div className="p-4 text-center">Carregando coleções...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Coleções</h2>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Nova Coleção
        </Button>
      </div>

      {colecoes.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          Nenhuma coleção encontrada. Crie uma para começar.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colecoes.map((colecao) => (
            <ColecaoCard
              key={colecao.id}
              colecao={colecao}
              nucleoId={nucleoId}
              blocoId={blocoId}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelect={onSelectColecao}
            />
          ))}
        </div>
      )}

      <ColecaoForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingColecao(null);
        }}
        initialData={editingColecao || undefined}
        onSubmit={editingColecao ? handleUpdate : handleCreate}
        isLoading={loading}
      />
    </div>
  );
}
