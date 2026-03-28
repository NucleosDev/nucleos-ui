"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, FileText, Scale, Lock, Eye, Bell, Database, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const secoes = [
  {
    titulo: "1. Aceitação dos Termos",
    conteudo: "Ao acessar e usar o Nucleos, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar ou usar nossos serviços.",
    icon: FileText,
  },
  {
    titulo: "2. Uso da Plataforma",
    conteudo: "O Nucleos concede uma licença limitada, não exclusiva e não transferível para acessar e usar a plataforma de acordo com estes termos. Você concorda em não: (a) copiar ou modificar o software; (b) transferir, sublicenciar ou revender os serviços; (c) usar a plataforma para fins ilegais.",
    icon: Eye,
  },
  {
    titulo: "3. Contas de Usuário",
    conteudo: "Você é responsável por manter a confidencialidade de sua conta e senha. Você concorda em nos notificar imediatamente sobre qualquer uso não autorizado de sua conta. O Nucleos não será responsável por perdas decorrentes de uso não autorizado de sua conta.",
    icon: Shield,
  },
  {
    titulo: "4. Conteúdo do Usuário",
    conteudo: "Você mantém todos os direitos sobre o conteúdo que cria e armazena no Nucleos. Ao usar nossos serviços, você nos concede uma licença mundial, royalty-free para hospedar, armazenar e exibir seu conteúdo exclusivamente para fornecer os serviços a você.",
    icon: Database,
  },
  {
    titulo: "5. Privacidade e Dados",
    conteudo: "Seu uso do Nucleos também é regido pela nossa Política de Privacidade. Coletamos e processamos dados pessoais conforme descrito na política. Você concorda com a coleta e uso de informações de acordo com a Política de Privacidade.",
    icon: Lock,
  },
  {
    titulo: "6. Propriedade Intelectual",
    conteudo: "O Nucleos e seu conteúdo original, características e funcionalidades são e permanecerão propriedade exclusiva do Nucleos e seus licenciadores. O software é protegido por leis de direitos autorais, marcas registradas e outras leis.",
    icon: Scale,
  },
  {
    titulo: "7. Cancelamento e Término",
    conteudo: "Você pode cancelar sua conta a qualquer momento. O Nucleos pode suspender ou encerrar seu acesso aos serviços imediatamente, sem aviso prévio, por qualquer violação destes Termos. Em caso de término, seu direito de usar os serviços cessará imediatamente.",
    icon: Bell,
  },
  {
    titulo: "8. Limitação de Responsabilidade",
    conteudo: "Em nenhum caso o Nucleos, seus diretores, funcionários ou parceiros serão responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo perda de lucros, dados ou uso, mesmo que avisados da possibilidade de tais danos.",
    icon: Scale,
  },
  {
    titulo: "9. Modificações dos Termos",
    conteudo: "O Nucleos reserva o direito de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer um aviso com pelo menos 30 dias de antecedência. O uso continuado da plataforma após a vigência constitui aceitação dos novos termos.",
    icon: Clock,
  },
];

export default function TermosPage() {
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
              <h1 className="text-2xl font-bold">Termos de Uso</h1>
              <p className="text-sm text-muted-foreground">
                Última atualização: 15 de março de 2024
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Introdução */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <Badge variant="outline" className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF] mb-4">
              <Scale className="size-4" />
              <span>Documento Legal</span>
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Bem-vindo ao Nucleos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estes termos regulam o uso da plataforma Nucleos. Leia atentamente antes de começar a usar nossos serviços.
            </p>
          </motion.div>

          {/* Seções */}
          <div className="space-y-8">
            {secoes.map((secao, index) => {
              const Icon = secao.icon;
              return (
                <motion.div
                  key={secao.titulo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-border/50 hover:border-[#4D7CFF]/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#4D7CFF]/10">
                          <Icon className="size-5 text-[#4D7CFF]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{secao.titulo}</h3>
                          <p className="text-muted-foreground leading-relaxed">{secao.conteudo}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Contato */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-[#4D7CFF]/10 to-[#00C9A7]/10 text-center"
          >
            <h3 className="text-xl font-semibold mb-2">Dúvidas sobre os termos?</h3>
            <p className="text-muted-foreground mb-4">
              Entre em contato com nossa equipe para esclarecimentos.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/contato">Falar com suporte</Link>
              </Button>
              <Button variant="link" asChild>
                <Link href="/privacidade">Ver política de privacidade</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}