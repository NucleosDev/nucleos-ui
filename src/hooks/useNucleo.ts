import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { blocosService } from "@/src/services/blocos.service"
import { tarefasService } from "@/src/services/tarefas.service"
import { nucleosService } from "@/src/services/nucleos.service"
import type { CreateBlocoPayload, UpdateBlocoPayload, CreateTarefaPayload, UpdateTarefaPayload } from "@/src/types/test"

// ---------------------------------------------------------------------------
// Blocos de um núcleo
// ---------------------------------------------------------------------------
export function useBlocosByNucleo(nucleoId: string) {
  return useQuery({
    queryKey: ["blocos", "nucleo", nucleoId],
    queryFn: () => blocosService.getByNucleo(nucleoId),
    enabled: !!nucleoId,
    staleTime: 1000 * 60 * 3,
  })
}

// ---------------------------------------------------------------------------
// Tarefas de um bloco
// ---------------------------------------------------------------------------
export function useTarefasByBloco(blocoId: string | null) {
  return useQuery({
    queryKey: ["tarefas", "bloco", blocoId],
    queryFn: () => tarefasService.getByBloco(blocoId!),
    enabled: !!blocoId,
    staleTime: 1000 * 60 * 2,
  })
}

// ---------------------------------------------------------------------------
// Criar bloco
// ---------------------------------------------------------------------------
export function useCreateBloco(nucleoId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateBlocoPayload) => blocosService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blocos", "nucleo", nucleoId] })
    },
  })
}

// ---------------------------------------------------------------------------
// Atualizar bloco
// ---------------------------------------------------------------------------
export function useUpdateBloco(nucleoId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBlocoPayload }) =>
      blocosService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blocos", "nucleo", nucleoId] })
    },
  })
}

// ---------------------------------------------------------------------------
// Deletar bloco
// ---------------------------------------------------------------------------
export function useDeleteBloco(nucleoId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => blocosService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blocos", "nucleo", nucleoId] })
    },
  })
}

// ---------------------------------------------------------------------------
// Criar tarefa
// ---------------------------------------------------------------------------
export function useCreateTarefa(blocoId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTarefaPayload) => tarefasService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tarefas", "bloco", blocoId] })
      qc.invalidateQueries({ queryKey: ["tarefas", "vencendo"] })
    },
  })
}

// ---------------------------------------------------------------------------
// Atualizar tarefa
// ---------------------------------------------------------------------------
export function useUpdateTarefa(blocoId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTarefaPayload }) =>
      tarefasService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tarefas", "bloco", blocoId] })
    },
  })
}

// ---------------------------------------------------------------------------
// Concluir tarefa
// ---------------------------------------------------------------------------
export function useConcluirTarefaBloco(blocoId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tarefasService.concluir(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tarefas", "bloco", blocoId] })
      qc.invalidateQueries({ queryKey: ["dashboard", "stats"] })
    },
  })
}

// ---------------------------------------------------------------------------
// Deletar tarefa
// ---------------------------------------------------------------------------
export function useDeleteTarefa(blocoId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tarefasService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tarefas", "bloco", blocoId] })
    },
  })
}

// ---------------------------------------------------------------------------
// Criar núcleo
// ---------------------------------------------------------------------------
export function useCreateNucleo() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: nucleosService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["nucleos"] })
    },
  })
}
