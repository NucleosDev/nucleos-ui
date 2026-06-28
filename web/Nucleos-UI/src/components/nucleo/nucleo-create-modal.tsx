// components/nucleos/CreateNucleoModal.tsx
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
  DialogTrigger,
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
import type { CreateNucleoPayload } from "@/types/nucleo";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Ícones (mesmo array
import {
  BookOpen,
  Heart,
  Briefcase,
  Home,
  Dumbbell,
  Palette,
  Music,
  Code,
  Trophy,
  Star,
  Globe,
  Coffee,
  Camera,
  Plane,
  ShoppingBag,
  Users,
  Mic,
  Gamepad2,
  Leaf,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

interface IconOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

const iconOptions: IconOption[] = [
  { id: "book-open", label: "Estudos", icon: BookOpen },
  { id: "heart", label: "Saúde", icon: Heart },
  { id: "briefcase", label: "Trabalho", icon: Briefcase },
  { id: "home", label: "Casa", icon: Home },
  { id: "dumbbell", label: "Fitness", icon: Dumbbell },
  { id: "palette", label: "Arte", icon: Palette },
  { id: "music", label: "Música", icon: Music },
  { id: "code", label: "Desenvolvimento", icon: Code },
  { id: "trophy", label: "Metas", icon: Trophy },
  { id: "star", label: "Pessoal", icon: Star },
  { id: "globe", label: "Idiomas", icon: Globe },
  { id: "coffee", label: "Lazer", icon: Coffee },
  { id: "camera", label: "Fotografia", icon: Camera },
  { id: "plane", label: "Viagens", icon: Plane },
  { id: "shopping-bag", label: "Compras", icon: ShoppingBag },
  { id: "users", label: "Família", icon: Users },
  { id: "mic", label: "Podcast", icon: Mic },
  { id: "gamepad-2", label: "Games", icon: Gamepad2 },
  { id: "leaf", label: "Natureza", icon: Leaf },
  { id: "graduation-cap", label: "Educação", icon: GraduationCap },
];

const tiposPredefinidos = [
  "pessoal",
  "profissional",
  "estudo",
  "projeto",
  "hobby",
  "fitness",
  "financas",
  "idiomas",
] as const;

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  tipo: z.string().default("pessoal"),
  corDestaque: z.string().optional(),
  imagemCapa: z.string().url("URL inválida").optional().or(z.literal("")),
  iconId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateNucleoModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function CreateNucleoModal({
  open: controlledOpen,
  onOpenChange,
  trigger,
}: CreateNucleoModalProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [tipoCustom, setTipoCustom] = useState(false);
  const [customTipo, setCustomTipo] = useState("");

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? onOpenChange! : setOpen;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "pessoal",
      corDestaque: "#6366f1",
      iconId: undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateNucleoPayload) => nucleosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nucleos"] });
      setIsOpen(false);
      reset();
      setTipoCustom(false);
      setCustomTipo("");
    },
  });

  const onSubmit = (data: FormData) => {
    const payload: CreateNucleoPayload = {
      ...data,
      imagemCapa: data.imagemCapa?.trim() || undefined,
      iconId: data.iconId || undefined,
    };
    createMutation.mutate(payload);
  };

  const selectedTipo = watch("tipo");
  const selectedIconId = watch("iconId");

  useEffect(() => {
    if (tipoCustom) {
      setValue("tipo", customTipo);
    }
  }, [customTipo, tipoCustom, setValue]);

  const handleTipoSelectChange = (value: string) => {
    if (value === "__custom__") {
      setTipoCustom(true);
      setValue("tipo", "");
    } else {
      setTipoCustom(false);
      setValue("tipo", value);
    }
  };

  const handleCustomTipoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTipo(e.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar novo Nucleo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Ex: Estudos, Saúde, Trabalho..."
              {...register("nome")}
            />
            {errors.nome && (
              <p className="text-sm text-destructive">{errors.nome.message}</p>
            )}
          </div>
          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva o propósito deste Nucleo..."
              rows={3}
              {...register("descricao")}
            />
          </div>
          {/* Tipo */}
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
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
                onChange={handleCustomTipoChange}
                className="mt-2"
                autoFocus
              />
            )}
          </div>
          {/* removido temporáriamente, não remover mesmo comentado. */}
          {/* Seletor de Ícone */}
          {/* <div className="space-y-2">
            <Label>Ícone (opcional)</Label>
            <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 border rounded-md">
              <button
                type="button"
                onClick={() => setValue("iconId", undefined)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-md border transition-all",
                  !selectedIconId
                    ? "border-primary bg-primary/10"
                    : "border-transparent hover:bg-muted",
                )}
              >
                <div className="w-8 h-8 flex items-center justify-center text-muted-foreground">
                  —
                </div>
                <span className="text-xs mt-1">Nenhum</span>
              </button>

              {iconOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = selectedIconId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setValue("iconId", option.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-md border transition-all",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-transparent hover:bg-muted",
                    )}
                  >
                    <IconComponent className="w-6 h-6" />
                    <span className="text-xs mt-1 truncate max-w-full">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedIconId && (
              <p className="text-xs text-muted-foreground">
                Ícone selecionado:{" "}
                {iconOptions.find((o) => o.id === selectedIconId)?.label}
              </p>
            )}
          </div> */}
          {/* Cor destaque */}
          <div className="space-y-2">
            <Label htmlFor="corDestaque">Cor de destaque</Label>
            <div className="flex gap-2">
              <Input
                id="corDestaque"
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
          {/* Imagem de capa */}
          <div className="space-y-2">
            <Label htmlFor="imagemCapa">Imagem de capa (URL opcional)</Label>
            <Input
              placeholder="https://... (link direto para a imagem)"
              {...register("imagemCapa")}
            />
            {errors.imagemCapa && (
              <p className="text-sm text-destructive">
                {errors.imagemCapa.message}
              </p>
            )}
          </div>
          {createMutation.error && (
            <p className="text-sm text-destructive">
              Erro ao criar Nucleo. Tente novamente.
            </p>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar Nucleo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
