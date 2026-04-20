"use client";

import { useParams, useRouter } from "next/navigation";
import { useBloco } from "@/hooks/useBlocos";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListaPage } from "@/components/lista/lista-page";
// import { ColecoesPage } from "@/components/lista/colecoes-page";

export default function BlocoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const nucleoId = params.nucleoId as string;
  const blocoId = params.blocoId as string;

  //  Passando nucleoId como segundo argumento
  const { data: bloco, isLoading, error } = useBloco(blocoId, nucleoId);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !bloco) {
    return (
      <div className="container py-8 text-center">
        <p className="text-muted-foreground">Bloco não encontrado.</p>
        <Button variant="link" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  switch (bloco.tipo) {
    case "lista":
      return <ListaPage bloco={bloco} nucleoId={nucleoId} />;
    case "tarefas":
      return <PlaceholderPage tipo="Tarefas" />;
    case "calendario":
      return <PlaceholderPage tipo="Calendário" />;
    default:
      return <PlaceholderPage tipo={bloco.tipo} />;
  }
}

function PlaceholderPage({ tipo }: { tipo: string }) {
  const router = useRouter();
  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">
          Página para <strong>{tipo}</strong> em desenvolvimento.
        </p>
      </div>
    </div>
  );
}
