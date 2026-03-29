"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  User,
  Tag,
  Clock,
  Sparkles,
  TrendingUp,
  Heart,
  Brain,
  Zap,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const posts = [
  {
    id: 1,
    titulo: "Como criar hábitos duradouros com gamificação",
    excerpt:
      "Descubra como o sistema de XP e níveis pode transformar sua rotina e criar hábitos que duram.",
    autor: "Ana Silva",
    autorAvatar: "/placeholder-user.jpg",
    data: "15 Mar 2024",
    tempoLeitura: "5 min",
    categoria: "Produtividade",
    tags: ["hábitos", "gamificação", "XP"],
    image: "/public/blog1.png",
    cor: "#4D7CFF",
  },
  {
    id: 2,
    titulo: "O poder dos streaks: por que consistência importa",
    excerpt:
      "Entenda a psicologia por trás dos streaks e como eles podem te ajudar a manter o foco.",
    autor: "Carlos Santos",
    autorAvatar: "/placeholder-user.jpg",
    data: "10 Mar 2024",
    tempoLeitura: "4 min",
    categoria: "Motivação",
    tags: ["streaks", "motivação", "consistência"],
    image: "/blog/streaks.jpg",
    cor: "#FF8C42",
  },
  {
    id: 3,
    titulo: "Organizando suas finanças com Nucleos",
    excerpt:
      "Aprenda a usar o Nucleos para controlar gastos, definir metas financeiras e investir melhor.",
    autor: "Mariana Costa",
    autorAvatar: "/placeholder-user.jpg",
    data: "5 Mar 2024",
    tempoLeitura: "6 min",
    categoria: "Finanças",
    tags: ["finanças", "metas", "orçamento"],
    image: "/blog/financas.jpg",
    cor: "#00C9A7",
  },
  {
    id: 4,
    titulo: "Técnica Pomodoro: maximize seu foco",
    excerpt:
      "Como usar o timer do Nucleos para aplicar a técnica Pomodoro e aumentar sua produtividade.",
    autor: "Pedro Oliveira",
    autorAvatar: "/placeholder-user.jpg",
    data: "28 Fev 2024",
    tempoLeitura: "3 min",
    categoria: "Produtividade",
    tags: ["pomodoro", "foco", "timer"],
    image: "/blog/pomodoro.jpg",
    cor: "#2EBD59",
  },
  {
    id: 5,
    titulo: "Equilibrando vida profissional e pessoal",
    excerpt:
      "Use Nucleos separados para trabalho e vida pessoal e encontre o equilíbrio ideal.",
    autor: "Juliana Lima",
    autorAvatar: "/placeholder-user.jpg",
    data: "20 Fev 2024",
    tempoLeitura: "5 min",
    categoria: "Equilíbrio",
    tags: ["work-life balance", "carreira", "pessoal"],
    image: "/blog/equilibrio.jpg",
    cor: "#0077BE",
  },
  {
    id: 6,
    titulo: "A ciência por trás da gamificação",
    excerpt:
      "Entenda como a gamificação ativa os circuitos de recompensa do cérebro e aumenta a motivação.",
    autor: "Dr. Roberto Mendes",
    autorAvatar: "/placeholder-user.jpg",
    data: "12 Fev 2024",
    tempoLeitura: "7 min",
    categoria: "Ciência",
    tags: ["neurociência", "gamificação", "motivação"],
    image: "/blog/ciencia.jpg",
    cor: "#FFD700",
  },
];

const categorias = [
  { nome: "Todos", count: 12 },
  { nome: "Produtividade", count: 4 },
  { nome: "Motivação", count: 3 },
  { nome: "Finanças", count: 2 },
  { nome: "Equilíbrio", count: 2 },
  { nome: "Ciência", count: 1 },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-10 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />
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
              <span>Blog</span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Histórias de{" "}
            <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              evolução
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Dicas, histórias e insights sobre produtividade, hábitos e
            desenvolvimento pessoal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 max-w-md mx-auto"
          >
            <div className="relative">
              <Input placeholder="Buscar artigos..." className="pl-10" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categorias */}
      <section className="px-4 py-8 border-y border-border/50">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-2">
            {categorias.map((cat) => (
              <Button
                key={cat.nome}
                variant={cat.nome === "Todos" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {cat.nome} ({cat.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/blog/${post.id}`}>
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-all group">
                    <div className="relative h-48 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                      <div className="absolute bottom-4 left-4 z-20">
                        <Badge
                          style={{ backgroundColor: post.cor }}
                          className="text-white border-0"
                        >
                          {post.categoria}
                        </Badge>
                      </div>
                      <div
                        className="w-full h-full bg-gradient-to-br"
                        style={{
                          background: `linear-gradient(135deg, ${post.cor}40 0%, ${post.cor}10 100%)`,
                        }}
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {post.data}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {post.tempoLeitura}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold mb-2 group-hover:text-[#4D7CFF] transition-colors">
                        {post.titulo}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full bg-muted overflow-hidden">
                            <Image
                              src={post.autorAvatar}
                              alt={post.autor}
                              width={24}
                              height={24}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {post.autor}
                          </span>
                        </div>
                        <span className="text-xs text-[#4D7CFF] group-hover:translate-x-1 transition-transform">
                          Ler mais →
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-4">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" className="gap-2">
              Carregar mais artigos
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-4 py-16 bg-gradient-to-r from-[#4D7CFF]/10 to-[#00C9A7]/10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Receba novidades</h2>
          <p className="text-muted-foreground mb-8">
            Inscreva-se para receber dicas de produtividade e novidades do
            Nucleos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input placeholder="Seu melhor email" type="email" />
            <Button className="whitespace-nowrap bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7]">
              Inscrever
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Prometemos não enviar spam. Você pode cancelar a qualquer momento.
          </p>
        </div>
      </section>
    </div>
  );
}
