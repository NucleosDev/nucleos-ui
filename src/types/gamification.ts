export interface UserLevel {
  nivel: number;
  xpAtual: number;
  xpProximoNivel: number;
  titulo: string;
}

export interface Streak {
  tipo: string;
  atual: number;
  maximo: number;
  ativo: boolean;
}

export interface Conquista {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  categoria: "habito" | "tarefa" | "nucleo" | "especial";
  desbloqueada: boolean;
  progresso?: number;
  meta?: number;
  dataDesbloqueio?: Date;
}

export interface GamificationStats {
  level: UserLevel;
  streaks: Streak[];
  conquistas: Conquista[];
}

export interface XPTransaction {
  id: string;
  amount: number;
  source: "tarefa" | "habito" | "nucleo" | "streak" | "conquista";
  description: string;
  createdAt: Date;
}
