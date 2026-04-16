"use client";

import { useListas } from "@/hooks/useListas";
// import { useTarefas } from "@/hooks/useTarefas";
import { BlocoCard } from "./bloco-card";
import { ListaCard } from "@/components/lista/lista-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Bloco } from "@/types/bloco";

interface BlocoCardContainerProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete: () => void;
  onEdit: () => void;
  isDeleting?: boolean;
}

export function BlocoCardContainer({
  bloco,
  nucleoId,
  onDelete,
  onEdit,
  isDeleting,
}: BlocoCardContainerProps) {
  // Buscar listas apenas se o bloco for do tipo "lista"
  const { listas, isLoading: loadingListas } = useListas(
    bloco.tipo === "lista" ? bloco.id : undefined,
  );

  // Futuro: tarefas, hábitos, etc.
  // const { tarefasPorBloco, isLoadingPorBloco: loadingTarefas } = useTarefas(
  //   bloco.tipo === "tarefas" ? bloco.id : undefined
  // );

  // Mostrar esqueleto enquanto carrega dados específicos
  if (bloco.tipo === "lista" && loadingListas) {
    return <Skeleton className="h-36 rounded-xl" />;
  }

  // Roteamento por tipo
  switch (bloco.tipo) {
    case "lista":
      if (listas && listas.length > 0) {
        return (
          <ListaCard
            lista={listas[0]}
            nucleoId={nucleoId}
            blocoId={bloco.id}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      }
      // Se ainda não tem lista (pode acontecer se a criação assíncrona ainda não completou),
      // podemos mostrar um card genérico ou um placeholder. Por enquanto, mostra o genérico.
      break;

    case "tarefas":
      // Placeholder para TarefaCard
      break;

    default:
      break;
  }

  // Fallback para card genérico
  return (
    <BlocoCard
      bloco={bloco}
      nucleoId={nucleoId}
      onDelete={onDelete}
      onEdit={onEdit}
      isDeleting={isDeleting}
    />
  );
}
