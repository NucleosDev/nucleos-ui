// src/components/colecoes/GerenciarCamposModal.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCampos } from "@/hooks/useColecoes";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, X, Check, GripVertical } from "lucide-react";
import type { TipoCampo } from "@/types/colecao";
import { cn } from "@/lib/utils";

interface GerenciarCamposModalProps {
  open: boolean;
  onClose: () => void;
  colecaoId: string;
  colecaoNome?: string;
  onRefresh?: () => void;
}

const TIPO_CONFIGS: Record<
  string,
  { label: string; icon: string; color: string; bgColor: string }
> = {
  texto: {
    label: "Texto",
    icon: "Aa",
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
  },
  numero: {
    label: "Número",
    icon: "#",
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
  },
  data: {
    label: "Data",
    icon: "📅",
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200",
  },
  booleano: {
    label: "Sim/Não",
    icon: "✓",
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200",
  },
};

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!novoNome.trim()) return;
    setIsSubmitting(true);
    try {
      await criarCampo({ nome: novoNome, tipoCampo: novoTipo });
      setNovoNome("");
      toast({ title: "Campo adicionado!" });
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
      toast({ title: "Campo atualizado!" });
      onRefresh?.();
    } catch {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm("Remover este campo? Todos os dados associados serão perdidos.")
    )
      return;
    setIsSubmitting(true);
    try {
      await excluirCampo(id);
      toast({ title: "Campo removido!" });
      onRefresh?.();
    } catch {
      toast({ title: "Erro ao remover", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Gerenciar Campos
            {colecaoNome && (
              <span className="text-base font-normal text-muted-foreground ml-2">
                {colecaoNome}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          {/* Adicionar novo campo */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Novo Campo
            </h3>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Nome
                </Label>
                <Input
                  placeholder="Ex: Título, Preço, Data de Criação..."
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  disabled={isSubmitting}
                  className="h-9 border-blue-300 focus:border-blue-500"
                />
              </div>
              <div className="w-40">
                <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Tipo
                </Label>
                <Select
                  value={novoTipo}
                  onValueChange={(v) => setNovoTipo(v as TipoCampo)}
                >
                  <SelectTrigger className="h-9 border-blue-300 focus:border-blue-500">
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
                onClick={handleAdd}
                disabled={isSubmitting || !novoNome.trim()}
                className="h-9 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
          {/* Lista de campos */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <div className="text-sm font-semibold text-slate-900 px-1 mb-3">
              Campos ({campos.length})
            </div>
            {campos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                <div className="inline-flex h-12 w-12 rounded-lg bg-slate-100 items-center justify-center mb-3">
                  <Plus className="h-5 w-5 text-slate-400" />
                </div>
                <p>Nenhum campo ainda.</p>
                <p className="text-xs">Adicione seu primeiro campo acima.</p>
              </div>
            ) : (
              campos.map((campo, index) => {
                const config = TIPO_CONFIGS[campo.tipoCampo];
                return (
                  <div
                    key={campo.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      config.bgColor,
                    )}
                  >
                    {editandoId === campo.id ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          value={editNome}
                          onChange={(e) => setEditNome(e.target.value)}
                          className="h-8 flex-1"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdate(campo.id)}
                          disabled={isSubmitting}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditandoId(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-xs font-semibold text-slate-700">
                            {index + 1}
                          </div>
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-white">
                            <span
                              className={cn(
                                "text-xs font-semibold",
                                config.color,
                              )}
                            >
                              {config.icon}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">
                              {campo.nome}
                            </p>
                            <p className="text-xs text-slate-600">
                              {config.label}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setEditandoId(campo.id);
                              setEditNome(campo.nome || "");
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(campo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
