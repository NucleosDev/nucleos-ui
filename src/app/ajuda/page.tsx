"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Zap,
  Trophy,
  Target,
  Flame,
  TrendingUp,
  Sparkles,
  MessageCircle,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gerarSlug, adicionarSlugs } from "@/lib/slug-utils";
import { HeroSection } from "@/components/help/hero-section";
import { CategoriaCard } from "@/components/help/categoria-card";
import { ArtigoCard } from "@/components/help/artigo-card";

// Dados das categorias
const categoriasData = [
  {
    icon: BookOpen,
    titulo: "Primeiros Passos",
    descricao: "Comece sua jornada no Nucleos",
    cor: "#4D7CFF",
    artigos: 10,
  },
  {
    icon: Zap,
    titulo: "Nucleos e Blocos",
    descricao: "Aprenda a criar e organizar",
    cor: "#00C9A7",
    artigos: 12,
  },
  {
    icon: Trophy,
    titulo: "Gamificação",
    descricao: "XP, níveis e conquistas",
    cor: "#FFD700",
    artigos: 6,
  },
  {
    icon: Target,
    titulo: "Metas e Streaks",
    descricao: "Mantenha a consistência",
    cor: "#FF8C42",
    artigos: 5,
  },
  {
    icon: Flame,
    titulo: "Produtividade",
    descricao: "Técnicas e métodos",
    cor: "#FF6B6B",
    artigos: 7,
  },
  {
    icon: TrendingUp,
    titulo: "Análises",
    descricao: "Métricas e relatórios",
    cor: "#8CD47E",
    artigos: 4,
  },
  {
    icon: Zap,
    titulo: "Planos disponíveis",
    descricao: "Conheça os planos e recursos disponíveis",
    cor: "#8CD47E",
    artigos: 4,
  },
];

// Artigos populares
const artigosPopularesData = [
  {
    titulo: "Como criar seu primeiro Núcleo",
    resumo:
      "Guia passo a passo para criar seu primeiro núcleo e organizar suas tarefas",
    tempoLeitura: "5 min",
    visualizacoes: "3.2k",
    data: "2024-01-12",
    categoria: "Nucleos e Blocos",
    categoriaCor: "#00C9A7",
  },
  {
    titulo: "Entendendo o sistema de XP",
    resumo: "Descubra como ganhar experiência e subir de nível no Nucleos",
    tempoLeitura: "4 min",
    visualizacoes: "2.8k",
    data: "2024-01-18",
    categoria: "Gamificação",
    categoriaCor: "#FFD700",
  },
  {
    titulo: "Dicas para manter streaks",
    resumo: "Estratégias para não quebrar sua sequência de produtividade",
    tempoLeitura: "6 min",
    visualizacoes: "2.1k",
    data: "2024-01-20",
    categoria: "Metas e Streaks",
    categoriaCor: "#FF8C42",
  },
  {
    titulo: "Personalizando seus Nucleos",
    resumo: "Aprenda a deixar seus Nucleos com a sua cara",
    tempoLeitura: "3 min",
    visualizacoes: "1.8k",
    data: "2024-01-22",
    categoria: "Nucleos e Blocos",
    categoriaCor: "#00C9A7",
  },
  {
    titulo: "Método Pomodoro no Nucleos",
    resumo: "Use a técnica Pomodoro para aumentar sua produtividade",
    tempoLeitura: "4 min",
    visualizacoes: "1.5k",
    data: "2024-01-25",
    categoria: "Produtividade",
    categoriaCor: "#FF6B6B",
  },
  {
    titulo: "Interpretando seus gráficos",
    resumo: "Entenda as métricas e acompanhe sua evolução",
    tempoLeitura: "5 min",
    visualizacoes: "1.2k",
    data: "2024-01-28",
    categoria: "Análises",
    categoriaCor: "#8CD47E",
  },
];

// ✅ FAQ adicionado!
const faqs = [
  {
    pergunta: "O que são Nucleos?",
    resposta:
      "Nucleos são espaços personalizados que você cria para organizar diferentes áreas da sua vida, como estudos, saúde, trabalho, finanças, etc. Cada núcleo pode conter blocos, tarefas e seu próprio sistema de progressão.",
  },
  {
    pergunta: "Como funciona o sistema de XP?",
    resposta:
      "Você ganha XP ao completar tarefas e manter streaks. Quanto mais XP acumula, mais sobe de nível. Cada nível desbloqueia novas conquistas e funcionalidades.",
  },
  {
    pergunta: "Posso usar em múltiplos dispositivos?",
    resposta:
      "Sim! O Nucleos sincroniza automaticamente todos os seus dados na nuvem, permitindo acesso de qualquer dispositivo (web, iOS e Android).",
  },
  {
    pergunta: "Meus dados são seguros?",
    resposta:
      "Sim, todos os dados são criptografados e armazenados com segurança. O Nucleos segue as melhores práticas de segurança da indústria.",
  },
  {
    pergunta: "Como posso cancelar minha assinatura?",
    resposta:
      "Você pode cancelar sua assinatura a qualquer momento nas configurações da sua conta. O cancelamento é imediato e sem multa.",
  },
];

// Adicionar slugs
const categorias = adicionarSlugs(categoriasData, "titulo");
const artigosPopulares = adicionarSlugs(artigosPopularesData, "titulo", {
  removeStopWords: true,
  stopWords: [
    "de",
    "da",
    "do",
    "das",
    "dos",
    "e",
    "a",
    "o",
    "em",
    "com",
    "sua",
  ],
});

// Interface para o FAQ (opcional, mas bom para TypeScript)
interface FAQ {
  pergunta: string;
  resposta: string;
}

export default function AjudaPage() {
  // Calcular totais
  const totalArtigos = categorias.reduce((acc, cat) => acc + cat.artigos, 0);
  const totalCategorias = categorias.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section com busca e estatísticas */}
      <HeroSection
        totalArtigos={totalArtigos}
        totalCategorias={totalCategorias}
      />

      {/* Categorias */}
      <section className="container mx-auto px-4 py-16 relative">
        {/* Gradiente de fundo */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge
            variant="outline"
            className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 mb-4"
          >
            <Sparkles className="size-4 text-[#4D7CFF]" />
            <span className="text-[#4D7CFF]">Navegue por categoria</span>
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Encontre o que você precisa
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categorias.map((cat, index) => (
            <CategoriaCard
              key={cat.slug}
              icon={cat.icon}
              titulo={cat.titulo}
              descricao={cat.descricao}
              cor={cat.cor}
              artigos={cat.artigos}
              slug={cat.slug}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Artigos Populares */}
      <section className="container mx-auto px-4 py-16 relative bg-muted/30">
        {/* Gradiente de fundo */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4D7CFF]/5 to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge
            variant="outline"
            className="gap-2 border-[#00C9A7]/20 bg-[#00C9A7]/5 px-4 py-2 mb-4"
          >
            <TrendingUp className="size-4 text-[#00C9A7]" />
            <span className="text-[#00C9A7]">Mais lidos</span>
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Artigos populares
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {artigosPopulares.map((artigo, index) => (
            <ArtigoCard
              key={artigo.slug}
              titulo={artigo.titulo}
              slug={artigo.slug}
              resumo={artigo.resumo}
              tempoLeitura={artigo.tempoLeitura}
              visualizacoes={artigo.visualizacoes}
              data={artigo.data}
              categoria={artigo.categoria}
              categoriaCor={artigo.categoriaCor}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge
              variant="outline"
              className="gap-2 border-[#FF8C42]/20 bg-[#FF8C42]/5 px-4 py-2 mb-4"
            >
              <Sparkles className="size-4 text-[#FF8C42]" />
              <span className="text-[#FF8C42]">Dúvidas frequentes</span>
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Perguntas frequentes
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq: FAQ, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <details className="group border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm open:bg-gradient-to-br open:from-[#4D7CFF]/5 open:to-[#00C9A7]/5 transition-all duration-300">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-medium group-hover:text-[#4D7CFF] transition-colors">
                      {faq.pergunta}
                    </span>
                    <motion.div
                      animate={{ rotate: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className="text-muted-foreground group-open:rotate-180 transition-transform"
                    >
                      ▼
                    </motion.div>
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground border-t border-border/50 pt-4">
                    {faq.resposta}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contato */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Gradiente de fundo */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] opacity-10 animate-gradient bg-[length:200%_auto]" />

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative p-12 text-center backdrop-blur-sm bg-gradient-to-r from-[#4D7CFF]/5 to-[#00C9A7]/5">
            <Badge
              variant="outline"
              className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 mb-4"
            >
              <MessageCircle className="size-4 text-[#4D7CFF]" />
              <span className="text-[#4D7CFF]">Suporte 24/7</span>
            </Badge>

            <h3 className="text-3xl font-bold mb-4">Ainda precisa de ajuda?</h3>

            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Nossa equipe está pronta para ajudar com qualquer dúvida que você
              tiver.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white hover:opacity-90"
              >
                <MessageCircle className="size-4" />
                Chat ao vivo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-[#4D7CFF] text-[#4D7CFF] hover:bg-[#4D7CFF]/10"
              >
                <Mail className="size-4" />
                Enviar email
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
