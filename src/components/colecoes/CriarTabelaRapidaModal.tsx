"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Zap, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TipoCampo } from "@/types/colecao";

const TIPO_LABELS: Record<TipoCampo, string> = {
  texto: "Texto",
  numero: "Número",
  data: "Data",
  booleano: "Sim/Não",
  arquivo: "Arquivo",
  select: "Seleção",
  relacao: "Relação",
};

const TIPO_SYMBOL: Record<TipoCampo, string> = {
  texto: "Aa",
  numero: "#",
  data: "📅",
  booleano: "✓",
  arquivo: "📎",
  select: "▾",
  relacao: "↗",
};

interface Campo {
  tempId: string;
  nome: string;
  tipo: TipoCampo;
}

interface CriarTabelaRapidaModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (
    nome: string,
    campos: { nome: string; tipoCampo: TipoCampo }[],
  ) => Promise<void>;
  isSubmitting?: boolean;
}

export function CriarTabelaRapidaModal({
  open,
  onClose,
  onConfirm,
  isSubmitting = false,
}: CriarTabelaRapidaModalProps) {
  const [tabelaNome, setTabelaNome] = useState("");
  const [campos, setCampos] = useState<Campo[]>([]);
  const [novoNome, setNovoNome] = useState("");
  const [novoTipo, setNovoTipo] = useState<TipoCampo>("texto");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTabelaNome("");
      setCampos([]);
      setNovoNome("");
      setNovoTipo("texto");
      setErro(null);
    }
  }, [open]);

  const adicionarCampo = () => {
    if (!novoNome.trim()) {
      setErro("Nome do campo é obrigatório");
      return;
    }
    if (campos.some((c) => c.nome.toLowerCase() === novoNome.toLowerCase())) {
      setErro("Campo com este nome já existe");
      return;
    }
    setCampos([
      ...campos,
      { tempId: `temp-${Date.now()}`, nome: novoNome.trim(), tipo: novoTipo },
    ]);
    setNovoNome("");
    setNovoTipo("texto");
    setErro(null);
  };

  const removerCampo = (tempId: string) =>
    setCampos(campos.filter((c) => c.tempId !== tempId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tabelaNome.trim()) {
      setErro("Nome da tabela é obrigatório");
      return;
    }
    if (campos.length === 0) {
      setErro("Adicione pelo menos um campo");
      return;
    }
    try {
      await onConfirm(
        tabelaNome.trim(),
        campos.map((c) => ({ nome: c.nome, tipoCampo: c.tipo })),
      );
      setTabelaNome("");
      setCampos([]);
      setErro(null);
    } catch {
      setErro("Erro ao criar tabela");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
              <Zap className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <DialogTitle className="text-sm font-semibold">
              Tabela rápida
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground/60 pl-9">
            Defina o nome e os campos — os dados vêm depois.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-4 pt-4 pb-3 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Nome da tabela */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground/70">
                Nome da tabela
              </label>
              <input
                autoFocus
                value={tabelaNome}
                onChange={(e) => {
                  setTabelaNome(e.target.value);
                  setErro(null);
                }}
                placeholder="Ex: Contatos, Produtos, Pedidos…"
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-border/60 bg-background placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-[border-color,box-shadow]"
              />
            </div>

            {/* Adicionar campo */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground/70">
                Campos
              </label>
              <div className="flex gap-2">
                <input
                  placeholder="Nome do campo"
                  value={novoNome}
                  onChange={(e) => {
                    setNovoNome(e.target.value);
                    setErro(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      adicionarCampo();
                    }
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-3 py-2 text-sm rounded-[var(--radius-md)] border border-border/60 bg-background placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-[border-color,box-shadow]"
                />
                <select
                  value={novoTipo}
                  onChange={(e) => setNovoTipo(e.target.value as TipoCampo)}
                  disabled={isSubmitting}
                  className="w-28 px-2 py-2 text-xs rounded-[var(--radius-md)] border border-border/60 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {(Object.keys(TIPO_LABELS) as TipoCampo[]).map((t) => (
                    <option key={t} value={t}>
                      {TIPO_LABELS[t]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={adicionarCampo}
                  disabled={isSubmitting}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-emerald-500 text-white hover:opacity-90 disabled:opacity-50 transition-opacity shadow-[0_2px_8px_rgba(16,185,129,0.2)]"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {erro && (
                <p className="text-xs text-destructive font-medium">{erro}</p>
              )}

              {campos.length > 0 && (
                <div className="space-y-1 mt-1">
                  <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                    {campos.length} campo{campos.length !== 1 ? "s" : ""}
                  </p>
                  {campos.map((campo) => (
                    <div
                      key={campo.tempId}
                      className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-muted/40 border border-border/40"
                    >
                      <span className="text-xs font-bold text-emerald-500 w-5 text-center shrink-0">
                        {TIPO_SYMBOL[campo.tipo]}
                      </span>
                      <span className="text-sm font-medium flex-1 min-w-0 truncate">
                        {campo.nome}
                      </span>
                      <span className="text-[10px] text-muted-foreground/50 shrink-0">
                        {TIPO_LABELS[campo.tipo]}
                      </span>
                      <button
                        type="button"
                        onClick={() => removerCampo(campo.tempId)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border/40 bg-muted/20">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 rounded-[var(--radius-md)] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || campos.length === 0 || !tabelaNome.trim()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[var(--radius-md)] text-sm font-medium bg-emerald-500 text-white hover:opacity-90 disabled:opacity-50 transition-opacity shadow-[0_2px_8px_rgba(16,185,129,0.25)]"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Criar tabela
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
