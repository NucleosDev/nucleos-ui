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
import { Checkbox } from "@/components/ui/checkbox";
import { Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TarefaPrioridade } from "@/types/tarefas";

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (
    titulo: string,
    prioridade: TarefaPrioridade,
    dataVencimento?: string,
    metadata?: {
      isRecorrente?: boolean;
      recorrenciaTipo?: "diaria" | "semanal" | "mensal";
    },
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
  const [isRecorrente, setIsRecorrente] = useState(false);
  const [recorrenciaTipo, setRecorrenciaTipo] = useState<
    "diaria" | "semanal" | "mensal"
  >("diaria");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    const metadata = isRecorrente
      ? { isRecorrente: true, recorrenciaTipo }
      : undefined;

    const success = await onAdd(
      titulo.trim(),
      prioridade,
      dataVencimento || undefined,
      metadata,
    );

    if (success) {
      // Reset form
      setTitulo("");
      setPrioridade("media");
      setDataVencimento("");
      setIsRecorrente(false);
      setRecorrenciaTipo("diaria");
      onClose();
    }
  };

  const getRecorrenciaLabel = (tipo: string) => {
    switch (tipo) {
      case "diaria":
        return "Todo dia";
      case "semanal":
        return "Toda semana";
      case "mensal":
        return "Todo mês";
      default:
        return "";
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
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">🟢 Baixa</SelectItem>
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

          <div className="space-y-3 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isRecorrente"
                checked={isRecorrente}
                onCheckedChange={(checked) => setIsRecorrente(checked === true)}
                disabled={isSubmitting}
              />
              <Label
                htmlFor="isRecorrente"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Repeat className="h-4 w-4" />
                Tarefa recorrente
              </Label>
            </div>

            {isRecorrente && (
              <div className="ml-6">
                <Select
                  value={recorrenciaTipo}
                  onValueChange={(v) =>
                    setRecorrenciaTipo(v as "diaria" | "semanal" | "mensal")
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diaria">🔄 Todo dia</SelectItem>
                    <SelectItem value="semanal">📅 Toda semana</SelectItem>
                    <SelectItem value="mensal">📆 Todo mês</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Esta tarefa será repetida{" "}
                  {getRecorrenciaLabel(recorrenciaTipo).toLowerCase()}
                </p>
              </div>
            )}
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
