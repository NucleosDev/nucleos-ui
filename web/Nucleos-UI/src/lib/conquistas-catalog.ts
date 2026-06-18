// Catálogo estático de conquistas. Condições são verificadas em runtime
// contra os dados reais do usuário.

export interface ConquistaDef {
  id: string;
  nome: string;
  descricao: string;
  tipo: "creation" | "progress" | "streak" | "level";
  xp_recompensa: number;
  condicao: (dados: CondicoesUsuario) => boolean;
}

export interface CondicoesUsuario {
  totalNucleos: number;
  totalTarefasConcluidas: number;
  totalHabitos: number;
  streakMaximo: number;
  streakAtual: number;
  nivel: number;
  totalXp: number;
  totalBlocos: number;
}

export const CONQUISTAS_CATALOG: ConquistaDef[] = [
  // ── Criação ─────────────────────────────────────────────────────────────────
  {
    id: "first-nucleo",
    nome: "Fundador",
    descricao: "Crie seu primeiro Núcleo",
    tipo: "creation",
    xp_recompensa: 100,
    condicao: (d) => d.totalNucleos >= 1,
  },
  {
    id: "three-nucleos",
    nome: "Explorador",
    descricao: "Crie 3 Núcleos diferentes",
    tipo: "creation",
    xp_recompensa: 200,
    condicao: (d) => d.totalNucleos >= 3,
  },
  {
    id: "five-nucleos",
    nome: "Construtor",
    descricao: "Crie 5 Núcleos",
    tipo: "creation",
    xp_recompensa: 350,
    condicao: (d) => d.totalNucleos >= 5,
  },
  {
    id: "ten-nucleos",
    nome: "Arquiteto",
    descricao: "Crie 10 Núcleos",
    tipo: "creation",
    xp_recompensa: 750,
    condicao: (d) => d.totalNucleos >= 10,
  },
  {
    id: "first-bloco",
    nome: "Organizador",
    descricao: "Adicione seu primeiro bloco a um Núcleo",
    tipo: "creation",
    xp_recompensa: 50,
    condicao: (d) => d.totalBlocos >= 1,
  },
  {
    id: "ten-blocos",
    nome: "Construtor de Fluxos",
    descricao: "Crie 10 blocos no total",
    tipo: "creation",
    xp_recompensa: 150,
    condicao: (d) => d.totalBlocos >= 10,
  },
  // ── Progresso (tarefas) ──────────────────────────────────────────────────────
  {
    id: "first-task",
    nome: "Primeiro Passo",
    descricao: "Conclua sua primeira tarefa",
    tipo: "progress",
    xp_recompensa: 50,
    condicao: (d) => d.totalTarefasConcluidas >= 1,
  },
  {
    id: "ten-tasks",
    nome: "Produtivo",
    descricao: "Conclua 10 tarefas",
    tipo: "progress",
    xp_recompensa: 200,
    condicao: (d) => d.totalTarefasConcluidas >= 10,
  },
  {
    id: "fifty-tasks",
    nome: "Executor",
    descricao: "Conclua 50 tarefas",
    tipo: "progress",
    xp_recompensa: 500,
    condicao: (d) => d.totalTarefasConcluidas >= 50,
  },
  {
    id: "hundred-tasks",
    nome: "Mestre das Tarefas",
    descricao: "Conclua 100 tarefas",
    tipo: "progress",
    xp_recompensa: 1000,
    condicao: (d) => d.totalTarefasConcluidas >= 100,
  },
  // ── Hábitos ──────────────────────────────────────────────────────────────────
  {
    id: "first-habito",
    nome: "Primeiro Hábito",
    descricao: "Crie seu primeiro hábito",
    tipo: "streak",
    xp_recompensa: 50,
    condicao: (d) => d.totalHabitos >= 1,
  },
  {
    id: "five-habitos",
    nome: "Rotineiro",
    descricao: "Crie 5 hábitos",
    tipo: "streak",
    xp_recompensa: 150,
    condicao: (d) => d.totalHabitos >= 5,
  },
  {
    id: "streak-3",
    nome: "Consistente",
    descricao: "Mantenha um streak de 3 dias em algum hábito",
    tipo: "streak",
    xp_recompensa: 100,
    condicao: (d) => d.streakMaximo >= 3,
  },
  {
    id: "streak-7",
    nome: "Uma Semana Forte",
    descricao: "Mantenha um streak de 7 dias",
    tipo: "streak",
    xp_recompensa: 250,
    condicao: (d) => d.streakMaximo >= 7,
  },
  {
    id: "streak-30",
    nome: "Mês Perfeito",
    descricao: "Mantenha um streak de 30 dias",
    tipo: "streak",
    xp_recompensa: 1000,
    condicao: (d) => d.streakMaximo >= 30,
  },
  {
    id: "streak-100",
    nome: "Centenário",
    descricao: "Mantenha um streak de 100 dias",
    tipo: "streak",
    xp_recompensa: 5000,
    condicao: (d) => d.streakMaximo >= 100,
  },
  // ── Nível / XP ───────────────────────────────────────────────────────────────
  {
    id: "level-5",
    nome: "Iniciante",
    descricao: "Alcance o nível 5",
    tipo: "level",
    xp_recompensa: 300,
    condicao: (d) => d.nivel >= 5,
  },
  {
    id: "level-10",
    nome: "Aprendiz",
    descricao: "Alcance o nível 10",
    tipo: "level",
    xp_recompensa: 500,
    condicao: (d) => d.nivel >= 10,
  },
  {
    id: "level-20",
    nome: "Avançado",
    descricao: "Alcance o nível 20",
    tipo: "level",
    xp_recompensa: 1000,
    condicao: (d) => d.nivel >= 20,
  },
  {
    id: "xp-1000",
    nome: "Primeiro Milhar",
    descricao: "Acumule 1.000 XP",
    tipo: "level",
    xp_recompensa: 200,
    condicao: (d) => d.totalXp >= 1000,
  },
  {
    id: "xp-10000",
    nome: "Dez Mil",
    descricao: "Acumule 10.000 XP",
    tipo: "level",
    xp_recompensa: 1000,
    condicao: (d) => d.totalXp >= 10000,
  },
];

// Avalia o catálogo contra os dados do usuário e retorna conquistas com status
export function avaliarConquistas(dados: CondicoesUsuario) {
  return CONQUISTAS_CATALOG.map((c) => ({
    id: c.id,
    nome: c.nome,
    descricao: c.descricao,
    tipo: c.tipo,
    xp_recompensa: c.xp_recompensa,
    unlocked: c.condicao(dados),
    unlockedAt: c.condicao(dados) ? new Date().toISOString() : null,
  }));
}
