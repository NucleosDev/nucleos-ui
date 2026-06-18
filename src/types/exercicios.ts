export interface TreinoExercicio {
  id: string;
  templateId: string;
  nome: string;
  series: number;
  repeticoes: number;
  pesoKg?: number | null;
  ordem: number;
}

export interface TreinoTemplate {
  id: string;
  blocoId: string;
  nome: string;
  descricao?: string | null;
  exercicios: TreinoExercicio[];
  sessoesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTreinoPayload {
  blocoId: string;
  nome: string;
  descricao?: string;
}

export interface UpdateTreinoPayload {
  nome?: string;
  descricao?: string | null;
}

export interface AddExercicioPayload {
  templateId: string;
  nome: string;
  series?: number;
  repeticoes?: number;
  pesoKg?: number | null;
  ordem?: number;
}
