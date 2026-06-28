// utils/nucleo-adapter.ts

import type { NucleoComStats, Nucleo } from "@/types/nucleo";

export function adaptNucleoToComStats(nucleo: Nucleo): NucleoComStats {
  return {
    ...nucleo,
    xpTotal: 0,
    level: 1,
    nextLevelXp: 1000,
    currentXp: 0,
    conquistas: 0,
    xpHoje: 0,
    // 🔧 Converte blocos: undefined → null
    blocos:
      nucleo.blocos?.map((bloco) => ({
        ...bloco,
        titulo: bloco.titulo ?? null, // undefined vira null
      })) ?? [],
  };
}
