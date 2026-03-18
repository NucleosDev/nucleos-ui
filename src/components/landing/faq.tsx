"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  HelpCircle,
  ArrowRight,
  Zap,
  Trophy,
  Layers,
  Infinity,
  Smartphone,
  Coins,
} from "lucide-react";

const faqs = [
  {
    question: "O que são os Nucleos?",
    answer:
      "Nucleos são áreas da sua vida que você deseja organizar e evoluir, como estudos, saúde, finanças e produtividade. Cada núcleo possui suas próprias tarefas, metas e sistema de progressão.",
    icon: Layers,
    color: "#4D7CFF",
  },
  {
    question: "Como funciona o sistema de XP e níveis?",
    answer:
      "Ao completar tarefas dentro dos seus Nucleos, você ganha pontos de experiência (XP). Conforme acumula XP, você sobe de nível, desbloqueando novas funcionalidades e conquistas. O sistema foi projetado para manter você motivado.",
    icon: Trophy,
    color: "#FFD700",
  },
  {
    question: "Posso criar meus próprios Nucleos personalizados?",
    answer:
      "Sim! Além dos Nucleos padrão (Estudos, Saúde, Finanças e Produtividade), você pode criar Nucleos totalmente personalizados para qualquer área da sua vida que deseja organizar.",
    icon: Layers,
    color: "#00C9A7",
  },
  {
    question: "O Nucleos é gratuito?",
    answer:
      "O Nucleos oferece um plano gratuito com funcionalidades essenciais. Para recursos avançados como analytics detalhados, Nucleos ilimitados e integração com outros apps, temos planos premium a partir de R$ 29,90/mês.",
    icon: Coins,
    color: "#2EBD59",
  },
  {
    question: "Como funciona o streak?",
    answer:
      "O streak conta quantos dias consecutivos você completou pelo menos uma tarefa. Manter seu streak alto desbloqueia bônus de XP e conquistas especiais. Se perder um dia, o streak reseta.",
    icon: Zap,
    color: "#FF8C42",
  },
  {
    question: "Posso usar em múltiplos dispositivos?",
    answer:
      "Sim! Seus dados são sincronizados na nuvem, permitindo acesso de qualquer dispositivo. Temos apps para iOS, Android e versão web com sincronização em tempo real.",
    icon: Smartphone,
    color: "#0077BE",
  },
];

export function FAQ() {
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

      <div className="mx-auto max-w-3xl relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <Badge
            variant="outline"
            className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF] mb-4"
          >
            <HelpCircle className="size-4" />
            <span>FAQ</span>
          </Badge>

          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            Perguntas{" "}
            <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              frequentes
            </span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground max-w-xl mx-auto">
            Tire suas dúvidas sobre o Nucleos e descubra como podemos ajudar na
            sua jornada de evolução.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm overflow-hidden hover:border-[#4D7CFF]/30 transition-all group"
                  >
                    <AccordionTrigger className="py-4 px-6 text-left text-base font-medium hover:text-[#4D7CFF] hover:no-underline [&[data-state=open]>div>svg]:rotate-180">
                      <div className="flex items-center gap-3">
                        {/* Ícone colorido */}
                        <div
                          className="flex size-8 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${faq.color}15` }}
                        >
                          <Icon
                            className="size-4"
                            style={{ color: faq.color }}
                          />
                        </div>
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground border-t border-border/50 mt-2">
                      <div className="pt-4">{faq.answer}</div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        </motion.div>

        {/* Botão para página completa de FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <Link href="/duvidas">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] hover:from-[#00C9A7] hover:to-[#4D7CFF] transition-all duration-500 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                Ver todas as perguntas
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Button>
          </Link>
        </motion.div>

        {/* Link rápido para suporte */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Ainda tem dúvidas?{" "}
            <Link
              href="/contato"
              className="font-medium text-[#4D7CFF] hover:text-[#00C9A7] transition-colors"
            >
              Fale com nosso suporte
            </Link>
          </p>
        </motion.div>

        {/* Badges de categorias */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap justify-center gap-2"
        >
          <Badge
            variant="outline"
            className="gap-1 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 text-[#4D7CFF]"
          >
            <Zap className="size-3" />
            Conta
          </Badge>
          <Badge
            variant="outline"
            className="gap-1 border-[#00C9A7]/20 bg-[#00C9A7]/5 text-[#00C9A7]"
          >
            <Trophy className="size-3" />
            Planos
          </Badge>
          <Badge
            variant="outline"
            className="gap-1 border-[#2EBD59]/20 bg-[#2EBD59]/5 text-[#2EBD59]"
          >
            <Infinity className="size-3" />
            Técnico
          </Badge>
        </motion.div>
      </div>
    </section>
  );
}
