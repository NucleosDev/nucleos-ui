// components/colecoes/CriarColecaoModal.tsx
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

interface CriarColecaoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (nome: string) => void;
  initialNome?: string;
  titulo?: string;
}

export function CriarColecaoModal({
  open,
  onClose,
  onConfirm,
  initialNome = "",
  titulo = "Nova coleção",
}: CriarColecaoModalProps) {
  const [nome, setNome] = useState(initialNome);

  // Reset quando abrir com novo initialNome
  useEffect(() => {
    if (open) {
      setNome(initialNome);
    }
  }, [open, initialNome]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nome.trim()) {
      onConfirm(nome.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Nome da coleção"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoFocus
          />
          <DialogFooter className="mt-4">
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
