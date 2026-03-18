Guia de Slugs - Nucleos
Abrir src/lib/slug-utils.ts >>>>>

magina que você tem um artigo chamado "Como criar seu primeiro Núcleo". Se a URL fosse algo como:

ⅹ - www.nucleos.com/artigo/123456 (feio, difícil de lembrar)
✔ - www.nucleos.com/artigo/como-criar-primeiro-nucleo (bonito, fácil de ler)
Esse texto bonitinho no final da URL (como-criar-primeiro-nucleo) é o SLUG! É basicamente uma versão amigável do título, sem acentos, espaços viram hífens, tudo minúsculo.

Por que usar slugs?

EM SLUG (URL feia):
/ajuda?id=abc123&categoria=43&artigo=987

COM SLUG (URL bonita):
/ajuda/artigo/como-criar-primeiro-nucleo

Vantagens:

Mais fácil de lembrar
Melhor para SEO (Google entende do que se trata)
Parece mais profissional
Dá pra ler e entender antes de clicar
Nosso Utilitário de Slugs 🛠️

Criei um arquivo mágico que faz todo o trabalho pesado pra gente:

/lib/slug-utils.ts

typescript
/\*\*

- UTILITÁRIO DE SLUGS - SUPER FÁCIL DE USAR!
- Pode ser usado em QUALQUER LUGAR do projeto
  \*/

// Função principal - a mais usada!

export function gerarSlug(texto: string): string {
return texto
.toLowerCase() // TUDO minúsculo
.normalize('NFD') // Prepara pra tirar acentos
.replace(/[\u0300-\u036f]/g, '') // Tchau acentos! (coração -> coracao)
.replace(/[^\w\s-]/g, '') // Remove caracteres especiais (!?@#$)
.replace(/\s+/g, '-') // Espaços viram hífens
.replace(/--+/g, '-') // Remove hífens duplicados
.trim(); // Remove espaços extras no começo/fim
}

// Útil pra adicionar slug em vários itens de uma vez

export function adicionarSlugs<T>(
items: T[],
campo: keyof T = 'titulo'
): (T & { slug: string })[] {
return items.map(item => ({
...item, // Mantém as propriedades originais
slug: gerarSlug(String(item[campo])) // Adiciona o slug novo
}));
}

Como usar na prática - EXEMPLOS REAIS!

EXEMPLO 1: Página de Ajuda (igual a que eu fiz)

Antes (sem slug):

tsx
// /app/ajuda/page.tsx
const categorias = [
{ titulo: "Primeiros Passos", descricao: "..." }
];

// Link feio :(

<Link href={`/ajuda/${categorias[0].titulo}`}>
  {/* resultado: /ajuda/Primeiros Passos (cheio de problemas) */}
</Link>
Depois (com slug - LINDO!):

tsx
// /app/ajuda/page.tsx
import { adicionarSlugs } from "@/lib/slug-utils";

// Array original (seus dados)
const categoriasData = [
{
titulo: "Primeiros Passos",
descricao: "Comece sua jornada",
cor: "#4D7CFF"
},
{
titulo: "Nucleos e Blocos",
descricao: "Aprenda a criar",
cor: "#00C9A7"
},
];

// MUITO MAIS FÁCIL: adiciona slugs automaticamente!

const categorias = adicionarSlugs(categoriasData, 'titulo');

/_
categorias agora tem:
[
{
titulo: "Primeiros Passos",
descricao: "...",
cor: "#4D7CFF",
slug: "primeiros-passos" ← NOVO!
},
{
titulo: "Nucleos e Blocos",
descricao: "...",
cor: "#00C9A7",
slug: "nucleos-e-blocos" ← NOVO!
},
]
_/

// Agora é só usar o slug no link!
{categorias.map(cat => (

  <Link href={`/ajuda/categoria/${cat.slug}`}>
    {cat.titulo}
  </Link>
  // Resultado: /ajuda/categoria/primeiros-passos  (LINDO DEMAIS!)
))}

EXEMPLO 2: Blog

tsx
// /app/blog/page.tsx
import { adicionarSlugs } from "@/lib/slug-utils";

const postsData = [
{
titulo: "Como ser mais produtivo",
autor: "João",
resumo: "Dicas incríveis"
},
{
titulo: "O que é gamificação?",
autor: "Maria",
resumo: "Entenda de uma vez"
},
];

const posts = adicionarSlugs(postsData, 'titulo');
// posts[0].slug = "como-ser-mais-produtivo"
// posts[1].slug = "o-que-e-gamificacao"
EXEMPLO 3: Produtos (E-commerce)

tsx
// /app/produtos/page.tsx
const produtosData = [
{
nome: "iPhone 15 Pro",
preco: 9999,
marca: "Apple"
},
{
nome: "Notebook Gamer",
preco: 5999,
marca: "Dell"
},
];

// Se o campo se chama "nome" em vez de "titulo"
const produtos = adicionarSlugs(produtosData, 'nome');
// produtos[0].slug = "iphone-15-pro"
// produtos[1].slug = "notebook-gamer"
Como criar PÁGINAS que recebem esses slugs 🚪

1. Página de Categoria (dinâmica)

Crie um arquivo com [slug] - isso é MÁGICA do Next.js!

text
/app
/ajuda
/categoria
/[slug] ← Isso é um placeholder!
page.tsx ← Pega QUALQUER slug
tsx
// /app/ajuda/categoria/[slug]/page.tsx
export default function CategoriaPage({ params }: { params: { slug: string } }) {
// O Next.js joga o slug automaticamente aqui!
// Se a URL for /ajuda/categoria/primeiros-passos
// params.slug = "primeiros-passos"

const slug = params.slug;

// Agora é só buscar os dados baseado no slug!
// (depois você aprende a buscar do banco de dados)

return <h1>Categoria: {slug}</h1>
} 2. Página de Artigo

Mesma ideia, mas com outra pasta:

text
/app
/ajuda
/artigo
/[slug]
page.tsx ← Página do artigo
tsx
// /app/ajuda/artigo/[slug]/page.tsx
export default function ArtigoPage({ params }: { params: { slug: string } }) {
// URL: /ajuda/artigo/como-criar-primeiro-nucleo
// params.slug = "como-criar-primeiro-nucleo"

return <h1>Artigo: {params.slug}</h1>
}
DICAS DE OURO PARA INICIANTES 🥇

1️⃣ Sempre use adicionarSlugs nos seus arrays

tsx
// ERRADO - fazer manualmente
const categorias = [
{ titulo: "Primeiros Passos", slug: "primeiros-passos" },
{ titulo: "Nucleos e Blocos", slug: "nucleos-e-blocos" },
];

// CERTO - deixar o computador fazer
const categorias = adicionarSlugs(categoriasData, 'titulo');
2️⃣ Para um item só, use gerarSlug diretamente

tsx
const titulo = "Como criar seu primeiro Núcleo!";
const slug = gerarSlug(titulo);
// Resultado: "como-criar-seu-primeiro-nucleo"
3️⃣ Nos links, SEMPRE use o slug, nunca o título original

tsx
// ERRADO (vai dar problema com espaços, acentos)

<Link href={`/categoria/${cat.titulo}`}>

// CERTO (sempre bonitinho)

<Link href={`/categoria/${cat.slug}`}>
4️⃣ Quando criar uma página dinâmica, lembre do [slug]

O nome da pasta com [slug] é tipo um curinga - pega qualquer valor!

text
/blog/[slug]/page.tsx ← pega /blog/qualquer-coisa-aqui
EXERCÍCIO PRÁTICO 🏋️‍♂️

Desafio: Você tem uma lista de tutoriais e quer criar slugs para eles.

tsx
// 1. Seus dados
const tutoriaisData = [
{
titulo: "Como usar o Nucleos no celular",
dificuldade: "Iniciante",
tempo: "5 min"
},
{
titulo: "Dicas avançadas de organização",
dificuldade: "Intermediário",
tempo: "10 min"
},
];

// 2. Adicione os slugs
import { adicionarSlugs } from "@/lib/slug-utils";
const tutoriais = adicionarSlugs(tutoriaisData, 'titulo');

// 3. Use nos links

{tutoriais.map(tutorial => (

  <Link href={`/tutoriais/${tutorial.slug}`}>
    {tutorial.titulo}
  </Link>
  // /tutoriais/como-usar-nucleos-no-celular
  // /tutoriais/dicas-avancadas-de-organizacao
))}

RESUMÃO - O que você precisa lembrar

Slug = versão bonita do título para URL
gerarSlug() = transforma texto em slug
adicionarSlugs() = adiciona slug em vários itens de uma vez
[slug] nas pastas = página dinâmica que recebe qualquer slug
Sempre use slug nos links, nunca o título original
Comandos mágicos que você vai usar SEMPRE ✨

tsx
// 1. GERAR UM SLUG
import { gerarSlug } from "@/lib/slug-utils";
const slug = gerarSlug("Meu Título Aqui!");

// 2. ADICIONAR SLUGS EM LISTAS
import { adicionarSlugs } from "@/lib/slug-utils";
const itensComSlug = adicionarSlugs(meusItens, 'titulo');

// 3. PEGAR SLUG DA URL (em páginas dinâmicas)
export default function Pagina({ params }: { params: { slug: string } }) {
const slugRecebido = params.slug;
}
Pronto! Agora vocês são mestres dos slugs! 🎉 Qualquer dúvida é só chamar!
