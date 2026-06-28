import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QuadroBlocoCard } from "../QuadroBlocoCard";
import {
  makeBloco,
  makeColecao,
  makeCampo,
  makeItem,
  makeUseColecoes,
  makeUseCampos,
  makeUseItens,
} from "@/test/mocks";

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("@/hooks/useColecoes", () => ({
  useColecoes: vi.fn(),
  useCampos: vi.fn(),
  useItensColecao: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

vi.mock("@/services/colecoes.service", () => ({
  colecoesService: { createCampo: vi.fn().mockResolvedValue({}) },
}));

vi.mock("@/components/colecoes/CriarTabelaRapidaModal", () => ({
  CriarTabelaRapidaModal: ({ open, onClose }: any) =>
    open ? <div data-testid="modal-tabela-rapida"><button onClick={onClose}>Fechar</button></div> : null,
}));

vi.mock("@/components/colecoes/GerenciarCamposModal", () => ({
  GerenciarCamposModal: ({ open, onClose }: any) =>
    open ? <div data-testid="modal-campos"><button onClick={onClose}>Fechar</button></div> : null,
}));

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));

// framer-motion: renderiza children sem animação
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

import { useColecoes, useCampos, useItensColecao } from "@/hooks/useColecoes";
const mockUseColecoes = vi.mocked(useColecoes);
const mockUseCampos = vi.mocked(useCampos);
const mockUseItens = vi.mocked(useItensColecao);

function renderComponent() {
  return render(
    <QuadroBlocoCard
      bloco={makeBloco({ tipo: "quadro" })}
      nucleoId="nucleo-1"
    />,
  );
}

function setupDefaults(overrides: {
  colecoes?: any[];
  loadingColecoes?: boolean;
  campos?: any[];
  loadingCampos?: boolean;
  itens?: any[];
} = {}) {
  mockUseColecoes.mockReturnValue(
    makeUseColecoes({ colecoes: overrides.colecoes ?? [], isLoading: overrides.loadingColecoes ?? false }) as any,
  );
  mockUseCampos.mockReturnValue(
    makeUseCampos({ campos: overrides.campos ?? [], isLoading: overrides.loadingCampos ?? false }) as any,
  );
  mockUseItens.mockReturnValue(
    makeUseItens({ itens: overrides.itens ?? [] }) as any,
  );
}

// ── Testes ────────────────────────────────────────────────────────────────────

describe("QuadroBlocoCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("estados de carregamento e vazio", () => {
    it("exibe skeleton quando coleções estão carregando", () => {
      setupDefaults({ loadingColecoes: true });
      renderComponent();
      expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it("exibe empty state para criar quadro quando não há coleção", () => {
      setupDefaults({ colecoes: [] });
      renderComponent();
      expect(screen.getByText("Nenhum quadro ainda")).toBeInTheDocument();
      expect(screen.getByText("Criar quadro")).toBeInTheDocument();
    });

    it("abre CriarTabelaRapidaModal ao clicar em 'Criar quadro'", () => {
      setupDefaults({ colecoes: [] });
      renderComponent();
      fireEvent.click(screen.getByText("Criar quadro"));
      expect(screen.getByTestId("modal-tabela-rapida")).toBeInTheDocument();
    });

    it("exibe skeleton quando campos estão carregando", () => {
      setupDefaults({ colecoes: [makeColecao()], loadingCampos: true });
      renderComponent();
      expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });

    it("exibe empty state para campos quando não há campos", () => {
      setupDefaults({ colecoes: [makeColecao()], campos: [] });
      renderComponent();
      expect(screen.getByText("Configure os campos primeiro")).toBeInTheDocument();
      expect(screen.getByText("Adicionar campos")).toBeInTheDocument();
    });

    it("abre GerenciarCamposModal ao clicar em 'Adicionar campos'", () => {
      setupDefaults({ colecoes: [makeColecao()], campos: [] });
      renderComponent();
      fireEvent.click(screen.getByText("Adicionar campos"));
      expect(screen.getByTestId("modal-campos")).toBeInTheDocument();
    });
  });

  describe("kanban board", () => {
    const campo = makeCampo({ id: "c1", nome: "Status" });
    const campo2 = makeCampo({ id: "c2", nome: "Título", tipoCampo: "texto" });

    it("exibe selector de agrupamento com os campos disponíveis", () => {
      setupDefaults({
        colecoes: [makeColecao()],
        campos: [campo, campo2],
        itens: [],
      });
      renderComponent();
      expect(screen.getByText("Agrupar por")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Status")).toBeInTheDocument();
    });

    it("exibe mensagem quando não há itens", () => {
      setupDefaults({
        colecoes: [makeColecao()],
        campos: [campo],
        itens: [],
      });
      renderComponent();
      expect(screen.getByText(/Nenhum item ainda/i)).toBeInTheDocument();
    });

    it("deriva colunas dos valores dos itens no campo de agrupamento", () => {
      const item1 = makeItem({ id: "i1", valores: { c1: "Fazer" } });
      const item2 = makeItem({ id: "i2", valores: { c1: "Feito" } });
      const item3 = makeItem({ id: "i3", valores: { c1: "Fazer" } });

      setupDefaults({
        colecoes: [makeColecao()],
        campos: [campo],
        itens: [item1, item2, item3],
      });
      renderComponent();

      expect(screen.getByText("Fazer")).toBeInTheDocument();
      expect(screen.getByText("Feito")).toBeInTheDocument();
    });

    it("exibe a contagem correta de itens por coluna", () => {
      const item1 = makeItem({ id: "i1", valores: { c1: "Fazer" } });
      const item2 = makeItem({ id: "i2", valores: { c1: "Fazer" } });

      setupDefaults({
        colecoes: [makeColecao()],
        campos: [campo],
        itens: [item1, item2],
      });
      renderComponent();

      // A coluna "Fazer" deve mostrar "2" itens
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("cria nova coluna local ao preencher formulário de nova coluna", () => {
      setupDefaults({
        colecoes: [makeColecao()],
        campos: [campo],
        itens: [],
      });
      renderComponent();

      // Clica no botão de nova coluna que aparece no empty state
      const novaColBtn = screen.getByText("Nova coluna");
      fireEvent.click(novaColBtn);

      const input = screen.getByPlaceholderText(/ex:/i);
      fireEvent.change(input, { target: { value: "Em Progresso" } });
      fireEvent.click(screen.getByText("Criar"));

      expect(screen.getByText("Em Progresso")).toBeInTheDocument();
    });

    it("exibe botão 'Campos' para abrir GerenciarCamposModal", () => {
      setupDefaults({
        colecoes: [makeColecao()],
        campos: [campo],
        itens: [],
      });
      renderComponent();
      const btnCampos = screen.getByText("Campos");
      fireEvent.click(btnCampos);
      expect(screen.getByTestId("modal-campos")).toBeInTheDocument();
    });

    it("itens sem valor no campo de agrupamento vão para coluna 'Sem status'", () => {
      const itemSemStatus = makeItem({ id: "i1", valores: {} });
      setupDefaults({
        colecoes: [makeColecao()],
        campos: [campo],
        itens: [itemSemStatus],
      });
      renderComponent();
      expect(screen.getByText("Sem status")).toBeInTheDocument();
    });
  });
});
