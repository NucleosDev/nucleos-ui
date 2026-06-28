// hooks/useCalendario.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { calendarioService } from "@/services/calendario.service";
import type {
  CreateEventoPayload,
  UpdateEventoPayload,
} from "@/types/calendar";

export function useCalendario(nucleoId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["calendario", nucleoId],
    queryFn: async () => {
      const result = await calendarioService.listarPorNucleo(nucleoId!);
      console.log("📅 listarPorNucleo result:", result);
      return Array.isArray(result) ? result : [];
    },
    enabled: !!nucleoId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateEventoPayload) =>
      calendarioService.criar(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["calendario", nucleoId] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateEventoPayload;
    }) => calendarioService.atualizar(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["calendario", nucleoId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => calendarioService.deletar(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["calendario", nucleoId] }),
  });

  return {
    eventos: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    reload: query.refetch,
    criar: createMutation.mutateAsync,
    atualizar: updateMutation.mutateAsync,
    excluir: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
