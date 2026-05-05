"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Table2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { TipoCampo } from "@/types/colecao";

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

  const removerCampo = (tempId: string) => {
    setCampos(campos.filter((c) => c.tempId !== tempId));
  };

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
    } catch (err) {
      console.error("[v0] Erro ao criar tabela:", err);
      setErro("Erro ao criar tabela");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-blue-100">
              <Table2 className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle className="text-xl">Criar Tabela Rápida</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Crie uma nova tabela com campos predefinidos. Você pode adicionar
            mais dados depois.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Nome da tabela */}
          <div className="space-y-2">
            <Label htmlFor="tabela-nome" className="text-sm font-semibold">
              Nome da Tabela
            </Label>
            <Input
              id="tabela-nome"
              placeholder="Ex: Contatos, Produtos, Pedidos..."
              value={tabelaNome}
              onChange={(e) => {
                setTabelaNome(e.target.value);
                setErro(null);
              }}
              disabled={isSubmitting}
              className="h-10 border-slate-300 focus:border-blue-500"
            />
          </div>

          {/* Adicionar campos */}
          <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-slate-900">
              Campos da Tabela
            </h3>

            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Nome do campo"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  disabled={isSubmitting}
                  className="h-9 text-sm border-blue-300 focus:border-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && adicionarCampo()}
                />
              </div>
              <div className="w-32">
                <Select
                  value={novoTipo}
                  onValueChange={(v) => setNovoTipo(v as TipoCampo)}
                >
                  <SelectTrigger className="h-9 text-sm border-blue-300 focus:border-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="texto">Texto</SelectItem>
                    <SelectItem value="numero">Número</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="booleano">Sim/Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                onClick={adicionarCampo}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {erro && (
              <p className="text-xs text-destructive font-medium">{erro}</p>
            )}

            {/* Lista de campos */}
            {campos.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  {campos.length} campo{campos.length !== 1 ? "s" : ""}{" "}
                  adicionado{campos.length !== 1 ? "s" : ""}
                </p>
                <div className="space-y-2">
                  {campos.map((campo) => (
                    <div
                      key={campo.tempId}
                      className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div className="text-xs font-semibold text-blue-600 w-12">
                          {campo.tipo === "texto" && "Aa"}
                          {campo.tipo === "numero" && "#"}
                          {campo.tipo === "data" && "📅"}
                          {campo.tipo === "booleano" && "✓"}
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {campo.nome}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({campo.tipo})
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                        onClick={() => removerCampo(campo.tempId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-24"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || campos.length === 0 || !tabelaNome.trim()
              }
              className="w-32 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Criando..." : "Criar Tabela"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
