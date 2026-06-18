"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
  Users,
  Home,
  Code,
  Music,
  Camera,
  Palette,
  Globe,
  Coffee,
  Dumbbell,
  BookOpen,
  Award,
  Crown,
  TrendingUp,
  Clock,
  BarChart,
  Shield,
  Smartphone,
  Cloud,
  Repeat,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const recursosPrincipais = [
  {
    categoria: "Organização",
    icon: Layers,
    cor: "#4D7CFF",
    recursos: [
      {
        titulo: "Nucleos Personalizados",
        descricao: "Crie espaços dedicados para cada área da sua vida",
        detalhes: [
          "Ilimitados no plano Pro",
          "Cores personalizáveis",
          "Ícones exclusivos",
        ],
      },
      {
        titulo: "Blocos Versáteis",
        descricao: "Combine diferentes tipos de blocos em cada Nucleo",
        detalhes: ["Texto rico", "Coleções/Tabelas", "Calendários", "Timers"],
      },
      {
        titulo: "Hierarquia Flexível",
        descricao: "Organize suas ideias em diferentes níveis",
        detalhes: ["Sub-Nucleos", "Categorias", "Tags", "Filtros avançados"],
      },
    ],
  },
  {
    categoria: "Gamificação",
    icon: Trophy,
    cor: "#FFD700",
    recursos: [
      {
        titulo: "Sistema de XP",
        descricao: "Ganhe experiência a cada tarefa completada",
        detalhes: ["XP por tarefa", "Bônus por streak", "Multiplicadores"],
      },
      {
        titulo: "Níveis e Evolução",
        descricao: "Suba de nível e desbloqueie novas funcionalidades",
        detalhes: ["50+ níveis", "Recompensas exclusivas", "Títulos especiais"],
      },
      {
        titulo: "Conquistas",
        descricao: "Colecione badges por seus marcos",
        detalhes: ["100+ conquistas", "Tiers raros", "Badges exclusivos"],
      },
    ],
  },
  {
    categoria: "Acompanhamento",
    icon: TrendingUp,
    cor: "#00C9A7",
    recursos: [
      {
        titulo: "Streaks Diários",
        descricao: "Mantenha a consistência dia após dia",
        detalhes: [
          "Contador de dias",
          "Bônus crescentes",
          "Alertas de recuperação",
        ],
      },
      {
        titulo: "Estatísticas Detalhadas",
        descricao: "Visualize seu progresso em gráficos",
        detalhes: ["Evolução temporal", "Distribuição por Nucleo", "Insights"],
      },
      {
        titulo: "Metas e Objetivos",
        descricao: "Defina e acompanhe suas metas",
        detalhes: ["Metas diárias", "Metas semanais", "Metas de longo prazo"],
      },
    ],
  },
  {
    categoria: "Ferramentas",
    icon: Zap,
    cor: "#FF8C42",
    recursos: [
      {
        titulo: "Temporizador Pomodoro",
        descricao: "Mantenha o foco com a técnica Pomodoro",
        detalhes: ["Ciclos personalizáveis", "Pausas automáticas", "Histórico"],
      },
      {
        titulo: "Calendário Integrado",
        descricao: "Visualize todos seus eventos em um só lugar",
        detalhes: ["Sincronização", "Eventos recorrentes", "Lembretes"],
      },
      {
        titulo: "Coleções Inteligentes",
        descricao: "Crie bancos de dados personalizados",
        detalhes: ["Múltiplos tipos de campo", "Filtros", "Visualizações"],
      },
    ],
  },
];

const tiposDeNucleo = [
  {
    nome: "Estudos",
    icon: BookOpen,
    cor: "#4D7CFF",
    exemplos: ["Matérias", "Idiomas", "Cursos"],
  },
  {
    nome: "Saúde",
    icon: Heart,
    cor: "#FF8C42",
    exemplos: ["Exercícios", "Alimentação", "Meditação"],
  },
  {
    nome: "Finanças",
    icon: Wallet,
    cor: "#00C9A7",
    exemplos: ["Orçamento", "Investimentos", "Gastos"],
  },
  {
    nome: "Trabalho",
    icon: Briefcase,
    cor: "#2EBD59",
    exemplos: ["Projetos", "Tarefas", "Reuniões"],
  },
  {
    nome: "Pessoal",
    icon: Home,
    cor: "#0077BE",
    exemplos: ["Metas", "Hábitos", "Rotina"],
  },
  {
    nome: "Criativo",
    icon: Palette,
    cor: "#8CD47E",
    exemplos: ["Arte", "Música", "Escrita"],
  },
  {
    nome: "Tecnologia",
    icon: Code,
    cor: "#4D7CFF",
    exemplos: ["Programação", "Estudos tech", "Projetos"],
  },
  {
    nome: "Social",
    icon: Users,
    cor: "#00C9A7",
    exemplos: ["Relacionamentos", "Eventos", "Networking"],
  },
];

const comparativo = [
  { recurso: "Nucleos", gratis: "3", pro: "Ilimitados" },
  { recurso: "Hábitos por Nucleo", gratis: "10", pro: "Ilimitados" },
  { recurso: "Blocos de texto", gratis: "✓", pro: "✓" },
  { recurso: "Blocos de coleção", gratis: "✓", pro: "✓" },
  { recurso: "Blocos de calendário", gratis: "✓", pro: "✓" },
  { recurso: "Blocos de timer", gratis: "✓", pro: "✓" },
  { recurso: "Estatísticas avançadas", gratis: "✗", pro: "✓" },
  { recurso: "Temas personalizados", gratis: "✗", pro: "✓" },
  { recurso: "Backup na nuvem", gratis: "✗", pro: "✓" },
  { recurso: "Exportação de dados", gratis: "✗", pro: "✓" },
  { recurso: "Suporte prioritário", gratis: "✗", pro: "✓" },
];

export default function RecursosPage() {
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
              <span>Tudo que você precisa</span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Recursos{" "}
            <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              poderosos
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Descubra todas as ferramentas que o Nucleos oferece para transformar
            sua produtividade e evolução pessoal.
          </motion.p>
        </div>
      </section>

      {/* Tipos de Nucleo */}
      <section className="px-4 py-16 bg-muted/30 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tipos de Nucleo
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {tiposDeNucleo.map((tipo, index) => (
              <motion.div
                key={tipo.nome}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="h-full border-border/50 hover:border-[#4D7CFF]/30 transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div
                      className="mb-4 flex size-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${tipo.cor}15` }}
                    >
                      <tipo.icon
                        className="size-6"
                        style={{ color: tipo.cor }}
                      />
                    </div>
                    <h3 className="mb-2 font-semibold">{tipo.nome}</h3>
                    <ul className="space-y-1">
                      {tipo.exemplos.map((exemplo) => (
                        <li
                          key={exemplo}
                          className="text-xs text-muted-foreground flex items-center gap-1"
                        >
                          <Check className="size-3 text-[#00C9A7]" />
                          {exemplo}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recursos por Categoria */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue="Organização" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              {recursosPrincipais.map((cat) => (
                <TabsTrigger
                  key={cat.categoria}
                  value={cat.categoria}
                  className="gap-2"
                >
                  <cat.icon className="size-4" />
                  <span className="hidden sm:inline">{cat.categoria}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {recursosPrincipais.map((cat) => (
              <TabsContent key={cat.categoria} value={cat.categoria}>
                <div className="grid gap-6 md:grid-cols-3">
                  {cat.recursos.map((recurso, idx) => (
                    <motion.div
                      key={recurso.titulo}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                    >
                      <Card
                        className="h-full border-l-4"
                        style={{ borderLeftColor: cat.cor }}
                      >
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-2">
                            {recurso.titulo}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            {recurso.descricao}
                          </p>
                          <ul className="space-y-2">
                            {recurso.detalhes.map((det) => (
                              <li
                                key={det}
                                className="text-xs flex items-center gap-2"
                              >
                                <Check
                                  className="size-3"
                                  style={{ color: cat.cor }}
                                />
                                {det}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Comparativo Planos */}
      <section className="px-4 py-16 bg-muted/30 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            Comparativo de Planos
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Veja o que você ganha em cada plano
          </p>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {comparativo.map((item) => (
                  <div
                    key={item.recurso}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <span className="font-medium">{item.recurso}</span>
                    <div className="flex items-center gap-8">
                      <span
                        className={`text-sm w-16 text-center ${item.gratis === "✓" ? "text-[#00C9A7]" : item.gratis === "✗" ? "text-muted-foreground" : ""}`}
                      >
                        {item.gratis === "✓" ? (
                          <Check className="size-4 mx-auto text-[#00C9A7]" />
                        ) : item.gratis === "✗" ? (
                          "—"
                        ) : (
                          item.gratis
                        )}
                      </span>
                      <span
                        className={`text-sm w-16 text-center font-medium ${item.pro === "✓" ? "text-[#4D7CFF]" : ""}`}
                      >
                        {item.pro === "✓" ? (
                          <Check className="size-4 mx-auto text-[#4D7CFF]" />
                        ) : (
                          item.pro
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7]"
            >
              <Link href="/planos" className="flex items-center gap-2">
                Ver todos os planos
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-muted-foreground mb-8">
            Experimente gratuitamente e descubra como o Nucleos pode transformar
            sua produtividade.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7]"
            >
              <Link href="/cadastro" className="flex items-center gap-2">
                Começar grátis
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo/nucleos">Ver demonstração</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
