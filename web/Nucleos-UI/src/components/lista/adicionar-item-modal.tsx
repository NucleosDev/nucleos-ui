// components/listas/adicionar-item-modal.tsx
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
import type { CreateItemListaPayload, ItemLista } from "@/types/lista"; // 👈 importação adicionada

interface AdicionarItemModalProps {
  open: boolean;
  onClose: () => void;
  listaId: string;
  onItemCreated: (payload: CreateItemListaPayload) => Promise<ItemLista>;
}

export function AdicionarItemModal({
  open,
  onClose,
  listaId,
  onItemCreated,
}: AdicionarItemModalProps) {
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [valorUnitario, setValorUnitario] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nome.trim()) return;
    setLoading(true);
    try {
      await onItemCreated({
        listaId,
        nome,
        quantidade,
        valorUnitario: valorUnitario ? parseFloat(valorUnitario) : undefined,
      });
      setNome("");
      setQuantidade(1);
      setValorUnitario("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Leite"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                min={1}
                value={quantidade}
                onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label htmlFor="valor">Valor unit. (opcional)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={valorUnitario}
                onChange={(e) => setValorUnitario(e.target.value)}
                placeholder="R$"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
