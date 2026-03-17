// /app/ajuda/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  MessageSquare,
  Youtube,
  Twitter,
  Github,
  FileText,
  Video,
  Users,
  Sparkles,
  Zap,
  Trophy,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const categorias = [
  {
    icon: BookOpen,
    titulo: "Primeiros Passos",
    descricao: "Comece sua jornada no Nucleos",
    cor: "#4D7CFF",
    artigos: 8,
  },
  {
    icon: Zap,
    titulo: "Núcleos e Blocos",
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
];

const artigosPopulares = [
  {
    titulo: "Como criar seu primeiro Núcleo",
    visualizacoes: "2.5k",
    tempo: "3 min",
    link: "/ajuda/primeiro-nucleo",
  },
  {
    titulo: "Entendendo o sistema de XP",
    visualizacoes: "1.8k",
    tempo: "4 min",
    link: "/ajuda/sistema-xp",
  },
  {
    titulo: "Dicas para manter streaks",
    visualizacoes: "1.2k",
    tempo: "5 min",
    link: "/ajuda/dicas-streaks",
  },
  {
    titulo: "Personalizando seus núcleos",
    visualizacoes: "980",
    tempo: "3 min",
    link: "/ajuda/personalizacao",
  },
];

const faqs = [
  {
    pergunta: "O que são Núcleos?",
    resposta:
      "Núcleos são espaços personalizados que você cria para organizar diferentes áreas da sua vida, como estudos, saúde, trabalho, finanças, etc. Cada núcleo pode conter blocos, tarefas e seu próprio sistema de progressão.",
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
    pergunta: "Como cancelar minha assinatura?",
    resposta:
      "Você pode cancelar sua assinatura a qualquer momento nas configurações da sua conta. O cancelamento é imediato e sem multa.",
  },
];

export default function AjudaPage() {
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
              <h1 className="text-2xl font-bold">Central de Ajuda</h1>
              <p className="text-sm text-muted-foreground">
                Como podemos ajudar você hoje?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Busca */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              placeholder="Buscar ajuda, tutoriais, perguntas..."
              className="pl-12 py-6 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Navegue por categoria
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categorias.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.titulo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/ajuda/${cat.titulo.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Card className="h-full hover:border-[#4D7CFF]/30 transition-all hover:shadow-lg group">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        <div
                          className="size-16 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: `${cat.cor}15` }}
                        >
                          <Icon className="size-8" style={{ color: cat.cor }} />
                        </div>
                      </div>
                      <h3 className="font-semibold mb-1">{cat.titulo}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {cat.descricao}
                      </p>
                      <span className="text-xs text-[#4D7CFF]">
                        {cat.artigos} artigos
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Artigos Populares */}
      <section className="container mx-auto px-4 py-12 bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Artigos populares
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {artigosPopulares.map((artigo, index) => (
              <motion.div
                key={artigo.titulo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={artigo.link}>
                  <Card className="hover:border-[#4D7CFF]/30 transition-all">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">{artigo.titulo}</h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{artigo.visualizacoes} visualizações</span>
                        <span>{artigo.tempo} de leitura</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Perguntas frequentes
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 hover:text-[#4D7CFF]">
                  {faq.pergunta}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-muted-foreground">
                  {faq.resposta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contato */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <Card className="border-0 bg-gradient-to-r from-[#4D7CFF]/10 to-[#00C9A7]/10">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">
                Ainda precisa de ajuda?
              </h3>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Nossa equipe está pronta para ajudar com qualquer dúvida que
                você tiver.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="gap-2 bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7]">
                  <MessageCircle className="size-4" />
                  Chat ao vivo
                </Button>
                <Button variant="outline" className="gap-2">
                  <Mail className="size-4" />
                  Enviar email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
