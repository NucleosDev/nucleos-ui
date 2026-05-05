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
import { Table2 } from "lucide-react";
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-blue-100">
              <Table2 className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle className="text-xl">{titulo}</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Crie uma nova coleção para organizar seus dados. Você poderá
            adicionar campos e itens depois.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-semibold">
              Nome da coleção
            </Label>
            <Input
              id="nome"
              placeholder="Ex: Biblioteca de Filmes, Clientes..."
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                setError(null);
              }}
              autoFocus
              disabled={isSubmitting}
              className="h-10 border-slate-300 focus:border-blue-500"
            />
            {error && (
              <p className="text-xs text-destructive font-medium">{error}</p>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-24"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !nome.trim()}
              className="w-24 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Salvando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
