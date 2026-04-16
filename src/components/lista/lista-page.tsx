// components/listas/lista-page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLista } from "@/hooks/useListas";
import { useItensLista } from "@/hooks/useItensLista";
import { ListaItem } from "./lista-item";
import { AdicionarItemModal } from "./adicionar-item-modal";
import { useState } from "react";
import type { Bloco } from "@/types/bloco";

interface ListaPageProps {
  bloco: Bloco;
  nucleoId: string;
}

export function ListaPage({ bloco, nucleoId }: ListaPageProps) {
  const router = useRouter();
  const [modalAberto, setModalAberto] = useState(false);

  // Assumindo que o bloco de lista tem apenas uma lista associada (ou a primeira)
  // Se o bloco pode ter múltiplas listas, você precisará listar as listas primeiro.
  // Para simplificar, vamos supor que a lista está acessível via bloco.listas[0]
  const listaId = bloco.listas?.[0]?.id;

  const { data: lista, isLoading } = useLista(listaId!);
  const { itens, criarItem, toggleItem, excluirItem } = useItensLista(listaId!);

  if (isLoading || !lista) {
    return <div>Carregando lista...</div>;
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{lista.nome}</h1>
          <p className="text-muted-foreground">
            {bloco.titulo || "Lista"} · {itens.length} itens
          </p>
        </div>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
        <Button onClick={() => setModalAberto(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar item
        </Button>
      </div>

      {/* Lista de itens */}
      <div className="space-y-2">
        {itens.map((item) => (
          <ListaItem
            key={item.id}
            item={item}
            onToggle={() => toggleItem(item.id)}
            onDelete={() => excluirItem(item.id)}
          />
        ))}
      </div>

      <AdicionarItemModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        listaId={lista.id}
        onItemCreated={criarItem}
      />
    </div>
  );
}
