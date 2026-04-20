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
import { Switch } from "@/components/ui/switch";
import { useItensColecao } from "@/hooks/useColecoes";
import { toast } from "@/hooks/use-toast";
import type { Campo } from "@/types/colecao";

interface AdicionarItemColecaoModalProps {
  open: boolean;
  onClose: () => void;
  colecaoId: string;
  campos: Campo[];
}

export function AdicionarItemColecaoModal({
  open,
  onClose,
  colecaoId,
  campos,
}: AdicionarItemColecaoModalProps) {
  const { criarItem } = useItensColecao(colecaoId);
  const [valores, setValores] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await criarItem(valores);
      toast({ title: "Item adicionado!" });
      onClose();
    } catch (error) {
      toast({ title: "Erro ao adicionar item", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (campoId: string, value: any) => {
    setValores((prev) => ({ ...prev, [campoId]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {campos.map((campo) => (
            <div key={campo.id} className="space-y-2">
              <Label>{campo.nome}</Label>
              {campo.tipoCampo === "texto" && (
                <Input
                  value={valores[campo.id] || ""}
                  onChange={(e) => handleChange(campo.id, e.target.value)}
                  disabled={isSubmitting}
                />
              )}
              {campo.tipoCampo === "numero" && (
                <Input
                  type="number"
                  value={valores[campo.id] || ""}
                  onChange={(e) =>
                    handleChange(campo.id, parseFloat(e.target.value))
                  }
                  disabled={isSubmitting}
                />
              )}
              {campo.tipoCampo === "data" && (
                <Input
                  type="date"
                  value={valores[campo.id] || ""}
                  onChange={(e) => handleChange(campo.id, e.target.value)}
                  disabled={isSubmitting}
                />
              )}
              {campo.tipoCampo === "booleano" && (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={valores[campo.id] || false}
                    onCheckedChange={(checked) =>
                      handleChange(campo.id, checked)
                    }
                    disabled={isSubmitting}
                  />
                  <span>{valores[campo.id] ? "Sim" : "Não"}</span>
                </div>
              )}
            </div>
          ))}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
