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

const TIPO_ICONS: Record<string, string> = {
  texto: "ABC",
  numero: "123",
  data: "📅",
  booleano: "✓",
};
const TIPO_LABELS: Record<string, string> = {
  texto: "Texto",
  numero: "Número",
  data: "Data",
  booleano: "Sim/Não",
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Campos da coleção {colecaoNome && `- ${colecaoNome}`}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label className="text-xs">Nome do campo</Label>
              <Input
                placeholder="Ex: Título, Preço..."
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                disabled={isSubmitting}
                className="h-9"
              />
            </div>
            <div className="w-28">
              <Label className="text-xs">Tipo</Label>
              <Select
                value={novoTipo}
                onValueChange={(v) => setNovoTipo(v as TipoCampo)}
              >
                <SelectTrigger className="h-9">
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
              className="h-9"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {campos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Nenhum campo ainda. Adicione seu primeiro campo acima.
              </div>
            ) : (
              campos.map((campo, index) => (
                <div
                  key={campo.id}
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                >
                  {editandoId === campo.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editNome}
                        onChange={(e) => setEditNome(e.target.value)}
                        className="h-8"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(campo.id)}
                        disabled={isSubmitting}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditandoId(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-6 text-muted-foreground text-xs">
                          {index + 1}
                        </div>
                        <div className="w-12 text-center">
                          <span className="text-xs font-mono bg-background px-2 py-0.5 rounded">
                            {TIPO_ICONS[campo.tipoCampo] || "📌"}
                          </span>
                        </div>
                        <span className="font-medium">{campo.nome}</span>
                        <span className="text-xs text-muted-foreground">
                          {TIPO_LABELS[campo.tipoCampo]}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            setEditandoId(campo.id);
                            setEditNome(campo.nome || "");
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleDelete(campo.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
