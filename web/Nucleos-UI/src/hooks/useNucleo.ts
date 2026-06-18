// src/hooks/useNucleo.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { nucleosService } from "@/services/nucleos.service";
import type {
  Nucleo,
  CreateNucleoPayload,
  UpdateNucleoPayload,
} from "@/types/nucleo";

export function useNucleo(id: string) {
  return useQuery({
    queryKey: ["nucleo", id],
    queryFn: () => nucleosService.getNucleo(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useNucleos() {
  const queryClient = useQueryClient();

  const query = useQuery<Nucleo[]>({
    queryKey: ["nucleos"],
    queryFn: () => nucleosService.getNucleos(),
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateNucleoPayload) =>
      nucleosService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nucleos"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateNucleoPayload;
    }) => nucleosService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nucleos"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => nucleosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nucleos"] });
    },
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    reload: query.refetch,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
