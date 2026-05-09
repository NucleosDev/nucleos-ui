// src/components/colecoes/CriarColecaoModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Layers, Check, Loader2 } from "lucide-react";
import { GlassModal, GlassModalHeader, GlassInput, GlassModalFooter, GlassButton } from "@/components/ui/glass-modal";

const ACCENT = "#10b981";

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
  const [nome,  setNome]  = useState(initialNome);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) { setNome(initialNome); setError(null); }
  }, [open, initialNome]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) { setError("O nome da coleção é obrigatório."); return; }
    await onConfirm(nome.trim());
  };

  return (
    <GlassModal open={open} onClose={onClose}>
      <GlassModalHeader
        title={titulo}
        description="Organize dados em tabelas flexíveis. Você pode adicionar campos e itens depois."
        icon={Layers}
        accent={ACCENT}
        onClose={onClose}
      />

      <form onSubmit={handleSubmit} className="px-5 py-4">
        <GlassInput
          label="Nome da coleção"
          placeholder="Ex: Biblioteca de Filmes, Clientes..."
          value={nome}
          onChange={(e) => { setNome(e.target.value); setError(null); }}
          autoFocus
          disabled={isSubmitting}
          error={error}
        />
        <GlassModalFooter>
          <GlassButton variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </GlassButton>
          <GlassButton
            type="submit"
            disabled={isSubmitting || !nome.trim()}
            style={{ background: ACCENT, boxShadow: `0 4px 12px ${ACCENT}35` }}
            className="text-white hover:opacity-90 bg-transparent"
          >
            {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Criar
          </GlassButton>
        </GlassModalFooter>
      </form>
    </GlassModal>
  );
}
