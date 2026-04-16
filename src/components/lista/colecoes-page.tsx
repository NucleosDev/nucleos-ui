"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useColecoes } from "@/hooks/useColecoes";
import { useState } from "react";

interface ColecoesPageProps {
  nucleoId: string;
}

export function ColecoesPage({ nucleoId }: ColecoesPageProps) {
  const router = useRouter();
  const [criando, setCriando] = useState(false);

  const { colecoes, isLoading, criarColecao } = useColecoes(nucleoId);

  if (isLoading) {
    return <div>Carregando coleções...</div>;
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/nucleos/${nucleoId}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">Coleções</h1>
          <p className="text-muted-foreground">
            {colecoes.length} coleções
          </p>
        </div>

        <Button onClick={() => setCriando(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova coleção
        </Button>
      </div>

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {colecoes.map((colecao) => (
          <div
            key={colecao.id}
            className="border rounded-lg p-4 cursor-pointer hover:bg-muted transition"
            onClick={() =>
              router.push(`/dashboard/nucleos/${nucleoId}/colecoes/${colecao.id}`)
            }
          >
            <h2 className="font-semibold">{colecao.nome}</h2>
            <p className="text-sm text-muted-foreground">
              {colecao.itens?.length || 0} itens
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}