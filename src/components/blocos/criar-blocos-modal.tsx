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
import { TIPO_BLOCO_META, TIPOS_BLOCO } from "@/lib/bloco-utils";
import type { BlocoTipo, CreateBlocoPayload } from "@/types/bloco";

interface CriarBlocoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (payload: CreateBlocoPayload) => Promise<void>;
  nucleoId: string;
  isCreating?: boolean;
}

export function CriarBlocoModal({
  open,
  onClose,
  onConfirm,
  nucleoId,
  isCreating = false,
}: CriarBlocoModalProps) {
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState<BlocoTipo>("tarefas");

  const handleSubmit = async () => {
    const payload = { nucleoId, tipo, titulo: titulo.trim() || undefined };
    console.log("Payload enviado:", JSON.stringify(payload));
    await onConfirm(payload);
    await onConfirm({
      nucleoId,
      tipo,
      titulo: titulo.trim() || undefined,
    });
    setTitulo("");
    setTipo("tarefas");
    onClose();
  };

  const Icone = TIPO_BLOCO_META[tipo].icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar novo bloco</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título (opcional)</Label>
            <Input
              id="titulo"
              placeholder="Ex: Tarefas da semana"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo do bloco</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as BlocoTipo)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_BLOCO.map((t) => {
                  const ItemIcon = TIPO_BLOCO_META[t].icon;
                  return (
                    <SelectItem key={t} value={t}>
                      <div className="flex items-center gap-2">
                        <ItemIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{TIPO_BLOCO_META[t].rotulo}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-start gap-3">
              <div className="rounded-md bg-background p-2">
                <Icone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {TIPO_BLOCO_META[tipo].rotulo}
                </p>
                <p className="text-xs text-muted-foreground">
                  {TIPO_BLOCO_META[tipo].descricao}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating}>
            {isCreating ? "Criando..." : "Criar bloco"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
