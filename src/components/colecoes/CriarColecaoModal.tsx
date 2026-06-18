"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Layers, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CriarColecaoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (nome: string) => Promise<void>;
  initialNome?: string;
  titulo?: string;
  isSubmitting?: boolean;
}

export function CriarColecaoModal({
  open,
  onClose,
  onConfirm,
  initialNome = "",
  titulo = "Nova coleção",
  isSubmitting = false,
}: CriarColecaoModalProps) {
  const [nome, setNome] = useState(initialNome);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setNome(initialNome);
      setError(null);
    }
  }, [open, initialNome]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError("O nome da coleção é obrigatório.");
      return;
    }
    await onConfirm(nome.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden gap-0">
        <div className="px-5 pt-5 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
              <Layers className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <DialogTitle className="text-sm font-semibold">{titulo}</DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground/60 pl-9">
            Organize dados em tabelas flexíveis — adicione campos e itens depois.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-4 pt-4 pb-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground/70">
                Nome
              </label>
              <input
                autoFocus
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  setError(null);
                }}
                placeholder="Ex: Biblioteca, Clientes, Produtos…"
                disabled={isSubmitting}
                className={cn(
                  "w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-background",
                  "placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2",
                  "transition-[border-color,box-shadow] duration-[var(--duration-fast)]",
                  error
                    ? "border-destructive/50 focus:ring-destructive/20"
                    : "border-border/60 focus:ring-primary/30 focus:border-primary/50",
                )}
              />
              {error && (
                <p className="text-xs text-destructive font-medium">{error}</p>
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
              disabled={isSubmitting || !nome.trim()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[var(--radius-md)] text-sm font-medium bg-emerald-500 text-white hover:opacity-90 disabled:opacity-50 transition-opacity shadow-[0_2px_8px_rgba(16,185,129,0.25)]"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Criar
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
