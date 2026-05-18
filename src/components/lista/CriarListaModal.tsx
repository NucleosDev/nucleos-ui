"use client";

import { useState, useEffect, useRef } from "react";
import { ListTodo, Check, Loader2 } from "lucide-react";
import {
  GlassModal,
  GlassModalHeader,
  GlassInput,
  GlassModalFooter,
  GlassButton,
} from "@/components/ui/glass-modal";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { TipoLista } from "@/types/lista";

const ACCENT = "#06b6d4";

type TipoFinanceiro = "gastos" | "despesas" | "receitas" | "compras";

const TIPO_OPTS: { value: TipoFinanceiro; label: string; desc: string }[] = [
  { value: "gastos", label: "Gastos", desc: "Controle de gastos gerais" },
  { value: "despesas", label: "Despesas", desc: "Despesas fixas e variáveis" },
  { value: "receitas", label: "Receitas", desc: "Entradas e rendimentos" },
  { value: "compras", label: "Compras", desc: "Lista de itens para comprar" },
];

const mapBackendToFrontend = (tipo: string): TipoFinanceiro => {
  if (tipo === "compras") return "compras";
  if (tipo === "despesas") return "despesas";
  if (tipo === "receitas") return "receitas";
  return "gastos";
};

export const mapFrontendToBackend = (tipo: string): string => {
  if (tipo === "compras") return "compras";
  return "financeiro";
};

interface CriarListaModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (
    nome: string,
    tipoLista: TipoLista,
    metadata?: Record<string, any>,
  ) => void;
  initialNome?: string;
  initialTipo?: TipoLista;
  titulo?: string;
  isSubmitting?: boolean;
}

export function CriarListaModal({
  open,
  onClose,
  onConfirm,
  initialNome = "",
  initialTipo,
  titulo = "Nova lista",
  isSubmitting = false,
}: CriarListaModalProps) {
  const nomeInputRef = useRef<HTMLInputElement>(null);
  const [nome, setNome] = useState(initialNome);
  const [tipoLista, setTipoLista] = useState<TipoFinanceiro | "">(
    initialTipo ? mapBackendToFrontend(initialTipo) : "",
  );
  const [orcamento, setOrcamento] = useState("");
  const [localCompra, setLocalCompra] = useState("");
  const [nomeError, setNomeError] = useState<string | null>(null);
  const [tipoError, setTipoError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setNome(initialNome);
      setTipoLista(initialTipo ? mapBackendToFrontend(initialTipo) : "");
      setOrcamento("");
      setLocalCompra("");
      setNomeError(null);
      setTipoError(null);
    }
  }, [open, initialNome, initialTipo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    if (!nome.trim()) {
      setNomeError("O nome da lista é obrigatório.");
      valid = false;
    }
    if (!tipoLista) {
      setTipoError("Selecione um tipo de lista.");
      valid = false;
    }
    if (!valid) {
      if (!nome.trim()) nomeInputRef.current?.focus();
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    const metadata: Record<string, any> = {};
    if (orcamento) {
      const v = parseFloat(orcamento);
      if (!isNaN(v) && v >= 0) metadata.orcamento = v;
    }
    if (tipoLista === "compras" && localCompra)
      metadata.localCompra = localCompra;
    onConfirm(
      nome.trim(),
      mapFrontendToBackend(tipoLista!) as TipoLista,
      metadata,
    );
  };

  return (
    <GlassModal open={open} onClose={onClose}>
      <GlassModalHeader
        title={titulo}
        description="Crie uma lista para controlar seus gastos, despesas ou receitas."
        icon={ListTodo}
        accent={ACCENT}
        onClose={onClose}
      />

      <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
        <GlassInput
          label="Nome da lista *"
          placeholder="Ex: Gastos do mês"
          value={nome}
          onChange={(e) => {
            setNome(e.target.value);
            if (nomeError) setNomeError(null);
          }}
          disabled={isSubmitting}
          error={nomeError}
        />

        {/* Tipo selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground/70">
            Tipo da lista *
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {TIPO_OPTS.map((opt) => {
              const active = tipoLista === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setTipoLista(opt.value);
                    if (tipoError) setTipoError(null);
                  }}
                  disabled={isSubmitting}
                  className={cn(
                    "flex flex-col items-start px-3 py-2.5 rounded-xl border text-left transition-all",
                    active
                      ? "border-transparent"
                      : "border-border/50 hover:border-border bg-muted/30 hover:bg-muted/50",
                  )}
                  style={
                    active
                      ? {
                          background: `${ACCENT}15`,
                          border: `1px solid ${ACCENT}40`,
                        }
                      : {}
                  }
                >
                  <span
                    className="text-xs font-semibold"
                    style={active ? { color: ACCENT } : {}}
                  >
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground/50 mt-0.5">
                    {opt.desc}
                  </span>
                </button>
              );
            })}
          </div>
          {tipoError && <p className="text-xs text-destructive">{tipoError}</p>}
        </div>

        <GlassInput
          label="Orçamento (opcional)"
          type="number"
          step="0.01"
          min="0"
          placeholder="R$ 0,00"
          value={orcamento}
          onChange={(e) => setOrcamento(e.target.value)}
          disabled={isSubmitting}
        />

        {tipoLista === "compras" && (
          <GlassInput
            label="Local de compra (opcional)"
            placeholder="Ex: Mercado, Farmácia..."
            value={localCompra}
            onChange={(e) => setLocalCompra(e.target.value)}
            disabled={isSubmitting}
          />
        )}
        <GlassModalFooter>
          <GlassButton
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </GlassButton>
          <GlassButton
            type="submit"
            disabled={isSubmitting}
            style={{ background: ACCENT, boxShadow: `0 4px 12px ${ACCENT}35` }}
            className="text- hover:opacity-90 bg-transparent"
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Salvar
          </GlassButton>
        </GlassModalFooter>
      </form>
    </GlassModal>
  );
}
