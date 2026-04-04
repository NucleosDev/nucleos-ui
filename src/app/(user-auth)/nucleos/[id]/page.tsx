"use client";

import { useState} from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, AlertCircle, LayoutGrid } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { BlocoCard } from "@/src/components/layout-auth/BlocoCard";
import { TaskCard } from "@/src/components/layout-auth/TaskCard";
import { BlocoDialog } from "@/src/components/layout-auth/dialogs/BlocoDialog";
import { TarefaDialog } from "@/src/components/layout-auth/dialogs/TarefaDialog";

import { useNucleoById } from "@/src/hooks/useDashboard";
import {
  useBlocosByNucleo,
  useTarefasByBloco,
  useCreateBloco,
  useUpdateBloco,
  useDeleteBloco,
  useCreateTarefa,
  useConcluirTarefaBloco,
  useDeleteTarefa,
} from "@/src/hooks/useNucleo";
import type { Bloco } from "@/src/types/bloco";

// ---------------------------------------------------------------------------
// Painel de conteúdo do bloco selecionado
// ---------------------------------------------------------------------------
function BlocoContent({ bloco, nucleoId }: { bloco: Bloco; nucleoId: string }) {
  const [tarefaDialogOpen, setTarefaDialogOpen] = useState(false);

  const { data: tarefas, isLoading, error } = useTarefasByBloco(bloco.id);
  const createTarefa = useCreateTarefa(bloco.id);
  const concluirTarefa = useConcluirTarefaBloco(bloco.id);
  const deleteTarefa = useDeleteTarefa(bloco.id);

  if (bloco.tipo !== "tarefas") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
        <LayoutGrid className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Visualização para o tipo <strong>{bloco.tipo}</strong> em breve.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{bloco.titulo}</h3>
        <Button
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => setTarefaDialogOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Nova tarefa
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Erro ao carregar tarefas.</AlertDescription>
        </Alert>
      ) : isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : !tarefas || tarefas.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma tarefa neste bloco.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setTarefaDialogOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Criar primeira tarefa
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tarefas.map((t: any) => (
            <TaskCard
              key={t.id}
              tarefa={t}
              onConcluir={(id) => concluirTarefa.mutate(id)}
              onDelete={(id) => deleteTarefa.mutate(id)}
            />
          ))}
        </div>
      )}

      <TarefaDialog
        open={tarefaDialogOpen}
        onOpenChange={setTarefaDialogOpen}
        isPending={createTarefa.isPending}
        onSubmit={(data) => {
          createTarefa.mutate(
            { blocoId: bloco.id, ...data },
            { onSuccess: () => setTarefaDialogOpen(false) },
          );
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Página
// ---------------------------------------------------------------------------
export default function NucleoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();

  const [selectedBlocoId, setSelectedBlocoId] = useState<string | null>(null);
  const [blocoDialogOpen, setBlocoDialogOpen] = useState(false);
  const [editingBloco, setEditingBloco] = useState<Bloco | null>(null);

  const {
    data: nucleo,
    isLoading: nucleoLoading,
    error: nucleoError,
  } = useNucleoById(id);
  const { data: blocos, isLoading: blocosLoading } = useBlocosByNucleo(id);

  const createBloco = useCreateBloco(id);
  const updateBloco = useUpdateBloco(id);
  const deleteBloco = useDeleteBloco(id);

  const selectedBloco = Array.isArray(blocos)
  ? blocos.find((b) => b.id === selectedBlocoId) ?? blocos[0] ?? null
  : null;

  if (nucleoError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Alert variant="destructive" className="max-w-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Não foi possível carregar o núcleo.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cabeçalho da página */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => router.back()}
            aria-label="Voltar"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {nucleoLoading ? (
            <Skeleton className="h-5 w-40" />
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-sm font-semibold text-foreground truncate">
                {nucleo?.nome}
              </h1>
              {nucleo && (
                <Badge variant="secondary" className="text-xs shrink-0">
                  {nucleo.progresso}%
                </Badge>
              )}
            </div>
          )}

          {nucleo && (
            <div className="ml-auto shrink-0">
              <Progress value={nucleo.progresso} className="w-24 h-1.5" />
            </div>
          )}
        </div>
      </header>

      <div
        className="mx-auto flex max-w-7xl"
        style={{ minHeight: "calc(100vh - 56px)" }}
      >
        {/* Sidebar de blocos */}
        <aside className="w-60 shrink-0 border-r border-border bg-background flex flex-col">
          <div className="flex items-center justify-between p-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Blocos
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              aria-label="Criar bloco"
              onClick={() => {
                setEditingBloco(null);
                setBlocoDialogOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Separator />

          <ScrollArea className="flex-1 py-2">
            {blocosLoading ? (
              <div className="flex flex-col gap-1 px-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>
            ) : !blocos || blocos.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Nenhum bloco ainda.
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs mt-1 h-auto p-0"
                  onClick={() => {
                    setEditingBloco(null);
                    setBlocoDialogOpen(true);
                  }}
                >
                  Criar bloco
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5 px-2">
                {blocos.map((b: any) => (
                  <BlocoCard
                    key={b.id}
                    bloco={b}
                    selected={selectedBloco?.id === b.id}
                    onClick={setSelectedBlocoId}
                    onEdit={(bloco: Bloco) => {
                    setEditingBloco(bloco);
                    setBlocoDialogOpen(true);
                }}
                    onDelete={(bid) => deleteBloco.mutate(bid)}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </aside>

        {/* Área principal */}
        <main className="flex-1 p-6 overflow-auto">
          {selectedBloco ? (
            <BlocoContent bloco={selectedBloco} nucleoId={id} />
          ) : !blocosLoading && (!blocos || blocos.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
              <LayoutGrid className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Este núcleo não tem blocos.
              </p>
              <p className="text-xs text-muted-foreground">
                Crie um bloco para começar a organizar.
              </p>
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  setEditingBloco(null);
                  setBlocoDialogOpen(true);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                Criar bloco
              </Button>
            </div>
          ) : null}
        </main>
      </div>

      {/* Dialog de bloco */}
      <BlocoDialog
        open={blocoDialogOpen}
        onOpenChange={setBlocoDialogOpen}
        bloco={editingBloco!}
        nucleoId={id}
        isPending={createBloco.isPending || updateBloco.isPending}
        onSubmit={(data) => {
          if (editingBloco !== null) {
            updateBloco.mutate(
              { id: editingBloco.id, payload: data },
              { onSuccess: () => setBlocoDialogOpen(false) },
            );
          } else {
            createBloco.mutate(
              {
                nucleoId: id,
                nome: data.nome,
                tipo: data.tipo,
                descricao: data.descricao,
              },
              {
                onSuccess: (bloco: any) => {
                  setBlocoDialogOpen(false);
                  setSelectedBlocoId(bloco.id);
                },
              },
            );
          }
        }}
      />
    </div>
  );
}
