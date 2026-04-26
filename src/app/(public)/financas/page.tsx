"use client";

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  Target,
  LineChart,
  Shield,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Trophy,
  Banknote,
  Building2,
  Play,
  Star,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Landmark,
  CircleDollarSign,
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

function FinanceCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  subtitle,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: React.ElementType;
  color: string;
  subtitle: string;
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
        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 ${
            changeType === "up" ? "bg-emerald-500/10" : "bg-rose-500/10"
          }`}
        >
          {changeType === "up" ? (
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />
          )}
          <span
            className={`text-xs font-medium ${
              changeType === "up" ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {change}
          </span>
        </div>
      </div>

      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function TransactionItem({
  title,
  category,
  amount,
  type,
  time,
}: {
  title: string;
  category: string;
  amount: string;
  type: "income" | "expense";
  time: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            type === "income" ? "bg-emerald-500/10" : "bg-rose-500/10"
          }`}
        >
          {type === "income" ? (
            <ArrowUpRight className="h-5 w-5 text-emerald-500" />
          ) : (
            <ArrowDownRight className="h-5 w-5 text-rose-500" />
          )}
        </div>
        <div>
          <p className="font-medium text-foreground text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{category}</p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-semibold ${
            type === "income" ? "text-emerald-500" : "text-foreground"
          }`}
        >
          {type === "income" ? "+" : "-"}
          {amount}
        </p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}

export default function FinancasPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Receipt,
      title: "Controle Automático",
      description:
        "Sincronize com bancos e categorize gastos automaticamente com IA.",
    },
    {
      icon: Target,
      title: "Metas Inteligentes",
      description:
        "Defina objetivos financeiros e receba planos personalizados para atingi-los.",
    },
    {
      icon: LineChart,
      title: "Analytics Avançado",
      description:
        "Relatórios detalhados e previsões baseadas no seu comportamento financeiro.",
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description:
        "Seus dados financeiros protegidos com criptografia de ponta a ponta.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-32">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-emerald-500/15 via-primary/10 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-l from-amber-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-transparent rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-sm backdrop-blur-sm">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
                  <Wallet className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <span className="text-foreground font-medium">
                  Para Finanças
                </span>
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 text-xs"
                >
                  Pro
                </Badge>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
                <span className="block text-muted-foreground/60 text-3xl sm:text-4xl md:text-5xl font-medium mb-2">
                  Controle seu dinheiro.
                </span>
                Evolua suas{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-primary">finanças</span>
                  <span className="absolute bottom-2 left-0 right-0 h-4 bg-primary/20 -rotate-1 rounded" />
                </span>
                .
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
                Organize gastos, economize mais, invista melhor. Transforme sua
                relação com o dinheiro em uma jornada gamificada rumo à
                liberdade financeira.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                className="h-14 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 gap-2 group"
              >
                Organizar finanças
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base gap-2 bg-background/50 backdrop-blur-sm"
              >
                <Play className="h-4 w-4" />
                Ver demonstração
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    63%
                  </p>
                  <p className="text-sm text-muted-foreground">Atingem metas</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    R$2.4k
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Economia média
                  </p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    8K+
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Usuários ativos
                  </p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/30">
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    4.9
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Avaliação média
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Dashboard Financeiro
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Visão completa das suas{" "}
              <span className="text-primary">finanças</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Acompanhe entradas, saídas, investimentos e metas em tempo real.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {/* Balance Card */}
            <BentoCard className="md:col-span-2 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Saldo Total
                  </p>
                  <h3 className="text-4xl font-bold text-foreground">
                    R$ 24.850,00
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-500">
                    +12.5%
                  </span>
                </div>
              </div>

              {/* Mini accounts */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-blue-500/10 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Landmark className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-muted-foreground">
                      Conta Principal
                    </span>
                  </div>
                  <p className="font-bold text-foreground">R$ 8.450</p>
                </div>
                <div className="rounded-xl bg-purple-500/10 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">
                      Investimentos
                    </span>
                  </div>
                  <p className="font-bold text-foreground">R$ 12.800</p>
                </div>
                <div className="rounded-xl bg-amber-500/10 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <PiggyBank className="h-4 w-4 text-amber-500" />
                    <span className="text-xs text-muted-foreground">
                      Poupança
                    </span>
                  </div>
                  <p className="font-bold text-foreground">R$ 3.600</p>
                </div>
              </div>
            </BentoCard>

            {/* Income Card */}
            <BentoCard className="p-6 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
              <div className="flex items-center justify-between mb-4">
                <ArrowUpRight className="h-8 w-8 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  +8%
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Receitas</h3>
              <p className="text-2xl font-bold text-emerald-500">R$ 12.500</p>
              <p className="text-sm text-muted-foreground">Este mês</p>
            </BentoCard>

            {/* Expense Card */}
            <BentoCard className="p-6 bg-gradient-to-br from-rose-500/10 to-transparent border-rose-500/20">
              <div className="flex items-center justify-between mb-4">
                <ArrowDownRight className="h-8 w-8 text-rose-500" />
                <span className="text-sm font-medium text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                  -3%
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">Despesas</h3>
              <p className="text-2xl font-bold text-rose-500">R$ 8.200</p>
              <p className="text-sm text-muted-foreground">Este mês</p>
            </BentoCard>

            {/* Transactions Card */}
            <BentoCard className="md:col-span-2 md:row-span-2 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">
                  Últimas Transações
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary text-xs"
                >
                  Ver todas
                </Button>
              </div>

              <div className="space-y-1">
                <TransactionItem
                  title="Salário"
                  category="Receita"
                  amount="R$ 8.500"
                  type="income"
                  time="Hoje"
                />
                <TransactionItem
                  title="Supermercado"
                  category="Alimentação"
                  amount="R$ 450"
                  type="expense"
                  time="Ontem"
                />
                <TransactionItem
                  title="Freelance"
                  category="Receita Extra"
                  amount="R$ 2.000"
                  type="income"
                  time="2 dias"
                />
                <TransactionItem
                  title="Netflix"
                  category="Assinaturas"
                  amount="R$ 55,90"
                  type="expense"
                  time="3 dias"
                />
                <TransactionItem
                  title="Aluguel"
                  category="Moradia"
                  amount="R$ 1.800"
                  type="expense"
                  time="5 dias"
                />
              </div>
            </BentoCard>

            {/* Goals Card */}
            <BentoCard className="p-6">
              <Target className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-1">
                Meta do Mês
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Economizar R$ 2.000
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium text-foreground">75%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted/50 overflow-hidden">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-primary/70" />
                </div>
              </div>
            </BentoCard>

            {/* Investment Card */}
            <BentoCard className="p-6">
              <Percent className="h-8 w-8 text-purple-500 mb-4" />
              <h3 className="font-semibold text-foreground mb-1">Rendimento</h3>
              <p className="text-2xl font-bold text-purple-500">+R$ 1.280</p>
              <p className="text-sm text-muted-foreground">Este ano</p>
            </BentoCard>

            {/* Monthly Chart */}
            <BentoCard className="md:col-span-2 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <LineChart className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">
                    Fluxo Mensal
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Comparativo receitas x despesas
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="flex items-end gap-3 h-24">
                {[
                  { month: "Jan", income: 80, expense: 60 },
                  { month: "Fev", income: 75, expense: 55 },
                  { month: "Mar", income: 90, expense: 65 },
                  { month: "Abr", income: 85, expense: 70 },
                  { month: "Mai", income: 95, expense: 60 },
                  { month: "Jun", income: 100, expense: 65 },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div className="w-full flex gap-0.5 items-end h-20">
                      <div
                        className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t transition-all duration-300 hover:opacity-80"
                        style={{ height: `${item.income}%` }}
                      />
                      <div
                        className="flex-1 bg-gradient-to-t from-rose-500 to-rose-400 rounded-t transition-all duration-300 hover:opacity-80"
                        style={{ height: `${item.expense}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.month}
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
                Controle total em um{" "}
                <span className="text-primary">Nucleo</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Organize todas as suas finanças em um só lugar. Cada meta
                atingida é XP, cada economia é uma conquista. Gamifique seu
                caminho para a liberdade financeira.
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

            {/* Finance Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <FinanceCard
                title="Economia"
                value="R$ 4.300"
                change="+18%"
                changeType="up"
                icon={PiggyBank}
                color="bg-emerald-500"
                subtitle="Economizado este mês"
              />
              <FinanceCard
                title="Investimentos"
                value="R$ 12.8k"
                change="+8.5%"
                changeType="up"
                icon={TrendingUp}
                color="bg-purple-500"
                subtitle="Rentabilidade total"
              />
              <FinanceCard
                title="Despesas"
                value="R$ 8.2k"
                change="-12%"
                changeType="down"
                icon={CreditCard}
                color="bg-blue-500"
                subtitle="Redução vs mês anterior"
              />
              <FinanceCard
                title="Reserva"
                value="R$ 15k"
                change="+5%"
                changeType="up"
                icon={Shield}
                color="bg-amber-500"
                subtitle="6 meses de despesas"
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
              Conquistas <span className="text-primary">financeiras</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Desbloqueie conquistas por bons hábitos financeiros e metas
              atingidas.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <BentoCard className="p-6 text-center group">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-110">
                <PiggyBank className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-foreground">Poupador</p>
              <p className="text-xs text-muted-foreground mt-1">
                Primeiro R$1.000
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/25 transition-transform group-hover:scale-110">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-foreground">Meta Batida</p>
              <p className="text-xs text-muted-foreground mt-1">
                10 metas atingidas
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
                <Banknote className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-foreground">Investidor</p>
              <p className="text-xs text-muted-foreground mt-1">
                Primeiro investimento
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-110">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <p className="font-semibold text-foreground">Blindado</p>
              <p className="text-xs text-muted-foreground mt-1">
                Reserva de emergência
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-8">
              <CircleDollarSign className="h-8 w-8" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Pronto para organizar suas{" "}
              <span className="text-primary">finanças</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Junte-se a milhares de pessoas que estão conquistando a liberdade
              financeira. Comece grátis e transforme sua relação com o dinheiro.
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
                <span className="text-sm">Dados criptografados</span>
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
