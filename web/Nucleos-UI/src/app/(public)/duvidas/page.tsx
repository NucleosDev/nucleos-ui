"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  HelpCircle,
  BookOpen,
  Zap,
  Trophy,
  Target,
  Users,
  CreditCard,
  Shield,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Mail,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const categorias = [
  {
    id: "geral",
    nome: "Geral",
    icon: HelpCircle,
    cor: "#4D7CFF",
    count: 8,
  },
  {
    id: "contas",
    nome: "Contas e Planos",
    icon: CreditCard,
    cor: "#00C9A7",
    count: 6,
  },
  {
    id: "nucleos",
    nome: "Nucleos",
    icon: BookOpen,
    cor: "#FFD700",
    count: 12,
  },
  {
    id: "gamificacao",
    nome: "Gamificação",
    icon: Trophy,
    cor: "#FF8C42",
    count: 5,
  },
  {
    id: "privacidade",
    nome: "Privacidade",
    icon: Shield,
    cor: "#2EBD59",
    count: 4,
  },
];

const duvidas = [
  {
    id: 1,
    categoria: "geral",
    pergunta: "O que é o Nucleos?",
    resposta:
      "Nucleos é uma plataforma de produtividade personalizada com gamificação. Você cria espaços (Nucleos) para diferentes áreas da sua vida, adiciona tarefas e hábitos, e ganha XP e níveis conforme evolui.",
    util: 45,
    links: [
      { texto: "Conheça o produto", url: "/produto" },
      { texto: "Ver demonstração", url: "/demo/nucleos" },
    ],
  },
  {
    id: 2,
    categoria: "geral",
    pergunta: "Como começar a usar o Nucleos?",
    resposta:
      "É simples! Crie uma conta gratuita, defina seus primeiros Nucleos (estudos, saúde, trabalho, etc.) e comece a adicionar tarefas. O sistema vai guiando você nos primeiros passos.",
    util: 38,
  },
  {
    id: 3,
    categoria: "contas",
    pergunta: "Qual a diferença entre os planos?",
    resposta:
      "O plano Gratuito inclui 3 Nucleos e funcionalidades básicas. O plano Pro oferece Nucleos ilimitados, estatísticas avançadas, temas personalizados e suporte prioritário. Veja a página de planos para detalhes completos.",
    util: 52,
    links: [{ texto: "Comparar planos", url: "/planos" }],
  },
  {
    id: 4,
    categoria: "contas",
    pergunta: "Como cancelar minha assinatura?",
    resposta:
      "Você pode cancelar a qualquer momento nas Configurações da sua conta, seção 'Assinatura'. O cancelamento é imediato e sem multa. Seu acesso continua até o fim do período já pago.",
    util: 27,
  },
  {
    id: 5,
    categoria: "nucleos",
    pergunta: "O que são Nucleos?",
    resposta:
      "Nucleos são espaços dedicados que você cria para organizar diferentes áreas da sua vida. Cada Nucleo tem seu próprio conjunto de blocos, tarefas e progresso. Exemplos: Estudos, Fitness, Finanças, Trabalho.",
    util: 63,
  },
  {
    id: 6,
    categoria: "nucleos",
    pergunta: "Quantos Nucleos posso criar?",
    resposta:
      "No plano Gratuito, você pode criar até 3 Nucleos. No plano Pro, o número de Nucleos é ilimitado.",
    util: 41,
  },
  {
    id: 7,
    categoria: "nucleos",
    pergunta: "Posso compartilhar Nucleos com outras pessoas?",
    resposta:
      "Atualmente, Nucleos são pessoais. Estamos desenvolvendo funcionalidades de compartilhamento e colaboração para equipes, previstas para o segundo semestre.",
    util: 19,
  },
  {
    id: 8,
    categoria: "gamificacao",
    pergunta: "Como funciona o sistema de XP?",
    resposta:
      "Você ganha XP ao completar tarefas, manter streaks e desbloquear conquistas. Cada tarefa tem um valor de XP que você define. Quanto mais XP acumula, mais sobe de nível.",
    util: 57,
  },
  {
    id: 9,
    categoria: "gamificacao",
    pergunta: "O que são streaks?",
    resposta:
      "Streak é a contagem de dias consecutivos que você completa pelo menos uma tarefa. Manter streaks altos dá bônus de XP e desbloqueia conquistas especiais.",
    util: 34,
  },
  {
    id: 10,
    categoria: "gamificacao",
    pergunta: "Quantos níveis existem?",
    resposta:
      "Não há limite! O sistema é infinito, com níveis cada vez mais desafiadores. A cada 10 níveis você desbloqueia conquistas especiais e novos recursos.",
    util: 28,
  },
  {
    id: 11,
    categoria: "privacidade",
    pergunta: "Meus dados são seguros?",
    resposta:
      "Sim! Todos os dados são criptografados e armazenados com segurança. O Nucleos segue as melhores práticas de segurança da indústria e está em conformidade com a LGPD.",
    util: 49,
    links: [{ texto: "Política de Privacidade", url: "/privacidade" }],
  },
  {
    id: 12,
    categoria: "privacidade",
    pergunta: "Posso exportar meus dados?",
    resposta:
      "Sim! Você pode exportar todos os seus dados em formato CSV ou JSON nas configurações da sua conta. Isso permite backup ou migração para outras ferramentas.",
    util: 23,
  },
];

const perguntasFrequentes = [
  {
    pergunta: "Esqueci minha senha, o que faço?",
    resposta:
      "Clique em 'Esqueci minha senha' na página de login e siga as instruções enviadas para seu email.",
  },
  {
    pergunta: "O Nucleos tem app mobile?",
    resposta:
      "Sim! Temos apps para iOS e Android disponíveis nas lojas oficiais. A versão web também é totalmente responsiva.",
  },
  {
    pergunta: "Como entro em contato com o suporte?",
    resposta:
      "Você pode nos contactar por email (suporte@nucleos.com), chat ao vivo no site ou através do Discord da comunidade.",
  },
];

export default function DuvidasPage() {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("todas");
  const [duvidaAberta, setDuvidaAberta] = useState<number | null>(null);

  const duvidasFiltradas = duvidas.filter(
    (d) =>
      (categoriaAtiva === "todas" || d.categoria === categoriaAtiva) &&
      (busca === "" ||
        d.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
        d.resposta.toLowerCase().includes(busca.toLowerCase())),
  );

  const toggleDuvida = (id: number) => {
    setDuvidaAberta(duvidaAberta === id ? null : id);
  };

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
              <h1 className="text-2xl font-bold">Dúvidas Frequentes</h1>
              <p className="text-sm text-muted-foreground">
                Encontre respostas para as perguntas mais comuns
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <Badge
            variant="outline"
            className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF] mb-4"
          >
            <HelpCircle className="size-4" />
            <span>Central de Ajuda</span>
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Como podemos{" "}
            <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent">
              ajudar
            </span>
            ?
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Busque por palavras-chave ou navegue pelas categorias abaixo
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              placeholder="Digite sua dúvida..."
              className="pl-12 py-6 text-lg"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </motion.div>
      </section>

      {/* Categorias */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant={categoriaAtiva === "todas" ? "default" : "outline"}
            size="lg"
            className="rounded-full"
            onClick={() => setCategoriaAtiva("todas")}
          >
            Todas ({duvidas.length})
          </Button>
          {categorias.map((cat) => {
            const Icon = cat.icon;
            return (
              <Button
                key={cat.id}
                variant={categoriaAtiva === cat.id ? "default" : "outline"}
                size="lg"
                className="rounded-full gap-2"
                onClick={() => setCategoriaAtiva(cat.id)}
                style={{
                  backgroundColor:
                    categoriaAtiva === cat.id ? cat.cor : "transparent",
                  borderColor: `${cat.cor}30`,
                  color: categoriaAtiva === cat.id ? "white" : cat.cor,
                }}
              >
                <Icon className="size-4" />
                {cat.nome} ({cat.count})
              </Button>
            );
          })}
        </div>
      </section>

      {/* Lista de Dúvidas */}
      <section className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {duvidasFiltradas.length > 0 ? (
            <div className="space-y-3">
              {duvidasFiltradas.map((duvida) => (
                <motion.div
                  key={duvida.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="overflow-hidden border-border/50 hover:border-[#4D7CFF]/30 transition-all">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleDuvida(duvida.id)}
                        className="w-full flex items-start justify-between p-6 text-left hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg pr-8">
                            {duvida.pergunta}
                          </h3>
                          {duvidaAberta === duvida.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4"
                            >
                              <p className="text-muted-foreground leading-relaxed">
                                {duvida.resposta}
                              </p>

                              {duvida.links && (
                                <div className="mt-4 flex flex-wrap gap-3">
                                  {duvida.links.map((link, idx) => (
                                    <Link
                                      key={idx}
                                      href={link.url}
                                      className="inline-flex items-center gap-1 text-sm text-[#4D7CFF] hover:text-[#00C9A7] transition-colors"
                                    >
                                      {link.texto}
                                      <ExternalLink className="size-3" />
                                    </Link>
                                  ))}
                                </div>
                              )}

                              <div className="mt-4 flex items-center gap-4">
                                <span className="text-xs text-muted-foreground">
                                  Esta resposta foi útil?
                                </span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2"
                                  >
                                    <ThumbsUp className="size-4 mr-1" />
                                    <span className="text-xs">
                                      {duvida.util}
                                    </span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2"
                                  >
                                    <ThumbsDown className="size-4" />
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                        <div className="shrink-0">
                          {duvidaAberta === duvida.id ? (
                            <ChevronUp className="size-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="size-5 text-muted-foreground" />
                          )}
                        </div>
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhuma dúvida encontrada para sua busca.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setBusca("");
                  setCategoriaAtiva("todas");
                }}
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Perguntas Rápidas */}
      <section className="container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-r from-[#4D7CFF]/5 to-[#00C9A7]/5 border-0">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap className="size-5 text-[#4D7CFF]" />
              Perguntas rápidas
            </CardTitle>
            <CardDescription>
              Respostas diretas para dúvidas comuns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {perguntasFrequentes.map((item, index) => (
                <div key={index} className="p-4 rounded-lg bg-background/50">
                  <h4 className="font-medium mb-2">{item.pergunta}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.resposta}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Ainda com dúvidas? */}
      <section className="container mx-auto px-4 py-12">
        <Card className="text-center border-0 bg-gradient-to-r from-[#4D7CFF]/10 to-[#00C9A7]/10">
          <CardContent className="p-12">
            <h3 className="text-2xl font-bold mb-4">Ainda tem dúvidas?</h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Nossa equipe está pronta para ajudar com qualquer questão não
              respondida aqui.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] hover:from-[#00C9A7] hover:to-[#4D7CFF]"
                asChild
              >
                <Link href="/contato">
                  <Mail className="size-4 mr-2" />
                  Falar com suporte
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/ajuda">
                  <MessageCircle className="size-4 mr-2" />
                  Central de ajuda
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
