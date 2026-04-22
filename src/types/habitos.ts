export type FrequenciaHabito = "diaria" | "semanal" | "personalizada";

export interface Habito {
  id: string;
  blocoId: string;
  nome: string;
  frequencia: FrequenciaHabito;
  diasSemana?: number[];
  metaVezes?: number;
  streakAtual?: number;
  streakMaximo?: number;
  completoHoje?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHabitoPayload {
  blocoId: string;
  nome: string;
  frequencia?: FrequenciaHabito;
  diasSemana?: number[];
  metaVezes?: number;
}

export interface UpdateHabitoPayload extends Partial<
  Omit<CreateHabitoPayload, "blocoId">
> {}

export interface RegistrarHabitoPayload {
  habitoId: string;
  data: string;
  vezesCompletadas?: number;
}
