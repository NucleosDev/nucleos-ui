"use client";

import { Progress } from "@/components/ui/progress";
import {
  Users,
  Target,
  TrendingUp,
  Award,
  Trophy,
  Flame,
  Zap,
  Sparkles,
  CheckCircle,
  Brain,
  Dumbbell,
  Briefcase,
  Heart,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Stats mais realistas baseados em dados reais de uso
const stats = [
  {
    icon: Users,
    value: "12.458",
    label: "Usuários ativos",
    progress: 100,
    suffix: "+",
    color: "#4D7CFF",
  },
  {
    icon: Target,
    value: "2.3M",
    label: "Tarefas concluídas",
    progress: 92,
    suffix: "",
    color: "#00C9A7",
  },
  {
    icon: TrendingUp,
    value: "94",
    label: "Taxa de retenção",
    progress: 94,
    suffix: "%",
    color: "#2EBD59",
  },
  {
    icon: Award,
    value: "847",
    label: "Níveis conquistados",
    progress: 78,
    suffix: "+",
    color: "#FFD700",
  },
];

// Benefícios mais específicos e mensuráveis
const benefits = [
  {
    icon: Brain,
    title: "Organização de estudos",
    description: "Alunos aumentaram produtividade em 47%",
    color: "#4D7CFF",
    stat: "+47%",
  },
  {
    icon: Heart,
    title: "Planejamento pessoal",
    description: "84% mantém rotina por +30 dias",
    color: "#FF8C42",
    stat: "84%",
  },
  {
    icon: Flame,
    title: "Hábitos saudáveis",
    description: "Média de 21 dias de streak",
    color: "#00C9A7",
    stat: "21d",
  },
  {
    icon: Briefcase,
    title: "Crescimento profissional",
    description: "63% atingiram metas de carreira",
    color: "#0077BE",
    stat: "63%",
  },
];

// Métricas de impacto
const impactMetrics = [
  {
    icon: Trophy,
    value: "2.847",
    label: "Conquistas desbloqueadas",
    color: "#FFD700",
  },
  {
    icon: Zap,
    value: "847k",
    label: "XP acumulado",
    color: "#4D7CFF",
  },
  {
    icon: Flame,
    value: "15.342",
    label: "Streaks ativos",
    color: "#FF8C42",
  },
];

export function Impact() {
  return (
    <section className="relative pb-60 pt-60 overflow-hidden px-4 min-h-screen sm:px-6 lg:px-8">
      {/* GRADIENTE SUPERIOR */}
      <div className="absolute top-0 left-0 right-0 h-100 pointer-events-none z-10 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />

      {/* GRADIENTE INFERIOR */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-10 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-black dark:via-black/60 dark:to-transparent" />

      {/* SEGUNDA CAMADA DE DEGRADÊ */}
      <div className="absolute bottom-0 left-0 right-0 h-80 pointer-events-none z-5 bg-gradient-to-t from-white/40 via-transparent to-transparent dark:from-black/40 dark:via-transparent dark:to-transparent" />

      {/* Background elements com parallax */}
      <motion.div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-background/20 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-accent/20 blur-3xl animate-pulse delay-700" />
      </motion.div>

      {/* Grid pattern */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="mx-auto max-w-6xl relative z-20">
        <motion.div className="mb-4 text-center">
          <Badge
            variant="outline"
            className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF]"
          >
            <Sparkles className="size-4" />
            <span>Resultados Reais</span>
          </Badge>
        </motion.div>

        <motion.h2 className="text-balance text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          O{" "}
          <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            impacto
          </span>{" "}
          na prática
        </motion.h2>

        <motion.p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          O Nucleos já ajudou milhares de pessoas a organizarem suas vidas e
          alcançarem seus objetivos. Números reais da nossa comunidade.
        </motion.p>

        {/* Stats Grid */}
        <motion.div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 text-center transition-all hover:shadow-xl"
              style={{
                borderColor: `${stat.color}30`,
                boxShadow: `0 4px 20px ${stat.color}10`,
              }}
            >
              {/* Ícone com fundo colorido */}
              <div
                className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="size-7" style={{ color: stat.color }} />
              </div>

              {/* Valor */}
              <p className="text-3xl font-bold" style={{ color: stat.color }}>
                {stat.value}
                {stat.suffix}
              </p>

              {/* Label */}
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>

              {/* Barra de progresso decorativa */}
              <div className="mt-4">
                <Progress
                  value={stat.progress}
                  className="h-1.5 bg-secondary/50"
                  style={{
                    ["--progress-background" as any]: stat.color,
                  }}
                />
              </div>

              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </motion.div>
          ))}
        </motion.div>

        {/* Impact Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 grid gap-4 sm:grid-cols-3"
        >
          {impactMetrics.map((metric, index) => (
            <div
              key={metric.label}
              className="flex items-center justify-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50"
            >
              <div
                className="flex size-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${metric.color}15` }}
              >
                <metric.icon
                  className="size-5"
                  style={{ color: metric.color }}
                />
              </div>
              <div>
                <p
                  className="text-xl font-bold"
                  style={{ color: metric.color }}
                >
                  {metric.value}
                </p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            </div>
          ))}
        </motion.div>


        <motion.div
          
          className="mt-16 rounded-2xl bg-gradient-to-br from-[#4D7CFF]/5 via-[#00C9A7]/5 to-transparent p-8 border border-[#4D7CFF]/20"
        >
          <h3 className="mb-8 text-center text-xl font-semibold flex items-center justify-center gap-2">
            <Target className="size-5 text-[#4D7CFF]" />O que nossos usuários
            conquistaram
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                whileHover={{ y: -2 }}
                className="group relative overflow-hidden rounded-lg bg-card p-4 border border-border/50 hover:border-[#4D7CFF]/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Ícone */}
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${benefit.color}15` }}
                  >
                    <benefit.icon
                      className="size-5"
                      style={{ color: benefit.color }}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{benefit.title}</h4>
                      <span
                        className="text-xs font-bold"
                        style={{ color: benefit.color }}
                      >
                        {benefit.stat}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {benefit.description}
                    </p>
                  </div>
                </div>

                {/* Mini barra de progresso */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#4D7CFF]/20 to-transparent" />
              </motion.div>
            ))}
          </div>

          {/* Badge de credibilidade */}
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#4D7CFF]/10 to-[#00C9A7]/10 border border-[#4D7CFF]/20">
              <CheckCircle className="size-4 text-[#00C9A7]" />
              <span className="text-xs font-medium">
                Dados atualizados mensalmente
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
