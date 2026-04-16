"use client";

import { useParams, useRouter } from "next/navigation";
import { useBloco } from "@/hooks/useBlocos";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListaPage } from "@/components/lista/lista-page";

export default function BlocoDetalhesPage() {
  const params = useParams();
  const router = useRouter();

  const nucleoId = params?.nucleoId as string;
  const blocoId = params?.blocoId as string;

  const { data: bloco, isLoading, error } = useBloco(
    blocoId,
    nucleoId
  );

  // 🔒 Segurança extra
  if (!blocoId) return null;

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

  // 🧠 Mapa de componentes (escala melhor que switch)
  const blocoComponents = {
    lista: ListaPage,
  } as const;

  const Component =
    blocoComponents[bloco.tipo as keyof typeof blocoComponents];

  return (
    <div className="container py-8">
      {/* ✅ Voltar sempre visível */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      {/* ✅ Render dinâmico */}
      {Component ? (
        <Component bloco={bloco} nucleoId={nucleoId} />
      ) : (
        <PlaceholderPage tipo={bloco.tipo} />
      )}
    </div>
  );
}

function PlaceholderPage({ tipo }: { tipo: string }) {
  return (
    <div className="rounded-lg border border-dashed p-12 text-center">
      <p className="text-muted-foreground">
        Página para <strong>{tipo}</strong> em desenvolvimento.
      </p>
    </div>
  );
}