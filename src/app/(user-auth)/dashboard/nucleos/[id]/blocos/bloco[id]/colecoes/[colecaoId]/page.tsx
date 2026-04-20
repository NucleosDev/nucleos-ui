"use client";

import { useParams, useRouter } from "next/navigation";
import { useColecao, useCampos, useItensColecao } from "@/hooks/useColecoes";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Eye } from "lucide-react";
import { notFound } from "next/navigation";
import { useState } from "react";
import { GerenciarCamposModal } from "@/components/colecoes/GerenciarCamposModal";
import { AdicionarItemColecaoModal } from "@/components/colecoes/AdicionarItemColecaoModal";
import { VisualizarItensModal } from "@/components/colecoes/VisualizarItensModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function ColecaoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const colecaoId = params.colecaoId as string;

  const { data: colecao, isLoading, error } = useColecao(colecaoId);
  const { campos } = useCampos(colecaoId);
  const { itens } = useItensColecao(colecaoId);

  const [gerenciarCamposOpen, setGerenciarCamposOpen] = useState(false);
  const [adicionarItemOpen, setAdicionarItemOpen] = useState(false);
  const [visualizarItensOpen, setVisualizarItensOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container py-6">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-10 w-full max-w-md mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !colecao) notFound();

  return (
    <div className="container py-6 space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{colecao.nome}</h1>
          <p className="text-muted-foreground">
            {campos.length} campo{campos.length !== 1 ? "s" : ""} ·{" "}
            {itens.length} item{itens.length !== 1 ? "ns" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setGerenciarCamposOpen(true)}
          >
            Gerenciar campos
          </Button>
          <Button onClick={() => setAdicionarItemOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar item
          </Button>
          <Button
            variant="secondary"
            onClick={() => setVisualizarItensOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" /> Ver itens
          </Button>
        </div>
      </div>

      <GerenciarCamposModal
        open={gerenciarCamposOpen}
        onClose={() => setGerenciarCamposOpen(false)}
        colecaoId={colecaoId}
        colecaoNome={colecao.nome}
      />
      <AdicionarItemColecaoModal
        open={adicionarItemOpen}
        onClose={() => setAdicionarItemOpen(false)}
        colecaoId={colecaoId}
        campos={campos}
      />
      <VisualizarItensModal
        open={visualizarItensOpen}
        onClose={() => setVisualizarItensOpen(false)}
        colecaoId={colecaoId}
        campos={campos}
      />
    </div>
  );
}
