// src/components/colecoes/CriarColecaoModal.tsx
"use client";

import { useState, useEffect } from "react";
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

interface CriarColecaoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (nome: string) => Promise<void>;
  initialNome?: string;
  titulo?: string;
  isSubmitting?: boolean;
}

export function CriarColecaoModal({
  open,
  onClose,
  onConfirm,
  initialNome = "",
  titulo = "Nova coleção",
  isSubmitting = false,
}: CriarColecaoModalProps) {
  const [nome, setNome] = useState(initialNome);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setNome(initialNome);
      setError(null);
    }
  }, [open, initialNome]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setError("O nome da coleção é obrigatório.");
      return;
    }
    await onConfirm(nome.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>
            Dê um nome para sua coleção. Você poderá adicionar campos depois.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da coleção</Label>
            <Input
              id="nome"
              placeholder="Ex: Biblioteca de Filmes"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                setError(null);
              }}
              autoFocus
              disabled={isSubmitting}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !nome.trim()}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
