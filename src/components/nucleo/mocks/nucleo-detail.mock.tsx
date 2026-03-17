"use client";

import { NucleoDetailPage } from "../ui/nucleo-main";
import { mockNucleos } from "./nucleo-card.mock";
import { getBlocosPorNucleo } from "./blocos.mock";

export function NucleoDetailMock() {
  const nucleoSelecionado = mockNucleos[0]; // Pega o primeiro Nucleo (Estudos de React)
  const blocosDoNucleo = getBlocosPorNucleo(nucleoSelecionado.id);

  return (
    <NucleoDetailPage
      nucleo={nucleoSelecionado}
      blocos={blocosDoNucleo}
      xpTotal={nucleoSelecionado.xpTotal}
      nivel={nucleoSelecionado.level}
      nextLevelXp={nucleoSelecionado.nextLevelXp}
      onAddBloco={(tipo) => console.log("➕ Adicionar bloco:", tipo)}
      onUpdateBloco={(id, dados) =>
        console.log("✏️ Atualizar bloco:", id, dados)
      }
      onDeleteBloco={(id) => console.log("🗑️ Deletar bloco:", id)}
      onReorderBlocos={(blocos) => console.log("🔄 Reordenar blocos:", blocos)}
    />
  );
}
