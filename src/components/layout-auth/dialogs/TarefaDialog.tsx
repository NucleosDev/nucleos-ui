"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Spinner } from "@/components/ui/spinner";
import type { Tarefa, TarefaPrioridade } from "@/src/types/tarefas";

const schema = z.object({
  titulo: z.string().min(1, "Título obrigatório").max(120),
  descricao: z.string().optional(),
  prioridade: z.enum(["baixa", "media", "alta"] as const),
  dataVencimento: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface TarefaDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tarefa?: Tarefa | null;
  onSubmit: (data: FormData) => void;
  isPending?: boolean;
}

export function TarefaDialog({
  open,
  onOpenChange,
  tarefa,
  onSubmit,
  isPending,
}: TarefaDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      titulo: "",
      descricao: "",
      prioridade: "media",
      dataVencimento: "",
    },
  });

  useEffect(() => {
    if (tarefa) {
      reset({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao ?? "",
        prioridade: tarefa.prioridade,
        dataVencimento: tarefa.dataVencimento?.split("T")[0] ?? "",
      });
    } else {
      reset({
        titulo: "",
        descricao: "",
        prioridade: "media",
        dataVencimento: "",
      });
    }
  }, [tarefa, open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tarefa ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="titulo-tarefa">Título</Label>
            <Input
              id="titulo-tarefa"
              placeholder="Ex: Revisar relatório"
              {...register("titulo")}
              aria-invalid={!!errors.titulo}
            />
            {errors.titulo && (
              <p className="text-xs text-destructive">
                {errors.titulo.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="desc-tarefa">Descrição (opcional)</Label>
            <Textarea
              id="desc-tarefa"
              placeholder="Detalhes da tarefa..."
              rows={3}
              className="resize-none"
              {...register("descricao")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Prioridade</Label>
              <Select
                defaultValue={tarefa?.prioridade ?? "media"}
                onValueChange={(v) =>
                  setValue("prioridade", v as TarefaPrioridade)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="vencimento-tarefa">Vencimento</Label>
              <Input
                id="vencimento-tarefa"
                type="date"
                {...register("dataVencimento")}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner className="mr-2 h-3.5 w-3.5" />}
              {tarefa ? "Salvar alterações" : "Criar tarefa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
