// components/blocos/cruds/ListasBlocoCard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, MoreVertical, Pencil, Trash2, ListChecks } from "lucide-react";
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
import { ListaCard } from "@/components/lista/lista-card";
import { CriarListaModal } from "@/components/lista/CriarListaModal";
import { useListas } from "@/hooks/useListas";
import { toast } from "@/hooks/use-toast";
import type { Bloco } from "@/types/bloco";
import type { Lista } from "@/types/lista";

interface ListasBlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete: (blocoId: string) => void;
  onEdit: (blocoId: string) => void;
  isDeleting?: boolean;
}

export function ListasBlocoCard({
  bloco,
  nucleoId,
  onDelete,
  onEdit,
  isDeleting,
}: ListasBlocoCardProps) {
  const router = useRouter();
  const {
    listas,
    isLoading,
    criar,
    atualizar,
    excluir,
    isCreating,
    isDeleting: isDeletingLista,
  } = useListas(bloco.id);

  const [modalCriarAberta, setModalCriarAberta] = useState(false);
  const [listaEditando, setListaEditando] = useState<Lista | null>(null);

  const handleCriarLista = async (nome: string, tipoLista: string) => {
    try {
      await criar({
        blocoId: bloco.id,
        nome,
        tipoLista: tipoLista as any,
      });
      toast({ title: "Lista criada com sucesso!" });
      setModalCriarAberta(false);
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao criar lista", variant: "destructive" });
    }
  };

  const handleEditarLista = async (
    lista: Lista,
    novoNome: string,
    novoTipo?: string,
  ) => {
    try {
      await atualizar({
        id: lista.id,
        payload: { nome: novoNome, tipoLista: novoTipo as any },
      });
      toast({ title: "Lista atualizada" });
      setListaEditando(null);
    } catch (error) {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  const handleExcluirLista = async (listaId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta lista?")) return;
    try {
      await excluir(listaId);
      toast({ title: "Lista excluída" });
    } catch (error) {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  const handleSelectLista = (lista: Lista) => {
    router.push(
      `/dashboard/nucleos/${nucleoId}/blocos/${bloco.id}/listas/${lista.id}`,
    );
  };

  return (
    <>
      <Card className="group relative hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">
                {bloco.titulo || "Listas"}
              </CardTitle>
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
            disabled={isCreating}
          >
            <Plus className="mr-2 h-4 w-4" /> Nova lista
          </Button>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : listas.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              Nenhuma lista ainda. Clique em "Nova lista" para começar.
            </div>
          ) : (
            <div className="space-y-3">
              {listas.map((lista) => (
                <ListaCard
                  key={lista.id}
                  lista={lista}
                  nucleoId={nucleoId}
                  blocoId={bloco.id}
                  onEdit={() => setListaEditando(lista)}
                  onDelete={() => handleExcluirLista(lista.id)}
                  onDuplicate={() => {
                    /* implementar duplicação */
                  }}
                  onShare={() => {
                    /* implementar compartilhamento */
                  }}
                  onArchive={() => {
                    /* implementar arquivamento */
                  }}
                  compact={false}
                  showProgressDetails
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CriarListaModal
        open={modalCriarAberta}
        onClose={() => setModalCriarAberta(false)}
        onConfirm={handleCriarLista}
      />

      {listaEditando && (
        <CriarListaModal
          open={!!listaEditando}
          onClose={() => setListaEditando(null)}
          onConfirm={(nome, tipo) =>
            handleEditarLista(listaEditando, nome, tipo)
          }
          initialNome={listaEditando.nome}
          initialTipo={listaEditando.tipoLista}
          titulo="Editar lista"
        />
      )}
    </>
  );
}
