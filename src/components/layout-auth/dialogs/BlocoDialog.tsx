"use client";

"use client";

import { useEffect, useState } from "react";
import type { BlocoTipo, Bloco } from "@/src/types/bloco";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BlocoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bloco?: Bloco | null;
  nucleoId: string;
  isPending: boolean;
  onSubmit: (data: { nome: string; tipo: string; descricao?: string }) => void;
}

export function BlocoDialog({
  open,
  onOpenChange,
  bloco,
  nucleoId,
  onSubmit,
  isPending,
}: BlocoDialogProps) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<BlocoTipo>("tarefas");
  const [descricao, setDescricao] = useState("");

  // 🔥 Preenche quando está editando
  useEffect(() => {
    if (bloco) {
      setNome(bloco.titulo ?? "");
      setTipo(bloco.tipo ?? "tarefas");
      setDescricao(bloco.configuracoes?.descricao ?? "");
    } else {
      setNome("");
      setTipo("tarefas");
      setDescricao("");
    }
  }, [bloco]);

  function handleSubmit() {
    if (!nome.trim()) return;

    onSubmit({
      nome,
      tipo,
      descricao,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bloco ? "Editar bloco" : "Novo bloco"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Nome */}
          <div className="space-y-1">
            <Label>Nome</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Estudos, Trabalho..."
            />
          </div>

          {/* Tipo */}
          <div className="space-y-1">
            <Label>Tipo</Label>
            <select
              value={tipo}
             onChange={(e) => setTipo(e.target.value as BlocoTipo)}
              className="w-full border rounded-md h-9 px-2 text-sm bg-background"
            >
              <option value="tarefas">Tarefas</option>
              <option value="notas">Notas</option>
              <option value="links">Links</option>
            </select>
          </div>

          {/* Descrição */}
          <div className="space-y-1">
            <Label>Descrição</Label>
            <Input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Opcional"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>

          <Button onClick={handleSubmit} disabled={isPending || !nome.trim()}>
            {isPending ? "Salvando..." : bloco ? "Salvar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
