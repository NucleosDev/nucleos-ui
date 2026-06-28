import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Eye,
  Calendar,
  ThumbsUp,
  Share2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { artigosPorSlug } from "../../data/artigos";

// Gerar slugs estaticamente
export async function generateStaticParams() {
  return Object.keys(artigosPorSlug).map((slug) => ({
    slug,
  }));
}

// Gerar metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artigo = artigosPorSlug[slug];

  if (!artigo) {
    return {
      title: "Artigo não encontrado | Nucleos",
    };
  }

  return {
    title: `${artigo.titulo} | Central de Ajuda Nucleos`,
    description: artigo.resumo,
    openGraph: {
      title: artigo.titulo,
      description: artigo.resumo,
      type: "article",
      publishedTime: artigo.data,
      authors: [artigo.autor],
    },
  };
}

export default async function ArtigoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artigo = artigosPorSlug[slug];

  if (!artigo) {
    notFound();
  }
  // Tenta encontrar com e sem hífen no final
  if (!artigosPorSlug[slug]) {
    console.log("5. Tentando com slug limpo:", slug.replace(/-$/, ""));
  }

  if (!artigo) {
    console.log("❌ ARTIGO NÃO ENCONTRADO!");
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header com gradiente */}
      <div
        className="relative border-b border-border/50 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${artigo.categoriaCor}15 0%, transparent 100%)`,
        }}
      >
        {/* Elementos de fundo */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-0 right-0 size-96 rounded-full blur-3xl"
            style={{ backgroundColor: `${artigo.categoriaCor}10` }}
          />
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb e navegação */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/ajuda">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                href="/ajuda"
                className="hover:text-foreground transition-colors"
              >
                Ajuda
              </Link>
              <ChevronRight className="size-4" />
              <Link
                href={`/ajuda/categoria/${artigo.categoria || gerarSlug(artigo.categoria)}`}
                className="hover:text-foreground transition-colors"
                style={{ color: artigo.categoriaCor }}
              >
                {artigo.categoria}
              </Link>
            </div>
          </div>

          {/* Título e metadados */}
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">{artigo.titulo}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="size-4" />
                {new Date(artigo.data).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-4" />
                {artigo.tempoLeitura}
              </span>
              {/* <span className="flex items-center gap-1">
                <Eye className="size-4" />
                {artigo.visualizacoes} visualizações
              </span> */}
            </div>

            {/* Badge da categoria */}
            <Badge
              variant="outline"
              className="mt-2"
              style={{
                backgroundColor: `${artigo.categoriaCor}15`,
                borderColor: `${artigo.categoriaCor}30`,
                color: artigo.categoriaCor,
              }}
            >
              {artigo.categoria}
            </Badge>
          </div>
        </div>
      </div>

      {/* Conteúdo do artigo */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-border/50 shadow-lg">
            <CardContent className="p-8">
              {/* Resumo em destaque */}
              <div
                className="p-6 rounded-lg mb-8"
                style={{ backgroundColor: `${artigo.categoriaCor}08` }}
              >
                <p className="text-lg italic text-foreground/80">
                  {artigo.resumo}
                </p>
              </div>

              {/* Conteúdo HTML */}
              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: artigo.conteudo }}
              />

              <Separator className="my-8" />

              {/* Informações do autor */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ThumbsUp className="size-4" />
                      Útil
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share2 className="size-4" />
                      Compartilhar
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Escrito por{" "}
                    <span className="font-medium text-foreground">
                      {artigo.autor}
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navegação para artigos relacionados (opcional) */}
          <div className="mt-8 flex justify-between">
            <Button variant="link" className="gap-2">
              ← Artigo anterior
            </Button>
            <Button variant="link" className="gap-2">
              Próximo artigo →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Função auxiliar para gerar slug (se não tiver no artigo)
function gerarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}
