// src/components/nucleo/ui/edit-nucleo-modal.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { NucleoComStats } from "@/types/nucleo";

const tiposPredefinidos = [
  "pessoal",
  "profissional",
  "estudo",
  "projeto",
  "hobby",
  "fitness",
  "financas",
  "idiomas",
];

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  tipo: z.string().default("pessoal"),
  corDestaque: z.string().optional(),
  imagemCapa: z.string().url("URL inválida").optional().or(z.literal("")),
  iconId: z.string().optional(),
});

interface EditNucleoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nucleo: NucleoComStats | null;
  onUpdate: (id: string, data: any) => Promise<void>;
}

export function EditNucleoModal({
  open,
  onOpenChange,
  nucleo,
  onUpdate,
}: EditNucleoModalProps) {
  const [tipoCustom, setTipoCustom] = useState(false);
  const [customTipo, setCustomTipo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (nucleo) {
      reset({
        nome: nucleo.nome,
        descricao: nucleo.descricao || "",
        tipo: nucleo.tipo,
        corDestaque: nucleo.corDestaque || "#6366f1",
        imagemCapa: nucleo.imagemCapa || "",
        iconId: nucleo.iconId || undefined,
      });
      const isCustom = !tiposPredefinidos.includes(nucleo.tipo);
      setTipoCustom(isCustom);
      if (isCustom) setCustomTipo(nucleo.tipo);
    }
  }, [nucleo, reset]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!nucleo) return;
    setIsSubmitting(true);
    try {
      const payload = {
        nome: data.nome,
        descricao: data.descricao,
        tipo: tipoCustom ? customTipo : data.tipo,
        corDestaque: data.corDestaque,
        imagemCapa: data.imagemCapa?.trim() || undefined,
        iconId: data.iconId || undefined,
      };
      await onUpdate(nucleo.id, payload);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTipo = watch("tipo");

  const handleTipoSelectChange = (value: string) => {
    if (value === "__custom__") {
      setTipoCustom(true);
      setValue("tipo", "");
    } else {
      setTipoCustom(false);
      setValue("tipo", value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Nucleo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" {...register("nome")} />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea id="descricao" rows={3} {...register("descricao")} />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={tipoCustom ? "__custom__" : selectedTipo}
              onValueChange={handleTipoSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                {tiposPredefinidos.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </SelectItem>
                ))}
                <SelectItem value="__custom__">Outro (digitar)...</SelectItem>
              </SelectContent>
            </Select>
            {tipoCustom && (
              <Input
                placeholder="Digite o tipo personalizado"
                value={customTipo}
                onChange={(e) => setCustomTipo(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
          <div className="space-y-2">
            <Label>Cor de destaque</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                className="w-12 h-10 p-1"
                {...register("corDestaque")}
              />
              <Input
                type="text"
                placeholder="#6366f1"
                className="flex-1"
                {...register("corDestaque")}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Imagem de capa (URL)</Label>
            <Input placeholder="https://..." {...register("imagemCapa")} />
            {errors.imagemCapa && (
              <p className="text-sm text-destructive">
                {errors.imagemCapa.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Salvar alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
