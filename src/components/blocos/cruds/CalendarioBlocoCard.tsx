"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { CalendarioCard } from "@/components/calendario/CalendarioCard";
import { useCalendario } from "@/hooks/useCalendario";
import { toast } from "@/hooks/use-toast";
import type { Bloco } from "@/types/bloco";

interface CalendarioBlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete: (blocoId: string) => void;
  onEdit: (blocoId: string) => void;
  isDeleting?: boolean;
}

export function CalendarioBlocoCard({ nucleoId }: CalendarioBlocoCardProps) {
  const {
    eventos,
    isLoading,
    criar,
    atualizar,
    excluir,
    isCreating,
    isUpdating,
    isDeleting: isDeletingEvento,
  } = useCalendario(nucleoId);

  const handleAddEvento = async (data: Date, titulo: string, descricao?: string, duracaoMinutos?: number) => {
    try {
      await criar({ nucleoId, titulo, descricao, dataEvento: data.toISOString(), duracaoMinutos });
      toast({ title: "Evento adicionado!" });
    } catch (e: any) {
      toast({ title: "Erro ao adicionar evento", description: e?.message, variant: "destructive" });
      throw e;
    }
  };

  const handleUpdateEvento = async (id: string, titulo: string, descricao?: string, duracaoMinutos?: number, dataEvento?: Date) => {
    try {
      const payload: any = { titulo, descricao, duracaoMinutos };
      if (dataEvento) payload.dataEvento = dataEvento.toISOString();
      await atualizar({ id, payload });
      toast({ title: "Evento atualizado!" });
    } catch (e: any) {
      toast({ title: "Erro ao atualizar evento", description: e?.message, variant: "destructive" });
      throw e;
    }
  };

  const handleDeleteEvento = async (id: string) => {
    try {
      await excluir(id);
      toast({ title: "Evento excluído!" });
    } catch (e: any) {
      toast({ title: "Erro ao excluir evento", description: e?.message, variant: "destructive" });
      throw e;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-32 rounded-lg" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 42 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <CalendarioCard
      eventos={eventos ?? []}
      isLoading={isLoading}
      onAddEvento={handleAddEvento}
      onUpdateEvento={handleUpdateEvento}
      onDeleteEvento={handleDeleteEvento}
      isSubmitting={isCreating || isUpdating || isDeletingEvento}
    />
  );
}
