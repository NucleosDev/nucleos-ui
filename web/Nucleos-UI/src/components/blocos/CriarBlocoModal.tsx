// src/components/blocos/CriarBlocoModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { TIPO_BLOCO_META, TIPOS_BLOCO } from "@/lib/bloco-utils";
import type { CreateBlocoPayload } from "@/types/bloco";

type FunctionalTipo = (typeof TIPOS_BLOCO)[number];

interface CriarBlocoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: CreateBlocoPayload) => Promise<void>;
  nucleoId: string;
  isCreating?: boolean;
  parentId?: string | null;
}

export function CriarBlocoModal({
  open,
  onClose,
  onConfirm,
  nucleoId,
  isCreating = false,
  parentId = null,
}: CriarBlocoModalProps) {
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState<FunctionalTipo>("tarefas");

  const handleSubmit = async () => {
    const payload: CreateBlocoPayload = {
      nucleoId,
      tipo,
      titulo: titulo.trim() || undefined,
      parentId,
    };
    try {
      await onConfirm(payload);
      setTitulo("");
      setTipo("tarefas");
      onClose();
    } catch {}
  };

  const selectedMeta = TIPO_BLOCO_META[tipo];
  const SelectedIcon = selectedMeta.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden gap-0">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-border/60">
          <DialogTitle className="text-sm font-semibold text-foreground">
            {parentId ? "Novo sub-bloco" : "Novo bloco"}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Escolha o tipo e opcionalmente dê um nome.
          </p>
        </div>

        {/* Type picker grid */}
        <div className="px-4 pt-4 pb-3">
          <div className="grid grid-cols-3 gap-1.5">
            {TIPOS_BLOCO.map((t) => {
              const meta   = TIPO_BLOCO_META[t];
              const ItemIcon = meta.icon;
              const active = tipo === t;
              return (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  disabled={isCreating}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-2.5 rounded-[var(--radius-md)]",
                    "border text-center transition-all duration-[var(--duration-fast)]",
                    active
                      ? "border-primary/40 bg-primary/8 text-primary"
                      : "border-border/50 hover:border-border hover:bg-accent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <ItemIcon className="h-4 w-4 shrink-0" />
                  <span className="text-[11px] font-medium leading-tight">
                    {meta.rotulo}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description of selected type */}
        <div className="px-4 pb-3">
          <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] bg-muted/40 border border-border/40">
            <SelectedIcon className="h-4 w-4 text-primary mt-px shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">{selectedMeta.rotulo}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                {selectedMeta.descricao}
              </p>
            </div>
          </div>
        </div>

        {/* Title input */}
        <div className="px-4 pb-4">
          <input
            type="text"
            placeholder="Nome do bloco (opcional)"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !isCreating) handleSubmit(); }}
            disabled={isCreating}
            className={cn(
              "w-full px-3 py-2 text-sm rounded-[var(--radius-md)]",
              "border border-border/60 bg-background",
              "placeholder:text-muted-foreground/50",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
              "transition-[border-color,box-shadow] duration-[var(--duration-fast)]",
            )}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border/40 bg-muted/20">
          <button
            onClick={onClose}
            disabled={isCreating}
            className="px-3.5 py-1.5 rounded-[var(--radius-md)] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isCreating}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--radius-md)]",
              "text-sm font-medium bg-primary text-primary-foreground",
              "hover:opacity-90 disabled:opacity-50 transition-opacity",
            )}
          >
            {isCreating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isCreating ? "Criando…" : "Criar bloco"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
