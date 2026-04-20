// /app/contato/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  Send,
  Check,
  AlertCircle,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Instagram,
  Sparkles,
  Zap,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const canais = [
  {
    icon: Mail,
    titulo: "Email",
    valor: "contato@nucleos.com",
    descricao: "Respondemos em até 24h",
    cor: "#4D7CFF",
    acao: "mailto:contato@nucleos.com",
  },
  {
    icon: MessageSquare,
    titulo: "Chat ao vivo",
    valor: "Disponível 9h-18h",
    descricao: "Segunda a sexta",
    cor: "#00C9A7",
    acao: "#",
  },
  {
    icon: Phone,
    titulo: "Telefone",
    valor: "(11) 99999-9999",
    descricao: "Suporte prioritário",
    cor: "#FFD700",
    acao: "tel:+5511999999999",
  },
  {
    icon: MapPin,
    titulo: "Escritório",
    valor: "São Paulo, SP",
    descricao: "Brasil",
    cor: "#FF8C42",
    acao: "#",
  },
];

const redesSociais = [
  {
    icon: Twitter,
    nome: "Twitter",
    link: "https://twitter.com/nucleos",
    cor: "#1DA1F2",
  },
  {
    icon: Github,
    nome: "GitHub",
    link: "https://github.com/nucleos",
    cor: "#333",
  },
  {
    icon: Linkedin,
    nome: "LinkedIn",
    link: "https://linkedin.com/company/nucleos",
    cor: "#0A66C2",
  },
  {
    icon: Youtube,
    nome: "YouTube",
    link: "https://youtube.com/@nucleos",
    cor: "#FF0000",
  },
  {
    icon: Instagram,
    nome: "Instagram",
    link: "https://instagram.com/nucleos",
    cor: "#E4405F",
  },
];

const motivosContato = [
  "Suporte técnico",
  "Dúvidas sobre planos",
  "Parcerias",
  "Imprensa",
  "Sugestões",
  "Reportar bug",
  "Outros",
];

export default function ContatoPage() {
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    motivo: "",
    mensagem: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio
    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
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
              <h1 className="text-2xl font-bold">Fale conosco</h1>
              <p className="text-sm text-muted-foreground">
                Estamos aqui para ajudar você
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
            <Sparkles className="size-4" />
            <span>Atendimento</span>
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Como podemos{" "}
            <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent">
              ajudar
            </span>
            ?
          </h1>
          <p className="text-lg text-muted-foreground">
            Escolha o canal mais conveniente para você. Nossa equipe está pronta
            para atender.
          </p>
        </motion.div>
      </section>

      {/* Canais de Contato */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {canais.map((canal, index) => {
            const Icon = canal.icon;
            return (
              <motion.div
                key={canal.titulo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={canal.acao}>
                  <Card className="h-full hover:border-[#4D7CFF]/30 transition-all group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="size-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${canal.cor}15` }}
                        >
                          <Icon
                            className="size-6"
                            style={{ color: canal.cor }}
                          />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {canal.descricao}
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-1">{canal.titulo}</h3>
                      <p className="text-sm text-muted-foreground">
                        {canal.valor}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Formulário e Informações */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Envie uma mensagem</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo e responderemos o mais breve
                  possível.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="nome"
                      className="text-sm font-medium mb-1 block"
                    >
                      Nome completo
                    </label>
                    <Input
                      id="nome"
                      placeholder="Seu nome"
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium mb-1 block"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="motivo"
                      className="text-sm font-medium mb-1 block"
                    >
                      Motivo do contato
                    </label>
                    <Select
                      value={formData.motivo}
                      onValueChange={(value) =>
                        setFormData({ ...formData, motivo: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        {motivosContato.map((motivo) => (
                          <SelectItem key={motivo} value={motivo}>
                            {motivo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label
                      htmlFor="mensagem"
                      className="text-sm font-medium mb-1 block"
                    >
                      Mensagem
                    </label>
                    <Textarea
                      id="mensagem"
                      placeholder="Descreva sua dúvida ou solicitação..."
                      rows={5}
                      value={formData.mensagem}
                      onChange={(e) =>
                        setFormData({ ...formData, mensagem: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] hover:from-[#00C9A7] hover:to-[#4D7CFF]"
                  >
                    {enviado ? (
                      <>
                        <Check className="size-4 mr-2" />
                        Mensagem enviada!
                      </>
                    ) : (
                      <>
                        <Send className="size-4 mr-2" />
                        Enviar mensagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Informações Adicionais */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Horário de Atendimento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="size-5 text-[#4D7CFF]" />
                  Horário de atendimento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Segunda a Sexta</span>
                  <span className="font-medium">9h às 18h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sábado</span>
                  <span className="font-medium">9h às 13h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Domingo</span>
                  <span className="font-medium">Fechado</span>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <AlertCircle className="size-4 text-[#4D7CFF] shrink-0 mt-0.5" />
                    <span>
                      Fora do horário comercial, envie um email que
                      responderemos no próximo dia útil.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Rápido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <HelpCircle className="size-5 text-[#00C9A7]" />
                  Perguntas frequentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/ajuda"
                  className="block p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="font-medium text-sm">Como criar um Nucleo?</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aprenda o passo a passo para criar seu primeiro Nucleo.
                  </p>
                </Link>
                <Link
                  href="/ajuda"
                  className="block p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="font-medium text-sm">Problemas com login?</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Soluções para os problemas mais comuns de acesso.
                  </p>
                </Link>
                <Link
                  href="/ajuda"
                  className="block p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="font-medium text-sm">
                    Como funciona o plano Pro?
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Detalhes sobre os benefícios do plano premium.
                  </p>
                </Link>
              </CardContent>
            </Card>

            {/* Redes Sociais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Redes sociais</CardTitle>
                <CardDescription>
                  Acompanhe novidades e atualizações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {redesSociais.map((rede) => {
                    const Icon = rede.icon;
                    return (
                      <Link
                        key={rede.nome}
                        href={rede.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-10 rounded-full hover:scale-110 transition-transform"
                          style={{ borderColor: `${rede.cor}30` }}
                        >
                          <Icon
                            className="size-4"
                            style={{ color: rede.cor }}
                          />
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <section className="container mx-auto px-4 py-8">
        <Card className="bg-gradient-to-r from-[#4D7CFF]/5 to-[#00C9A7]/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Quer nos visitar?</h3>
            <p className="text-muted-foreground mb-4">
              Nosso escritório fica em --. Agende uma visita com antecedência.
            </p>
            <Button variant="outline" className="gap-2">
              <MapPin className="size-4" />
              Ver no mapa
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
