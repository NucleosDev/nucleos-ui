// src/types/habito.ts
export type FrequenciaHabito = "diaria" | "semanal" | "personalizada";

export interface Habito {
  id: string;
  blocoId: string;
  nome: string;
  frequencia: FrequenciaHabito;
  diasSemana?: number[];
  metaVezes?: number;
  createdAt: string;
  updatedAt: string;
  registros?: HabitoRegistro[];
}

export interface HabitoRegistro {
  id: string;
  habitoId: string;
  data: string;
  vezesCompletadas: number;
  createdAt: string;
}

export interface CreateHabitoPayload {
  blocoId: string;
  nome: string;
  frequencia?: FrequenciaHabito;
  diasSemana?: number[];
  metaVezes?: number;
}

export interface UpdateHabitoPayload extends Partial<CreateHabitoPayload> {
  id: string;
}

export interface RegistrarHabitoPayload {
  habitoId: string;
  data: string;
  vezesCompletadas?: number;
}
