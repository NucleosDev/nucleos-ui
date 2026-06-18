"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  BookOpen,
  Code,
  Zap,
  Layers,
  Calendar,
  Timer,
  Table,
  Brain,
  Trophy,
  Target,
  Sparkles,
  ChevronRight,
  Copy,
  Check,
  Terminal,
  Globe,
  Smartphone,
  Cloud,
  Lock,
  Users,
  Code2,
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
import { Clock } from "lucide-react";

const secoes = [
  {
    id: "introducao",
    titulo: "Introdução",
    icon: BookOpen,
    cor: "#4D7CFF",
    descricao: "Conceitos fundamentais do Nucleos",
  },
  {
    id: "instalacao",
    titulo: "Instalação",
    icon: Terminal,
    cor: "#00C9A7",
    descricao: "Como configurar o ambiente",
  },
  {
    id: "nucleos",
    titulo: "Nucleos",
    icon: Layers,
    cor: "#FFD700",
    descricao: "Criação e gerenciamento de Nucleos",
  },
  {
    id: "blocos",
    titulo: "Blocos",
    icon: Table,
    cor: "#FF8C42",
    descricao: "Tipos de blocos e suas funções",
  },
  {
    id: "gamificacao",
    titulo: "Gamificação",
    icon: Trophy,
    cor: "#2EBD59",
    descricao: "XP, níveis e conquistas",
  },
  {
    id: "api",
    titulo: "API Reference",
    icon: Code,
    cor: "#0077BE",
    descricao: "Endpoints e integrações",
  },
];

const guiasRapidos = [
  {
    titulo: "Criar primeiro Nucleo",
    descricao: "Aprenda a criar seu primeiro Nucleo em 5 minutos",
    tempo: "5 min",
    nivel: "Iniciante",
  },
  {
    titulo: "Configurar blocos",
    descricao: "Adicione e personalize blocos nos seus Nucleos",
    tempo: "8 min",
    nivel: "Intermediário",
  },
  {
    titulo: "Entender XP e níveis",
    descricao: "Como funciona o sistema de progressão",
    tempo: "6 min",
    nivel: "Iniciante",
  },
  {
    titulo: "Integração com API",
    descricao: "Conecte o Nucleos com outras ferramentas",
    tempo: "12 min",
    nivel: "Avançado",
  },
];

const exemplosCodigo = [
  {
    linguagem: "JavaScript",
    codigo: `// Criar um novo Nucleo
const nucleo = await nucleosService.createNucleo({
  nome: "Meus Estudos",
  tipo: "estudo",
  cor_destaque: "#4D7CFF"
});`,
  },
  {
    linguagem: "Python",
    codigo: `# Adicionar XP a um Nucleo
import requests

response = requests.post(
  'https://api.nucleos.com/v1/xp',
  json={
    'nucleo_id': '123',
    'amount': 50,
    'source': 'tarefa'
  },
  headers={'Authorization': 'Bearer SEU_TOKEN'}
)`,
  },
  {
    linguagem: "cURL",
    codigo: `curl -X GET https://api.nucleos.com/v1/nucleos \\
  -H "Authorization: Bearer SEU_TOKEN" \\
  -H "Content-Type: application/json"`,
  },
];

export default function DocsPage() {
  const [busca, setBusca] = useState("");
  const [secaoAtiva, setSecaoAtiva] = useState("introducao");
  const [copiado, setCopiado] = useState<number | null>(null);

  const copiarCodigo = (index: number, codigo: string) => {
    navigator.clipboard.writeText(codigo);
    setCopiado(index);
    setTimeout(() => setCopiado(null), 2000);
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
              <h1 className="text-2xl font-bold">Documentação</h1>
              <p className="text-sm text-muted-foreground">
                Guia completo para desenvolvedores e usuários avançados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Busca */}
      <section className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              placeholder="Buscar na documentação..."
              className="pl-12 py-6 text-lg"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Navegação</CardTitle>
                <CardDescription>Seções da documentação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                {secoes.map((secao) => {
                  const Icon = secao.icon;
                  return (
                    <button
                      key={secao.id}
                      onClick={() => setSecaoAtiva(secao.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        secaoAtiva === secao.id
                          ? "bg-[#4D7CFF]/10 text-[#4D7CFF]"
                          : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="size-4" style={{ color: secao.cor }} />
                      <span className="text-sm font-medium flex-1">
                        {secao.titulo}
                      </span>
                      <ChevronRight
                        className={`size-4 transition-transform ${
                          secaoAtiva === secao.id ? "translate-x-1" : ""
                        }`}
                      />
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo */}
          <div className="lg:col-span-3 space-y-8">
            {/* Guias Rápidos */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="size-6 text-[#4D7CFF]" />
                Guias rápidos
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {guiasRapidos.map((guia, index) => (
                  <motion.div
                    key={guia.titulo}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:border-[#4D7CFF]/30 transition-all group">
                      <CardContent className="p-5">
                        <h3 className="font-semibold mb-2">{guia.titulo}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {guia.descricao}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <Badge variant="outline" className="gap-1">
                            <Clock className="size-3" />
                            {guia.tempo}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Users className="size-3" />
                            {guia.nivel}
                          </Badge>
                        </div>
                        <Button variant="link" className="w-full mt-3 text-xs">
                          Ler guia
                          <ChevronRight className="size-3 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Conteúdo da Seção Ativa */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {secoes.find((s) => s.id === secaoAtiva)?.icon && (
                      <div
                        className="size-8 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: `${secoes.find((s) => s.id === secaoAtiva)?.cor}15`,
                        }}
                      >
                        {(() => {
                          const secaoAtual = secoes.find(
                            (s) => s.id === secaoAtiva,
                          );
                          if (!secaoAtual) return null;

                          const Icon = secaoAtual.icon;
                          return (
                            <Icon
                              className="size-4"
                              style={{ color: secaoAtual.cor }}
                            />
                          );
                        })()}
                      </div>
                    )}
                    {secoes.find((s) => s.id === secaoAtiva)?.titulo}
                  </CardTitle>
                  <CardDescription>
                    {secoes.find((s) => s.id === secaoAtiva)?.descricao}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Conteúdo detalhado sobre{" "}
                    {secoes
                      .find((s) => s.id === secaoAtiva)
                      ?.titulo.toLowerCase()}
                    . Esta seção está em constante atualização.
                  </p>

                  {/* Exemplos de código (aparecem apenas na seção de API) */}
                  {secaoAtiva === "api" && (
                    <div className="space-y-4 mt-4">
                      <h3 className="font-semibold">Exemplos de código</h3>
                      <Tabs defaultValue="javascript">
                        <TabsList>
                          {exemplosCodigo.map((ex) => (
                            <TabsTrigger
                              key={ex.linguagem}
                              value={ex.linguagem.toLowerCase()}
                            >
                              {ex.linguagem}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {exemplosCodigo.map((ex, idx) => (
                          <TabsContent
                            key={ex.linguagem}
                            value={ex.linguagem.toLowerCase()}
                          >
                            <div className="relative">
                              <pre className="p-4 rounded-lg bg-muted overflow-x-auto text-sm">
                                <code>{ex.codigo}</code>
                              </pre>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-2 right-2"
                                onClick={() => copiarCodigo(idx, ex.codigo)}
                              >
                                {copiado === idx ? (
                                  <Check className="size-4 text-green-500" />
                                ) : (
                                  <Copy className="size-4" />
                                )}
                              </Button>
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Recursos Adicionais */}
            <section className="grid gap-4 md:grid-cols-3">
              <Card className="bg-gradient-to-br from-[#4D7CFF]/10 to-transparent">
                <CardContent className="p-5">
                  <Code2 className="size-8 mb-3 text-[#4D7CFF]" />
                  <h3 className="font-semibold mb-1">GitHub</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Código aberto e contribuições
                  </p>
                  <Button variant="link" size="sm" className="px-0">
                    Ver repositório
                    <ExternalLink className="size-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#00C9A7]/10 to-transparent">
                <CardContent className="p-5">
                  <Globe className="size-8 mb-3 text-[#00C9A7]" />
                  <h3 className="font-semibold mb-1">API Status</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Verifique a disponibilidade da API
                  </p>
                  <Button variant="link" size="sm" className="px-0">
                    Ver status
                    <ExternalLink className="size-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#FFD700]/10 to-transparent">
                <CardContent className="p-5">
                  <Users className="size-8 mb-3 text-[#FFD700]" />
                  <h3 className="font-semibold mb-1">Comunidade</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Tire dúvidas no Discord
                  </p>
                  <Button variant="link" size="sm" className="px-0">
                    Entrar no Discord
                    <ExternalLink className="size-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
