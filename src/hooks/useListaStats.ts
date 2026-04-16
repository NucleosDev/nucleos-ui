// src/hooks/useListaStats.ts
import { useMemo } from "react";
import type { Lista } from "@/types/lista";

export function useListaStats(lista?: Lista) {
  const itens = lista?.itens ?? [];

  const totalItens = itens.length;

  const itensConcluidos = useMemo(() => {
    return itens.filter((i) => i.concluido).length;
  }, [itens]);

  const progresso = useMemo(() => {
    if (totalItens === 0) return 0;
    return (itensConcluidos / totalItens) * 100;
  }, [itensConcluidos, totalItens]);

  return {
    itens,
    totalItens,
    itensConcluidos,
    progresso,
  };
}