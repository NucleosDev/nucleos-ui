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
import { GerenciarCamposModal } from "@/components/colecoes/GerenciarCamposModal"; // 👈 novo
import { useColecoes } from "@/hooks/useColecoes";
import { toast } from "@/hooks/use-toast";
import type { Bloco } from "@/types/bloco";
import type { Colecao } from "@/types/colecao";

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
  const [gerenciandoCamposColecao, setGerenciandoCamposColecao] =
    useState<Colecao | null>(null); // 👈 novo estado

  const carregarColecoes = useCallback(async () => {
    const resultado = await listColecoesByBloco(bloco.id);
    if (resultado) setColecoes(resultado);
  }, [bloco.id, listColecoesByBloco]);

  useEffect(() => {
    carregarColecoes();
  }, [carregarColecoes]);

  const handleCriarColecao = async (nome: string) => {
    const nova = await createColecao(bloco.id, nome);
    if (nova) {
      toast({ title: "Coleção criada!" });
      await carregarColecoes();
      setModalCriarAberta(false);
    } else {
      toast({ title: "Erro ao criar", variant: "destructive" });
    }
  };

  const handleEditarColecao = async (colecao: Colecao, novoNome: string) => {
    const atualizada = await updateColecao(colecao.id, novoNome);
    if (atualizada) {
      toast({ title: "Coleção atualizada" });
      await carregarColecoes();
      setColecaoEditando(null);
    } else {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  const handleExcluirColecao = async (colecaoId: string) => {
    if (!confirm("Tem certeza?")) return;
    const result = await deleteColecao(colecaoId);
    if (result) {
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

  const handleGerenciarCampos = (colecao: Colecao) => {
    setGerenciandoCamposColecao(colecao);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">{bloco.tipo}</CardTitle>
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
                  onGerenciarCampos={handleGerenciarCampos} // 👈 nova prop
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de criação de coleção */}
      <CriarColecaoModal
        open={modalCriarAberta}
        onClose={() => setModalCriarAberta(false)}
        onConfirm={handleCriarColecao}
      />

      {/* Modal de edição de nome da coleção */}
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

      {/* Modal de gerenciamento de campos */}
      {gerenciandoCamposColecao && (
        <GerenciarCamposModal
          open={!!gerenciandoCamposColecao}
          onClose={() => setGerenciandoCamposColecao(null)}
          colecaoId={gerenciandoCamposColecao.id}
          colecaoNome={gerenciandoCamposColecao.nome || "Coleção"}
        />
      )}
    </>
  );
}
