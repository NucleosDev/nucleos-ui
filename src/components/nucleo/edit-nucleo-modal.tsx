// src/components/nucleo/ui/edit-nucleo-modal.tsx
"use client";

import { useState, useEffect } from "react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nucleosService } from "@/services/nucleos.service";
import type { Nucleo } from "@/types/nucleo";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
});

type FormData = z.infer<typeof formSchema>;

interface EditNucleoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nucleo:
    | (Nucleo & {
        xpTotal?: number;
        level?: number;
        nextLevelXp?: number;
        currentXp?: number;
        conquistas?: number;
        xpHoje?: number;
        conquistasDesbloqueadas?: number;
      })
    | null;
  onSuccess?: () => void; // Renomeado para onSuccess para deixar claro que é apenas callback
}

export function EditNucleoModal({
  open,
  onOpenChange,
  nucleo,
  onSuccess,
}: EditNucleoModalProps) {
  const queryClient = useQueryClient();
  const [tipoCustom, setTipoCustom] = useState(false);
  const [customTipo, setCustomTipo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (nucleo) {
      reset({
        nome: nucleo.nome,
        descricao: nucleo.descricao || "",
        tipo: nucleo.tipo || "pessoal",
        corDestaque: nucleo.corDestaque || "#6366f1",
        imagemCapa: nucleo.imagemCapa || "",
      });
      const isCustom = nucleo.tipo && !tiposPredefinidos.includes(nucleo.tipo);
      setTipoCustom(isCustom || false);
      if (isCustom && nucleo.tipo) setCustomTipo(nucleo.tipo);
    }
  }, [nucleo, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Nucleo>) =>
      nucleosService.update(nucleo!.id, data),
    onSuccess: () => {
      // Invalida as queries para atualizar os dados
      queryClient.invalidateQueries({ queryKey: ["nucleos"] });
      queryClient.invalidateQueries({ queryKey: ["nucleo", nucleo?.id] });

      // Fecha o modal
      onOpenChange(false);

      // Chama o callback de sucesso (sem redirecionamento)
      if (onSuccess) {
        onSuccess();
      }

      // Reseta o formulário
      reset();
    },
  });

  const onSubmit = (data: FormData) => {
    if (!nucleo) return;
    const payload: Partial<Nucleo> = {
      nome: data.nome,
      descricao: data.descricao,
      tipo: tipoCustom ? customTipo : data.tipo,
      corDestaque: data.corDestaque,
      imagemCapa: data.imagemCapa?.trim() || undefined,
    };
    updateMutation.mutate(payload);
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
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-0 gap-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative overflow-hidden rounded-t-2xl bg-gradient-to-r from-[#4D7CFF]/10 to-[#00C9A7]/10 border-b border-border/50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] p-2 shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] bg-clip-text text-transparent">
                Editar Núcleo
              </DialogTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Faça as alterações desejadas no seu núcleo
            </p>
          </DialogHeader>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6 pt-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="space-y-2"
          >
            <Label htmlFor="nome" className="text-sm font-semibold">
              Nome do Núcleo
            </Label>
            <Input
              id="nome"
              placeholder="Ex: Estudos, Saúde, Trabalho..."
              {...register("nome")}
              className="transition-all focus:ring-2 focus:ring-[#4D7CFF]/20"
            />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="descricao" className="text-sm font-semibold">
              Descrição
            </Label>
            <Textarea
              id="descricao"
              placeholder="Descreva o propósito deste Núcleo..."
              rows={3}
              {...register("descricao")}
              className="transition-all focus:ring-2 focus:ring-[#4D7CFF]/20"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-2"
          >
            <Label htmlFor="tipo" className="text-sm font-semibold">
              Tipo
            </Label>
            <Select
              value={tipoCustom ? "__custom__" : selectedTipo}
              onValueChange={handleTipoSelectChange}
            >
              <SelectTrigger className="transition-all focus:ring-2 focus:ring-[#4D7CFF]/20">
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
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Input
                  placeholder="Digite o tipo personalizado"
                  value={customTipo}
                  onChange={(e) => setCustomTipo(e.target.value)}
                  className="mt-2 transition-all focus:ring-2 focus:ring-[#4D7CFF]/20"
                  autoFocus
                />
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label className="text-sm font-semibold">Cor de destaque</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                className="w-12 h-10 p-1 cursor-pointer"
                {...register("corDestaque")}
              />
              <Input
                type="text"
                placeholder="#6366f1"
                className="flex-1 transition-all focus:ring-2 focus:ring-[#4D7CFF]/20"
                {...register("corDestaque")}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-2"
          >
            <Label htmlFor="imagemCapa" className="text-sm font-semibold">
              Imagem de capa (URL)
            </Label>
            <Input
              placeholder="https://... (link direto para a imagem)"
              {...register("imagemCapa")}
              className="transition-all focus:ring-2 focus:ring-[#4D7CFF]/20"
            />
            {errors.imagemCapa && (
              <p className="text-sm text-destructive">
                {errors.imagemCapa.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Deixe em branco para usar uma imagem aleatória
            </p>
          </motion.div>

          {updateMutation.error && (
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-sm text-destructive text-center p-3 rounded-lg bg-destructive/10"
            >
              Erro ao atualizar Núcleo. Tente novamente.
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end gap-3 pt-4 border-t border-border/50"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="transition-all hover:bg-accent"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white hover:opacity-90 transition-all shadow-lg shadow-[#4D7CFF]/20"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Salvar alterações
            </Button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
