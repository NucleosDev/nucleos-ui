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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { FrequenciaHabito } from "@/types/habitos";

const diasSemanaLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface CriarHabitoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    nome: string;
    frequencia: FrequenciaHabito;
    diasSemana?: number[];
    metaVezes?: number;
  }) => Promise<void>;
  initialData?: {
    nome: string;
    frequencia: FrequenciaHabito;
    diasSemana?: number[];
    metaVezes?: number;
  };
  isSubmitting?: boolean;
  titulo?: string;
}

export function CriarHabitoModal({
  open,
  onClose,
  onConfirm,
  initialData,
  isSubmitting = false,
  titulo = "Novo hábito",
}: CriarHabitoModalProps) {
  const [nome, setNome] = useState("");
  const [frequencia, setFrequencia] = useState<FrequenciaHabito>("diaria");
  const [diasSemana, setDiasSemana] = useState<number[]>([]);
  const [metaVezes, setMetaVezes] = useState<number>(1);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setNome(initialData.nome);
        setFrequencia(initialData.frequencia);
        setDiasSemana(initialData.diasSemana || []);
        setMetaVezes(initialData.metaVezes || 1);
      } else {
        setNome("");
        setFrequencia("diaria");
        setDiasSemana([]);
        setMetaVezes(1);
      }
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    await onConfirm({
      nome: nome.trim(),
      frequencia,
      diasSemana: frequencia === "semanal" ? diasSemana : undefined,
      metaVezes,
    });
  };

  const toggleDia = (dia: number) => {
    setDiasSemana((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>
            Crie um hábito para acompanhar sua consistência.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do hábito</Label>
            <Input
              id="nome"
              placeholder="Ex: Meditar, Ler, Exercitar..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequencia">Frequência</Label>
            <Select
              value={frequencia}
              onValueChange={(v) => setFrequencia(v as FrequenciaHabito)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diaria">Diária</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="personalizada">Personalizada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {frequencia === "semanal" && (
            <div className="space-y-2">
              <Label>Dias da semana</Label>
              <ToggleGroup type="multiple" className="grid grid-cols-7 gap-1">
                {diasSemanaLabels.map((label, index) => (
                  <ToggleGroupItem
                    key={index}
                    value={index.toString()}
                    onClick={() => toggleDia(index)}
                    className="h-9 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="meta">Meta diária (vezes)</Label>
            <Input
              id="meta"
              type="number"
              min={1}
              max={99}
              value={metaVezes}
              onChange={(e) => setMetaVezes(parseInt(e.target.value) || 1)}
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
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
