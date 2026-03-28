"use client";

import { NucleoCard } from "../ui/nucleo-card";
import { NucleoGrid } from "../ui/nucleo-grid";
import type { NucleoWithStats } from "../types/nucleo-components.types";

// ===== DADOS MOCK DOS NucleoS =====
export const mockNucleos: NucleoWithStats[] = [
  // {
  //   id: "nucleo-1",
  //   userId: "user1",
  //   nome: "Estudos de React",
  //   descricao: "Aprendendo Next.js, Tailwind e TypeScript",
  //   tipo: "estudo",
  //   corDestaque: "#4D7CFF",
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  //   icon: {
  //     id: "icon1",
  //     name: "React",
  //     icon_url: "/placeholder-logo.png",
  //     createdAt: new Date().toISOString(),
  //   },
  //   xpTotal: 2450,
  //   xpHoje: 120,
  //   xpSemana: 850,
  //   level: 12,
  //   nextLevelXp: 3000,
  //   imagemCapa: "/placeholder.svg",
  //   energyTotal: 80,
  //   energyHoje: 15,
  //   conquistasDesbloqueadas: 2,
  // },
  {
    id: "nucleo-2",
    userId: "user1",
    nome: "Fitness Diário",
    descricao: "Academia, cardio e meditação",
    tipo: "hobby",
    corDestaque: "#00C9A7",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon: {
      id: "icon2",
      name: "Fitness",
      iconUrl: "/placeholder-logo.png",
      createdAt: new Date().toISOString(),
    },
    imagemCapa: "/placeholder.svg",
    xpTotal: 1200,
    xpHoje: 50,
    xpSemana: 350,
    level: 8,
    nextLevelXp: 2000,
    energyTotal: 60,
    energyHoje: 20,
    conquistasDesbloqueadas: 1,
  },
  {
    id: "nucleo-3",
    userId: "user1",
    nome: "Projeto Cliente X",
    descricao: "Landing page e dashboard",
    tipo: "profissional",
    corDestaque: "#FF4D4D",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon: {
      id: "icon1",
      name: "React",
      iconUrl: "/placeholder-logo.png",
      createdAt: new Date().toISOString(),
    },
    imagemCapa: "/placeholder.svg",
    xpTotal: 4500,
    xpHoje: 200,
    xpSemana: 1200,
    level: 15,
    nextLevelXp: 5000,
    energyTotal: 95,
    energyHoje: 30,
    conquistasDesbloqueadas: 3,
  },
  {
    id: "nucleo-4",
    userId: "user1",
    nome: "Finanças Pessoais",
    descricao: "Orçamento mensal e investimentos",
    tipo: "pessoal",
    corDestaque: "#FFB347",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon: {
      id: "icon1",
      name: "React",
      iconUrl: "/placeholder-logo.png",
      createdAt: new Date().toISOString(),
    },
    imagemCapa: "/placeholder.svg",
    xpTotal: 890,
    xpHoje: 30,
    xpSemana: 210,
    level: 5,
    nextLevelXp: 1500,
    energyTotal: 40,
    energyHoje: 10,
    conquistasDesbloqueadas: 0,
  },
];

// ===== COMPONENTE DE DEMONSTRAÇÃO DO CARD =====
export function NucleoCardMock() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Variações do Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Compact</p>
            <NucleoCard nucleo={mockNucleos[0]} variant="compact" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Default</p>
            <NucleoCard nucleo={mockNucleos[1]} variant="default" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Detailed</p>
            <NucleoCard nucleo={mockNucleos[2]} variant="detailed" />
          </div>
        </div>
      </div>
    </div>
  );
}
