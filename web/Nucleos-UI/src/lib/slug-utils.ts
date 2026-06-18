// Utilitário universal para geração de slugs, Pode ser usado em qualquer parte da aplicação

export const stopWords = [
  // Artigos
  "o",
  "a",
  "os",
  "as",
  "um",
  "uma",
  "uns",
  "umas",

  // Preposições
  "de",
  "da",
  "do",
  "das",
  "dos",
  "em",
  "na",
  "no",
  "nas",
  "nos",
  "para",
  "pra",
  "pro",
  "pras",
  "pros",
  "com",
  "sem",
  "sob",
  "sobre",
  "entre",
  "por",
  "per",
  "ante",
  "após",
  "até",

  // Conjunções
  "e",
  "ou",
  "mas",
  "que",
  "porque",
  "pois",
  "como",
  "quando",
  "enquanto",
  "embora",

  // Pronomes
  "eu",
  "tu",
  "ele",
  "ela",
  "nós",
  "vós",
  "eles",
  "elas",
  "me",
  "te",
  "se",
  "nos",
  "vos",
  "meu",
  "minha",
  "meus",
  "minhas",
  "seu",
  "sua",
  "seus",
  "suas",
  "este",
  "esta",
  "estes",
  "estas",
  "isto",
  "esse",
  "essa",
  "esses",
  "essas",
  "isso",
  "aquele",
  "aquela",
  "aqueles",
  "aquelas",
  "aquilo",

  // Advérbios comuns
  "já",
  "ainda",
  "agora",
  "depois",
  "antes",
  "aqui",
  "ali",
  "lá",
  "cá",
  "muito",
  "pouco",
  "mais",
  "menos",
  "sim",
  "não",
  "talvez",
  "sempre",
  "nunca",

  // Verbos comuns (forma infinitiva)
  "ser",
  "estar",
  "ter",
  "haver",
  "fazer",
  "poder",
  "dever",
  "querer",
  "saber",

  // Palavras interrogativas
  "que",
  "quem",
  "qual",
  "quais",
  "quanto",
  "quanta",
  "quantos",
  "quantas",
  "como",
  "onde",
  "quando",
  "porque",
  "porquê",

  // Numerais
  "primeiro",
  "primeira",
  "primeiros",
  "primeiras",
  "segundo",
  "terceiro",
  "quarto",
  "quinto",
];

// Interface para itens que podem ter slug
export interface Sluggable {
  titulo?: string;
  nome?: string;
  titulo_original?: string;
  [key: string]: any;
}

// Opções para geração de slug
export interface SlugOptions {
  maxLength?: number;
  separator?: string;
  lowercase?: boolean;
  removeStopWords?: boolean;
  stopWords?: string[];
}

// Configurações padrão
const DEFAULT_OPTIONS: SlugOptions = {
  maxLength: 100,
  separator: "-",
  lowercase: true,
  removeStopWords: false,
  stopWords: [],
};


/**
 * Gera um slug a partir de qualquer texto
 * @param texto - Texto original para converter em slug
 * @param options - Opções de configuração
 * @returns Slug gerado
 */
export function gerarSlug(texto: string, options: SlugOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (!texto) return "";

  let slug = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^\w\s-]/g, "") // Remove caracteres especiais
    .trim();

  // Remove stop words se necessário
  if (opts.removeStopWords && opts.stopWords) {
    const words = slug.split(/\s+/);
    const filteredWords = words.filter(
      (word) => !opts.stopWords?.includes(word),
    );
    slug = filteredWords.join(" ");
  }

  // Substitui espaços e caracteres especiais
  slug = slug
    .replace(/\s+/g, opts.separator!) // Substitui espaços pelo separador
    .replace(/--+/g, opts.separator!) // Remove separadores duplicados
    .replace(new RegExp(`^${opts.separator}|${opts.separator}$`, "g"), ""); // Remove separadores do início/fim

  // Limita o tamanho máximo
  if (opts.maxLength && slug.length > opts.maxLength) {
    slug = slug
      .substring(0, opts.maxLength)
      .replace(new RegExp(`${opts.separator}[^${opts.separator}]*$`), "");
  }

  return opts.lowercase ? slug.toLowerCase() : slug;
}

/**
 * Gera slug a partir de múltiplos campos
 * @param campos - Objeto com os campos para compor o slug
 * @param options - Opções de configuração
 * @returns Slug gerado
 */
export function gerarSlugComposto(
  campos: Record<string, string>,
  options: SlugOptions = {},
): string {
  const textoComposto = Object.values(campos).filter(Boolean).join(" ");

  return gerarSlug(textoComposto, options);
}

/**
 * Gera slug único verificando existência
 * @param baseSlug - Slug base
 * @param existe - Função para verificar se o slug já existe
 * @param options - Opções de configuração
 * @returns Slug único
 */
export async function gerarSlugUnico(
  baseSlug: string,
  existe: (slug: string) => Promise<boolean> | boolean,
  options: { maxTentativas?: number; separator?: string } = {},
): Promise<string> {
  const { maxTentativas = 100, separator = "-" } = options;

  let slug = baseSlug;
  let tentativa = 1;

  while (await existe(slug)) {
    if (tentativa > maxTentativas) {
      throw new Error(
        `Não foi possível gerar um slug único após ${maxTentativas} tentativas`,
      );
    }

    // Adiciona número ao final do slug
    const baseWithoutNumber = baseSlug.replace(
      new RegExp(`${separator}\\d+$`),
      "",
    );
    slug = `${baseWithoutNumber}${separator}${tentativa}`;
    tentativa++;
  }

  return slug;
}

/**
 * Adiciona slug a um array de itens
 * @param items - Array de itens para adicionar slug
 * @param campo - Campo usado para gerar o slug (padrão: 'titulo')
 * @param options - Opções de configuração
 * @returns Array com slugs adicionados
 */
export function adicionarSlugs<T extends Sluggable>(
  items: T[],
  campo: keyof T = "titulo" as keyof T,
  options: SlugOptions = {},
): (T & { slug: string })[] {
  return items.map((item) => ({
    ...item,
    slug: gerarSlug(String(item[campo] || ""), options),
  }));
}

/**
 * Gera slug para rotas aninhadas
 * @param partes - Partes da rota
 * @param options - Opções de configuração
 * @returns Slug completo para rota
 */
export function gerarSlugRota(
  partes: string[],
  options: SlugOptions = {},
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return partes
    .map((parte) => gerarSlug(parte, { ...opts, separator: "" }))
    .join(opts.separator);
}

/**
 * Valida se um slug é válido
 * @param slug - Slug para validar
 * @returns boolean indicando se é válido
 */
export function slugValido(slug: string): boolean {
  if (!slug) return false;

  // Regex: apenas letras minúsculas, números e hífens
  // Não pode começar ou terminar com hífen
  // Não pode ter hífens consecutivos
  const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return regex.test(slug);
}

/**
 * Extrai ID de um slug no formato "id-titulo"
 * @param slug - Slug no formato "id-titulo"
 * @returns ID extraído ou null
 */
export function extrairIdDoSlug(slug: string): number | null {
  const match = slug.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Converte slug de volta para texto legível
 * @param slug - Slug para converter
 * @returns Texto legível
 */
export function slugParaTexto(slug: string): string {
  return slug
    .split("-")
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(" ");
}

// Exportações nomeadas e default
export default {
  gerarSlug,
  gerarSlugComposto,
  gerarSlugUnico,
  gerarSlugRota,
  adicionarSlugs,
  slugValido,
  extrairIdDoSlug,
  slugParaTexto,
};
