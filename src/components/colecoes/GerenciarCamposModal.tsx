"use client";

import { useState } from "react";
import { Settings, Plus, Trash2, Pencil, X, Check, Loader2 } from "lucide-react";
import {
  GlassModal,
  GlassModalHeader,
  GlassModalFooter,
  GlassButton,
} from "@/components/ui/glass-modal";
import { useCampos } from "@/hooks/useColecoes";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { TipoCampo } from "@/types/colecao";

const ACCENT = "#10b981";

const TIPO_OPTS: { value: TipoCampo; label: string; symbol: string }[] = [
  { value: "texto",    label: "Texto",    symbol: "Aa" },
  { value: "numero",   label: "Número",   symbol: "#"  },
  { value: "data",     label: "Data",     symbol: "📅" },
  { value: "booleano", label: "Sim/Não",  symbol: "✓"  },
  { value: "arquivo",  label: "Arquivo",  symbol: "📎" },
  { value: "select",   label: "Seleção",  symbol: "▾"  },
  { value: "relacao",  label: "Relação",  symbol: "↗"  },
];

interface GerenciarCamposModalProps {
  open: boolean;
  onClose: () => void;
  colecaoId: string;
  colecaoNome?: string;
  onRefresh?: () => void;
}

export function GerenciarCamposModal({
  open, onClose, colecaoId, colecaoNome, onRefresh,
}: GerenciarCamposModalProps) {
  const { campos, criarCampo, atualizarCampo, excluirCampo } = useCampos(colecaoId);
  const [novoNome,    setNovoNome]    = useState("");
  const [novoTipo,    setNovoTipo]    = useState<TipoCampo>("texto");
  const [editandoId,  setEditandoId]  = useState<string | null>(null);
  const [editNome,    setEditNome]    = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!novoNome.trim()) return;
    setIsSubmitting(true);
    try {
      await criarCampo({ nome: novoNome, tipoCampo: novoTipo });
      setNovoNome("");
      onRefresh?.();
    } catch {
      toast({ title: "Erro ao adicionar campo", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editNome.trim()) return;
    setIsSubmitting(true);
    try {
      await atualizarCampo({ id, data: { nome: editNome } });
      setEditandoId(null);
      onRefresh?.();
    } catch {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este campo? Todos os dados associados serão perdidos.")) return;
    setIsSubmitting(true);
    try {
      await excluirCampo(id);
      onRefresh?.();
    } catch {
      toast({ title: "Erro ao remover", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tipoAtual = TIPO_OPTS.find((t) => t.value === novoTipo);

  return (
    <GlassModal open={open} onClose={onClose} size="max-w-lg">
      <GlassModalHeader
        title="Gerenciar Campos"
        description={colecaoNome ? `Coleção: ${colecaoNome}` : "Adicione e edite os campos desta coleção."}
        icon={Settings}
        accent={ACCENT}
        onClose={onClose}
      />

      <div className="px-5 py-4 space-y-4">
        {/* Add field row */}
        <div className="space-y-2 rounded-xl border border-border/40 bg-muted/20 p-3">
          <p className="text-xs font-semibold text-foreground/60">Novo campo</p>
          <div className="flex gap-2">
            <input
              placeholder="Nome do campo..."
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd(); } }}
              disabled={isSubmitting}
              className="flex-1 px-3 py-2 text-sm rounded-xl bg-background border border-border/50 focus:outline-none focus:ring-2 focus:border-transparent placeholder:text-muted-foreground/40 transition-[border-color,box-shadow]"
              style={{ "--tw-ring-color": `${ACCENT}40` } as any}
            />
            <select
              value={novoTipo}
              onChange={(e) => setNovoTipo(e.target.value as TipoCampo)}
              disabled={isSubmitting}
              className="w-28 px-2 py-2 text-xs rounded-xl bg-background border border-border/50 focus:outline-none focus:ring-2"
            >
              {TIPO_OPTS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAdd}
              disabled={isSubmitting || !novoNome.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: ACCENT, boxShadow: `0 2px 8px ${ACCENT}30` }}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Field list */}
        <div className="space-y-1.5 max-h-72 overflow-y-auto">
          <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider px-0.5">
            {campos.length} {campos.length === 1 ? "campo" : "campos"}
          </p>

          {campos.length === 0 ? (
            <div className="py-8 text-center">
              <div
                className="mx-auto mb-2.5 flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: `${ACCENT}12` }}
              >
                <Plus className="h-4 w-4" style={{ color: ACCENT }} />
              </div>
              <p className="text-sm text-muted-foreground/60">Nenhum campo ainda.</p>
              <p className="text-xs text-muted-foreground/40">Adicione seu primeiro campo acima.</p>
            </div>
          ) : (
            campos.map((campo) => {
              const opt = TIPO_OPTS.find((t) => t.value === campo.tipoCampo);
              return (
                <div
                  key={campo.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border/40 bg-background/60"
                >
                  {editandoId === campo.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        value={editNome}
                        onChange={(e) => setEditNome(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter")  handleUpdate(campo.id);
                          if (e.key === "Escape") setEditandoId(null);
                        }}
                        className="flex-1 px-2.5 py-1 text-sm rounded-lg bg-background border border-border/60 focus:outline-none focus:ring-2"
                        style={{ "--tw-ring-color": `${ACCENT}40` } as any}
                      />
                      <button
                        onClick={() => handleUpdate(campo.id)}
                        disabled={isSubmitting}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                        style={{ background: ACCENT }}
                      >
                        {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                      </button>
                      <button
                        onClick={() => setEditandoId(null)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold"
                        style={{ background: `${ACCENT}14`, color: ACCENT }}
                      >
                        {opt?.symbol ?? "•"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{campo.nome}</p>
                        <p className="text-[10px] text-muted-foreground/50">{opt?.label}</p>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={() => { setEditandoId(campo.id); setEditNome(campo.nome || ""); }}
                          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent transition-colors"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(campo.id)}
                          disabled={isSubmitting}
                          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <GlassModalFooter>
        <GlassButton variant="outline" onClick={onClose}>
          Fechar
        </GlassButton>
      </GlassModalFooter>
    </GlassModal>
  );
}
