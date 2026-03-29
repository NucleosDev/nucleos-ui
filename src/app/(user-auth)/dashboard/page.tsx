"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/layout-auth/dashboard-header";
import {
  SummaryCards,
  type SummaryData,
} from "@/components/layout-auth/summary-cards";
import { NucleoGrid } from "@/components/layout-auth/nucleo-grid";
import {
  AISuggestions,
  type Suggestion,
} from "@/components/layout-auth/ai-suggestions";
import type { NucleoData } from "@/components/layout-auth/nucleo-card";

// ---------------------------------------------------------------------------
// Dados de demonstração (substituir por chamadas reais de API)
// ---------------------------------------------------------------------------
const DEMO_SUMMARY: SummaryData = {
  activeNucleos: 4,
  tasksCompletedToday: 7,
  focusedTimeMinutes: 145,
  overallProgress: 62,
};

const DEMO_NUCLEOS: NucleoData[] = [
  {
    id: "1",
    name: "Saúde & Bem-estar",
    type: "Saúde",
    progress: 74,
    lastActivity: "Atualizado há 1 dia",
    color: "health",
  },
  {
    id: "2",
    name: "Estudos — TypeScript",
    type: "Estudos",
    progress: 48,
    lastActivity: "Atualizado há 2 horas",
    color: "study",
  },
  {
    id: "3",
    name: "Controle Financeiro",
    type: "Finanças",
    progress: 31,
    lastActivity: "Atualizado há 3 dias",
    color: "finance",
  },
  {
    id: "4",
    name: "Projeto Pessoal",
    type: "Criatividade",
    progress: 88,
    lastActivity: "Atualizado hoje",
    color: "default",
  },
  {
    id: "5",
    name: "Leitura Mensal",
    type: "Estudos",
    progress: 55,
    lastActivity: "Atualizado há 4 dias",
    color: "study",
  },
  {
    id: "6",
    name: "Rotina Matinal",
    type: "Saúde",
    progress: 90,
    lastActivity: "Atualizado hoje",
    color: "health",
  },
];

const DEMO_SUGGESTIONS: Suggestion[] = [
  {
    id: "1",
    text: "Você tem 2 núcleos sem atualização há mais de 3 dias. Que tal revisitar o Controle Financeiro?",
    action: "3",
  },
  {
    id: "2",
    text: "Sua Rotina Matinal está em 90% — você está quase lá! Foque nela para fechar a meta.",
    action: "6",
  },
  {
    id: "3",
    text: "Quer organizar suas prioridades para hoje? Posso sugerir quais núcleos focar.",
    action: null,
  },
];
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNucleos = DEMO_NUCLEOS.filter(
    (n) =>
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        userName="Maria Silva"
        userEmail="maria@nucleos.app"
        onNewNucleo={() => {}}
        onSearch={setSearchQuery}
      />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-20 md:px-6 lg:pt-24">
        {/* Saudação */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-foreground text-balance">
            Bom dia, Maria
          </h1>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Aqui está o resumo do seu progresso hoje.
          </p>
        </div>

        {/* Cards de resumo */}
        <div className="mb-10">
          <SummaryCards data={DEMO_SUMMARY} />
        </div>

        {/* Layout principal: Núcleos + IA */}
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Núcleos */}
          <NucleoGrid
            nucleos={filteredNucleos}
            isLoading={false}
            onOpenNucleo={(id) => {
              console.log("[v0] Abrir núcleo:", id);
            }}
            onCreateNucleo={() => {
              console.log("[v0] Criar novo núcleo");
            }}
          />

          {/* Sugestões da IA */}
          <aside className="flex flex-col gap-4">
            <AISuggestions
              suggestions={DEMO_SUGGESTIONS}
              isLoading={false}
              onSuggestionClick={(s) => {
                console.log("[v0] Sugestão clicada:", s);
              }}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
