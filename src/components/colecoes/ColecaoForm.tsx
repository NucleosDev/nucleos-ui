// components/colecoes/ColecaoForm.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ColecaoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: { id?: string; nome?: string };
  onSubmit: (nome: string) => Promise<void>;
  isLoading?: boolean;
}

export function ColecaoForm({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isLoading = false,
}: ColecaoFormProps) {
  const [nome, setNome] = useState("");

  // Sincroniza o campo nome quando o modal abre ou os dados iniciais mudam
  useEffect(() => {
    if (open) {
      setNome(initialData?.nome || "");
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNome = nome.trim();
    if (!trimmedNome) return;
    await onSubmit(trimmedNome);
    // O formulário será fechado pelo pai via onOpenChange após sucesso
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setNome(""); // limpa ao fechar
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Editar Coleção" : "Nova Coleção"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="colecao-nome">Nome da Coleção</Label>
              <Input
                id="colecao-nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Artigos, Tarefas..."
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="mt-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !nome.trim()}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
