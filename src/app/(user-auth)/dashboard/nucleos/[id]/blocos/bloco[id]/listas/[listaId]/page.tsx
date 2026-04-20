"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLista, useListas } from "@/hooks/useListas";
import { useBloco } from "@/hooks/useBlocos";
import { useNucleo } from "@/hooks/useNucleo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Pencil, Trash2 } from "lucide-react";
import { ListaCard } from "@/components/lista/ListaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";
import { CriarListaModal } from "@/components/lista/CriarListaModal";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ListaDetalhesPage() {
  const params = useParams();
  const router = useRouter();

  const nucleoId = params.nucleoId as string;
  const blocoId = params.blocoId as string;
  const listaId = params.listaId as string;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Buscar dados da lista
  const {
    data: lista,
    isLoading: loadingLista,
    error,
    refetch: recarregarLista,
  } = useLista(listaId);

  // Buscar bloco e núcleo para breadcrumbs e contexto
  const { data: bloco } = useBloco(blocoId);
  const { data: nucleo } = useNucleo(nucleoId);

  // Para mutations de atualização e exclusão
  const { atualizar, excluir, isUpdating, isDeleting } = useListas(blocoId);

  const handleUpdateLista = async (
    nome: string,
    tipoLista: string,
    metadata?: Record<string, any>,
  ) => {
    try {
      await atualizar({
        id: listaId,
        payload: { nome, tipoLista: tipoLista as any },
      });
      toast({ title: "Lista atualizada com sucesso!" });
      setEditModalOpen(false);
      recarregarLista(); // Atualiza os dados exibidos
    } catch (error: any) {
      console.error("Erro ao atualizar lista:", error);
      toast({
        title: "Erro ao atualizar lista",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteLista = async () => {
    try {
      await excluir(listaId);
      toast({ title: "Lista excluída com sucesso!" });
      // Redireciona de volta para a página do núcleo (ou do bloco)
      router.push(`/dashboard/nucleos/${nucleoId}`);
    } catch (error: any) {
      console.error("Erro ao excluir lista:", error);
      toast({
        title: "Erro ao excluir lista",
        description: error?.message,
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  if (loadingLista) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !lista) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Cabeçalho com navegação e breadcrumbs */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{nucleo?.nome || "Núcleo"}</span>
          <span>/</span>
          <span>{bloco?.titulo || "Bloco"}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{lista.nome}</span>
        </div>

        {/* Ações rápidas (editar/excluir) no cabeçalho */}
        <div className="flex items-center justify-between mt-4">
          <h1 className="text-2xl font-bold">{lista.nome}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditModalOpen(true)}
              disabled={isUpdating}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal: ListaCard sem redirecionamento */}
      <div onClick={(e) => e.stopPropagation()}>
        <ListaCard
          lista={lista}
          nucleoId={nucleoId}
          blocoId={blocoId}
          onEdit={() => setEditModalOpen(true)}
          onDelete={() => setDeleteDialogOpen(true)}
          showProgressDetails
          compact={false}
        />
      </div>

      {/* Modal de edição */}
      <CriarListaModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onConfirm={handleUpdateLista}
        initialNome={lista.nome}
        initialTipo={lista.tipoLista}
        titulo="Editar lista"
        isSubmitting={isUpdating}
      />

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir lista</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a lista "{lista.nome}"? Esta ação
              não pode ser desfeita e todos os itens serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLista}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
