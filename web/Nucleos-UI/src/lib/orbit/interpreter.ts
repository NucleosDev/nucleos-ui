/**
 * Orbit Interpreter — Motor heurístico de parsing em português
 * Converte texto livre em OrbitCommands estruturados.
 * Sem dependências de IA: usa regex, dicionários e inferência estrutural.
 */

import type { Nucleo, NucleoTipo } from "@/types/nucleo";

// ── Tipos públicos ────────────────────────────────────────────────────────────

export type OrbitCommandType =
  | "CREATE_TASK"
  | "CREATE_HABIT"
  | "CREATE_EVENT"
  | "CREATE_LIST"
  | "CREATE_TIMER"
  | "CREATE_NOTE"
  | "CAPTURE";

export interface OrbitCommand {
  id: string;
  type: OrbitCommandType;
  confidence: number; // 0–1
  raw: string;
  titulo: string;
  prioridade: "baixa" | "media" | "alta";
  dataVencimento?: string; // ISO date string "YYYY-MM-DD"
  horaExata?: string; // "HH:MM"
  periodo?: "manha" | "tarde" | "noite";
  frequencia?: "diaria" | "semanal" | "personalizada";
  diasSemana?: number[]; // 0=Dom … 6=Sáb
  tipoNucleo?: NucleoTipo;
  nucleoId?: string;
  nucleoNome?: string;
  nucleoCor?: string;
  // Lista
  tipoLista?: "generico" | "compras" | "financeiro";
  listaItems?: string[];
  valorFinanceiro?: number;
  // Timer
  duracaoMinutos?: number;
  // Nota
  conteudo?: string;
}

// ── Dicionários ───────────────────────────────────────────────────────────────

interface CategoryEntry {
  keywords: string[];
  tipo: NucleoTipo;
  defaultCor: string;
}

const CATEGORIES: CategoryEntry[] = [
  {
    keywords: [
      "trabalho", "cliente", "clientes", "projeto", "reunião", "email", "apresentação",
      "relatório", "empresa", "chefe", "deadline", "entrega", "contrato", "proposta",
      "casamento", "editar", "filmagem", "fotografia", "foto", "vídeo",
      "entrevista", "emprego", "vaga", "cargo", "processo seletivo", "rh", "currículo",
      "nf", "nota fiscal", "orçamento", "proposta comercial",
    ],
    tipo: "profissional",
    defaultCor: "#4D7CFF",
  },
  {
    keywords: [
      "estudar", "estudo", "faculdade", "universidade", "prova", "aula", "matéria",
      "livro", "ler", "leitura", "curso", "react", "código", "programar", "programação",
      "javascript", "python", "typescript", "sql", "revisão", "revisar",
      "anotações", "anotar", "caderno", "apostila", "inglês", "idioma", "certificação",
      "aprender", "workshop", "palestra", "pesquisa",
    ],
    tipo: "estudo",
    defaultCor: "#7C3AED",
  },
  {
    keywords: [
      "academia", "treino", "exercício", "correr", "nadar", "pedalar", "ginástica",
      "musculação", "yoga", "alongamento", "crossfit", "caminhada",
      "água", "hidratação", "beber", "whey", "proteína", "dieta", "emagrecer",
      "peso", "corrida", "ciclismo", "natação", "pilates",
    ],
    tipo: "fitness",
    defaultCor: "#10B981",
  },
  {
    keywords: [
      "pagar", "banco", "dinheiro", "conta", "boleto", "financeiro", "investimento",
      "poupança", "salário", "imposto", "nota fiscal", "receita", "despesa", "fatura",
      "iptu", "ipva", "aluguel", "mensalidade", "assinatura", "streaming", "plano",
      "cartão", "débito", "transferir", "pix", "fornecedor",
    ],
    tipo: "financas",
    defaultCor: "#F59E0B",
  },
  {
    keywords: [
      "casa", "compras", "mercado", "faxina", "limpeza", "roupa", "conserto",
      "organizar", "arrumar", "cozinhar", "almoço", "janta", "leite", "café", "pão",
      "supermercado", "farmácia", "carro", "manutenção", "cnh", "documento",
      "presente", "cabelo", "barbearia", "cabelereiro",
    ],
    tipo: "pessoal",
    defaultCor: "#EC4899",
  },
  {
    keywords: [
      "médico", "consulta", "exame", "saúde", "remédio", "dentista", "hospital",
      "psicólogo", "terapia", "vacina", "sangue", "pressão", "checkup",
    ],
    tipo: "pessoal",
    defaultCor: "#06B6D4",
  },
  {
    keywords: [
      "filho", "filha", "família", "pai", "mãe", "irmão", "namorado", "namorada",
      "aniversário", "viagem", "férias", "ligar", "visitar",
      "amigo", "amiga", "avó", "avô", "neto", "neta", "esposo", "esposa",
    ],
    tipo: "pessoal",
    defaultCor: "#F97316",
  },
  {
    keywords: [
      "música", "tocar", "violão", "guitarra", "piano", "ensaio", "show",
      "pintura", "desenho", "fotografia", "hobby", "jogo", "game", "xadrez",
      "jardinagem", "costura", "artesanato", "culinária", "receita",
    ],
    tipo: "hobby",
    defaultCor: "#8B5CF6",
  },
];

const HABIT_KEYWORDS = [
  "todo dia", "todo os dias", "todos os dias", "diariamente", "cada dia",
  "toda semana", "semanalmente", "por semana",
  "começar a", "comecar a", "quero me tornar", "hábito de", "habito de",
  "rotina de", "rotina",
];

const FREQUENCY_PATTERNS: Array<{
  pattern: RegExp;
  frequencia: "diaria" | "semanal" | "personalizada";
  diasSemana?: number[];
}> = [
  { pattern: /\btodo[s]?\s+os?\s+dias?\b/i, frequencia: "diaria", diasSemana: [0,1,2,3,4,5,6] },
  { pattern: /\btodo\s+dia\b/i, frequencia: "diaria", diasSemana: [0,1,2,3,4,5,6] },
  { pattern: /\bdiariamente\b/i, frequencia: "diaria", diasSemana: [0,1,2,3,4,5,6] },
  { pattern: /\bcada\s+dia\b/i, frequencia: "diaria", diasSemana: [0,1,2,3,4,5,6] },
  { pattern: /\bpor\s+dia\b/i, frequencia: "diaria", diasSemana: [0,1,2,3,4,5,6] },
  { pattern: /\btoda[s]?\s+(manhã|tarde|noite)\b/i, frequencia: "diaria", diasSemana: [0,1,2,3,4,5,6] },
  { pattern: /\btodo[s]?\s+(dia[s]?\s+de\s+)?semana\b/i, frequencia: "diaria", diasSemana: [0,1,2,3,4,5,6] },
  { pattern: /\bdias\s+de\s+semana\b|\bsegunda\s+a\s+sexta\b/i, frequencia: "semanal", diasSemana: [1,2,3,4,5] },
  { pattern: /\bfinais?\s+de\s+semana\b|\bfim\s+de\s+semana\b/i, frequencia: "semanal", diasSemana: [0,6] },
  { pattern: /\btoda\s+semana\b/i, frequencia: "semanal" },
  { pattern: /\bsemanalmente\b/i, frequencia: "semanal" },
  { pattern: /\b(\d+)x\s+por\s+semana\b/i, frequencia: "semanal" },
  { pattern: /\b(\d+)\s+vezes\s+por\s+semana\b/i, frequencia: "semanal" },
  // "todo domingo", "toda segunda", etc.
  { pattern: /\btodo\s+(domingo)\b/i, frequencia: "semanal", diasSemana: [0] },
  { pattern: /\btoda\s+(segunda|segunda-feira)\b/i, frequencia: "semanal", diasSemana: [1] },
  { pattern: /\btoda\s+(terça|terça-feira)\b/i, frequencia: "semanal", diasSemana: [2] },
  { pattern: /\btoda\s+(quarta|quarta-feira)\b/i, frequencia: "semanal", diasSemana: [3] },
  { pattern: /\btoda\s+(quinta|quinta-feira)\b/i, frequencia: "semanal", diasSemana: [4] },
  { pattern: /\btoda\s+(sexta|sexta-feira)\b/i, frequencia: "semanal", diasSemana: [5] },
  { pattern: /\btodo\s+(sábado|sabado)\b/i, frequencia: "semanal", diasSemana: [6] },
];

const PRIORITY_PATTERNS: Array<{
  pattern: RegExp;
  prioridade: "baixa" | "media" | "alta";
}> = [
  { pattern: /\burgente\b|\bimportante\b|\bcrítico\b|\bpreciso\b|\bnão\s+posso\s+esquecer\b/i, prioridade: "alta" },
  { pattern: /\bsempre\s+que\s+possível\b|\bquando\s+der\b|\bse\s+possível\b|\bpode\s+esperar\b/i, prioridade: "baixa" },
];

// Padrões de dia da semana com índice numérico
const WEEKDAY_PATTERNS: Array<{ pattern: RegExp; weekday: number }> = [
  { pattern: /\bdomingo\b/i, weekday: 0 },
  { pattern: /\bsegunda[\s-]?(feira)?\b/i, weekday: 1 },
  { pattern: /\bterça[\s-]?(feira)?\b/i, weekday: 2 },
  { pattern: /\bquarta[\s-]?(feira)?\b/i, weekday: 3 },
  { pattern: /\bquinta[\s-]?(feira)?\b/i, weekday: 4 },
  { pattern: /\bsexta[\s-]?(feira)?\b/i, weekday: 5 },
  { pattern: /\bsábado\b/i, weekday: 6 },
];

const DATE_PATTERNS: Array<{ pattern: RegExp; offset?: number; weekday?: number }> = [
  { pattern: /\bhoje\b/i, offset: 0 },
  { pattern: /\bamanhã\b/i, offset: 1 },
  ...WEEKDAY_PATTERNS.map((wp) => ({ pattern: wp.pattern, weekday: wp.weekday })),
];

const PERIOD_PATTERNS: Array<{ pattern: RegExp; periodo: "manha" | "tarde" | "noite" }> = [
  { pattern: /\bde\s+manhã\b|\bmanhã\b|\bcedo\b/i, periodo: "manha" },
  { pattern: /\bde\s+tarde\b|\bà\s+tarde\b|\bdepois\s+do\s+almoço\b/i, periodo: "tarde" },
  { pattern: /\bà\s+noite\b|\bde\s+noite\b|\bà\s+noitinha\b/i, periodo: "noite" },
];

// Keywords que indicam que " e " não deve ser usado para separar segmentos
// e que partes separadas por vírgula devem ser reagrupadas como itens da mesma lista
const LIST_START_REGEX = /^\s*(comprar\s+|precisamos\s+de\s+|lista\s+de\s+compras|lista\s+de\s+|falta\s+comprar\s+|falta\s+)/i;

const NOTE_PREFIX_REGEX = /^\s*(ideia\s*:\s*|anotação\s*:\s*|nota\s*:\s*|lembrar\s*:\s*|observação\s*:\s*|obs\s*:\s*|pensar\s+em\s*:?\s*)/i;

const FILLER_PREFIXES = [
  /^(preciso\s+|tenho\s+que\s+|tenho\s+de\s+|quero\s+|vou\s+|devo\s+|não\s+posso\s+esquecer\s+(de\s+)?|lembrar\s+(de\s+)?|não\s+esquecer\s+(de\s+)?)/i,
  /^(comecar\s+a\s+|começar\s+a\s+)/i,
];

const DATE_WORDS_REGEX = /\bhoje\b|\bamanhã\b|\bsegunda\b|\bterça\b|\bquarta\b|\bquinta\b|\bsexta\b|\bsábado\b|\bdomingo\b/gi;
const PERIOD_WORDS_REGEX = /\bde\s+manhã\b|\bmanhã\b|\bà\s+tarde\b|\bde\s+tarde\b|\bà\s+noite\b|\bde\s+noite\b|\bdepois\s+do\s+almoço\b/gi;
const PRIORITY_WORDS_REGEX = /\burgente\b|\bimportante\b|\bcrítico\b/gi;
const FREQUENCY_WORDS_REGEX = /\btodo[s]?\s+os?\s+dias?\b|\btodo\s+dia\b|\bdiariamente\b|\bcada\s+dia\b|\btoda\s+semana\b|\bsemanalmente\b|\b\d+x\s+por\s+semana\b|\b\d+\s+vezes\s+por\s+semana\b|\bdias\s+de\s+semana\b|\bfinais?\s+de\s+semana\b|\bfim\s+de\s+semana\b/gi;
const HORA_WORDS_REGEX = /às?\s+\d{1,2}h\d{0,2}|\b\d{1,2}h\d{2}\b/gi;
const DIA_WORDS_REGEX = /\bdia\s+\d{1,2}\b|\b\d{1,2}\/\d{1,2}\b/gi;
const DURACAO_WORDS_REGEX = /\b\d+\s*(?:hora?s?|h)\b|\b\d+\s*min(?:utos?)?\b/gi;

// ── Helpers internos ──────────────────────────────────────────────────────────

function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

/** Extrai hora exata de strings como "às 15h", "às 15h30", "15h30" → "15:30" */
function extractHoraExata(text: string): string | undefined {
  const m = text.match(/às?\s+(\d{1,2})h(\d{2})?|(?<!\d)(\d{1,2})h(\d{2})(?!\d)/i);
  if (!m) return undefined;
  const hStr = m[1] ?? m[3];
  const minStr = m[2] ?? m[4] ?? "00";
  const h = parseInt(hStr, 10);
  const min = parseInt(minStr, 10);
  if (h < 0 || h > 23 || min < 0 || min > 59) return undefined;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

/** Extrai data absoluta: "dia 20", "15/06" → ISO date */
function extractDataAbsoluta(text: string): string | undefined {
  const today = new Date();

  // "dia 20"
  const mDia = text.match(/\bdia\s+(\d{1,2})\b/i);
  if (mDia) {
    const day = parseInt(mDia[1], 10);
    if (day >= 1 && day <= 31) {
      const candidate = new Date(today.getFullYear(), today.getMonth(), day);
      // Se o dia já passou este mês, use o próximo mês
      if (candidate <= today) candidate.setMonth(candidate.getMonth() + 1);
      return candidate.toISOString().split("T")[0];
    }
  }

  // "15/06" ou "15/06/2025"
  const mSlash = text.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
  if (mSlash) {
    const day = parseInt(mSlash[1], 10);
    const month = parseInt(mSlash[2], 10) - 1;
    const year = mSlash[3]
      ? parseInt(mSlash[3].length === 2 ? "20" + mSlash[3] : mSlash[3], 10)
      : today.getFullYear();
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  }

  return undefined;
}

function extractGlobalDate(text: string): string | undefined {
  for (const dp of DATE_PATTERNS) {
    if (dp.pattern.test(text)) {
      const today = new Date();
      if (dp.offset !== undefined) {
        today.setDate(today.getDate() + dp.offset);
        return today.toISOString().split("T")[0];
      }
      if (dp.weekday !== undefined) {
        const current = today.getDay();
        let diff = dp.weekday - current;
        if (diff <= 0) diff += 7;
        today.setDate(today.getDate() + diff);
        return today.toISOString().split("T")[0];
      }
    }
  }

  if (/\besta\s+semana\b|\bessa\s+semana\b/i.test(text)) {
    const sunday = new Date();
    sunday.setDate(sunday.getDate() + (7 - sunday.getDay()));
    return sunday.toISOString().split("T")[0];
  }

  return extractDataAbsoluta(text);
}

// Segmento que parece item solto de lista: curto, sem verbo de ação forte, sem data
const LOOSE_LIST_ITEM_RE = /^[^,]{2,30}$/;
const ACTION_VERB_RE = /\b(pagar|estudar|ligar|enviar|fazer|ir|marcar|renovar|reunião|consulta|treinar|correr|buscar|comprar|entregar|falar|responder)\b/i;

function isLooseListItem(s: string): boolean {
  return LOOSE_LIST_ITEM_RE.test(s.trim()) && !ACTION_VERB_RE.test(s);
}

function splitSegments(text: string): string[] {
  const cleaned = text.replace(
    /^(hoje\s+)?(preciso\s+|tenho\s+que\s+|quero\s+|vou\s+|devo\s+)?/i,
    "",
  );

  const rawParts = cleaned.split(/\s*,\s*|\s*;\s*/);

  // Reagrupa partes que pertencem à mesma lista de compras.
  // Ex: "comprar pão, leite e ovos" → split dá ["comprar pão", "leite e ovos"]
  // → reune em "comprar pão, leite e ovos" para ser tratado como 1 segmento.
  const regrouped: string[] = [];
  for (let i = 0; i < rawParts.length; i++) {
    const part = rawParts[i];
    if (LIST_START_REGEX.test(part)) {
      // Absorve partes seguintes que parecem ser itens da mesma lista
      let merged = part;
      while (i + 1 < rawParts.length && isLooseListItem(rawParts[i + 1])) {
        i++;
        merged += ", " + rawParts[i];
      }
      regrouped.push(merged);
    } else {
      regrouped.push(part);
    }
  }

  const parts = regrouped
    .flatMap((part) => {
      // Segmentos de lista nunca são partidos no "e"
      if (LIST_START_REGEX.test(part)) return [part];

      const subparts = part.split(/\s+e\s+(?=[a-záéíóúâêîôûãẽĩõũçàèìòùäëïöü])/i);
      if (subparts.length > 1 && subparts.every((s) => s.trim().length >= 5)) {
        return subparts;
      }
      return [part];
    })
    .map((s) => normalizeText(s))
    .filter((s) => s.length >= 4);

  return parts;
}

/** Detecta se o segmento é uma lista de compras e extrai os itens */
function detectListInfo(segment: string): {
  isShoppingList: boolean;
  isFinancialList: boolean;
  items: string[];
  valor?: number;
} {
  const lower = segment.toLowerCase();

  // Lista financeira: "pagar boleto R$120", "conta de luz R$80"
  const isFinancial = /\b(pagar|pagamento|boleto|conta\s+de|fatura|débito)\b/i.test(segment);
  const valorMatch = segment.match(/R\$\s*([\d.,]+)/i);
  const valor = valorMatch
    ? parseFloat(valorMatch[1].replace(",", "."))
    : undefined;

  if (isFinancial) {
    // Extrai os itens do segmento de pagamento (pode ser múltiplos separados por vírgula já tratados)
    return { isShoppingList: false, isFinancialList: true, items: [segment], valor };
  }

  // Lista de compras: "comprar leite e café", "leite, café, pão"
  const isShop = /\b(comprar|precisamos\s+de|lista\s+de\s+compras|falta\s+comprar|falta)\b/i.test(segment);
  if (isShop) {
    const afterKeyword = segment
      .replace(/\b(lista\s+de\s+compras|comprar|precisamos\s+de|falta\s+comprar|falta)\b/i, "")
      .replace(/^\s*[:\-]\s*/, "") // remove ":" ou "-" após o keyword
      .trim();
    const items = afterKeyword
      .split(/\s*,\s*|\s+e\s+/)
      .map((s) => normalizeText(s))
      .filter((s) => s.length >= 2);
    return { isShoppingList: true, isFinancialList: false, items: items.length ? items : [afterKeyword] };
  }

  return { isShoppingList: false, isFinancialList: false, items: [] };
}

/** Detecta duração em minutos: "2h", "25 min", "1 hora" */
function extractDuracao(segment: string): number | undefined {
  // Horas primeiro
  const mHora = segment.match(/\b(\d+(?:[.,]\d+)?)\s*h(?:ora?s?)?\b/i);
  if (mHora) return Math.round(parseFloat(mHora[1].replace(",", ".")) * 60);

  const mMin = segment.match(/\b(\d+)\s*min(?:utos?)?\b/i);
  if (mMin) return parseInt(mMin[1], 10);

  return undefined;
}

function detectIntent(segment: string): OrbitCommandType {
  const lower = segment.toLowerCase();

  // Nota: prefixo explícito ou texto longo sem ação
  if (NOTE_PREFIX_REGEX.test(segment)) return "CREATE_NOTE";
  if (segment.length > 80 && !/\b(fazer|ir|estudar|comprar|pagar|ligar|reunião|treinar)\b/i.test(lower)) {
    return "CREATE_NOTE";
  }

  // Lista financeira
  if (/\b(pagar|boleto|fatura|débito)\b/i.test(lower) && /R\$|reais/i.test(lower)) {
    return "CREATE_LIST";
  }

  // Lista de compras
  if (/\b(comprar|precisamos\s+de|lista\s+de\s+compras|falta\s+comprar)\b/i.test(lower)) {
    return "CREATE_LIST";
  }

  // Hábito
  if (HABIT_KEYWORDS.some((kw) => lower.includes(kw))) return "CREATE_HABIT";
  if (FREQUENCY_PATTERNS.some(({ pattern }) => pattern.test(segment))) return "CREATE_HABIT";

  // Timer: duração explícita + keyword de foco (sem frequência)
  const hasDuracao = /\b\d+\s*h(?:ora?s?)?\b|\b\d+\s*min(?:utos?)?\b/i.test(segment);
  const hasFocoKeyword = /\b(foco|pomodoro|sprint|sessão|focar)\b/i.test(lower);
  const hasStudyWithDuration = /\b(estudar|estudando)\b/i.test(lower) && hasDuracao;
  if (hasDuracao && (hasFocoKeyword || hasStudyWithDuration) && !FREQUENCY_PATTERNS.some(({ pattern }) => pattern.test(segment))) {
    return "CREATE_TIMER";
  }

  // Evento: keyword de compromisso + referência de data/hora
  if (
    /\b(reunião|consulta|compromisso|evento|meeting|apresentação|entrevista)\b/i.test(segment) &&
    /às?\s+\d+h|\bdia\s+\d+|\bsegunda\b|\bterça\b|\bquarta\b|\bquinta\b|\bsexta\b|\bsábado\b|\bdomingo\b|\bamanhã\b|\bhoje\b|\b\d{1,2}h\d{2}\b/i.test(segment)
  ) {
    return "CREATE_EVENT";
  }

  return "CREATE_TASK";
}

function detectPriority(segment: string): "baixa" | "media" | "alta" {
  for (const { pattern, prioridade } of PRIORITY_PATTERNS) {
    if (pattern.test(segment)) return prioridade;
  }
  return "media";
}

function detectDate(segment: string, globalDate?: string): string | undefined {
  for (const dp of DATE_PATTERNS) {
    if (dp.pattern.test(segment)) {
      const today = new Date();
      if (dp.offset !== undefined) {
        today.setDate(today.getDate() + dp.offset);
        return today.toISOString().split("T")[0];
      }
      if (dp.weekday !== undefined) {
        const current = today.getDay();
        let diff = dp.weekday - current;
        if (diff <= 0) diff += 7;
        today.setDate(today.getDate() + diff);
        return today.toISOString().split("T")[0];
      }
    }
  }

  // Data absoluta ("dia 20", "15/06")
  const abs = extractDataAbsoluta(segment);
  if (abs) return abs;

  return globalDate;
}

function detectPeriod(segment: string): "manha" | "tarde" | "noite" | undefined {
  for (const { pattern, periodo } of PERIOD_PATTERNS) {
    if (pattern.test(segment)) return periodo;
  }
  return undefined;
}

function detectFrequency(segment: string): {
  frequencia: "diaria" | "semanal" | "personalizada";
  diasSemana?: number[];
} | undefined {
  for (const { pattern, frequencia, diasSemana } of FREQUENCY_PATTERNS) {
    if (pattern.test(segment)) return { frequencia, diasSemana };
  }
  return undefined;
}

function detectCategory(segment: string): { tipo: NucleoTipo; defaultCor: string } | undefined {
  const lower = segment.toLowerCase();
  let best: { tipo: NucleoTipo; defaultCor: string; score: number } | undefined;

  for (const cat of CATEGORIES) {
    let score = 0;
    for (const kw of cat.keywords) {
      if (lower.includes(kw.toLowerCase())) score++;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { tipo: cat.tipo, defaultCor: cat.defaultCor, score };
    }
  }

  return best ? { tipo: best.tipo, defaultCor: best.defaultCor } : undefined;
}

function cleanTitulo(segment: string, type: OrbitCommandType): string {
  let title = segment;

  // Remove filler prefixes
  for (const regex of FILLER_PREFIXES) {
    title = title.replace(regex, "");
  }

  // Remove metadata words
  title = title
    .replace(DATE_WORDS_REGEX, "")
    .replace(PERIOD_WORDS_REGEX, "")
    .replace(PRIORITY_WORDS_REGEX, "")
    .replace(FREQUENCY_WORDS_REGEX, "")
    .replace(HORA_WORDS_REGEX, "")
    .replace(DIA_WORDS_REGEX, "");

  // Para timers, remover a duração do título
  if (type === "CREATE_TIMER") {
    title = title.replace(DURACAO_WORDS_REGEX, "");
  }

  // Para listas de compras, remover o keyword "comprar"
  if (type === "CREATE_LIST") {
    title = title.replace(/\b(comprar|precisamos\s+de|lista\s+de\s+compras|falta\s+comprar)\b/i, "");
    // Remove "R$xxx" do título de listas financeiras
    title = title.replace(/R\$\s*[\d.,]+/gi, "");
  }

  // Para notas, remover o prefixo
  if (type === "CREATE_NOTE") {
    title = title.replace(NOTE_PREFIX_REGEX, "");
  }

  title = title.replace(/\s+/g, " ").trim();
  title = title.replace(/\s+(e|de|para|por|com|em)\s*$/i, "").trim();

  return title.charAt(0).toUpperCase() + title.slice(1);
}

function matchNucleo(
  tipoNucleo: NucleoTipo | undefined,
  nucleos: Nucleo[],
): Pick<OrbitCommand, "nucleoId" | "nucleoNome" | "nucleoCor"> {
  if (!tipoNucleo || nucleos.length === 0) return {};

  const byTipo = nucleos.filter((n) => n.tipo === tipoNucleo);
  if (byTipo.length > 0) {
    const n = byTipo[0];
    return { nucleoId: n.id, nucleoNome: n.nome, nucleoCor: n.corDestaque || "#4D7CFF" };
  }

  const categoryEntry = CATEGORIES.find((c) => c.tipo === tipoNucleo);
  if (categoryEntry) {
    const byKeyword = nucleos.find((n) =>
      categoryEntry.keywords.some((kw) =>
        n.nome.toLowerCase().includes(kw.toLowerCase()),
      ),
    );
    if (byKeyword) {
      return {
        nucleoId: byKeyword.id,
        nucleoNome: byKeyword.nome,
        nucleoCor: byKeyword.corDestaque || categoryEntry.defaultCor,
      };
    }
  }

  return {};
}

function computeConfidence(cmd: Partial<OrbitCommand>): number {
  let score = 0.5;
  if (cmd.titulo && cmd.titulo.length > 5) score += 0.1;
  if (cmd.tipoNucleo) score += 0.1;
  if (cmd.nucleoId) score += 0.15;
  if (cmd.dataVencimento) score += 0.08;
  if (cmd.horaExata) score += 0.07;
  if (cmd.periodo) score += 0.05;
  // Penalidades
  if (cmd.titulo && cmd.titulo.length < 5) score -= 0.15;
  if (cmd.type === "CAPTURE") score -= 0.2;
  return Math.min(Math.max(score, 0.1), 1);
}

// ── API pública ───────────────────────────────────────────────────────────────

export function interpret(rawText: string, nucleos: Nucleo[] = []): OrbitCommand[] {
  const text = normalizeText(rawText);
  if (!text) return [];

  const globalDate = extractGlobalDate(text);
  const segments = splitSegments(text);

  return segments
    .map((segment): OrbitCommand | null => {
      if (segment.length < 4) return null;

      const type = detectIntent(segment);
      const titulo = cleanTitulo(segment, type);
      if (!titulo || titulo.length < 2) return null;

      const prioridade = detectPriority(segment);
      const isHabit = type === "CREATE_HABIT";
      const dataVencimento = !isHabit ? detectDate(segment, globalDate) : undefined;
      const horaExata = extractHoraExata(segment);
      const periodo = detectPeriod(segment);
      const freqInfo = isHabit ? detectFrequency(segment) : undefined;
      const catInfo = detectCategory(segment);
      const nucleoMatch = matchNucleo(catInfo?.tipo, nucleos);

      // Campos específicos por tipo
      let tipoLista: "generico" | "compras" | "financeiro" | undefined;
      let listaItems: string[] | undefined;
      let valorFinanceiro: number | undefined;
      let duracaoMinutos: number | undefined;
      let conteudo: string | undefined;

      if (type === "CREATE_LIST") {
        const listInfo = detectListInfo(segment);
        if (listInfo.isFinancialList) {
          tipoLista = "financeiro";
          valorFinanceiro = listInfo.valor;
          listaItems = [titulo];
        } else if (listInfo.isShoppingList) {
          tipoLista = "compras";
          listaItems = listInfo.items.length ? listInfo.items : [titulo];
        } else {
          tipoLista = "generico";
          listaItems = [titulo];
        }
      }

      if (type === "CREATE_TIMER") {
        duracaoMinutos = extractDuracao(segment) ?? 25;
      }

      if (type === "CREATE_NOTE") {
        conteudo = segment.replace(NOTE_PREFIX_REGEX, "").trim();
      }

      const partial: Partial<OrbitCommand> = {
        type, titulo, prioridade, dataVencimento, horaExata, periodo,
        frequencia: freqInfo?.frequencia, diasSemana: freqInfo?.diasSemana,
        tipoNucleo: catInfo?.tipo ?? "pessoal",
        nucleoCor: catInfo?.defaultCor ?? "#F97316",
        tipoLista, duracaoMinutos, conteudo,
        ...nucleoMatch,
      };

      return {
        id: crypto.randomUUID(),
        type,
        confidence: computeConfidence(partial),
        raw: segment,
        titulo,
        prioridade,
        dataVencimento,
        horaExata,
        periodo,
        frequencia: freqInfo?.frequencia,
        diasSemana: freqInfo?.diasSemana,
        tipoNucleo: catInfo?.tipo ?? "pessoal",
        nucleoCor: nucleoMatch.nucleoCor ?? catInfo?.defaultCor ?? "#F97316",
        nucleoId: nucleoMatch.nucleoId,
        nucleoNome: nucleoMatch.nucleoNome,
        tipoLista,
        listaItems,
        valorFinanceiro,
        duracaoMinutos,
        conteudo,
      };
    })
    .filter((c): c is OrbitCommand => c !== null)
    .sort((a, b) => {
      const pOrder = { alta: 0, media: 1, baixa: 2 };
      return pOrder[a.prioridade] - pOrder[b.prioridade];
    });
}
