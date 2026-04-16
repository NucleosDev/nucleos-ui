// components/blocos/ColecoesBlocoCard.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreVertical, Pencil, Trash2, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ColecaoCard } from "@/components/colecoes/ColecaoCard";
import { CriarColecaoModal } from "@/components/colecoes/CriarColecaoModal";
import { useColecoes } from "@/hooks/useColecoes";
import { toast } from "@/hooks/use-toast";
import type { Bloco, Colecao } from "@/types";

interface ColecoesBlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete: (blocoId: string) => void;
  onEdit: (blocoId: string) => void;
  isDeleting?: boolean;
}

export function ColecoesBlocoCard({
  bloco,
  nucleoId,
  onDelete,
  onEdit,
  isDeleting,
}: ColecoesBlocoCardProps) {
  const router = useRouter();
  const {
    listColecoesByBloco,
    createColecao,
    updateColecao,
    deleteColecao,
    loading,
  } = useColecoes();

  const [colecoes, setColecoes] = useState<Colecao[]>([]);
  const [modalCriarAberta, setModalCriarAberta] = useState(false);
  const [colecaoEditando, setColecaoEditando] = useState<Colecao | null>(null);

  const carregarColecoes = useCallback(async () => {
    const resultado = await listColecoesByBloco(bloco.id);
    if (resultado) setColecoes(resultado);
  }, [bloco.id, listColecoesByBloco]);

  useEffect(() => {
    carregarColecoes();
  }, [carregarColecoes]);

  const handleCriarColecao = async (nome: string) => {
    const novaColecao = await createColecao(bloco.id, nome);
    if (novaColecao) {
      toast({ title: "Coleção criada com sucesso!" });
      await carregarColecoes();
      setModalCriarAberta(false);
    } else {
      toast({ title: "Erro ao criar coleção", variant: "destructive" });
    }
  };

  const handleEditarColecao = async (colecao: Colecao, novoNome: string) => {
    const atualizada = await updateColecao(colecao.id, { nome: novoNome });
    if (atualizada) {
      toast({ title: "Coleção atualizada" });
      await carregarColecoes();
      setColecaoEditando(null);
    } else {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  const handleExcluirColecao = async (colecaoId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta coleção?")) return;
    const sucesso = await deleteColecao(colecaoId);
    if (sucesso !== undefined) {
      toast({ title: "Coleção excluída" });
      await carregarColecoes();
    } else {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const handleSelectColecao = (colecao: Colecao) => {
    router.push(
      `/dashboard/nucleos/${nucleoId}/blocos/${bloco.id}/colecoes/${colecao.id}`,
    );
  };

  return (
    <>
      <Card className="group relative hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">{bloco.nome}</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(bloco.id)}>
                  <Pencil className="mr-2 h-4 w-4" /> Editar bloco
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(bloco.id)}
                  className="text-destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Excluir bloco
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setModalCriarAberta(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Nova coleção
          </Button>

          {loading && colecoes.length === 0 ? (
            <div className="space-y-2">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : colecoes.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              Nenhuma coleção ainda. Clique em "Nova coleção" para começar.
            </div>
          ) : (
            <div className="space-y-3">
              {colecoes.map((colecao) => (
                <ColecaoCard
                  key={colecao.id}
                  colecao={colecao}
                  nucleoId={nucleoId}
                  blocoId={bloco.id}
                  onEdit={(c) => setColecaoEditando(c)}
                  onDelete={handleExcluirColecao}
                  onSelect={handleSelectColecao}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CriarColecaoModal
        open={modalCriarAberta}
        onClose={() => setModalCriarAberta(false)}
        onConfirm={handleCriarColecao}
      />

      {colecaoEditando && (
        <CriarColecaoModal
          open={!!colecaoEditando}
          onClose={() => setColecaoEditando(null)}
          onConfirm={(novoNome) =>
            handleEditarColecao(colecaoEditando, novoNome)
          }
          initialNome={colecaoEditando.nome}
          titulo="Editar coleção"
        />
      )}
    </>
  );
}
