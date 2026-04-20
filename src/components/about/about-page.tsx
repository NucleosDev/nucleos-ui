"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ChevronRight,
  Sparkles,
  Zap,
  Brain,
  Dumbbell,
  Briefcase,
  Trophy,
  Flame,
  Star,
  Target,
  Award,
  Users,
  Check,
  X,
  Bell,
  TrendingUp,
  Crown,
  Rocket,
  Medal,
  Heart,
  Wallet,
  BookOpen,
} from "lucide-react";

interface AboutPageProps {
  achievements?: Array<{ label: string; value: string }>;
}

const defaultAchievements = [
  { label: "Usuários ativos", value: "50K+" },
  { label: "Tarefas completas", value: "2M+" },
  { label: "Conquistas", value: "500K+" },
  { label: "Avaliação média", value: "4.9" },
];

const nucleosData = [
  {
    nome: "Estudos",
    nivel: 12,
    xpAtual: 2450,
    xpMax: 3000,
    progresso: 82,
    icon: Brain,
    cor: "primary",
  },
  {
    nome: "Fitness",
    nivel: 8,
    xpAtual: 1200,
    xpMax: 2000,
    progresso: 60,
    icon: Dumbbell,
    cor: "accent",
  },
  {
    nome: "Trabalho",
    nivel: 15,
    xpAtual: 4500,
    xpMax: 5000,
    progresso: 90,
    icon: Briefcase,
    cor: "primary",
  },
];

const notifications = [
  { icon: Trophy, text: "Nível 12 - 2.847/3.000 XP", color: "primary" },
  { icon: Zap, text: "Estudar React +50 XP", color: "accent" },
  { icon: Flame, text: "Academia +75 XP", color: "primary" },
  { icon: Star, text: "Meditar +30 XP", color: "accent" },
  { icon: TrendingUp, text: "21 dias +15%", color: "primary" },
  { icon: Award, text: "Nova conquista! 'Primeira Semana'", color: "accent" },
  {
    icon: Flame,
    text: "Streak em chamas! 7 dias consecutivos",
    color: "primary",
  },
  { icon: Crown, text: "Level Up! Nível 5 alcançado", color: "accent" },
  {
    icon: Trophy,
    text: "Meta atingida! 100% das tarefas +250 XP",
    color: "primary",
  },
  { icon: Star, text: "Bônus de consistência", color: "accent" },
];

const comparisons = [
  {
    feature: "Organização de tarefas",
    semNucleos: "Espalhadas em vários apps",
    comNucleos: "Tudo em um só lugar",
  },
  {
    feature: "Motivação",
    semNucleos: "Facilmente perdida",
    comNucleos: "Sistema de XP e níveis",
  },
  {
    feature: "Acompanhamento",
    semNucleos: "Sem visão geral",
    comNucleos: "Dashboard completo",
  },
  {
    feature: "Consistência",
    semNucleos: "Difícil manter hábitos",
    comNucleos: "Streaks e conquistas",
  },
  {
    feature: "Personalização",
    semNucleos: "Limitada",
    comNucleos: "Nucleos personalizados",
  },
];

const journeySteps = [
  {
    nivel: "Nível 1",
    titulo: "Dia 1 - Começo",
    desc: "Crie sua conta e configure seus primeiros Nucleos.",
    icon: Star,
  },
  {
    nivel: "Nível 5",
    titulo: "Semana 1 - Hábitos",
    desc: "Adicione tarefas diárias e ganhe seus primeiros XPs.",
    icon: Target,
  },
  {
    nivel: "Nível 15",
    titulo: "Mês 1 - Conquistas",
    desc: "Desbloqueie suas primeiras conquistas.",
    icon: Trophy,
  },
  {
    nivel: "Nível 30",
    titulo: "Mês 3 - Evolução",
    desc: "Hábitos consolidados, produtividade em alta.",
    icon: TrendingUp,
  },
  {
    nivel: "Nível 50",
    titulo: "Mês 6 - Domínio",
    desc: "Você domina suas áreas e inspira outros.",
    icon: Crown,
  },
  {
    nivel: "Nível 100",
    titulo: "Ano 1 - Transformação",
    desc: "Uma pessoa completamente transformada.",
    icon: Rocket,
  },
];

const howItWorks = [
  {
    number: "01",
    title: "Crie seus Nucleos",
    desc: "Defina as áreas da sua vida que deseja desenvolver.",
  },
  {
    number: "02",
    title: "Estabeleça Hábitos",
    desc: "Adicione hábitos e configure a frequência e XP.",
  },
  {
    number: "03",
    title: "Complete Atividades",
    desc: "Registre atividades diárias e ganhe experiência.",
  },
  {
    number: "04",
    title: "Evolua e Celebre",
    desc: "Suba de nível e desbloqueie conquistas.",
  },
];

const badges = [
  {
    nome: "Primeiro Passo",
    desc: "Complete sua primeira tarefa",
    tier: "bronze",
    icon: Star,
    unlocked: true,
  },
  {
    nome: "Em Chamas",
    desc: "3 dias consecutivos",
    tier: "bronze",
    icon: Flame,
    unlocked: true,
  },
  {
    nome: "Focado",
    desc: "Complete 10 tarefas em um dia",
    tier: "prata",
    icon: Target,
    unlocked: true,
  },
  {
    nome: "Produtivo",
    desc: "50 tarefas completadas",
    tier: "prata",
    icon: Zap,
    unlocked: true,
  },
  {
    nome: "Semana Perfeita",
    desc: "7 dias consecutivos",
    tier: "ouro",
    icon: Trophy,
    unlocked: true,
  },
  {
    nome: "Estudioso",
    desc: "100 tarefas de estudo",
    tier: "ouro",
    icon: BookOpen,
    unlocked: false,
  },
  {
    nome: "Vida Saudável",
    desc: "30 dias de exercícios",
    tier: "ouro",
    icon: Heart,
    unlocked: false,
  },
  {
    nome: "Economista",
    desc: "Meta financeira atingida",
    tier: "ouro",
    icon: Wallet,
    unlocked: false,
  },
  {
    nome: "Veterano",
    desc: "100 dias usando o app",
    tier: "platina",
    icon: Medal,
    unlocked: false,
  },
  {
    nome: "Mestre",
    desc: "Nível 50 alcançado",
    tier: "platina",
    icon: Crown,
    unlocked: false,
  },
  {
    nome: "Lendário",
    desc: "1000 tarefas completadas",
    tier: "diamante",
    icon: Rocket,
    unlocked: false,
  },
  {
    nome: "Perfeição",
    desc: "365 dias consecutivos",
    tier: "diamante",
    icon: Award,
    unlocked: false,
  },
];

const testimonials = [
  {
    quote:
      "O Nucleos transformou minha rotina de estudos. Consegui organizar todas as matérias e ver meu progresso diariamente. Passei de média 7 para 9!",
    author: "Lucas Mendes",
    role: "Estudante de Medicina",
    initials: "LM",
    nivel: 24,
    days: 45,
  },
  {
    quote:
      "Finalmente consegui equilibrar minha vida pessoal e profissional. O sistema de Nucleos me ajuda a não negligenciar nenhuma área importante.",
    author: "Ana Carolina",
    role: "Empreendedora",
    initials: "AC",
    nivel: 18,
    days: 32,
  },
  {
    quote:
      "A gamificação faz toda diferença. Me sinto motivado a completar minhas tarefas todos os dias para manter meu streak e subir de nível.",
    author: "Pedro Santos",
    role: "Desenvolvedor",
    initials: "PS",
    nivel: 31,
    days: 67,
  },
];

const faqs = [
  "O que são os Nucleos?",
  "Como funciona o sistema de XP e níveis?",
  "Posso criar meus próprios Nucleos personalizados?",
  "O Nucleos é gratuito?",
  "Como funciona o streak?",
  "Posso usar em múltiplos dispositivos?",
];

const plans = [
  {
    name: "Grátis",
    price: "R$ 0/mês",
    description: "Perfeito para começar sua jornada",
    features: [
      "Até 3 Nucleos",
      "10 hábitos por Nucleo",
      "Tracking de atividades",
      "Sistema de XP e níveis",
      "Estatísticas básicas",
    ],
    cta: "Começar grátis",
    popular: false,
  },
  {
    name: "Pro",
    price: "R$ 19/mês",
    description: "Para quem leva a evolução a sério",
    features: [
      "Nucleos ilimitados",
      "Hábitos ilimitados",
      "Conquistas exclusivas",
      "Estatísticas avançadas",
      "Temas personalizados",
      "Backup na nuvem",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    popular: true,
  },
  {
    name: "Equipe",
    price: "R$ 49/mês",
    description: "Para grupos e organizações",
    features: [
      "Tudo do Pro",
      "Até 10 membros",
      "Desafios em grupo",
      "Ranking de equipe",
      "Dashboard administrativo",
      "Integrações",
    ],
    cta: "Fale conosco",
    popular: false,
  },
];

export default function AboutPage({
  achievements = defaultAchievements,
}: AboutPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* ---------------- HEADER ---------------- */}
      {/* <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6 mx-auto max-w-7xl">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              Nucleos
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Produto
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Recursos
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Empresa
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Preços
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
            <Button
              size="sm"
              className="bg-foreground text-primary-foreground hover:bg-foreground/90"
            >
              Começar grátis
            </Button>
          </div>
        </div>
      </header> */}

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="py-16 md:py-28 bg-background relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="mx-auto max-w-6xl space-y-8 px-6">
          <div>
            <Badge
              variant="outline"
              className="gap-2 border-primary/20 bg-primary/5 px-4 py-2 text-primary animate-border-pulse"
            >
              <Sparkles className="size-4" />
              <span>BEM VINDO.</span>
            </Badge>
          </div>

          <h1>
            Tudo começa com um{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              Nucleo
            </span>
            .
          </h1>

          <p>
            O espaço certo para cada ideia. Organize. Realize. Evolua. Simples,
            flexível e ao seu alcance.
          </p>

          <div>
            <Button
              size="lg"
              className="bg-foreground text-primary-foreground hover:bg-foreground/90 group"
            >
              Começar agora
              <ChevronRight className="size-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary/30 bg-background/50 backdrop-blur-sm group"
            >
              Ver demonstração
              <Zap className="size-4 ml-1 transition-all group-hover:rotate-12" />
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------- APRESENTACAO NUCLEOS ---------------- */}
      <section className="py-20 md:py-28 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6">
          <div>
            <Badge
              variant="outline"
              className="gap-2 border-primary/20 bg-primary/5 px-4 py-2 text-primary"
            >
              <Sparkles className="size-4" />
              <span>Apresentamos NUCLEOS</span>
            </Badge>
          </div>

          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <h2>
              Use seu potencial para
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                sua própria evolução!
              </span>
            </h2>

            <div>
              <p className="text-lg text-muted-foreground">
                Crie Nucleos para cada área da sua vida. Acompanhe seu
                progresso, ganhe XP, desbloqueie conquistas e veja sua evolução
                em tempo real. Produtividade que parece jogo.
              </p>

              <div>
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Maria S. completou</p>
                  <p className="text-sm text-muted-foreground">
                    Estudar inglês{" "}
                    <span className="text-primary font-semibold">+150 XP</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- ACHIEVEMENTS ---------------- */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div>
                <p className="text-3xl md:text-4xl font-bold text-foreground">
                  {achievement.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {achievement.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SOCIAL PROOF ---------------- */}
      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Avatar key={i} className="border-2 border-background">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    U{i}
                  </AvatarFallback>
                </Avatar>
              ))}
              <div className="size-10 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium text-primary">
                +50K
              </div>
            </div>

            <div className="text-center md:text-left">
              <p className="font-semibold">Junte-se à comunidade</p>
              <p className="text-sm text-muted-foreground">
                Usuários evoluindo juntos
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="size-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="font-medium">4.9</span>
              <span className="text-sm text-muted-foreground">
                de 5 · +10.000 avaliações
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- NUCLEOS CARDS ---------------- */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {nucleosData.map((nucleo, index) => (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-10 rounded-lg bg-${nucleo.cor}/10 flex items-center justify-center`}
                    >
                      <nucleo.icon className={`size-5 text-${nucleo.cor}`} />
                    </div>
                    <span className="font-semibold text-lg">{nucleo.nome}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`border-${nucleo.cor}/20 bg-${nucleo.cor}/5 text-${nucleo.cor}`}
                  >
                    Nv. {nucleo.nivel}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {nucleo.xpAtual.toLocaleString()} /{" "}
                      {nucleo.xpMax.toLocaleString()} XP
                    </span>
                    <span className={`text-${nucleo.cor} font-medium`}>
                      {nucleo.progresso}%
                    </span>
                  </div>
                  <Progress
                    value={nucleo.progresso}
                    className={`h-2 [&>div]:bg-${nucleo.cor}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- NOTIFICACOES ---------------- */}
      <section className="py-20 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary mb-4"
            >
              <Bell className="size-4 mr-2" />
              Celebre cada conquista
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Notificações motivacionais
            </h2>
            <p className="text-muted-foreground mt-2">
              em tempo real para manter você engajado
            </p>
          </div>

          <div className="grid gap-3 max-w-2xl mx-auto">
            {notifications.map((notif, index) => (
              <div>
                <div
                  className={`size-8 rounded-full bg-${notif.color}/10 flex items-center justify-center`}
                >
                  <notif.icon className={`size-4 text-${notif.color}`} />
                </div>
                <span className="flex-1 text-sm">{notif.text}</span>
                <span className="text-xs text-muted-foreground">agora</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- ANTES E DEPOIS ---------------- */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary mb-4"
            >
              Antes e Depois
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              A diferença que o Nucleos faz
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border">
            <div className="grid grid-cols-3 bg-muted/50 p-4 font-medium">
              <div>Aspecto</div>
              <div className="text-center border-x">Sem Nucleos</div>
              <div className="text-center">Com Nucleos</div>
            </div>
            {comparisons.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 p-4 ${index !== comparisons.length - 1 ? "border-b" : ""}`}
              >
                <div className="font-medium">{item.feature}</div>
                <div className="text-center border-x flex items-center justify-center gap-2 text-muted-foreground">
                  <X className="size-4 text-destructive" />
                  <span className="text-sm">{item.semNucleos}</span>
                </div>
                <div className="text-center flex items-center justify-center gap-2">
                  <Check className="size-4 text-primary" />
                  <span className="text-sm font-medium">{item.comNucleos}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- JORNADA ---------------- */}
      <section className="py-20 bg-secondary/30">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary mb-4"
            >
              Sua Jornada
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              O caminho para a sua melhor versão
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

            <div className="space-y-8">
              {journeySteps.map((step, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center gap-4 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div
                    className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                  >
                    <div
                      className={`p-6 rounded-2xl border bg-card hover:shadow-lg transition-all max-w-sm ${index % 2 === 0 ? "md:ml-auto md:mr-8" : "md:mr-auto md:ml-8"}`}
                    >
                      <div
                        className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                      >
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <step.icon className="size-5 text-primary" />
                        </div>
                        <Badge
                          variant="outline"
                          className="border-primary/20 bg-primary/5 text-primary"
                        >
                          {step.nivel}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg">{step.titulo}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 size-12 rounded-full border-4 border-background bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-lg">
                    {index + 1}
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- COMO FUNCIONA ---------------- */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary mb-4"
            >
              Como funciona
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Simples de usar, poderoso para evoluir
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {howItWorks.map((step, index) => (
              <div>
                <div className="size-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- BADGES ---------------- */}
      <section className="py-20 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary mb-4"
            >
              Sistema de Conquistas
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Colecione conquistas e mostre sua evolução
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {badges.map((badge, index) => (
              <div>
                <div
                  className={`size-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                    badge.unlocked ? "bg-primary/20" : "bg-muted"
                  }`}
                >
                  <badge.icon
                    className={`size-6 ${badge.unlocked ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
                <p className="text-sm font-semibold">{badge.nome}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {badge.desc}
                </p>
                <Badge
                  variant="outline"
                  className={`absolute -top-2 -right-2 text-xs capitalize ${
                    badge.unlocked
                      ? "bg-primary/20 border-primary/30 text-primary"
                      : "bg-muted border-border/50 text-muted-foreground"
                  }`}
                >
                  {badge.tier}
                </Badge>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-sm text-muted-foreground">
            Você desbloqueou{" "}
            <span className="font-bold text-primary">
              {badges.filter((b) => b.unlocked).length}
            </span>{" "}
            de {badges.length} conquistas
          </p>
        </div>
      </section>

      {/* ---------------- IMPACTO ---------------- */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary mb-4"
            >
              Resultados Reais
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Impacto do Projeto
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              O Nucleos foi pensado como uma ferramenta de desenvolvimento
              pessoal que pode ajudar estudantes e membros da comunidade.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {[
              { value: "2.500+", label: "Usuários ativos", progress: 85 },
              { value: "15.000+", label: "Metas alcançadas", progress: 92 },
              { value: "89%", label: "Taxa de engajamento", progress: 89 },
              { value: "500+", label: "Níveis conquistados", progress: 78 },
            ].map((stat, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                  <Progress value={stat.progress} className="mt-4 h-1.5" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="rounded-2xl bg-secondary/50 p-8">
            <h3 className="text-xl font-semibold text-center mb-6">
              O que você vai conquistar
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Organização de estudos",
                "Planejamento pessoal",
                "Desenvolvimento de hábitos saudáveis",
                "Apoio ao crescimento profissional",
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg bg-card p-4"
                >
                  <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- DEPOIMENTOS ---------------- */}
      <section className="py-20 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary mb-4"
            >
              Depoimentos
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              O que nossos usuários dizem
            </h2>
            <p className="text-muted-foreground mt-2">
              Milhares de pessoas já transformaram suas vidas com o Nucleos
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-3 text-xs border-t pt-4">
                  <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/5 text-primary"
                  >
                    Nv. {testimonial.nivel}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-accent/20 bg-accent/5 text-accent"
                  >
                    <Flame className="size-3 mr-1" />
                    {testimonial.days} dias
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary mb-4"
            >
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Perguntas frequentes
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq, index) => (
              <div>
                <p className="font-medium">{faq}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PRICING ---------------- */}
      <section className="py-20 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary mb-4"
            >
              PREÇOS
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Escolha seu plano de evolução
            </h2>
            <p className="text-muted-foreground mt-2">
              Comece grátis e evolua conforme suas necessidades. Sem surpresas.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan, index) => (
              <div>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Mais popular
                  </Badge>
                )}

                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-3xl font-bold mt-2">{plan.price}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.description}
                </p>

                <div className="mt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full mt-6 ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-foreground text-primary-foreground hover:bg-foreground/90"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA FINAL ---------------- */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para transformar sua produtividade?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Junte-se a milhares de pessoas que estão evoluindo todos os dias com
            Nucleos. Sua jornada começa agora.
          </p>
          <Button
            size="lg"
            className="bg-foreground text-primary-foreground hover:bg-foreground/90 px-8"
          >
            Criar conta grátis
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Sem cartão de crédito. Cancele quando quiser.
          </p>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-border/40 bg-background py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="font-bold text-lg mb-4">Nucleos</h3>
              <p className="text-sm text-muted-foreground">
                Organize sua vida, evolua todos os dias. O sistema de
                organização pessoal que transforma hábitos em conquistas.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Como funciona
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Termos de uso
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>
              © 2026 Nucleos. Todos os direitos reservados. Feito com dedicação
              no Brasil 🇧🇷
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
