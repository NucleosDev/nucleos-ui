// /app/produto/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Trophy,
  Target,
  Layers,
  Calendar,
  Timer,
  Table,
  Brain,
  Heart,
  Briefcase,
  Wallet,
  Flame,
  Star,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { NucleoCoreCard } from "@/components/nucleo/nucleo-core-card";
// import { mockNucleos } from "@/components/nucleo/mocks/nucleo-card.mock";

const features = [
  {
    icon: Layers,
    title: "Nucleos Personalizados",
    description:
      "Crie espaços dedicados para cada área da sua vida: estudos, saúde, finanças, projetos e muito mais.",
    color: "#4D7CFF",
  },
  {
    icon: Trophy,
    title: "Gamificação",
    description:
      "Ganhe XP, suba de nível e desbloqueie conquistas. Cada tarefa completada é um passo na sua evolução.",
    color: "#FFD700",
  },
  {
    icon: Target,
    title: "Metas e Streaks",
    description:
      "Defina objetivos e mantenha a consistência. Streaks diários te motivam a não quebrar o ritmo.",
    color: "#FF8C42",
  },
  {
    icon: Calendar,
    title: "Calendário Integrado",
    description:
      "Visualize seus eventos e prazos em um calendário completo, sincronizado com seus Nucleos.",
    color: "#2EBD59",
  },
  {
    icon: Table,
    title: "Coleções",
    description:
      "Organize informações em tabelas personalizáveis, como bancos de dados simples e poderosos.",
    color: "#00C9A7",
  },
  {
    icon: Timer,
    title: "Pomodoro e Timers",
    description:
      "Mantenha o foco com temporadores integrados. Ideal para estudos e tarefas que exigem concentração.",
    color: "#0077BE",
  },
];

const blocosTipos = [
  {
    titulo: "Bloco de Texto",
    descricao: "Para anotações, ideias e documentação",
    icon: Brain,
    color: "#4D7CFF",
  },
  {
    titulo: "Bloco de Coleção",
    descricao: "Tabelas e bancos de dados personalizados",
    icon: Table,
    color: "#00C9A7",
  },
  {
    titulo: "Bloco de Calendário",
    descricao: "Eventos, prazos e cronogramas",
    icon: Calendar,
    color: "#2EBD59",
  },
  {
    titulo: "Bloco de Timer",
    descricao: "Pomodoro, cronômetros e contagens",
    icon: Timer,
    color: "#0077BE",
  },
];

export default function ProdutoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:px-8 lg:pt-40">
        {/* Gradientes */}
        <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-10 bg-gradient-to-b from via/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10 bg-gradient-to-t from via/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />

        {/* Elementos decorativos */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-[#4D7CFF]/5 blur-3xl animate-pulse" />
          <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-[#00C9A7]/5 blur-3xl animate-pulse delay-700" />
        </div>

        <div className="mx-auto max-w-5xl text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="outline"
              className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF] mb-6"
            >
              <Sparkles className="size-4" />
              <span>Conheça o Nucleos</span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            O sistema operacional da{" "}
            <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              sua evolução
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Nucleos é mais que um app de produtividade. É um ecossistema
            completo para organizar, acompanhar e celebrar sua jornada de
            desenvolvimento pessoal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="group bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] hover:from-[#00C9A7] hover:to-[#4D7CFF]"
            >
              <Link href="/cadastro" className="flex items-center gap-2">
                Começar grátis
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/painel">Ver demonstração</Link>
            </Button>
          </motion.div>
        </div>

        {/* Preview dos Nucleos */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#4D7CFF]/20 via-[#00C9A7]/20 to-transparent blur-3xl" />

          <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 border-b border-border/50 bg-secondary/30 px-4 py-3">
              <div className="size-3 rounded-full bg-destructive/60" />
              <div className="size-3 rounded-full bg-chart-3/60" />
              <div className="size-3 rounded-full bg-accent/60" />
              <span className="ml-2 text-xs text-muted-foreground">
                Seus Nucleos • visão geral
              </span>
            </div>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                {/* <NucleoCoreCard nucleo={mockNucleos[0]} />
                <NucleoCoreCard nucleo={mockNucleos[1]} />
                <NucleoCoreCard nucleo={mockNucleos[2]} /> */}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF] mb-4"
            >
              <Zap className="size-4" />
              <span>Recursos poderosos</span>
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Tudo que você precisa para{" "}
              <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent">
                evoluir
              </span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa com ferramentas flexíveis para organizar
              todas as áreas da sua vida.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-[#4D7CFF]/30 transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div
                      className="mb-4 flex size-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <feature.icon
                        className="size-6"
                        style={{ color: feature.color }}
                      />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blocos Section */}
      <section className="px-4 py-24 bg-muted/30 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="gap-2 border-[#00C9A7]/20 bg-[#00C9A7]/5 px-4 py-2 text-[#00C9A7] mb-4"
            >
              <Layers className="size-4" />
              <span>Blocos versáteis</span>
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Construa do seu jeito
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Cada Nucleo é composto por blocos que você pode combinar
              livremente.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {blocosTipos.map((bloco, index) => (
              <motion.div
                key={bloco.titulo}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div
                    className="flex size-16 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${bloco.color}15` }}
                  >
                    <bloco.icon
                      className="size-8"
                      style={{ color: bloco.color }}
                    />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">{bloco.titulo}</h3>
                <p className="text-sm text-muted-foreground">
                  {bloco.descricao}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge
              variant="outline"
              className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF] mb-4"
            >
              <Sparkles className="size-4" />
              <span>Comece agora</span>
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Pronto para começar no Nucleos?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Junte-se a milhares de pessoas que já estão evoluindo com o
              Nucleos.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7]"
              >
                <Link href="/cadastro" className="flex items-center gap-2">
                  Criar conta gratuita
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/planos">Ver planos</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              *Não é necessário um cartão de crédito. Comece grátis hoje.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
