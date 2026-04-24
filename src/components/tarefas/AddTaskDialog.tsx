// src/components/tarefas/AddTaskDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TarefaPrioridade } from "@/types/tarefas";

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (
    titulo: string,
    prioridade: TarefaPrioridade,
    dataVencimento?: string,
  ) => Promise<boolean>;
  isSubmitting?: boolean;
}

export function AddTaskDialog({
  open,
  onClose,
  onAdd,
  isSubmitting = false,
}: AddTaskDialogProps) {
  const [titulo, setTitulo] = useState("");
  const [prioridade, setPrioridade] = useState<TarefaPrioridade>("media");
  const [dataVencimento, setDataVencimento] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    const success = await onAdd(
      titulo.trim(),
      prioridade,
      dataVencimento || undefined,
    );
    if (success) {
      setTitulo("");
      setPrioridade("media");
      setDataVencimento("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova tarefa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              placeholder="O que precisa ser feito?"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              autoFocus
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select
                value={prioridade}
                onValueChange={(v) => setPrioridade(v as TarefaPrioridade)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">🔵 Baixa</SelectItem>
                  <SelectItem value="media">🟡 Média</SelectItem>
                  <SelectItem value="alta">🔴 Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataVencimento">
                Data de vencimento (opcional)
              </Label>
              <Input
                id="dataVencimento"
                type="date"
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !titulo.trim()}>
              {isSubmitting ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
