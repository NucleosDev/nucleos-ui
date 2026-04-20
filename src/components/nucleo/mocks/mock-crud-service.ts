import { v4 as uuidv4 } from "uuid";
import { mockNucleos as nucleosIniciais } from "./nucleo-card.mock";
import { mockBlocos as blocosIniciais } from "./blocos.mock";

//  TIPOS
export interface MockUser {
  id: string;
  email: string;
  full_name: string;
  nickname?: string;
  avatar_url?: string;
  created_at: string;
}

export interface MockNucleo {
  id: string;
  user_id: string;
  icon_id?: string;
  nome: string;
  descricao?: string;
  tipo: "pessoal" | "profissional" | "projeto" | "estudo" | "hobby";
  corDestaque: string;
  imagem_capa?: string;
  created_at: string;
  updated_at: string;
}

export interface MockXpLog {
  id: string;
  user_id: string;
  nucleo_id?: string;
  xp_amount: number;
  source: string;
  created_at: string;
}

export interface MockEnergyLog {
  id: string;
  user_id: string;
  nucleo_id?: string;
  energy_amount: number;
  created_at: string;
}

export interface MockUserLevel {
  id: string;
  user_id: string;
  level: number;
  current_xp: number;
  next_level_xp: number;
  total_xp_earned: number;
  updated_at: string;
}

export interface MockAchievement {
  id: string;
  nucleo_id: string;
  achievement_type: string;
  current_value: number;
  target_value?: number;
  unlocked_at?: string;
  created_at: string;
}

export interface MockBloco {
  id: string;
  nucleo_id: string;
  tipo: string;
  titulo?: string;
  posicao: number;
  configuracoes: Record<string, any>;
  created_at: string;
  updated_at: string;
  dados?: any;
}

//  ESTADO INICIAL (COPIA PROFUNDA)
const initialState = {
  users: [
    {
      id: "user-1",
      email: "ana@exemplo.com",
      full_name: "Ana Silva",
      nickname: "ana_dev",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    },
    {
      id: "user-2",
      email: "carlos@exemplo.com",
      full_name: "Carlos Oliveira",
      nickname: "carlos_fit",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    },
  ] as MockUser[],

  nucleos: JSON.parse(JSON.stringify(nucleosIniciais)) as MockNucleo[],

  blocos: JSON.parse(JSON.stringify(blocosIniciais)) as MockBloco[],

  xpLogs: [
    // XP para Nucleo 1 (Estudos React)
    ...Array.from({ length: 30 }, (_, i) => ({
      id: uuidv4(),
      user_id: "user-1",
      nucleo_id: "nucleo-1",
      xp_amount: Math.floor(Math.random() * 100) + 50,
      source: ["estudo", "tarefa", "conquista"][Math.floor(Math.random() * 3)],
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
    })),
    // XP para Nucleo 2 (Fitness)
    ...Array.from({ length: 20 }, (_, i) => ({
      id: uuidv4(),
      user_id: "user-1",
      nucleo_id: "nucleo-2",
      xp_amount: Math.floor(Math.random() * 80) + 30,
      source: ["exercício", "meditação", "streak"][
        Math.floor(Math.random() * 3)
      ],
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
    })),
    // XP para Nucleo 3 (Projeto)
    ...Array.from({ length: 25 }, (_, i) => ({
      id: uuidv4(),
      user_id: "user-1",
      nucleo_id: "nucleo-3",
      xp_amount: Math.floor(Math.random() * 150) + 100,
      source: ["tarefa", "entrega", "revisão"][Math.floor(Math.random() * 3)],
      created_at: new Date(Date.now() - i * 86400000).toISOString(),
    })),
  ] as MockXpLog[],

  energyLogs: [
    ...Array.from({ length: 40 }, (_, i) => ({
      id: uuidv4(),
      user_id: "user-1",
      nucleo_id: ["nucleo-1", "nucleo-2", "nucleo-3"][
        Math.floor(Math.random() * 3)
      ],
      energy_amount: Math.floor(Math.random() * 20) + 5,
      created_at: new Date(Date.now() - i * 43200000).toISOString(),
    })),
  ] as MockEnergyLog[],

  userLevels: [
    {
      id: uuidv4(),
      user_id: "user-1",
      level: 12,
      current_xp: 2450,
      next_level_xp: 3000,
      total_xp_earned: 8450,
      updated_at: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      user_id: "user-2",
      level: 8,
      current_xp: 1200,
      next_level_xp: 2000,
      total_xp_earned: 4200,
      updated_at: new Date().toISOString(),
    },
  ] as MockUserLevel[],

  achievements: [
    {
      id: uuidv4(),
      nucleo_id: "nucleo-1",
      achievement_type: "streak_7",
      current_value: 7,
      target_value: 7,
      unlocked_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: uuidv4(),
      nucleo_id: "nucleo-1",
      achievement_type: "xp_2000",
      current_value: 2450,
      target_value: 2000,
      unlocked_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    },
    {
      id: uuidv4(),
      nucleo_id: "nucleo-2",
      achievement_type: "streak_30",
      current_value: 15,
      target_value: 30,
      created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    },
  ] as MockAchievement[],
};

//  ESTADO ATUAL (MUTÁVEL DURANTE A SESSÃO)
let currentState = JSON.parse(JSON.stringify(initialState));

//  SERVIÇO MOCK COM CRUD
export const mockCrudService = {
  // RESET
  resetToInitial() {
    currentState = JSON.parse(JSON.stringify(initialState));
    console.log("🔄 Mock resetado ao estado inicial");
  },

  // USERS
  getUsers() {
    return [...currentState.users];
  },

  getUserById(id: string) {
    return currentState.users.find((u: MockUser) => u.id === id);
  },

  // NucleoS
  getNucleos(userId?: string) {
    let nucleos = [...currentState.nucleos];
    if (userId) {
      nucleos = nucleos.filter((n: MockNucleo) => n.user_id === userId);
    }
    return nucleos.sort(
      (a: MockNucleo, b: MockNucleo) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  },

  getNucleoById(id: string) {
    return currentState.nucleos.find((n: MockNucleo) => n.id === id);
  },

  createNucleo(data: Partial<MockNucleo>) {
    const novoNucleo: MockNucleo = {
      id: `nucleo-${uuidv4()}`,
      user_id: data.user_id || "user-1",
      nome: data.nome || "Novo Nucleo",
      descricao: data.descricao || "",
      tipo: data.tipo || "pessoal",
      corDestaque: data.corDestaque || "#4D7CFF",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    currentState.nucleos.push(novoNucleo);
    console.log("✅ Nucleo criado (mock):", novoNucleo);
    return novoNucleo;
  },

  updateNucleo(id: string, data: Partial<MockNucleo>) {
    const index = currentState.nucleos.findIndex(
      (n: MockNucleo) => n.id === id,
    );
    if (index === -1) return null;

    currentState.nucleos[index] = {
      ...currentState.nucleos[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    console.log("✏️ Nucleo atualizado (mock):", id);
    return currentState.nucleos[index];
  },

  deleteNucleo(id: string) {
    const index = currentState.nucleos.findIndex(
      (n: MockNucleo) => n.id === id,
    );
    if (index === -1) return false;

    // Remove Nucleo
    currentState.nucleos.splice(index, 1);

    // Remove blocos relacionados
    currentState.blocos = currentState.blocos.filter(
      (b: MockBloco) => b.nucleo_id !== id,
    );

    // Remove logs relacionados
    currentState.xpLogs = currentState.xpLogs.filter(
      (l: MockXpLog) => l.nucleo_id !== id,
    );
    currentState.energyLogs = currentState.energyLogs.filter(
      (l: MockEnergyLog) => l.nucleo_id !== id,
    );
    currentState.achievements = currentState.achievements.filter(
      (a: MockAchievement) => a.nucleo_id !== id,
    );

    console.log("🗑️ Nucleo deletado (mock):", id);
    return true;
  },

  // BLOCOS
  getBlocos(nucleoId: string) {
    return currentState.blocos
      .filter((b: MockBloco) => b.nucleo_id === nucleoId)
      .sort((a: MockBloco, b: MockBloco) => a.posicao - b.posicao);
  },

  createBloco(nucleoId: string, data: Partial<MockBloco>) {
    const novoBloco: MockBloco = {
      id: `bloco-${uuidv4()}`,
      nucleo_id: nucleoId,
      tipo: data.tipo || "texto",
      titulo: data.titulo || "Novo Bloco",
      posicao: currentState.blocos.filter(
        (b: MockBloco) => b.nucleo_id === nucleoId,
      ).length,
      configuracoes: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      dados: data.dados || (data.tipo === "texto" ? { conteudo: "" } : {}),
      ...data,
    };
    currentState.blocos.push(novoBloco);
    console.log("✅ Bloco criado (mock):", novoBloco);
    return novoBloco;
  },

  updateBloco(id: string, data: Partial<MockBloco>) {
    const index = currentState.blocos.findIndex((b: MockBloco) => b.id === id);
    if (index === -1) return null;

    currentState.blocos[index] = {
      ...currentState.blocos[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    console.log("✏️ Bloco atualizado (mock):", id);
    return currentState.blocos[index];
  },

  deleteBloco(id: string) {
    const index = currentState.blocos.findIndex((b: MockBloco) => b.id === id);
    if (index === -1) return false;

    currentState.blocos.splice(index, 1);
    console.log("🗑️ Bloco deletado (mock):", id);
    return true;
  },

  reorderBlocos(nucleoId: string, novaOrdem: string[]) {
    const blocosDoNucleo = currentState.blocos.filter(
      (b: MockBloco) => b.nucleo_id === nucleoId,
    );

    novaOrdem.forEach((blocoId, index) => {
      const bloco = blocosDoNucleo.find((b: MockBloco) => b.id === blocoId);
      if (bloco) {
        bloco.posicao = index;
      }
    });

    console.log("🔄 Blocos reordenados (mock)");
    return this.getBlocos(nucleoId);
  },

  // XP LOGS
  getXpLogs(filters?: { userId?: string; nucleoId?: string }) {
    let logs = [...currentState.xpLogs];

    if (filters?.userId) {
      logs = logs.filter((l: MockXpLog) => l.user_id === filters.userId);
    }
    if (filters?.nucleoId) {
      logs = logs.filter((l: MockXpLog) => l.nucleo_id === filters.nucleoId);
    }

    return logs.sort(
      (a: MockXpLog, b: MockXpLog) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  },

  addXpLog(
    userId: string,
    nucleoId: string | undefined,
    amount: number,
    source: string,
  ) {
    const novoLog: MockXpLog = {
      id: uuidv4(),
      user_id: userId,
      nucleo_id: nucleoId,
      xp_amount: amount,
      source,
      created_at: new Date().toISOString(),
    };
    currentState.xpLogs.push(novoLog);

    // Atualizar nível do usuário
    const userLevel = currentState.userLevels.find(
      (l: MockUserLevel) => l.user_id === userId,
    );
    if (userLevel) {
      userLevel.current_xp += amount;
      userLevel.total_xp_earned += amount;

      // Verificar se subiu de nível
      while (userLevel.current_xp >= userLevel.next_level_xp) {
        userLevel.level++;
        userLevel.current_xp -= userLevel.next_level_xp;
        userLevel.next_level_xp = userLevel.level * 1000;
      }
      userLevel.updated_at = new Date().toISOString();
    }

    return novoLog;
  },

  // ENERGY LOGS
  getEnergyLogs(filters?: { userId?: string; nucleoId?: string }) {
    let logs = [...currentState.energyLogs];

    if (filters?.userId) {
      logs = logs.filter((l: MockEnergyLog) => l.user_id === filters.userId);
    }
    if (filters?.nucleoId) {
      logs = logs.filter(
        (l: MockEnergyLog) => l.nucleo_id === filters.nucleoId,
      );
    }

    return logs.sort(
      (a: MockEnergyLog, b: MockEnergyLog) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  },

  addEnergyLog(userId: string, nucleoId: string | undefined, amount: number) {
    const novoLog: MockEnergyLog = {
      id: uuidv4(),
      user_id: userId,
      nucleo_id: nucleoId,
      energy_amount: amount,
      created_at: new Date().toISOString(),
    };
    currentState.energyLogs.push(novoLog);
    return novoLog;
  },

  // USER LEVEL
  getUserLevel(userId: string) {
    return currentState.userLevels.find(
      (l: MockUserLevel) => l.user_id === userId,
    );
  },

  // ACHIEVEMENTS
  getAchievements(nucleoId: string) {
    return currentState.achievements.filter(
      (a: MockAchievement) => a.nucleo_id === nucleoId,
    );
  },

  updateAchievementProgress(nucleoId: string, type: string, value: number) {
    const achievement = currentState.achievements.find(
      (a: MockAchievement) =>
        a.nucleo_id === nucleoId && a.achievement_type === type,
    );

    if (achievement) {
      achievement.current_value = value;

      if (
        achievement.target_value &&
        value >= achievement.target_value &&
        !achievement.unlocked_at
      ) {
        achievement.unlocked_at = new Date().toISOString();
        console.log("🏆 Conquista desbloqueada (mock):", type);
      }
    }

    return achievement;
  },

  // ESTATÍSTICAS AGREGADAS
  getNucleoStats(nucleoId: string) {
    const xpLogs = this.getXpLogs({ nucleoId });
    const energyLogs = this.getEnergyLogs({ nucleoId });
    const achievements = this.getAchievements(nucleoId);

    const xpTotal = xpLogs.reduce(
      (sum: number, log: MockXpLog) => sum + log.xp_amount,
      0,
    );
    const energyTotal = energyLogs.reduce(
      (sum: number, log: MockEnergyLog) => sum + log.energy_amount,
      0,
    );

    const hoje = new Date().toDateString();
    const xpHoje = xpLogs
      .filter(
        (log: MockXpLog) => new Date(log.created_at).toDateString() === hoje,
      )
      .reduce((sum: number, log: MockXpLog) => sum + log.xp_amount, 0);

    const energyHoje = energyLogs
      .filter(
        (log: MockEnergyLog) =>
          new Date(log.created_at).toDateString() === hoje,
      )
      .reduce((sum: number, log: MockEnergyLog) => sum + log.energy_amount, 0);

    const conquistasDesbloqueadas = achievements.filter(
      (a: MockAchievement) => a.unlocked_at,
    ).length;

    return {
      xpTotal,
      xpHoje,
      energyTotal,
      energyHoje,
      conquistasDesbloqueadas,
      level: Math.floor(xpTotal / 1000) + 1,
      nextLevelXp: (Math.floor(xpTotal / 1000) + 1) * 1000,
    };
  },
};
