import { string } from "zod";
import { Bloco } from "./bloco";
import { User } from "./user";

export interface Nucleo {
  id: string;
  userId: string;
  iconId?: string;
  nome: string;
  descricao?: string;
  tipo: NucleoTipo;
  corDestaque?: string;
  imagemCapa?: string;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
  deletedAt?: string | null;
  icon?: NucleoIcon;
  blocos?: Bloco[];
  achievements?: NucleoAchievement[];
  relations?: NucleoRelation[];
  user?: User;
}

export type NucleoTipo =
  | "pessoal"
  | "profissional"
  | "estudo"
  | "projeto"
  | "hobby"
  | "fitness"
  | "financas"
  | "idiomas"
  | string;

export interface NucleoIcon {
  id: string;
  name?: string;
  iconUrl?: string;
  createdAt: string;
}

export interface NucleoRelation {
  id: string;
  sourceNucleoId: string;
  targetNucleoId: string;
  relationType?: string;
  createdAt: string;
  source?: Nucleo;
  target?: Nucleo;
}

export interface NucleoAchievement {
  id: string;
  nucleoId: string;
  achievementType: string;
  currentValue: number;
  targetValue?: number;
  unlockedAt?: string;
  createdAt: string;
}

// Para criação/atualização
export interface CreateNucleoPayload {
  nome: string;
  descricao?: string;
  tipo?: NucleoTipo;
  corDestaque?: string;
  imagemCapa?: string;
  iconId?: string;
}

export interface NucleoComStats extends Nucleo {
  xpTotal: number;
  level: number;
  nextLevelXp: number;
  currentXp: number;
  conquistas: number;
  xpHoje: number;
}



export interface UpdateNucleoPayload extends Partial<CreateNucleoPayload> {}
