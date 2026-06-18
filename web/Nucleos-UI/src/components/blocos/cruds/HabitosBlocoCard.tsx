"use client";

import { useState } from "react";
import { Plus, Activity } from "lucide-react";
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

export function HabitosBlocoCard({ bloco }: HabitosBlocoCardProps) {
  const {
    habitos = [],
    isLoading,
    criar,
    atualizar,
    deletar,
    registrar,
    isCreating,
    isDeleting: isDeletingHabito,
    isRegistering,
  } = useHabitos(bloco.id);

  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [habitoEditando, setHabitoEditando] = useState<Habito | null>(null);

  const handleCriar = async (data: {
    nome: string;
    frequencia: FrequenciaHabito;
    diasSemana?: number[];
    metaVezes?: number;
  }) => {
    try {
      await criar({ blocoId: bloco.id, ...data });
      toast({ title: "Hábito criado!" });
      setModalCriarAberto(false);
    } catch (e: any) {
      toast({ title: "Erro ao criar", description: e?.message, variant: "destructive" });
    }
  };

  const handleEditar = async (data: {
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
    } catch (e: any) {
      toast({ title: "Erro ao atualizar", description: e?.message, variant: "destructive" });
    }
  };

  const handleDeletar = async (id: string) => {
    try {
      await deletar(id);
      toast({ title: "Hábito excluído!" });
    } catch (e: any) {
      toast({ title: "Erro ao excluir", description: e?.message, variant: "destructive" });
    }
  };

  const handleRegistrar = async (id: string) => {
    try {
      await registrar({ habitoId: id, data: new Date().toISOString().split("T")[0], vezesCompletadas: 1 });
      toast({ title: "Hábito registrado!" });
    } catch (e: any) {
      toast({ title: "Erro ao registrar", description: e?.message, variant: "destructive" });
    }
  };

  const done   = habitos.filter((h) => h.completoHoje).length;
  const total  = habitos.length;

  return (
    <>
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          {total > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden w-20">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {done}/{total}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => setModalCriarAberto(true)}
            disabled={isCreating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/8 border border-primary/25 transition-colors ml-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            Novo hábito
          </button>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        ) : habitos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Activity className="h-8 w-8 text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground/60">Nenhum hábito ainda</p>
            <button
              onClick={() => setModalCriarAberto(true)}
              className="mt-3 text-xs text-primary hover:underline"
            >
              Criar primeiro hábito
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {habitos.map((habito) => (
              <HabitoCard
                key={habito.id}
                habito={habito}
                onRegistrar={handleRegistrar}
                onEdit={() => setHabitoEditando(habito)}
                onDelete={handleDeletar}
                onRename={async (nome) => {
                  await atualizar({ id: habito.id, payload: { nome } });
                }}
                isRegistering={isRegistering}
                isDeleting={isDeletingHabito}
              />
            ))}
          </div>
        )}
      </div>

      <CriarHabitoModal
        open={modalCriarAberto}
        onClose={() => setModalCriarAberto(false)}
        onConfirm={handleCriar}
        isSubmitting={isCreating}
      />
      {habitoEditando && (
        <CriarHabitoModal
          open
          onClose={() => setHabitoEditando(null)}
          onConfirm={handleEditar}
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
