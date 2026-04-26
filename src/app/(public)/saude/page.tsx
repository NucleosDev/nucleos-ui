"use client";

import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Activity,
  Dumbbell,
  Moon,
  Apple,
  Droplets,
  Trophy,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Flame,
  TrendingUp,
  Target,
  Footprints,
  Scale,
  Brain,
  Salad,
  HeartPulse,
  Play,
  Star,
} from "lucide-react";
import { useState } from "react";

function BentoCard({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-500 ${hover ? "hover:border-primary/30 hover:bg-card/80 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function CircularProgress({
  value,
  max,
  unit,
  label,
  color,
}: {
  value: number;
  max: number;
  unit: string;
  label: string;
  color: string;
}) {
  const percentage = (value / max) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg className="w-28 h-28 transform -rotate-90">
        <circle
          cx="56"
          cy="56"
          r="45"
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
          className="text-muted/30"
        />
        <circle
          cx="56"
          cy="56"
          r="45"
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
          strokeLinecap="round"
          className={color}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            transition: "stroke-dashoffset 1s ease-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
      <span className="text-sm text-muted-foreground mt-2">{label}</span>
    </div>
  );
}

function HealthMetricCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  color,
  description,
}: {
  title: string;
  value: string;
  unit: string;
  icon: React.ElementType;
  trend?: string;
  color: string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex items-start justify-between mb-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-500">
              {trend}
            </span>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default function SaudePage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Activity,
      title: "Monitoramento Completo",
      description:
        "Acompanhe exercícios, sono, alimentação e hidratação em um só lugar.",
    },
    {
      icon: Target,
      title: "Metas Personalizadas",
      description:
        "Defina objetivos realistas e receba lembretes para manter a consistência.",
    },
    {
      icon: Brain,
      title: "Saúde Mental",
      description:
        "Meditação guiada, exercícios de respiração e registro de humor diário.",
    },
    {
      icon: TrendingUp,
      title: "Insights Inteligentes",
      description:
        "Análises e recomendações baseadas nos seus dados e padrões de comportamento.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-32">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-rose-500/15 via-primary/10 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-l from-emerald-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-transparent rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/5 px-4 py-2 text-sm backdrop-blur-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/10">
                  <Heart className="h-3.5 w-3.5 text-rose-500" />
                </div>
                <span className="text-foreground font-medium">Para Saúde</span>
                <Badge
                  variant="secondary"
                  className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs"
                >
                  Popular
                </Badge>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
                <span className="block text-muted-foreground/60 text-3xl sm:text-4xl md:text-5xl font-medium mb-2">
                  Cuide do corpo e mente.
                </span>
                Evolua sua{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-primary">saúde</span>
                  <span className="absolute bottom-2 left-0 right-0 h-4 bg-primary/20 -rotate-1 rounded" />
                </span>
                .
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
                Acompanhe exercícios, alimentação, sono e bem-estar em uma
                jornada gamificada. Construa hábitos saudáveis e celebre cada
                conquista.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                className="h-14 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 gap-2 group"
              >
                Começar jornada
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Link href="/saude/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-base gap-2 bg-background/50 backdrop-blur-sm"
                >
                  <Play className="h-4 w-4" />
                  Ver demonstração
                </Button>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    89%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mantêm hábitos
                  </p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    3.2x
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mais motivação
                  </p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    15K+
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Usuários ativos
                  </p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    30d
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Média de streak
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Dashboard Preview */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Dashboard Diário
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Tudo em um só <span className="text-primary">lugar</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Visualize seu progresso diário e mantenha o foco nas suas metas de
              saúde.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {/* Main Progress Card */}
            <BentoCard className="md:col-span-2 md:row-span-2 p-8">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      Progresso do Dia
                    </h3>
                    <p className="text-muted-foreground">
                      Quarta-feira, 20 de março
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1.5">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-500">
                      15 dias
                    </span>
                  </div>
                </div>

                {/* Progress Circles */}
                <div className="flex-1 flex items-center justify-around py-8">
                  <CircularProgress
                    value={8500}
                    max={10000}
                    unit="passos"
                    label="Passos"
                    color="text-blue-500"
                  />
                  <CircularProgress
                    value={6}
                    max={8}
                    unit="copos"
                    label="Água"
                    color="text-cyan-500"
                  />
                  <CircularProgress
                    value={7.5}
                    max={8}
                    unit="horas"
                    label="Sono"
                    color="text-purple-500"
                  />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mt-auto">
                  <div className="rounded-xl bg-emerald-500/10 p-3 text-center">
                    <p className="text-lg font-bold text-emerald-500">420</p>
                    <p className="text-xs text-muted-foreground">
                      kcal queimadas
                    </p>
                  </div>
                  <div className="rounded-xl bg-rose-500/10 p-3 text-center">
                    <p className="text-lg font-bold text-rose-500">72</p>
                    <p className="text-xs text-muted-foreground">bpm médio</p>
                  </div>
                  <div className="rounded-xl bg-amber-500/10 p-3 text-center">
                    <p className="text-lg font-bold text-amber-500">1.850</p>
                    <p className="text-xs text-muted-foreground">
                      kcal ingeridas
                    </p>
                  </div>
                </div>
              </div>
            </BentoCard>

            {/* Exercise Card */}
            <BentoCard className="p-6 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
              <div className="flex items-center justify-between mb-4">
                <Dumbbell className="h-8 w-8 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +150 XP
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Exercícios</h3>
              <p className="text-2xl font-bold text-foreground">45 min</p>
              <p className="text-sm text-muted-foreground">Treino concluído</p>
            </BentoCard>

            {/* Sleep Card */}
            <BentoCard className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <Moon className="h-8 w-8 text-purple-500" />
                <span className="text-sm font-medium text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full">
                  Ótimo
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Sono</h3>
              <p className="text-2xl font-bold text-foreground">7h 32min</p>
              <p className="text-sm text-muted-foreground">Qualidade: 85%</p>
            </BentoCard>

            {/* Nutrition Card */}
            <BentoCard className="p-6">
              <Apple className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-1">Nutrição</h3>
              <p className="text-sm text-muted-foreground">
                Acompanhe macros e calorias com registro simplificado
              </p>
            </BentoCard>

            {/* Hydration Card */}
            <BentoCard className="p-6">
              <Droplets className="h-8 w-8 text-cyan-500 mb-4" />
              <h3 className="font-semibold text-foreground mb-1">Hidratação</h3>
              <p className="text-sm text-muted-foreground">
                Lembretes para manter a ingestão de água ideal
              </p>
            </BentoCard>

            {/* Weekly Progress */}
            <BentoCard className="md:col-span-2 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Activity className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">
                    Progresso Semanal
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sua evolução nos últimos 7 dias
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+18%</span>
                </div>
              </div>

              {/* Weekly Chart */}
              <div className="flex items-end gap-2 h-20">
                {[
                  { day: "Seg", value: 75 },
                  { day: "Ter", value: 90 },
                  { day: "Qua", value: 60 },
                  { day: "Qui", value: 85 },
                  { day: "Sex", value: 95 },
                  { day: "Sáb", value: 70 },
                  { day: "Dom", value: 80 },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t transition-all duration-300 hover:from-primary hover:to-primary/70"
                      style={{ height: `${item.value}%` }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
            <div>
              <Badge variant="outline" className="mb-4">
                Funcionalidades
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Saúde completa em um{" "}
                <span className="text-primary">Nucleo</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Monitore todos os aspectos da sua saúde física e mental. Cada
                meta atingida é XP, cada hábito mantido fortalece seu streak.
                Cuide-se de forma divertida.
              </p>

              {/* Feature List */}
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-300 ${
                      activeFeature === index
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 transition-colors ${
                        activeFeature === index
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p
                        className={`font-medium transition-colors ${
                          activeFeature === index
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                      >
                        {feature.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-lg shadow-primary/25 group"
              >
                Começar agora
                <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
              </Button>
            </div>

            {/* Health Metric Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <HealthMetricCard
                title="Passos"
                value="8.5K"
                unit="de 10K"
                icon={Footprints}
                trend="+12%"
                color="bg-blue-500"
                description="Meta diária quase atingida"
              />
              <HealthMetricCard
                title="Calorias"
                value="420"
                unit="kcal"
                icon={Flame}
                trend="+8%"
                color="bg-orange-500"
                description="Queimadas hoje"
              />
              <HealthMetricCard
                title="Peso"
                value="72.5"
                unit="kg"
                icon={Scale}
                trend="-2.5kg"
                color="bg-emerald-500"
                description="Evolução do mês"
              />
              <HealthMetricCard
                title="Frequência"
                value="68"
                unit="bpm"
                icon={HeartPulse}
                color="bg-rose-500"
                description="Batimentos em repouso"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-muted/30 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Conquistas
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Celebre cada <span className="text-primary">vitória</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Conquistas especiais para celebrar sua jornada de saúde.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <BentoCard className="p-6 text-center group">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg shadow-rose-500/25 transition-transform group-hover:scale-110">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-foreground">Coração Forte</p>
              <p className="text-xs text-muted-foreground mt-1">
                30 dias de exercício
              </p>
              <div className="mt-3 flex justify-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </BentoCard>

            <BentoCard className="p-6 text-center group">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/25 transition-transform group-hover:scale-110">
                <Droplets className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-foreground">Hidratado</p>
              <p className="text-xs text-muted-foreground mt-1">
                7 dias bebendo 2L
              </p>
              <div className="mt-3 flex justify-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-muted"}`}
                    />
                  ))}
                </div>
              </div>
            </BentoCard>

            <BentoCard className="p-6 text-center group">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg shadow-purple-500/25 transition-transform group-hover:scale-110">
                <Moon className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-foreground">Dorminhoco</p>
              <p className="text-xs text-muted-foreground mt-1">
                14 noites de 8h
              </p>
              <div className="mt-3 flex justify-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < 3 ? "text-yellow-400 fill-yellow-400" : "text-muted"}`}
                    />
                  ))}
                </div>
              </div>
            </BentoCard>

            <BentoCard className="p-6 text-center group">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-110">
                <Salad className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-foreground">Nutri Pro</p>
              <p className="text-xs text-muted-foreground mt-1">
                21 dias de dieta
              </p>
              <div className="mt-3 flex justify-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-muted"}`}
                    />
                  ))}
                </div>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-rose-500/10 text-rose-500 mb-8">
              <HeartPulse className="h-8 w-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Pronto para cuidar da sua{" "}
              <span className="text-primary">saúde</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Junte-se a milhares de pessoas que estão transformando seus
              hábitos. Comece grátis e evolua sua saúde de forma gamificada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="h-14 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 gap-2"
              >
                Criar conta grátis
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base bg-background/50 backdrop-blur-sm"
              >
                Ver planos
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Grátis para começar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">Cancele quando quiser</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
