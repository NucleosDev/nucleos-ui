"use client";

import { useState } from "react";
import { Plus, Dumbbell, Trash2, ChevronDown, ChevronRight, X, Check, Loader2, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useExercicios } from "@/hooks/useExercicios";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { Bloco } from "@/types/bloco";
import type { TreinoTemplate } from "@/types/exercicios";

interface ExerciciosBlocoCardProps {
  bloco: Bloco;
  nucleoId: string;
  onDelete: (blocoId: string) => void;
  onEdit: (blocoId: string) => void;
  isDeleting?: boolean;
}

export function ExerciciosBlocoCard({ bloco }: ExerciciosBlocoCardProps) {
  const {
    treinos,
    isLoading,
    criarTreino,
    deletarTreino,
    adicionarExercicio,
    removerExercicio,
    isCreating,
  } = useExercicios(bloco.id);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalCriar, setModalCriar] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addExercicioTemplateId, setAddExercicioTemplateId] = useState<string | null>(null);

  const handleCriarTreino = async (nome: string, descricao?: string) => {
    try {
      const created = await criarTreino({ blocoId: bloco.id, nome, descricao });
      toast({ title: "Treino criado!" });
      setModalCriar(false);
      setExpandedId(created.id);
    } catch (e: any) {
      toast({ title: "Erro ao criar treino", description: e?.message, variant: "destructive" });
    }
  };

  const handleDeletar = async (id: string) => {
    setIsDeleting(true);
    try {
      await deletarTreino(id);
      setConfirmDeleteId(null);
      if (expandedId === id) setExpandedId(null);
      toast({ title: "Treino removido" });
    } catch (e: any) {
      toast({ title: "Erro ao remover", description: e?.message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAdicionarExercicio = async (
    templateId: string,
    nome: string,
    series: number,
    repeticoes: number,
    pesoKg?: number | null,
  ) => {
    try {
      await adicionarExercicio({ templateId, nome, series, repeticoes, pesoKg });
      toast({ title: "Exercício adicionado!" });
      setAddExercicioTemplateId(null);
    } catch (e: any) {
      toast({ title: "Erro ao adicionar exercício", description: e?.message, variant: "destructive" });
    }
  };

  const handleRemoverExercicio = async (exercicioId: string) => {
    try {
      await removerExercicio(exercicioId);
      toast({ title: "Exercício removido" });
    } catch (e: any) {
      toast({ title: "Erro ao remover", description: e?.message, variant: "destructive" });
    }
  };

  return (
    <>
      <div className="space-y-3">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground/60">
            {treinos.length} {treinos.length === 1 ? "treino" : "treinos"}
          </span>
          <button
            onClick={() => setModalCriar(true)}
            disabled={isCreating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/8 border border-primary/25 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Novo treino
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : treinos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Dumbbell className="h-8 w-8 text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground/60">Nenhum treino ainda</p>
            <button
              onClick={() => setModalCriar(true)}
              className="mt-3 text-xs text-primary hover:underline"
            >
              Criar primeiro treino
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {treinos.map((treino) => (
              <TreinoItem
                key={treino.id}
                treino={treino}
                isExpanded={expandedId === treino.id}
                onToggle={() => setExpandedId(expandedId === treino.id ? null : treino.id)}
                onDelete={() => setConfirmDeleteId(treino.id)}
                isConfirmDelete={confirmDeleteId === treino.id}
                onCancelDelete={() => setConfirmDeleteId(null)}
                onConfirmDelete={() => handleDeletar(treino.id)}
                isDeletingItem={isDeleting && confirmDeleteId === treino.id}
                onAddExercicio={() => setAddExercicioTemplateId(treino.id)}
                onRemoveExercicio={handleRemoverExercicio}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal criar treino */}
      <CriarTreinoModal
        open={modalCriar}
        onClose={() => setModalCriar(false)}
        onConfirm={handleCriarTreino}
        isSubmitting={isCreating}
      />

      {/* Modal adicionar exercício */}
      {addExercicioTemplateId && (
        <AdicionarExercicioModal
          open
          onClose={() => setAddExercicioTemplateId(null)}
          onConfirm={(nome, series, repeticoes, pesoKg) =>
            handleAdicionarExercicio(addExercicioTemplateId, nome, series, repeticoes, pesoKg)
          }
        />
      )}
    </>
  );
}

// ── TreinoItem ────────────────────────────────────────────────────────────────

function TreinoItem({
  treino,
  isExpanded,
  onToggle,
  onDelete,
  isConfirmDelete,
  onCancelDelete,
  onConfirmDelete,
  isDeletingItem,
  onAddExercicio,
  onRemoveExercicio,
}: {
  treino: TreinoTemplate;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  isConfirmDelete: boolean;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  isDeletingItem: boolean;
  onAddExercicio: () => void;
  onRemoveExercicio: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border transition-colors",
        isConfirmDelete
          ? "border-destructive/40 bg-destructive/5"
          : "border-border/40 bg-muted/10",
      )}
    >
      {isConfirmDelete ? (
        <div className="flex items-center gap-2 px-3 py-2.5">
          <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
          <p className="text-xs text-destructive font-medium flex-1">
            Remover "{treino.nome}" e seus exercícios?
          </p>
          <button
            onClick={onConfirmDelete}
            disabled={isDeletingItem}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-destructive text-destructive-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isDeletingItem ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            Remover
          </button>
          <button
            onClick={onCancelDelete}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <>
          {/* Header row */}
          <div className="flex items-center gap-2 px-3 py-2.5 group">
            <button
              onClick={onToggle}
              className="flex items-center gap-2 flex-1 min-w-0 text-left"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
              )}
              <span className="text-sm font-medium truncate">{treino.nome}</span>
              {treino.exercicios.length > 0 && (
                <span className="text-[10px] text-muted-foreground/40 shrink-0">
                  {treino.exercicios.length} ex.
                </span>
              )}
            </button>
            <button
              onClick={onAddExercicio}
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/40 hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-all"
              title="Adicionar exercício"
            >
              <Plus className="h-3 w-3" />
            </button>
            <button
              onClick={onDelete}
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
              title="Remover treino"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>

          {/* Expanded exercises */}
          {isExpanded && (
            <div className="px-3 pb-3 space-y-1">
              {treino.exercicios.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground/50">Nenhum exercício</p>
                  <button
                    onClick={onAddExercicio}
                    className="mt-1 text-xs text-primary hover:underline"
                  >
                    Adicionar exercício
                  </button>
                </div>
              ) : (
                treino.exercicios.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-background/60 border border-border/30 group/ex"
                  >
                    <Dumbbell className="h-3 w-3 text-muted-foreground/30 shrink-0" />
                    <span className="text-xs font-medium flex-1 truncate">{ex.nome}</span>
                    <span className="text-[10px] text-muted-foreground/50 shrink-0">
                      {ex.series}×{ex.repeticoes}
                      {ex.pesoKg ? ` ${ex.pesoKg}kg` : ""}
                    </span>
                    <button
                      onClick={() => onRemoveExercicio(ex.id)}
                      className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover/ex:opacity-100 transition-all"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── CriarTreinoModal ──────────────────────────────────────────────────────────

function CriarTreinoModal({
  open,
  onClose,
  onConfirm,
  isSubmitting,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (nome: string, descricao?: string) => Promise<void>;
  isSubmitting: boolean;
}) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) { setError("Nome é obrigatório"); return; }
    await onConfirm(nome.trim(), descricao.trim() || undefined);
    setNome("");
    setDescricao("");
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden gap-0">
        <div className="px-5 pt-5 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10">
              <Dumbbell className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <DialogTitle className="text-sm font-semibold">Novo treino</DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground/60 pl-9">
            Crie um plano de treino e adicione exercícios depois.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-4 pt-4 pb-3 space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground/70">Nome do treino</label>
              <input
                autoFocus
                value={nome}
                onChange={(e) => { setNome(e.target.value); setError(null); }}
                placeholder="Ex: Peito e Tríceps, Perna, Fullbody…"
                disabled={isSubmitting}
                className={cn(
                  "w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border bg-background",
                  "placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2",
                  "transition-[border-color,box-shadow]",
                  error
                    ? "border-destructive/50 focus:ring-destructive/20"
                    : "border-border/60 focus:ring-primary/30 focus:border-primary/50",
                )}
              />
              {error && <p className="text-xs text-destructive font-medium">{error}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground/70">Descrição (opcional)</label>
              <input
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Foco em hipertrofia…"
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-border/60 bg-background placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-[border-color,box-shadow]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border/40 bg-muted/20">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 rounded-[var(--radius-md)] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !nome.trim()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[var(--radius-md)] text-sm font-medium bg-orange-500 text-white hover:opacity-90 disabled:opacity-50 transition-opacity shadow-[0_2px_8px_rgba(249,115,22,0.25)]"
            >
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Criar
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── AdicionarExercicioModal ───────────────────────────────────────────────────

function AdicionarExercicioModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (nome: string, series: number, repeticoes: number, pesoKg?: number | null) => Promise<void>;
}) {
  const [nome, setNome] = useState("");
  const [series, setSeries] = useState("3");
  const [repeticoes, setRepeticoes] = useState("10");
  const [pesoKg, setPesoKg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) { setError("Nome é obrigatório"); return; }
    setIsSubmitting(true);
    try {
      await onConfirm(
        nome.trim(),
        parseInt(series) || 3,
        parseInt(repeticoes) || 10,
        pesoKg ? parseFloat(pesoKg) : null,
      );
      setNome("");
      setSeries("3");
      setRepeticoes("10");
      setPesoKg("");
      setError(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-border/60 bg-background placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-[border-color,box-shadow]";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden gap-0">
        <div className="px-5 pt-5 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10">
              <Plus className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <DialogTitle className="text-sm font-semibold">Adicionar exercício</DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground/60 pl-9">
            Defina o exercício, séries e repetições.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-4 pt-4 pb-3 space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground/70">Exercício</label>
              <input
                autoFocus
                value={nome}
                onChange={(e) => { setNome(e.target.value); setError(null); }}
                placeholder="Ex: Supino reto, Agachamento…"
                disabled={isSubmitting}
                className={cn(inputCls, error ? "border-destructive/50" : "")}
              />
              {error && <p className="text-xs text-destructive font-medium">{error}</p>}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground/70">Séries</label>
                <input
                  type="number"
                  min={1}
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  disabled={isSubmitting}
                  className={inputCls}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground/70">Reps</label>
                <input
                  type="number"
                  min={1}
                  value={repeticoes}
                  onChange={(e) => setRepeticoes(e.target.value)}
                  disabled={isSubmitting}
                  className={inputCls}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground/70">Peso (kg)</label>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={pesoKg}
                  onChange={(e) => setPesoKg(e.target.value)}
                  placeholder="—"
                  disabled={isSubmitting}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border/40 bg-muted/20">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 rounded-[var(--radius-md)] text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !nome.trim()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[var(--radius-md)] text-sm font-medium bg-orange-500 text-white hover:opacity-90 disabled:opacity-50 transition-opacity shadow-[0_2px_8px_rgba(249,115,22,0.25)]"
            >
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Adicionar
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
