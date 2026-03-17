"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  Cookie,
  Mail,
  Globe,
  Smartphone,
  FileText,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const secoes = [
  {
    titulo: "1. Informações que coletamos",
    conteudo: "Coletamos informações que você nos fornece diretamente, como nome, email, dados de perfil e conteúdo que você cria nos núcleos. Também coletamos automaticamente informações sobre seu uso da plataforma, como endereço IP, tipo de dispositivo e interações.",
    icon: Database,
  },
  {
    titulo: "2. Como usamos suas informações",
    conteudo: "Utilizamos suas informações para fornecer, manter e melhorar nossos serviços, personalizar sua experiência, processar transações, enviar comunicações e garantir a segurança da plataforma.",
    icon: Eye,
  },
  {
    titulo: "3. Compartilhamento de dados",
    conteudo: "Não vendemos seus dados pessoais. Compartilhamos apenas com seu consentimento, para fins legais, ou com prestadores de serviços que nos auxiliam na operação da plataforma sob estritas obrigações de confidencialidade.",
    icon: Globe,
  },
  {
    titulo: "4. Armazenamento e segurança",
    conteudo: "Seus dados são armazenados em servidores seguros com criptografia. Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, perda ou destruição.",
    icon: Lock,
  },
  {
    titulo: "5. Seus direitos",
    conteudo: "Você tem direito a acessar, corrigir ou excluir seus dados pessoais. Pode exportar seus dados a qualquer momento nas configurações da conta. Para solicitações, entre em contato com privacy@nucleos.com",
    icon: Shield,
  },
  {
    titulo: "6. Cookies e tecnologias similares",
    conteudo: "Utilizamos cookies para melhorar sua experiência, analisar tráfego e personalizar conteúdo. Você pode gerenciar preferências de cookies nas configurações do seu navegador.",
    icon: Cookie,
  },
  {
    titulo: "7. Transferência internacional",
    conteudo: "Seus dados podem ser transferidos e processados em países diferentes do seu. Garantimos que todas as transferências cumprem as leis de proteção de dados aplicáveis.",
    icon: Globe,
  },
  {
    titulo: "8. Retenção de dados",
    conteudo: "Mantemos seus dados enquanto sua conta estiver ativa. Após o encerramento, podemos reter algumas informações por período limitado para cumprir obrigações legais.",
    icon: Database,
  },
  {
    titulo: "9. Alterações nesta política",
    conteudo: "Podemos atualizar esta política periodicamente. Notificaremos sobre alterações significativas por email ou através da plataforma. O uso continuado após alterações constitui aceitação.",
    icon: FileText,
  },
];

export default function PrivacidadePage() {
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
              <h1 className="text-2xl font-bold">Política de Privacidade</h1>
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
              <Shield className="size-4" />
              <span>Protegendo seus dados</span>
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Sua privacidade é importante</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              No Nucleos, levamos a sério a proteção dos seus dados. Esta política explica como coletamos, usamos e protegemos suas informações.
            </p>
          </motion.div>

          {/* Resumo visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 grid gap-4 md:grid-cols-3"
          >
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="p-4 text-center">
                <Check className="size-8 mx-auto mb-2 text-green-500" />
                <h3 className="font-semibold text-sm">Não vendemos dados</h3>
                <p className="text-xs text-muted-foreground mt-1">Seus dados são seus</p>
              </CardContent>
            </Card>
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardContent className="p-4 text-center">
                <Lock className="size-8 mx-auto mb-2 text-blue-500" />
                <h3 className="font-semibold text-sm">Criptografia</h3>
                <p className="text-xs text-muted-foreground mt-1">Dados protegidos</p>
              </CardContent>
            </Card>
            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardContent className="p-4 text-center">
                <Eye className="size-8 mx-auto mb-2 text-purple-500" />
                <h3 className="font-semibold text-sm">Você controla</h3>
                <p className="text-xs text-muted-foreground mt-1">Acesse e exporte quando quiser</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Seções */}
          <div className="space-y-6">
            {secoes.map((secao, index) => {
              const Icon = secao.icon;
              return (
                <motion.div
                  key={secao.titulo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
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

          {/* Contato DPO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-[#4D7CFF]/10 to-[#00C9A7]/10"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Fale com nosso DPO</h3>
              <p className="text-muted-foreground mb-4">
                Se tiver dúvidas sobre como tratamos seus dados, entre em contato com nosso Encarregado de Proteção de Dados.
              </p>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-[#4D7CFF]" />
                  <span>privacy@nucleos.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="size-4 text-[#00C9A7]" />
                  <span>Respondemos em até 48h</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}