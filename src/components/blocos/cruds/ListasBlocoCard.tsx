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
import { ListaCard } from "@/components/lista/ListaCard";
import { CriarListaModal } from "@/components/lista/CriarListaModal";
import { useListas } from "@/hooks/useListas";
import { toast } from "@/hooks/use-toast";
import type { Bloco } from "@/types/bloco";
import type { Lista, TipoLista } from "@/types/lista";

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

  // Agora recebe o metadata (orçamento, local de compra)
  const handleCriarLista = async (
    nome: string,
    tipoLista: string,
    metadata?: Record<string, any>,
  ) => {
    try {
      // Se a API ainda não aceita metadata, você pode armazenar em localStorage
      // ou simplesmente ignorar. Vamos enviar se a API suportar (você pode estender o payload).
      const payload: any = {
        blocoId: bloco.id,
        nome,
        tipoLista: tipoLista as any,
      };
      if (metadata) {
        // Exemplo: payload.metadata = metadata;
        console.log("Metadados da lista:", metadata);
        // Futuramente: enviar para o backend
      }
      await criar(payload);
      toast({ title: "Lista criada com sucesso!" });
      setModalCriarAberta(false);
    } catch (error: any) {
      console.error("Erro ao criar lista:", error);
      toast({
        title: "Erro ao criar lista",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const handleEditarLista = async (
    lista: Lista,
    novoNome: string,
    novoTipo?: string,
    metadata?: Record<string, any>,
  ) => {
    try {
      await atualizar({
        id: lista.id,
        payload: { nome: novoNome, tipoLista: novoTipo as any },
      });
      toast({ title: "Lista atualizada" });
      setListaEditando(null);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const handleExcluirLista = async (listaId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta lista?")) return;
    try {
      await excluir(listaId);
      toast({ title: "Lista excluída" });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error?.message,
        variant: "destructive",
      });
    }
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
        isSubmitting={isCreating}
      />

      {listaEditando && (
        <CriarListaModal
          open={!!listaEditando}
          onClose={() => setListaEditando(null)}
          onConfirm={(nome, tipo, metadata) =>
            handleEditarLista(listaEditando, nome, tipo, metadata)
          }
          initialNome={listaEditando.nome}
          initialTipo={listaEditando.tipoLista}
          titulo="Editar lista"
          isSubmitting={false} // pode usar isUpdating se quiser
        />
      )}
    </>
  );
}
