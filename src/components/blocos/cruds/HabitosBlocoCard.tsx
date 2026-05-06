"use client";

import { useState } from "react";
import { Plus, MoreVertical, Pencil, Trash2, CheckSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { HabitoCard } from "@/components/habitos/HabitoCard";
import { CriarHabitoModal } from "@/components/habitos/CriarHabitoModal";
import { useHabitos } from "@/hooks/useHabitos";
import { toast } from "@/hooks/use-toast";
import type { Bloco } from "@/types/bloco";
import type { Habito, FrequenciaHabito } from "@/types/habitos";

interface HabitosBlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete: (blocoId: string) => void;
  onEdit: (blocoId: string) => void;
  isDeleting?: boolean;
}

export function HabitosBlocoCard({
  bloco,
  onDelete,
  onEdit,
  isDeleting,
}: HabitosBlocoCardProps) {
  const {
    habitos = [],
    isLoading,
    criar,
    atualizar,
    deletar,
    registrar,
    isCreating,
    isUpdating,
    isDeleting: isDeletingHabito,
    isRegistering,
  } = useHabitos(bloco.id);

  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [habitoEditando, setHabitoEditando] = useState<Habito | null>(null);

  const handleCriarHabito = async (data: {
    nome: string;
    frequencia: FrequenciaHabito;
    diasSemana?: number[];
    metaVezes?: number;
  }) => {
    try {
      await criar({ blocoId: bloco.id, ...data });
      toast({ title: "Hábito criado!" });
      setModalCriarAberto(false);
    } catch (error: any) {
      toast({
        title: "Erro ao criar",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const handleEditarHabito = async (data: {
    nome: string;
    frequencia: FrequenciaHabito;
    diasSemana?: number[];
    metaVezes?: number;
  }) => {
    if (!habitoEditando) return;
    try {
      await atualizar({ id: habitoEditando.id, payload: data });
      toast({ title: "Hábito atualizado!" });
      setHabitoEditando(null);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const handleDeletarHabito = async (id: string) => {
    if (!confirm("Excluir este hábito?")) return;
    try {
      await deletar(id);
      toast({ title: "Hábito excluído!" });
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  const handleRegistrarHabito = async (id: string) => {
    try {
      await registrar({
        habitoId: id,
        data: new Date().toISOString().split("T")[0],
        vezesCompletadas: 1,
      });
      toast({ title: "Hábito registrado! 🔥" });
    } catch (error: any) {
      toast({
        title: "Erro ao registrar",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="group relative hover:shadow-md transition-shadow">
        <CardHeader className="">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2"></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(bloco.id)}>
                  <Pencil className="mr-2 h-4 w-4" /> Editar bloco
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(bloco.id)}
                  className="text-destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Excluir bloco
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setModalCriarAberto(true)}
            disabled={isCreating}
          >
            <Plus className="mr-2 h-4 w-4" /> Novo hábito
          </Button>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : habitos.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              Nenhum hábito ainda. Crie seu primeiro!
            </div>
          ) : (
            <div className="space-y-3">
              {habitos.map((habito) => (
                <HabitoCard
                  key={habito.id}
                  habito={habito}
                  onRegistrar={handleRegistrarHabito}
                  onEdit={() => setHabitoEditando(habito)}
                  onDelete={handleDeletarHabito}
                  isRegistering={isRegistering}
                  isDeleting={isDeletingHabito}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CriarHabitoModal
        open={modalCriarAberto}
        onClose={() => setModalCriarAberto(false)}
        onConfirm={handleCriarHabito}
        isSubmitting={isCreating}
      />

      {habitoEditando && (
        <CriarHabitoModal
          open={!!habitoEditando}
          onClose={() => setHabitoEditando(null)}
          onConfirm={handleEditarHabito}
          initialData={{
            nome: habitoEditando.nome,
            frequencia: habitoEditando.frequencia,
            diasSemana: habitoEditando.diasSemana,
            metaVezes: habitoEditando.metaVezes,
          }}
          titulo="Editar hábito"
        />
      )}
    </>
  );
}
