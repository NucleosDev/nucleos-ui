// src/app/(user-auth)/dashboard/nucleos/[id]/blocos/[blocoId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useBloco, useBlocos } from "@/hooks/useBlocos";
import { useNucleo } from "@/hooks/useNucleo";
import {
  Plus,
  CheckSquare,
  CalendarDays,
  Activity,
  ListTodo,
  Timer,
  Layers,
  FileText,
  BookOpen,
  GripVertical,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { CriarBlocoModal } from "@/components/blocos/CriarBlocoModal";
import { ColecoesBlocoCard } from "@/components/blocos/cruds/ColecoesBlocoCard";
import { TarefasBlocoCard } from "@/components/blocos/cruds/TarefasBlocoCard";
import { ListasBlocoCard } from "@/components/blocos/cruds/ListasBlocoCard";
import { CalendarioBlocoCard } from "@/components/blocos/cruds/CalendarioBlocoCard";
import { TimersBlocoCard } from "@/components/blocos/cruds/TimersBlocoCard";
import { HabitosBlocoCard } from "@/components/blocos/cruds/HabitosBlocoCard";
import { BlocoDeNotas } from "@/components/blocos/cruds/BlocoDeNotas";
import { BLOCO_INITIALIZERS } from "@/lib/bloco-initializers";
import { cn } from "@/lib/utils";
import type { CreateBlocoPayload, Bloco } from "@/types/bloco";

const BLOCO_ICONS: Record<string, LucideIcon> = {
  tarefas: CheckSquare,
  calendario: CalendarDays,
  habitos: Activity,
  habito: Activity,
  lista: ListTodo,
  timer: Timer,
  timers: Timer,
  colecoes: Layers,
  notas: BookOpen,
};

const BLOCO_LABELS: Record<string, string> = {
  tarefas: "Tarefas",
  calendario: "Calendário",
  habitos: "Hábitos",
  habito: "Hábito",
  lista: "Lista",
  timer: "Timer",
  timers: "Timers",
  colecoes: "Coleções",
  notas: "Notas",
};

const BLOCO_COLORS: Record<string, string> = {
  tarefas: "#3B82F6",
  calendario: "#6366F1",
  habitos: "#22C55E",
  habito: "#22C55E",
  lista: "#06B6D4",
  timer: "#F97316",
  timers: "#F97316",
  colecoes: "#10B981",
  notas: "#A855F7",
};

function renderConteudo(bloco: Bloco, nucleoId: string) {
  const props = {
    bloco,
    nucleoId,
    onDelete: () => {},
    onEdit: () => {},
    isDeleting: false,
  };
  switch (bloco.tipo) {
    case "tarefas":
      return <TarefasBlocoCard {...props} />;
    case "calendario":
      return <CalendarioBlocoCard {...props} />;
    case "habitos":
    case "habito":
      return <HabitosBlocoCard {...props} />;
    case "lista":
      return <ListasBlocoCard {...props} />;
    case "timer":
    case "timers":
      return <TimersBlocoCard {...props} />;
    case "colecoes":
      return <ColecoesBlocoCard {...props} />;
    case "notas":
      return (
        <BlocoDeNotas bloco={bloco} nucleoId={nucleoId} onDelete={() => {}} />
      );
    default:
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <FileText className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">Bloco: {bloco.tipo}</p>
        </div>
      );
  }
}

export default function BlocoDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const nucleoId = params.id as string;
  const blocoId = params.blocoId as string;

  const { bloco, isLoading: blocoLoading, error: blocoError } = useBloco(blocoId, nucleoId);
  const { data: nucleo, isLoading: nucleoLoading } = useNucleo(nucleoId);
  const {
    blocos: subBlocos,
    create: createSub,
    remove: removeSub,
    isCreating,
    isDeleting,
  } = useBlocos(nucleoId, blocoId);

  const [modalAberto, setModalAberto] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleCriarSub = async (payload: CreateBlocoPayload) => {
    try {
      const criado = await createSub({ ...payload, parentId: blocoId });
      const initializer = BLOCO_INITIALIZERS[payload.tipo];
      if (initializer) await initializer(criado.id, payload.titulo);
      toast({ title: "Sub-bloco criado!" });
      setModalAberto(false);
    } catch {
      toast({ title: "Erro ao criar", variant: "destructive" });
    }
  };

  const confirmExcluirSub = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget;
    setDeleteTarget(null);
    try {
      await removeSub(id);
      toast({ title: "Excluído!" });
    } catch {
      toast({ title: "Erro ao excluir", variant: "destructive" });
    }
  };

  if (blocoLoading || nucleoLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 md:pl-20 md:pr-8 py-6 space-y-4">
        <Skeleton className="h-52 w-full rounded-xl" />
        <Skeleton className="h-10 w-1/2 rounded-lg" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (blocoError || !bloco || !nucleo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-muted-foreground">Bloco não encontrado.</p>
        <Button variant="link" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  const cor = BLOCO_COLORS[bloco.tipo] ?? nucleo.corDestaque ?? "#4D7CFF";

  return (
    <div className="max-w-3xl mx-auto px-6 md:pl-20 md:pr-8 pb-32">
      {/* Conteúdo principal do bloco */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden mb-10">
        {renderConteudo(bloco, nucleoId)}
      </div>

      {/* Sub-blocos */}
      <section>
        {/* Separador */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 border-t border-border/40" />
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            Sub-blocos
          </span>
          <div className="flex-1 border-t border-border/40" />
        </div>

        {subBlocos.length === 0 ? (
          <button
            onClick={() => setModalAberto(true)}
            className="w-full rounded-xl border-2 border-dashed border-border/50 p-10 text-center hover:border-primary/40 hover:bg-muted/20 transition-all group"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="h-9 w-9 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                <Plus className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary/70" />
              </div>
              <p className="text-sm text-muted-foreground">
                Nenhum sub-bloco. Clique para adicionar.
              </p>
            </div>
          </button>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setModalAberto(true)}
                className="gap-1.5 h-8 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar sub-bloco
              </Button>
            </div>

            <div className="space-y-3">
              {subBlocos.map((sub) => {
                const SubIcon = BLOCO_ICONS[sub.tipo] ?? GripVertical;
                const subCor = BLOCO_COLORS[sub.tipo] ?? "#6366f1";
                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="group relative"
                  >
                    {/* Indicador lateral de hierarquia */}
                    <div
                      className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full opacity-40"
                      style={{ backgroundColor: subCor }}
                    />

                    <div className="ml-4 rounded-xl border border-border/50 bg-card overflow-hidden hover:border-border hover:shadow-sm transition-all duration-150">
                      {/* Header do sub-bloco */}
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-muted/20">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="h-6 w-6 rounded-md flex items-center justify-center text-white shrink-0"
                            style={{ backgroundColor: subCor }}
                          >
                            <SubIcon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm font-medium">
                            {sub.titulo || BLOCO_LABELS[sub.tipo] || sub.tipo}
                          </span>
                        </div>

                        <div className={cn(
                          "flex items-center gap-1 transition-opacity",
                          "opacity-0 group-hover:opacity-100",
                        )}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              router.push(`/dashboard/nucleos/${nucleoId}/blocos/${sub.id}`)
                            }
                            title="Abrir em tela cheia"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteTarget(sub.id)}
                            disabled={isDeleting}
                            title="Excluir"
                          >
                            <span className="text-sm leading-none">×</span>
                          </Button>
                        </div>
                      </div>

                      <div>{renderConteudo(sub, nucleoId)}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </section>

      <CriarBlocoModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={handleCriarSub}
        nucleoId={nucleoId}
        isCreating={isCreating}
        parentId={blocoId}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir sub-bloco?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmExcluirSub}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
