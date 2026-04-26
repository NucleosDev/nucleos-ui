// src/types/tarefas.ts
export type TarefaStatus = "pendente" | "concluida" | "fazendo" | "atrasada";
export type TarefaPrioridade = "baixa" | "media" | "alta";

// Interface de metadados (opcional, para manter organizado)
export interface TarefaMetadata {
  isRecorrente?: boolean;
  recorrenciaTipo?: "diaria" | "semanal" | "mensal";
}

export interface Tarefa {
  id: string;
  blocoId: string;
  titulo: string;
  descricao?: string;
  prioridade: TarefaPrioridade;
  status: TarefaStatus;
  dataVencimento?: string;
  concluidaEm?: string;
  posicao: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  metadata?: TarefaMetadata;
}

// Status calculado para exibição (inclui "atrasada" como calculado)
export type TarefaStatusExibicao = TarefaStatus | "atrasada";

export interface CreateTarefaPayload {
  blocoId: string;
  titulo: string;
  descricao?: string;
  prioridade?: TarefaPrioridade;
  dataVencimento?: string;
  metadata?: TarefaMetadata;
}

export interface UpdateTarefaPayload extends Partial<
  Omit<CreateTarefaPayload, "blocoId">
> {
  status?: TarefaStatus;
}
export function getStatusExibicao(tarefa: Tarefa): TarefaStatusExibicao {
  // Se já estiver concluída, retorna concluida
  if (tarefa.status === "concluida") return "concluida";

  // Se estiver fazendo, retorna fazendo
  if (tarefa.status === "fazendo") return "fazendo";

  // Verificar se está atrasada (pendente e data de vencimento passou)
  if (tarefa.dataVencimento) {
    const dataVencimento = new Date(tarefa.dataVencimento);
    const hoje = new Date();
    // Resetar horas para comparar apenas datas
    hoje.setHours(0, 0, 0, 0);
    dataVencimento.setHours(0, 0, 0, 0);

    if (dataVencimento < hoje) {
      return "atrasada";
    }
  }

  return "pendente";
}
