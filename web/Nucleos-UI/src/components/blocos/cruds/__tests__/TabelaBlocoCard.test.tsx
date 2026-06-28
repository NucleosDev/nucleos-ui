import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TabelaBlocoCard } from "../TabelaBlocoCard";
import { makeBloco, makeColecao, makeUseColecoes } from "@/test/mocks";

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("@/hooks/useColecoes", () => ({
  useColecoes: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

vi.mock("@/services/colecoes.service", () => ({
  colecoesService: { createCampo: vi.fn().mockResolvedValue({}) },
}));

vi.mock("@/components/colecoes/ColecaoBoard", () => ({
  ColecaoBoard: ({ colecao, defaultView, hideViewToggle }: any) => (
    <div data-testid="colecao-board" data-view={defaultView} data-hide-toggle={String(hideViewToggle)}>
      {colecao.nome}
    </div>
  ),
}));

vi.mock("@/components/colecoes/CriarColecaoModal", () => ({
  CriarColecaoModal: ({ open, onClose }: any) =>
    open ? <div data-testid="modal-criar-colecao"><button onClick={onClose}>Fechar</button></div> : null,
}));

vi.mock("@/components/colecoes/CriarTabelaRapidaModal", () => ({
  CriarTabelaRapidaModal: ({ open, onClose }: any) =>
    open ? <div data-testid="modal-tabela-rapida"><button onClick={onClose}>Fechar</button></div> : null,
}));

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: any) => <div data-testid="skeleton" className={className} />,
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

import { useColecoes } from "@/hooks/useColecoes";
const mockUseColecoes = vi.mocked(useColecoes);

function renderComponent(blocoOverrides = {}) {
  return render(
    <TabelaBlocoCard
      bloco={makeBloco({ tipo: "tabela", ...blocoOverrides })}
      nucleoId="nucleo-1"
    />,
  );
}

// ── Testes ────────────────────────────────────────────────────────────────────

describe("TabelaBlocoCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exibe skeleton enquanto carrega", () => {
    mockUseColecoes.mockReturnValue(makeUseColecoes({ isLoading: true }) as any);
    renderComponent();
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("exibe empty state quando não há coleções", () => {
    mockUseColecoes.mockReturnValue(makeUseColecoes({ colecoes: [] }) as any);
    renderComponent();
    expect(screen.getByText("Nenhuma tabela ainda")).toBeInTheDocument();
    expect(screen.getByText("Tabela rápida")).toBeInTheDocument();
    expect(screen.getByText("Em branco")).toBeInTheDocument();
  });

  it("abre CriarTabelaRapidaModal ao clicar em 'Tabela rápida'", () => {
    mockUseColecoes.mockReturnValue(makeUseColecoes({ colecoes: [] }) as any);
    renderComponent();
    fireEvent.click(screen.getByText("Tabela rápida"));
    expect(screen.getByTestId("modal-tabela-rapida")).toBeInTheDocument();
  });

  it("abre CriarColecaoModal ao clicar em 'Em branco'", () => {
    mockUseColecoes.mockReturnValue(makeUseColecoes({ colecoes: [] }) as any);
    renderComponent();
    fireEvent.click(screen.getByText("Em branco"));
    expect(screen.getByTestId("modal-criar-colecao")).toBeInTheDocument();
  });

  it("renderiza ColecaoBoard com defaultView='table' e hideViewToggle quando há coleções", () => {
    const colecao = makeColecao({ nome: "Minha Tabela" });
    mockUseColecoes.mockReturnValue(makeUseColecoes({ colecoes: [colecao] }) as any);
    renderComponent();
    const board = screen.getByTestId("colecao-board");
    expect(board).toBeInTheDocument();
    expect(board).toHaveAttribute("data-view", "table");
    expect(board).toHaveAttribute("data-hide-toggle", "true");
  });

  it("renderiza múltiplas coleções em view de tabela", () => {
    const colecoes = [
      makeColecao({ id: "c1", nome: "Tabela 1" }),
      makeColecao({ id: "c2", nome: "Tabela 2" }),
    ];
    mockUseColecoes.mockReturnValue(makeUseColecoes({ colecoes }) as any);
    renderComponent();
    expect(screen.getAllByTestId("colecao-board")).toHaveLength(2);
    expect(screen.getByText("Tabela 1")).toBeInTheDocument();
    expect(screen.getByText("Tabela 2")).toBeInTheDocument();
  });

  it("exibe botão 'Nova tabela' na toolbar quando há coleções", () => {
    mockUseColecoes.mockReturnValue(
      makeUseColecoes({ colecoes: [makeColecao()] }) as any,
    );
    renderComponent();
    expect(screen.getByText("Nova tabela")).toBeInTheDocument();
  });

  it("desabilita botões quando isCreating=true", () => {
    mockUseColecoes.mockReturnValue(makeUseColecoes({ colecoes: [], isCreating: true }) as any);
    renderComponent();
    expect(screen.getByText("Tabela rápida").closest("button")).toBeDisabled();
    expect(screen.getByText("Em branco").closest("button")).toBeDisabled();
  });
});
