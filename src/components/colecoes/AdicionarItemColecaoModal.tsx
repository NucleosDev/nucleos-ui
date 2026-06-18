"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Plus, Loader2, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useItensColecao } from "@/hooks/useColecoes";
import { toast } from "@/hooks/use-toast";
import type { Campo } from "@/types/colecao";
import { cn } from "@/lib/utils";

interface AdicionarItemColecaoModalProps {
  open: boolean;
  onClose: () => void;
  colecaoId: string;
  campos: Campo[];
  onSuccess?: () => void;
  initialValores?: Record<string, any>;
}

export function AdicionarItemColecaoModal({
  open,
  onClose,
  colecaoId,
  campos,
  onSuccess,
  initialValores,
}: AdicionarItemColecaoModalProps) {
  const { criarItem } = useItensColecao(colecaoId);
  const [valores, setValores] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      const initial: Record<string, any> = {};
      campos.forEach((campo) => {
        initial[campo.id] =
          initialValores?.[campo.id] ??
          (campo.tipoCampo === "booleano" ? false : "");
      });
      setValores(initial);
    }
  }, [open, campos, initialValores]);

  const handleChange = (campoId: string, value: any) =>
    setValores((prev) => ({ ...prev, [campoId]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valuesToSend: Record<string, any> = {};
    campos.forEach((campo) => {
      const val = valores[campo.id];
      if (val !== undefined && val !== "") valuesToSend[campo.id] = val;
    });
    if (Object.keys(valuesToSend).length === 0) {
      toast({ title: "Preencha pelo menos um campo", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await criarItem(valuesToSend);
      toast({ title: "Item adicionado!" });
      onSuccess?.();
      onClose();
    } catch {
      toast({ title: "Erro ao adicionar item", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden gap-0">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Plus className="h-3.5 w-3.5 text-primary" />
            </div>
            <DialogTitle className="text-sm font-semibold">
              Novo item
            </DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground/60 pl-9">
            Preencha os campos abaixo.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-4 pt-4 pb-3 space-y-3 max-h-[60vh] overflow-y-auto">
            {campos.length === 0 ? (
              <p className="text-sm text-muted-foreground/60 text-center py-6">
                Nenhum campo definido. Adicione campos primeiro.
              </p>
            ) : (
              campos.map((campo) => (
                <div key={campo.id} className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground/70">
                    {campo.nome}
                  </label>

                  {campo.tipoCampo === "booleano" ? (
                    <div className="flex items-center gap-2.5 py-0.5">
                      <Switch
                        checked={valores[campo.id] ?? false}
                        onCheckedChange={(c) => handleChange(campo.id, c)}
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-muted-foreground">
                        {valores[campo.id] ? "Sim" : "Não"}
                      </span>
                    </div>
                  ) : (
                    <input
                      type={
                        campo.tipoCampo === "numero"
                          ? "number"
                          : campo.tipoCampo === "data"
                            ? "date"
                            : "text"
                      }
                      value={valores[campo.id] ?? ""}
                      onChange={(e) =>
                        handleChange(
                          campo.id,
                          campo.tipoCampo === "numero"
                            ? e.target.value === ""
                              ? ""
                              : parseFloat(e.target.value)
                            : e.target.value,
                        )
                      }
                      disabled={isSubmitting}
                      className={cn(
                        "w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-border/60 bg-background",
                        "placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
                        "transition-[border-color,box-shadow]",
                      )}
                    />
                  )}
                </div>
              ))
            )}
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
              disabled={isSubmitting || campos.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[var(--radius-md)] text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Salvar
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
