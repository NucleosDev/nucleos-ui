import { describe, it, expect } from "vitest";
import {
  avaliarConquistas,
  CONQUISTAS_CATALOG,
  type CondicoesUsuario,
} from "../conquistas-catalog";

const BASE: CondicoesUsuario = {
  totalNucleos: 0,
  totalTarefasConcluidas: 0,
  totalHabitos: 0,
  streakMaximo: 0,
  streakAtual: 0,
  nivel: 1,
  totalXp: 0,
  totalBlocos: 0,
};

describe("CONQUISTAS_CATALOG", () => {
  it("tem pelo menos 20 conquistas definidas", () => {
    expect(CONQUISTAS_CATALOG.length).toBeGreaterThanOrEqual(20);
  });

  it("cada conquista tem id único", () => {
    const ids = CONQUISTAS_CATALOG.map((c) => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("cada conquista tem xp_recompensa > 0", () => {
    CONQUISTAS_CATALOG.forEach((c) => {
      expect(c.xp_recompensa).toBeGreaterThan(0);
    });
  });

  it("tipos são apenas os 4 permitidos", () => {
    const allowed = new Set(["creation", "progress", "streak", "level"]);
    CONQUISTAS_CATALOG.forEach((c) => {
      expect(allowed.has(c.tipo)).toBe(true);
    });
  });
});

describe("avaliarConquistas", () => {
  it("usuário novo não desbloqueia nenhuma conquista", () => {
    const result = avaliarConquistas(BASE);
    const unlocked = result.filter((c) => c.unlocked);
    expect(unlocked).toHaveLength(0);
  });

  it("retorna todas as conquistas do catálogo", () => {
    const result = avaliarConquistas(BASE);
    expect(result).toHaveLength(CONQUISTAS_CATALOG.length);
  });

  it("cria 1 nucleo → desbloqueia 'Fundador'", () => {
    const result = avaliarConquistas({ ...BASE, totalNucleos: 1 });
    const fundador = result.find((c) => c.id === "first-nucleo");
    expect(fundador?.unlocked).toBe(true);
  });

  it("cria 3 nucleos → desbloqueia 'Explorador' mas não 'Arquiteto'", () => {
    const result = avaliarConquistas({ ...BASE, totalNucleos: 3 });
    expect(result.find((c) => c.id === "three-nucleos")?.unlocked).toBe(true);
    expect(result.find((c) => c.id === "ten-nucleos")?.unlocked).toBe(false);
  });

  it("1 tarefa concluída → desbloqueia 'Primeiro Passo'", () => {
    const result = avaliarConquistas({ ...BASE, totalTarefasConcluidas: 1 });
    expect(result.find((c) => c.id === "first-task")?.unlocked).toBe(true);
    expect(result.find((c) => c.id === "ten-tasks")?.unlocked).toBe(false);
  });

  it("10 tarefas → desbloqueia 'Produtivo' mas não 'Executor'", () => {
    const result = avaliarConquistas({ ...BASE, totalTarefasConcluidas: 10 });
    expect(result.find((c) => c.id === "ten-tasks")?.unlocked).toBe(true);
    expect(result.find((c) => c.id === "fifty-tasks")?.unlocked).toBe(false);
  });

  it("streakMaximo 7 → desbloqueia 'Uma Semana Forte' e 'Consistente'", () => {
    const result = avaliarConquistas({ ...BASE, streakMaximo: 7 });
    expect(result.find((c) => c.id === "streak-7")?.unlocked).toBe(true);
    expect(result.find((c) => c.id === "streak-3")?.unlocked).toBe(true);
    expect(result.find((c) => c.id === "streak-30")?.unlocked).toBe(false);
  });

  it("streakMaximo 30 → desbloqueia 'Mês Perfeito'", () => {
    const result = avaliarConquistas({ ...BASE, streakMaximo: 30 });
    expect(result.find((c) => c.id === "streak-30")?.unlocked).toBe(true);
    expect(result.find((c) => c.id === "streak-100")?.unlocked).toBe(false);
  });

  it("nível 5 → desbloqueia 'Iniciante'", () => {
    const result = avaliarConquistas({ ...BASE, nivel: 5 });
    expect(result.find((c) => c.id === "level-5")?.unlocked).toBe(true);
    expect(result.find((c) => c.id === "level-10")?.unlocked).toBe(false);
  });

  it("totalXp 1000 → desbloqueia 'Primeiro Milhar'", () => {
    const result = avaliarConquistas({ ...BASE, totalXp: 1000 });
    expect(result.find((c) => c.id === "xp-1000")?.unlocked).toBe(true);
    expect(result.find((c) => c.id === "xp-10000")?.unlocked).toBe(false);
  });

  it("usuário avançado desbloqueia várias conquistas ao mesmo tempo", () => {
    const result = avaliarConquistas({
      totalNucleos: 5,
      totalTarefasConcluidas: 55,
      totalHabitos: 5,
      streakMaximo: 10,
      streakAtual: 3,
      nivel: 6,
      totalXp: 2500,
      totalBlocos: 20,
    });
    const unlocked = result.filter((c) => c.unlocked);
    // Deve desbloquear: fundador, explorador, construtor, first-bloco, ten-blocos,
    // first-task, ten-tasks, fifty-tasks, first-habito, five-habitos,
    // streak-3, streak-7, level-5, xp-1000
    expect(unlocked.length).toBeGreaterThanOrEqual(10);
  });

  it("conquistas bloqueadas têm unlockedAt null", () => {
    const result = avaliarConquistas(BASE);
    result.filter((c) => !c.unlocked).forEach((c) => {
      expect(c.unlockedAt).toBeNull();
    });
  });

  it("conquistas desbloqueadas têm unlockedAt não-nulo", () => {
    const result = avaliarConquistas({ ...BASE, totalNucleos: 1 });
    const fundador = result.find((c) => c.id === "first-nucleo")!;
    expect(fundador.unlocked).toBe(true);
    expect(fundador.unlockedAt).not.toBeNull();
  });
});
