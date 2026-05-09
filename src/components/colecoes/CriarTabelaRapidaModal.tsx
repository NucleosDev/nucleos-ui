"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Zap, Check, Loader2 } from "lucide-react";
import { GlassModal, GlassModalHeader, GlassInput, GlassModalFooter, GlassButton } from "@/components/ui/glass-modal";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { TipoCampo } from "@/types/colecao";

const ACCENT = "#10b981";

const TIPO_LABELS: Record<TipoCampo, string> = {
  texto:    "Texto",
  numero:   "Número",
  data:     "Data",
  booleano: "Sim/Não",
  arquivo:  "Arquivo",
  select:   "Seleção",
  relacao:  "Relação",
};

const TIPO_SYMBOL: Record<TipoCampo, string> = {
  texto:    "Aa",
  numero:   "#",
  data:     "📅",
  booleano: "✓",
  arquivo:  "📎",
  select:   "▾",
  relacao:  "↗",
};

interface Campo { tempId: string; nome: string; tipo: TipoCampo; }

interface CriarTabelaRapidaModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (nome: string, campos: { nome: string; tipoCampo: TipoCampo }[]) => Promise<void>;
  isSubmitting?: boolean;
}

export function CriarTabelaRapidaModal({
  open, onClose, onConfirm, isSubmitting = false,
}: CriarTabelaRapidaModalProps) {
  const [tabelaNome, setTabelaNome] = useState("");
  const [campos,     setCampos]     = useState<Campo[]>([]);
  const [novoNome,   setNovoNome]   = useState("");
  const [novoTipo,   setNovoTipo]   = useState<TipoCampo>("texto");
  const [erro,       setErro]       = useState<string | null>(null);

  useEffect(() => {
    if (open) { setTabelaNome(""); setCampos([]); setNovoNome(""); setNovoTipo("texto"); setErro(null); }
  }, [open]);

  const adicionarCampo = () => {
    if (!novoNome.trim()) { setErro("Nome do campo é obrigatório"); return; }
    if (campos.some((c) => c.nome.toLowerCase() === novoNome.toLowerCase())) { setErro("Campo com este nome já existe"); return; }
    setCampos([...campos, { tempId: `temp-${Date.now()}`, nome: novoNome.trim(), tipo: novoTipo }]);
    setNovoNome("");
    setNovoTipo("texto");
    setErro(null);
  };

  const removerCampo = (tempId: string) => setCampos(campos.filter((c) => c.tempId !== tempId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tabelaNome.trim()) { setErro("Nome da tabela é obrigatório"); return; }
    if (campos.length === 0) { setErro("Adicione pelo menos um campo"); return; }
    try {
      await onConfirm(tabelaNome.trim(), campos.map((c) => ({ nome: c.nome, tipoCampo: c.tipo })));
      setTabelaNome(""); setCampos([]); setErro(null);
    } catch { setErro("Erro ao criar tabela"); }
  };

  return (
    <GlassModal open={open} onClose={onClose} size="max-w-lg">
      <GlassModalHeader
        title="Criar Tabela Rápida"
        description="Crie uma nova tabela com campos predefinidos."
        icon={Zap}
        accent={ACCENT}
        onClose={onClose}
      />

      <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
        <GlassInput
          label="Nome da tabela"
          placeholder="Ex: Contatos, Produtos, Pedidos..."
          value={tabelaNome}
          onChange={(e) => { setTabelaNome(e.target.value); setErro(null); }}
          disabled={isSubmitting}
          autoFocus
        />

        {/* Add field row */}
        <div className="space-y-3 rounded-xl border border-border/40 bg-muted/30 p-3">
          <p className="text-xs font-semibold text-foreground/70">Campos</p>
          <div className="flex gap-2">
            <input
              placeholder="Nome do campo"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              disabled={isSubmitting}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); adicionarCampo(); } }}
              className={cn(
                "flex-1 px-3 py-2 text-sm rounded-xl bg-background border border-border/50",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40",
                "placeholder:text-muted-foreground/40 transition-[border-color,box-shadow]",
              )}
            />
            <select
              value={novoTipo}
              onChange={(e) => setNovoTipo(e.target.value as TipoCampo)}
              className="w-28 px-2 py-2 text-xs rounded-xl bg-background border border-border/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {(Object.keys(TIPO_LABELS) as TipoCampo[]).map((t) => (
                <option key={t} value={t}>{TIPO_LABELS[t]}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={adicionarCampo}
              disabled={isSubmitting}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: ACCENT, boxShadow: `0 2px 8px ${ACCENT}30` }}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {erro && <p className="text-xs text-destructive font-medium">{erro}</p>}

          {campos.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                {campos.length} campo{campos.length !== 1 ? "s" : ""} adicionado{campos.length !== 1 ? "s" : ""}
              </p>
              {campos.map((campo) => (
                <div
                  key={campo.tempId}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-background/60 border border-border/40"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold w-5 text-center" style={{ color: ACCENT }}>
                      {TIPO_SYMBOL[campo.tipo]}
                    </span>
                    <span className="text-sm font-medium">{campo.nome}</span>
                    <span className="text-[10px] text-muted-foreground/50">({TIPO_LABELS[campo.tipo]})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removerCampo(campo.tempId)}
                    className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <GlassModalFooter>
          <GlassButton variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </GlassButton>
          <GlassButton
            type="submit"
            disabled={isSubmitting || campos.length === 0 || !tabelaNome.trim()}
            style={{ background: ACCENT, boxShadow: `0 4px 12px ${ACCENT}35` }}
            className="text-white hover:opacity-90 bg-transparent"
          >
            {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Criar Tabela
          </GlassButton>
        </GlassModalFooter>
      </form>
    </GlassModal>
  );
}
