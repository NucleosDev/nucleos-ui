import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GaleriaBlocoCard } from "../GaleriaBlocoCard";
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

function renderComponent() {
  return render(
    <GaleriaBlocoCard
      bloco={makeBloco({ tipo: "galeria" })}
      nucleoId="nucleo-1"
    />,
  );
}

// ── Testes ────────────────────────────────────────────────────────────────────

describe("GaleriaBlocoCard", () => {
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
    expect(screen.getByText("Nenhuma galeria ainda")).toBeInTheDocument();
    expect(screen.getByText("Com campos")).toBeInTheDocument();
    expect(screen.getByText("Em branco")).toBeInTheDocument();
  });

  it("abre CriarTabelaRapidaModal ao clicar em 'Com campos'", () => {
    mockUseColecoes.mockReturnValue(makeUseColecoes({ colecoes: [] }) as any);
    renderComponent();
    fireEvent.click(screen.getByText("Com campos"));
    expect(screen.getByTestId("modal-tabela-rapida")).toBeInTheDocument();
  });

  it("abre CriarColecaoModal ao clicar em 'Em branco'", () => {
    mockUseColecoes.mockReturnValue(makeUseColecoes({ colecoes: [] }) as any);
    renderComponent();
    fireEvent.click(screen.getByText("Em branco"));
    expect(screen.getByTestId("modal-criar-colecao")).toBeInTheDocument();
  });

  it("renderiza ColecaoBoard com defaultView='board' e hideViewToggle", () => {
    const colecao = makeColecao({ nome: "Minha Galeria" });
    mockUseColecoes.mockReturnValue(makeUseColecoes({ colecoes: [colecao] }) as any);
    renderComponent();
    const board = screen.getByTestId("colecao-board");
    expect(board).toHaveAttribute("data-view", "board");
    expect(board).toHaveAttribute("data-hide-toggle", "true");
  });

  it("não exibe toggle de view (forçado pelo hideViewToggle)", () => {
    mockUseColecoes.mockReturnValue(
      makeUseColecoes({ colecoes: [makeColecao()] }) as any,
    );
    renderComponent();
    // O board é mockado — confirmamos que hideViewToggle=true foi passado
    expect(screen.getByTestId("colecao-board")).toHaveAttribute("data-hide-toggle", "true");
  });

  it("renderiza múltiplas galerias", () => {
    const colecoes = [
      makeColecao({ id: "c1", nome: "Galeria 1" }),
      makeColecao({ id: "c2", nome: "Galeria 2" }),
    ];
    mockUseColecoes.mockReturnValue(makeUseColecoes({ colecoes }) as any);
    renderComponent();
    expect(screen.getAllByTestId("colecao-board")).toHaveLength(2);
  });

  it("exibe botão 'Nova galeria' na toolbar quando há coleções", () => {
    mockUseColecoes.mockReturnValue(
      makeUseColecoes({ colecoes: [makeColecao()] }) as any,
    );
    renderComponent();
    expect(screen.getByText("Nova galeria")).toBeInTheDocument();
  });
});
