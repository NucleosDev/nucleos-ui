// /app/explorar/page.tsx
"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Filter,
  TrendingUp,
  Star,
  Users,
  Flame,
  Trophy,
  Zap,
  Target,
  BookOpen,
  Heart,
  Briefcase,
  Wallet,
  Dumbbell,
  Coffee,
  Home,
  Code,
  Music,
  Camera,
  Palette,
  Globe,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NucleoCardCompact } from "@/components/nucleo/ui/nucleo-card-mini";
import { mockNucleos } from "@/components/nucleo/mocks/nucleo-card.mock";
import type { NucleoWithStats } from "@/components/nucleo/types/nucleo-components.types";

const categorias = [
  { nome: "Todos", icone: Sparkles, count: 156 },
  { nome: "Estudos", icone: BookOpen, count: 45, cor: "#4D7CFF" },
  { nome: "Saúde", icone: Heart, count: 32, cor: "#FF8C42" },
  { nome: "Finanças", icone: Wallet, count: 28, cor: "#00C9A7" },
  { nome: "Trabalho", icone: Briefcase, count: 24, cor: "#2EBD59" },
  { nome: "Pessoal", icone: Home, count: 18, cor: "#0077BE" },
  { nome: "Fitness", icone: Dumbbell, count: 15, cor: "#FFD700" },
  { nome: "Bem-estar", icone: Coffee, count: 12, cor: "#8CD47E" },
  { nome: "Tecnologia", icone: Code, count: 10, cor: "#4D7CFF" },
  { nome: "Música", icone: Music, count: 8, cor: "#9B59B6" },
  { nome: "Fotografia", icone: Camera, count: 7, cor: "#E67E22" },
  { nome: "Arte", icone: Palette, count: 6, cor: "#E74C3C" },
];

const templatesPopulares = [
  {
    id: "template-1",
    nome: "Estudos para Provas",
    descricao:
      "Template completo para organizar estudos para concursos e provas",
    autor: "Ana Silva",
    usos: 234,
    avaliacao: 4.8,
    cor: "#4D7CFF",
    tags: ["estudos", "concursos", "organização"],
  },
  {
    id: "template-2",
    nome: "Fitness Tracker",
    descricao: "Acompanhe treinos, dieta e medidas corporais",
    autor: "Carlos Fitness",
    usos: 189,
    avaliacao: 4.9,
    cor: "#00C9A7",
    tags: ["fitness", "saúde", "exercícios"],
  },
  {
    id: "template-3",
    nome: "Finanças Pessoais",
    descricao: "Controle de gastos, investimentos e metas financeiras",
    autor: "Mariana Econômica",
    usos: 312,
    avaliacao: 4.7,
    cor: "#FFD700",
    tags: ["finanças", "orçamento", "metas"],
  },
  {
    id: "template-4",
    nome: "Projetos Ágeis",
    descricao: "Template para gerenciar projetos com metodologia ágil",
    autor: "Pedro PM",
    usos: 156,
    avaliacao: 4.6,
    cor: "#2EBD59",
    tags: ["projetos", "ágil", "trabalho"],
  },
  {
    id: "template-5",
    nome: "Hábitos Diários",
    descricao: "Acompanhe e construa hábitos saudáveis",
    autor: "Juliana Hábitos",
    usos: 278,
    avaliacao: 4.9,
    cor: "#FF8C42",
    tags: ["hábitos", "rotina", "produtividade"],
  },
  {
    id: "template-6",
    nome: "Diário de Gratidão",
    descricao: "Registro diário de gratidão e reflexões",
    autor: "Bem-Estar Coletivo",
    usos: 145,
    avaliacao: 4.8,
    cor: "#0077BE",
    tags: ["bem-estar", "gratidão", "reflexão"],
  },
];

// Função para gerar XP aleatório
const gerarXpAleatorio = () => Math.floor(Math.random() * 5000) + 500;

// Tipos válidos para Nucleos
type NucleoTipo = "pessoal" | "profissional" | "projeto" | "estudo" | "hobby";

// Nucleos públicos tipados corretamente
const nucleosPublicos: NucleoWithStats[] = [
  ...mockNucleos.map((n) => ({
    ...n,
    autor: "Usuário Nucleos",
    usos: Math.floor(Math.random() * 100) + 20,
  })),
  {
    id: "public-1",
    userId: "user2",
    nome: "Estudando para Certificação AWS",
    descricao: "Meus estudos para a certificação Solutions Architect",
    tipo: "estudo" as NucleoTipo,
    corDestaque: "#4D7CFF",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon: undefined,
    blocos: [],
    relations: [],
    achievements: [],
    autor: "João Cloud",
    usos: 67,
    xpTotal: 3450,
    xpHoje: 120,
    xpSemana: 850,
    level: 14,
    nextLevelXp: 4000,
    energyTotal: 80,
    energyHoje: 15,
    conquistasDesbloqueadas: 2,
  },
  {
    id: "public-2",
    userId: "user3",
    nome: "Rotina Fitness 2024",
    descricao: "Treinos, dieta e acompanhamento de resultados",
    tipo: "hobby" as NucleoTipo,
    corDestaque: "#00C9A7",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon: undefined,
    blocos: [],
    relations: [],
    achievements: [],
    autor: "Mariana Atleta",
    usos: 42,
    xpTotal: 2100,
    xpHoje: 75,
    xpSemana: 450,
    level: 9,
    nextLevelXp: 2500,
    energyTotal: 60,
    energyHoje: 20,
    conquistasDesbloqueadas: 1,
  },
  {
    id: "public-3",
    userId: "user4",
    nome: "Organização Financeira",
    descricao: "Controle de gastos e investimentos",
    tipo: "pessoal" as NucleoTipo,
    corDestaque: "#FFD700",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon: undefined,
    blocos: [],
    relations: [],
    achievements: [],
    autor: "Carlos Economia",
    usos: 89,
    xpTotal: 1800,
    xpHoje: 60,
    xpSemana: 320,
    level: 7,
    nextLevelXp: 2000,
    energyTotal: 45,
    energyHoje: 12,
    conquistasDesbloqueadas: 0,
  },
  {
    id: "public-4",
    userId: "user5",
    nome: "Desenvolvimento Pessoal",
    descricao: "Metas e hábitos para crescimento",
    tipo: "projeto" as NucleoTipo,
    corDestaque: "#2EBD59",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    icon: undefined,
    blocos: [],
    relations: [],
    achievements: [],
    autor: "Ana Desenvolvimento",
    usos: 56,
    xpTotal: 2900,
    xpHoje: 95,
    xpSemana: 620,
    level: 11,
    nextLevelXp: 3000,
    energyTotal: 70,
    energyHoje: 25,
    conquistasDesbloqueadas: 1,
  },
];

export default function ExplorarPage() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [busca, setBusca] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-[#4D7CFF]/5 via-transparent to-[#00C9A7]/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Explorar</h1>
              <p className="text-sm text-muted-foreground">
                Descubra Nucleos e templates criados pela comunidade
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Busca e Filtros */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar Nucleos, templates, autores..."
              className="pl-9"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2 md:w-auto">
            <Filter className="size-4" />
            Filtros avançados
          </Button>
        </div>
      </section>

      {/* Categorias */}
      <section className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          {categorias.map((cat) => {
            const Icon = cat.icone;
            return (
              <Button
                key={cat.nome}
                variant={
                  categoriaSelecionada === cat.nome ? "default" : "outline"
                }
                size="sm"
                className="rounded-full gap-2"
                onClick={() => setCategoriaSelecionada(cat.nome)}
              >
                <Icon className="size-4" style={{ color: cat.cor }} />
                {cat.nome} ({cat.count})
              </Button>
            );
          })}
        </div>
      </section>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="populares" className="space-y-8">
          <TabsList>
            <TabsTrigger value="populares" className="gap-2">
              <TrendingUp className="size-4" />
              Populares
            </TabsTrigger>
            <TabsTrigger value="recentes" className="gap-2">
              <Sparkles className="size-4" />
              Recentes
            </TabsTrigger>
            <TabsTrigger value="seguindo" className="gap-2">
              <Users className="size-4" />
              Seguindo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="populares" className="space-y-8">
            {/* Templates em Destaque */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Star className="size-5 text-[#FFD700]" />
                Templates em destaque
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templatesPopulares.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:border-[#4D7CFF]/30 transition-all group">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="size-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${template.cor}20` }}
                            >
                              <Zap
                                className="size-4"
                                style={{ color: template.cor }}
                              />
                            </div>
                            <h3 className="font-semibold">{template.nome}</h3>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {template.usos} usos
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {template.descricao}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            por {template.autor}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="size-3 text-[#FFD700] fill-[#FFD700]" />
                            <span>{template.avaliacao}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {template.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-muted"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-3 text-xs">
                          Usar template
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Nucleos da Comunidade */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="size-5 text-[#4D7CFF]" />
                Nucleos da comunidade
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {nucleosPublicos.map((nucleo, index) => (
                  <NucleoCardCompact
                    key={nucleo.id}
                    nucleo={nucleo}
                    onClick={() => console.log("Abrir", nucleo.nome)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recentes">
            <div className="text-center py-12 text-muted-foreground">
              Nucleos recentes aparecerão aqui
            </div>
          </TabsContent>

          <TabsContent value="seguindo">
            <div className="text-center py-12 text-muted-foreground">
              Nucleos de pessoas que você segue aparecerão aqui
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
