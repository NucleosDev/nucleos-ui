import { SlugOptions } from "./slug-utils";

// Lista completa de stop words em português
export const stopWords = [
  // Artigos
  "o", "a", "os", "as", "um", "uma", "uns", "umas",

  // Preposições
  "de", "da", "do", "das", "dos",
  "em", "na", "no", "nas", "nos",
  "para", "pra", "pro", "pras", "pros",
  "com", "sem", "sob", "sobre", "entre",
  "por", "per", "ante", "após", "até",

  // Conjunções
  "e", "ou", "mas", "que", "porque", "pois",
  "como", "quando", "enquanto", "embora",

  // Pronomes
  "eu", "tu", "ele", "ela", "nós", "vós", "eles", "elas",
  "me", "te", "se", "nos", "vos",
  "meu", "minha", "meus", "minhas",
  "seu", "sua", "seus", "suas",
  "este", "esta", "estes", "estas", "isto",
  "esse", "essa", "esses", "essas", "isso",
  "aquele", "aquela", "aqueles", "aquelas", "aquilo",

  // Advérbios comuns
  "já", "ainda", "agora", "depois", "antes",
  "aqui", "ali", "lá", "cá",
  "muito", "pouco", "mais", "menos",
  "sim", "não", "talvez", "sempre", "nunca",

  // Verbos comuns (forma infinitiva)
  "ser", "estar", "ter", "haver", "fazer",
  "poder", "dever", "querer", "saber",

  // Palavras interrogativas
  "que", "quem", "qual", "quais",
  "quanto", "quanta", "quantos", "quantas",
  "como", "onde", "quando", "porque", "porquê",

  // Numerais
  "primeiro", "primeira", "primeiros", "primeiras",
  "segundo", "terceiro", "quarto", "quinto",
];

// Configuração para ARTIGOS (com remoção de stop words)
export const artigoSlugOptions: SlugOptions = {
  removeStopWords: true,
  stopWords: stopWords,
  maxLength: 80, // Limite de caracteres
  separator: "-",
  lowercase: true,
};

// Configuração para CATEGORIAS (sem remoção de stop words)
export const categoriaSlugOptions: SlugOptions = {
  removeStopWords: false,
  maxLength: 50,
  separator: "-",
  lowercase: true,
};

// Configuração para URLs mais curtas (tags, etc)
export const shortSlugOptions: SlugOptions = {
  removeStopWords: true,
  stopWords: stopWords,
  maxLength: 40,
  separator: "-",
  lowercase: true,
};