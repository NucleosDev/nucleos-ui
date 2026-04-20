"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Plus, Trash2, Pencil } from "lucide-react";
import type { TipoCampo } from "@/types/colecao";

interface GerenciarCamposModalProps {
  open: boolean;
  onClose: () => void;
  colecaoId: string;
  colecaoNome?: string;
}

export function GerenciarCamposModal({
  open,
  onClose,
  colecaoId,
  colecaoNome,
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
      toast({ title: "Erro ao remover", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar campos - {colecaoNome}</DialogTitle>
          <DialogDescription>
            Adicione, edite ou remova campos da coleção.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label htmlFor="campo-nome">Nome do campo</Label>
              <Input
                id="campo-nome"
                placeholder="Ex: Título"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="w-40">
              <Label>Tipo</Label>
              <Select
                value={novoTipo}
                onValueChange={(v) => setNovoTipo(v as TipoCampo)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
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
            >
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {campos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum campo ainda.
              </p>
            ) : (
              campos.map((campo) => (
                <div
                  key={campo.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  {editandoId === campo.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editNome}
                        onChange={(e) => setEditNome(e.target.value)}
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(campo.id)}
                        disabled={isSubmitting}
                      >
                        Salvar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditandoId(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="font-medium">{campo.nome}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({campo.tipoCampo})
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditandoId(campo.id);
                            setEditNome(campo.nome || "");
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleDelete(campo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
