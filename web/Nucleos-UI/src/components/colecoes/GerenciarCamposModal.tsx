"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Settings,
  Plus,
  Trash2,
  Pencil,
  X,
  Check,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useCampos } from "@/hooks/useColecoes";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { TipoCampo } from "@/types/colecao";

const TIPO_OPTS: { value: TipoCampo; label: string; symbol: string }[] = [
  { value: "texto", label: "Texto", symbol: "Aa" },
  { value: "numero", label: "Número", symbol: "#" },
  { value: "data", label: "Data", symbol: "📅" },
  { value: "booleano", label: "Sim/Não", symbol: "✓" },
  { value: "arquivo", label: "Arquivo", symbol: "📎" },
  { value: "select", label: "Seleção", symbol: "▾" },
  { value: "relacao", label: "Relação", symbol: "↗" },
];

interface GerenciarCamposModalProps {
  open: boolean;
  onClose: () => void;
  colecaoId: string;
  colecaoNome?: string;
  onRefresh?: () => void;
}

export function GerenciarCamposModal({
  open,
  onClose,
  colecaoId,
  colecaoNome,
  onRefresh,
}: GerenciarCamposModalProps) {
  const { campos, criarCampo, atualizarCampo, excluirCampo } =
    useCampos(colecaoId);
  const [novoNome, setNovoNome] = useState("");
  const [novoTipo, setNovoTipo] = useState<TipoCampo>("texto");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
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
    setIsSubmitting(true);
    try {
      await excluirCampo(id);
      setConfirmDeleteId(null);
      onRefresh?.();
    } catch {
      toast({ title: "Erro ao remover", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Settings className="h-3.5 w-3.5 text-primary" />
            </div>
            <DialogTitle className="text-sm font-semibold">
              Campos{colecaoNome ? ` — ${colecaoNome}` : ""}
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground/60 pl-9">
            Adicione, renomeie ou remova campos desta coleção.
          </p>
        </div>

        <div className="px-4 pt-4 pb-3 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Adicionar campo */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground/70">
              Novo campo
            </label>
            <div className="flex gap-2">
              <input
                placeholder="Nome do campo…"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdd();
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
                {TIPO_OPTS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAdd}
                disabled={isSubmitting || !novoNome.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Lista de campos */}
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
              {campos.length} {campos.length === 1 ? "campo" : "campos"}
            </p>

            {campos.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground/60">
                  Nenhum campo ainda.
                </p>
                <p className="text-xs text-muted-foreground/40 mt-0.5">
                  Adicione o primeiro campo acima.
                </p>
              </div>
            ) : (
              campos.map((campo) => {
                const opt = TIPO_OPTS.find((t) => t.value === campo.tipoCampo);
                const isDeleting = confirmDeleteId === campo.id;

                return (
                  <div
                    key={campo.id}
                    className={cn(
                      "rounded-[var(--radius-md)] border transition-colors",
                      isDeleting
                        ? "border-destructive/40 bg-destructive/5"
                        : "border-border/40 bg-muted/20",
                    )}
                  >
                    {isDeleting ? (
                      <div className="flex items-center gap-2 px-3 py-2.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
                        <p className="text-xs text-destructive font-medium flex-1">
                          Remover "{campo.nome}"? Dados serão perdidos.
                        </p>
                        <button
                          onClick={() => handleDelete(campo.id)}
                          disabled={isSubmitting}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-destructive text-destructive-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : null}
                          Remover
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : editandoId === campo.id ? (
                      <div className="flex items-center gap-2 px-3 py-2">
                        <input
                          value={editNome}
                          onChange={(e) => setEditNome(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdate(campo.id);
                            if (e.key === "Escape") setEditandoId(null);
                          }}
                          className="flex-1 px-2.5 py-1 text-sm rounded-md bg-background border border-border/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <button
                          onClick={() => handleUpdate(campo.id)}
                          disabled={isSubmitting}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </button>
                        <button
                          onClick={() => setEditandoId(null)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-3 py-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold bg-primary/8 text-primary">
                          {opt?.symbol ?? "•"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {campo.nome}
                          </p>
                          <p className="text-[10px] text-muted-foreground/50">
                            {opt?.label}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => {
                              setEditandoId(campo.id);
                              setEditNome(campo.nome || "");
                            }}
                            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-accent transition-colors"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(campo.id)}
                            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex items-center justify-end px-4 py-3 border-t border-border/40 bg-muted/20">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-[var(--radius-md)] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Fechar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
