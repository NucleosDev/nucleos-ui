import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Eye,
  BookOpen,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { gerarSlug } from "@/lib/slug-utils";
import { todosArtigos } from "../../data/artigos";
import { ArtigoCard } from "@/components/help/artigo-card";

// Dados das categorias
const categoriasData = [
  {
    titulo: "Primeiros Passos",
    descricao: "Comece sua jornada no Nucleos",
    cor: "#4D7CFF",
    slug: "primeiros-passos",
    artigos: 8,
  },
  {
    titulo: "Nucleos e Blocos",
    descricao: "Aprenda a criar e organizar",
    cor: "#00C9A7",
    slug: "nucleos-e-blocos",
    artigos: 12,
  },
  {
    titulo: "Gamificação",
    descricao: "XP, níveis e conquistas",
    cor: "#FFD700",
    slug: "gamificacao",
    artigos: 6,
  },
  {
    titulo: "Metas e Streaks",
    descricao: "Mantenha a consistência",
    cor: "#FF8C42",
    slug: "metas-e-streaks",
    artigos: 5,
  },
  {
    titulo: "Produtividade",
    descricao: "Técnicas e métodos",
    cor: "#FF6B6B",
    slug: "produtividade",
    artigos: 7,
  },
  {
    titulo: "Análises",
    descricao: "Métricas e relatórios",
    cor: "#8CD47E",
    slug: "analises",
    artigos: 4,
  },
];

// Gerar slugs estaticamente
export async function generateStaticParams() {
  return categoriasData.map((categoria) => ({
    slug: categoria.slug,
  }));
}

// Gerar metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categoria = categoriasData.find((cat) => cat.slug === slug);

  if (!categoria) {
    return {
      title: "Categoria não encontrada | Nucleos",
    };
  }

  return {
    title: `${categoria.titulo} | Central de Ajuda Nucleos`,
    description: categoria.descricao,
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoria = categoriasData.find((cat) => cat.slug === slug);

  if (!categoria) {
    notFound();
    return;
  }

  const artigos = todosArtigos[slug] || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header da categoria */}
      <div
        className="relative border-b border-border/50 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${categoria.cor}10 0%, transparent 100%)`,
        }}
      >
        {/* Elementos de fundo */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-0 right-0 size-96 rounded-full blur-3xl"
            style={{ backgroundColor: `${categoria.cor}10` }}
          />
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/ajuda">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>

            <Badge
              variant="outline"
              className="gap-2"
              style={{
                borderColor: `${categoria.cor}30`,
                backgroundColor: `${categoria.cor}10`,
                color: categoria.cor,
              }}
            >
              <BookOpen className="size-4" />
              <span>Categoria</span>
            </Badge>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-3">{categoria.titulo}</h1>
            <p className="text-lg text-muted-foreground mb-6">
              {categoria.descricao}
            </p>

            {/* Estatísticas */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div
                  className="size-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${categoria.cor}20` }}
                >
                  <BookOpen
                    className="size-5"
                    style={{ color: categoria.cor }}
                  />
                </div>
                <div>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: categoria.cor }}
                  >
                    {artigos.length}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {artigos.length === 1 ? "Artigo" : "Artigos"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de artigos */}
      <section className="container mx-auto px-4 py-12">
        {artigos.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Sparkles className="size-5 text-[#4D7CFF]" />
                Todos os artigos
              </h2>
              <Badge variant="outline">{artigos.length} encontrados</Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {artigos.map((artigo, index) => (
                <ArtigoCard
                  key={artigo.slug}
                  titulo={artigo.titulo}
                  slug={artigo.slug}
                  resumo={artigo.resumo}
                  tempoLeitura={artigo.tempoLeitura}
                  visualizacoes={artigo.visualizacoes}
                  data={artigo.data}
                  categoria={categoria.titulo}
                  categoriaCor={categoria.cor}
                  index={index}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div
              className="size-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${categoria.cor}10` }}
            >
              <BookOpen className="size-8" style={{ color: categoria.cor }} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="text-muted-foreground">
              Em breve teremos artigos nesta categoria
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
