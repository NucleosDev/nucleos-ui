"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { TipoLista } from "@/types/lista";

type TipoFinanceiro = "gastos" | "despesas" | "receitas" | "compras";

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
  const [orcamento, setOrcamento] = useState<string>("");
  const [localCompra, setLocalCompra] = useState<string>("");

  // Estados de erro
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

  const validateFields = (): boolean => {
    let isValid = true;

    if (!nome.trim()) {
      setNomeError("O nome da lista é obrigatório.");
      isValid = false;
    } else {
      setNomeError(null);
    }

    if (!tipoLista) {
      setTipoError("Selecione um tipo de lista.");
      isValid = false;
    } else {
      setTipoError(null);
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      // Foca no primeiro campo com erro
      if (!nome.trim()) {
        nomeInputRef.current?.focus();
      }
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios para continuar.",
        variant: "destructive",
      });
      return;
    }

    const metadata: Record<string, any> = {};
    if (orcamento) {
      const valor = parseFloat(orcamento);
      if (!isNaN(valor) && valor >= 0) {
        metadata.orcamento = valor;
      }
    }
    if (tipoLista === "compras" && localCompra) {
      metadata.localCompra = localCompra;
    }

    const tipoParaBackend = mapFrontendToBackend(tipoLista);
    onConfirm(nome.trim(), tipoParaBackend as TipoLista, metadata);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>
            Crie uma lista para controlar seus gastos, despesas ou receitas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome da lista */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="flex items-center gap-1">
              Nome da lista
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nome"
              ref={nomeInputRef}
              placeholder="Ex: Gastos do mês"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                if (nomeError) setNomeError(null);
              }}
              className={cn(nomeError && "border-destructive")}
              disabled={isSubmitting}
            />
            {nomeError && (
              <p className="text-xs text-destructive">{nomeError}</p>
            )}
          </div>

          {/* Tipo da lista */}
          <div className="space-y-2">
            <Label htmlFor="tipo" className="flex items-center gap-1">
              Tipo da lista
              <span className="text-destructive">*</span>
            </Label>
            <Select
              value={tipoLista}
              onValueChange={(v) => {
                setTipoLista(v as TipoFinanceiro);
                if (tipoError) setTipoError(null);
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger className={cn(tipoError && "border-destructive")}>
                <SelectValue placeholder="Escolha o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="" disabled>
                  Escolha o tipo
                </SelectItem>
                <SelectItem value="gastos">Gastos</SelectItem>
                <SelectItem value="despesas">Despesas</SelectItem>
                <SelectItem value="receitas">Receitas</SelectItem>
                <SelectItem value="compras">Compras</SelectItem>
              </SelectContent>
            </Select>
            {tipoError && (
              <p className="text-xs text-destructive">{tipoError}</p>
            )}
          </div>

          {/* Orçamento (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="orcamento">Orçamento (opcional)</Label>
            <Input
              id="orcamento"
              type="number"
              step="0.01"
              min="0"
              placeholder="R$ 0,00"
              value={orcamento}
              onChange={(e) => setOrcamento(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Define um limite de gastos para esta lista.
            </p>
          </div>

          {/* Local de compra (apenas para compras) */}
          {tipoLista === "compras" && (
            <div className="space-y-2">
              <Label htmlFor="local">Local de compra (opcional)</Label>
              <Input
                id="local"
                placeholder="Ex: Mercado, Farmácia..."
                value={localCompra}
                onChange={(e) => setLocalCompra(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
