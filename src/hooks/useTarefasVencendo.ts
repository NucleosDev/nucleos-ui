import { useQuery } from "@tanstack/react-query";
import { tarefasService } from "@/services/tarefas.service";
import type { Tarefa } from "@/types/tarefas";

export function useTarefasVencendo() {
  return useQuery<Tarefa[]>({
    queryKey: ["tarefas", "vencendo"],
    queryFn: () => tarefasService.listarVencendo(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}
