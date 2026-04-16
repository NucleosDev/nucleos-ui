"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

interface CriarListaModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (nome: string, tipoLista: string) => void;
  initialNome?: string;
  initialTipo?: string;
  titulo?: string;
}

export function CriarListaModal({
  open,
  onClose,
  onConfirm,
  initialNome = "",
  initialTipo = "generica",
  titulo = "Nova lista",
}: CriarListaModalProps) {
  const [nome, setNome] = useState(initialNome);
  const [tipoLista, setTipoLista] = useState(initialTipo);

  useEffect(() => {
    if (open) {
      setNome(initialNome);
      setTipoLista(initialTipo);
    }
  }, [open, initialNome, initialTipo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim()) {
      onConfirm(nome.trim(), tipoLista);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da lista</Label>
            <Input
              id="nome"
              placeholder="Ex: Compras do mês"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo da lista</Label>
            <Select value={tipoLista} onValueChange={setTipoLista}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="generica">Geral</SelectItem>
                <SelectItem value="compras">Compras</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
