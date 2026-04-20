export type TarefaStatus = "pendente" | "concluida" | "atrasada";
export type TarefaPrioridade = "baixa" | "media" | "alta";

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
}

export interface CreateTarefaPayload {
  blocoId: string;
  titulo: string;
  descricao?: string;
  prioridade?: TarefaPrioridade;
  dataVencimento?: string;
}

export interface UpdateTarefaPayload extends Partial<
  Omit<CreateTarefaPayload, "blocoId">
> {
  status?: TarefaStatus;
}
