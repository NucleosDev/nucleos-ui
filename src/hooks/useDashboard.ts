import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gamificacaoService } from "@/services/gamificacao.service";
import { tarefasService } from "@/services/tarefas.service";
import { nucleosService } from "@/services/nucleos.service";
import { usersService } from "@/services/users.service";
import api from "@/services/api";
import type { DashboardStats, UpdateTarefaPayload } from "@/types/tarefas";
import type { User } from "@/types/user";

// ---------------------------------------------------------------------------
// Stats gerais do dashboard
// ---------------------------------------------------------------------------
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const { data } = await api.get<DashboardStats>("/Dashboard/stats");
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

type CurrentUser = {
  nome: string;
  email: string;
  avatarUrl?: string;
  createdAt?: string;
};

export function useCurrentUser() {
  return useQuery<CurrentUser>({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await fetch("/api/me");

      if (!res.ok) {
        throw new Error("Erro ao buscar usuário");
      }

      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

// ---------------------------------------------------------------------------
// Nível e XP do usuário
// ---------------------------------------------------------------------------
export function useUserLevel() {
  return useQuery({
    queryKey: ["gamificacao", "level"],
    queryFn: gamificacaoService.getLevel,
    staleTime: 1000 * 60 * 5,
  });
}

// ---------------------------------------------------------------------------
// Streaks
// ---------------------------------------------------------------------------
export function useStreaks() {
  return useQuery({
    queryKey: ["gamificacao", "streaks"],
    queryFn: gamificacaoService.getStreaks,
    staleTime: 1000 * 60 * 2,
  });
}

// ---------------------------------------------------------------------------
// Conquistas
// ---------------------------------------------------------------------------
export function useConquistas() {
  return useQuery({
    queryKey: ["gamificacao", "conquistas"],
    queryFn: gamificacaoService.getConquistas,
    staleTime: 1000 * 60 * 10,
  });
}

// ---------------------------------------------------------------------------
// Tarefas vencendo
// ---------------------------------------------------------------------------
export function useTarefasVencendo() {
  return useQuery({
    queryKey: ["tarefas", "vencendo"],
    queryFn: tarefasService.getVencendo,
    staleTime: 1000 * 60 * 2,
  });
}

// ---------------------------------------------------------------------------
// Concluir tarefa (mutation)
// ---------------------------------------------------------------------------
export function useConcluirTarefa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tarefasService.concluir(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tarefas"] });
      qc.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
}

// ---------------------------------------------------------------------------
// Nucleos do usuário
// ---------------------------------------------------------------------------
export function useNucleos() {
  return useQuery({
    queryKey: ["nucleos"],
    queryFn: nucleosService.getNucleos,
    staleTime: 1000 * 60 * 5,
  });
}

// ---------------------------------------------------------------------------
// Núcleo por ID
// ---------------------------------------------------------------------------
export function useNucleoById(id: string) {
  return useQuery({
    queryKey: ["nucleos", id],
    queryFn: () => nucleosService.getNucleo(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// ---------------------------------------------------------------------------
// Usuário atual
// ---------------------------------------------------------------------------
