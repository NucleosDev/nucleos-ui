import { vi } from "vitest";
import type { Bloco } from "@/types/bloco";
import type { Colecao, Campo, Item } from "@/types/colecao";

export const makeBloco = (overrides: Partial<Bloco> = {}): Bloco => ({
  id: "bloco-1",
  nucleoId: "nucleo-1",
  tipo: "tabela",
  titulo: "Minha Tabela",
  posicao: 0,
  configuracoes: null,
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  ...overrides,
});

export const makeColecao = (overrides: Partial<Colecao> = {}): Colecao => ({
  id: "colecao-1",
  blocoId: "bloco-1",
  nome: "Coleção A",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  ...overrides,
});

export const makeCampo = (overrides: Partial<Campo> = {}): Campo => ({
  id: "campo-1",
  colecaoId: "colecao-1",
  nome: "Status",
  tipoCampo: "texto",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  ...overrides,
});

export const makeItem = (overrides: Partial<Item> = {}): Item => ({
  id: "item-1",
  colecaoId: "colecao-1",
  valores: {},
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
  ...overrides,
});

type UseColecoesMock = {
  colecoes: Colecao[];
  isLoading: boolean;
  criarColecao: ReturnType<typeof vi.fn>;
  atualizarColecao: ReturnType<typeof vi.fn>;
  excluirColecao: ReturnType<typeof vi.fn>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
};

export const makeUseColecoes = (overrides: Partial<UseColecoesMock> = {}): UseColecoesMock => ({
  colecoes: [],
  isLoading: false,
  criarColecao: vi.fn().mockResolvedValue(makeColecao()),
  atualizarColecao: vi.fn().mockResolvedValue(undefined),
  excluirColecao: vi.fn().mockResolvedValue(undefined),
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  ...overrides,
});

type UseCamposMock = {
  campos: Campo[];
  isLoading: boolean;
  criarCampo: ReturnType<typeof vi.fn>;
  atualizarCampo: ReturnType<typeof vi.fn>;
  excluirCampo: ReturnType<typeof vi.fn>;
};

export const makeUseCampos = (overrides: Partial<UseCamposMock> = {}): UseCamposMock => ({
  campos: [],
  isLoading: false,
  criarCampo: vi.fn().mockResolvedValue(makeCampo()),
  atualizarCampo: vi.fn().mockResolvedValue(undefined),
  excluirCampo: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

type UseItensMock = {
  itens: Item[];
  isLoading: boolean;
  criarItem: ReturnType<typeof vi.fn>;
  atualizarItem: ReturnType<typeof vi.fn>;
  excluirItem: ReturnType<typeof vi.fn>;
};

export const makeUseItens = (overrides: Partial<UseItensMock> = {}): UseItensMock => ({
  itens: [],
  isLoading: false,
  criarItem: vi.fn().mockResolvedValue(makeItem()),
  atualizarItem: vi.fn().mockResolvedValue(undefined),
  excluirItem: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});
