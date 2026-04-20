"use client";

import { useState } from "react";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
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

export function CalendarioBlocoCard({
  bloco,
  nucleoId,
  onDelete,
  onEdit,
  isDeleting,
}: CalendarioBlocoCardProps) {
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

  const handleAddEvento = async (
    data: Date,
    titulo: string,
    descricao?: string,
    duracaoMinutos?: number,
  ) => {
    try {
      await criar({
        nucleoId,
        titulo,
        descricao,
        dataEvento: data.toISOString(),
        duracaoMinutos,
      });
      toast({
        title: "Evento adicionado!",
        description: `${titulo} foi adicionado ao calendário.`,
      });
      return Promise.resolve();
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar evento",
        description: error?.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const handleUpdateEvento = async (
    id: string,
    titulo: string,
    descricao?: string,
    duracaoMinutos?: number,
    dataEvento?: Date,
  ) => {
    try {
      const payload: any = { titulo, descricao, duracaoMinutos };
      if (dataEvento) {
        payload.dataEvento = dataEvento.toISOString();
      }
      await atualizar({
        id,
        payload,
      });
      toast({
        title: "Evento atualizado!",
        description: `${titulo} foi atualizado com sucesso.`,
      });
      return Promise.resolve();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar evento",
        description: error?.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const handleDeleteEvento = async (id: string) => {
    try {
      await excluir(id);
      toast({
        title: "Evento excluído!",
        description: "O evento foi removido do calendário.",
      });
      return Promise.resolve();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir evento",
        description: error?.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const isSubmitting = isCreating || isUpdating || isDeletingEvento;

  return (
    <Card className="group relative hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <CalendarIcon className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-base font-semibold">
              {bloco.titulo || "Calendário"}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isSubmitting}
              >
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

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(35)].map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-md" />
              ))}
            </div>
          </div>
        ) : (
          <CalendarioCard
            eventos={eventos || []}
            isLoading={isLoading}
            onAddEvento={handleAddEvento}
            onUpdateEvento={handleUpdateEvento}
            onDeleteEvento={handleDeleteEvento}
            isSubmitting={isSubmitting}
          />
        )}
      </CardContent>
    </Card>
  );
}
