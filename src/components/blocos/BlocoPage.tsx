"use client";

import { useParams, useRouter } from "next/navigation";
import { useBloco } from "@/hooks/useBlocos";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlocoCard } from "@/components/blocos/BlocoCard";
import { ListaPage } from "@/components/lista/lista-page";
import { TarefasBlocoCard } from "@/components/blocos/cruds/TarefasBlocoCard";
import { ColecoesBlocoCard } from "@/components/blocos/cruds/ColecoesBlocoCard";
import { CalendarioBlocoCard } from "@/components/blocos/cruds/CalendarioBlocoCard";
import { TimersBlocoCard } from "@/components/blocos/cruds/TimersBlocoCard";
import { HabitosBlocoCard } from "@/components/blocos/cruds/HabitosBlocoCard";

export default function BlocoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const nucleoId = params.nucleoId as string;
  const blocoId = params.blocoId as string;

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

  // Cabeçalho comum
  const header = (
    <div className="mb-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <BlocoCard
        bloco={bloco}
        nucleoId={nucleoId}
        compact={false}
        onEdit={() => console.log("Editar bloco", bloco.id)}
        onDelete={() => console.log("Excluir bloco", bloco.id)}
      />
    </div>
  );

  // Conteúdo específico por tipo
  const renderConteudo = () => {
    switch (bloco.tipo) {
      case "lista":
        return <ListaPage bloco={bloco} nucleoId={nucleoId} />;
      case "tarefas":
        return (
          <div className="mt-6">
            <TarefasBlocoCard
              bloco={bloco}
              nucleoId={nucleoId}
              onDelete={() => {}}
              onEdit={() => {}}
            />
          </div>
        );
      case "colecoes":
        return (
          <div className="mt-6">
            <ColecoesBlocoCard
              bloco={bloco}
              nucleoId={nucleoId}
              onDelete={() => {}}
              onEdit={() => {}}
            />
          </div>
        );
      case "calendario":
        return (
          <div className="mt-6">
            <CalendarioBlocoCard
              bloco={bloco}
              nucleoId={nucleoId}
              onDelete={() => {}}
              onEdit={() => {}}
            />
          </div>
        );
      case "timer":
      case "timers":
        return (
          <div className="mt-6">
            <TimersBlocoCard
              bloco={bloco}
              nucleoId={nucleoId}
              onDelete={() => {}}
              onEdit={() => {}}
            />
          </div>
        );
      case "habitos":
        return (
          <div className="mt-6">
            <HabitosBlocoCard
              bloco={bloco}
              nucleoId={nucleoId}
              onDelete={() => {}}
              onEdit={() => {}}
            />
          </div>
        );
      default:
        return (
          <div className="mt-6 rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground">
              Conteúdo para <strong>{bloco.tipo}</strong> em desenvolvimento.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="container py-8 max-w-5xl">
      {header}
      {renderConteudo()}
    </div>
  );
}
