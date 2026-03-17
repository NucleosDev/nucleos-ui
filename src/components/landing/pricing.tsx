"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import {
  Check,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
  Infinity,
  Star,
} from "lucide-react";

const plans = [
  {
    name: "Grátis",
    description: "Comece sua jornada hoje.",
    price: "R$ 0",
    period: "/mês",
    features: ["3 Núcleos", "XP e níveis", "Streaks", "Conquistas básicas"],
    cta: "Começar agora",
    icon: Sparkles,
    color: "#4D7CFF",
    popular: false,
  },
  {
    name: "Pro",
    description: "Para quem quer ir além.",
    price: "R$ 29,90",
    period: "/mês",
    features: [
      "Núcleos ilimitados",
      "Hábitos ilimitados",
      "Analytics avançado",
      "Conquistas exclusivas",
      "Temas personalizados",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    icon: Crown,
    color: "#00C9A7",
    popular: true,
    savings: "Economize 20% no anual",
  },
  {
    name: "Vitalício",
    description: "Invista no seu futuro.",
    price: "R$ 497",
    period: "único",
    features: [
      "Tudo do Pro",
      "Acesso vitalício",
      "Atualizações grátis",
      "Prioridade em features",
      "Beta tester",
      "Suporte VIP",
    ],
    cta: "Garantir acesso",
    icon: Infinity,
    color: "#FFD700",
    popular: false,
    highlight: "Melhor custo-benefício",
  },
];

export function Pricing() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
      {/* Gradientes de fundo */}
      <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-10 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />

      {/* Elementos decorativos */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-[#4D7CFF]/5 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-[#00C9A7]/5 blur-3xl animate-pulse delay-700" />
      </div>

      <div className="mx-auto max-w-7xl relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge
            variant="outline"
            className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF] mb-4"
          >
            <Zap className="size-4" />
            <span>Preços simples</span>
          </Badge>

          <h2 className="text-pretty text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Invista em{" "}
            <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              você mesmo
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comece grátis. Escale quando precisar. Sem surpresas, sem letras
            miúdas.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div
                  className={`relative flex flex-col rounded-2xl border p-8 h-full transition-all ${
                    plan.popular
                      ? "border-[#4D7CFF]/30 bg-gradient-to-b from-[#4D7CFF]/5 to-transparent shadow-xl hover:shadow-2xl hover:shadow-[#4D7CFF]/10"
                      : "border-border/50 bg-card/50 backdrop-blur-sm hover:border-[#4D7CFF]/30 hover:shadow-lg"
                  }`}
                >
                  {/* Badge de popular */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] text-white border-0 px-4 py-1">
                        <Star className="size-3 mr-1" />
                        Mais escolhido
                      </Badge>
                    </div>
                  )}

                  {/* Highlight para vitalício */}
                  {plan.highlight && (
                    <div className="absolute -top-3 right-4">
                      <Badge
                        variant="outline"
                        className="border-[#FFD700] text-[#FFD700] bg-[#FFD700]/10"
                      >
                        {plan.highlight}
                      </Badge>
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="flex size-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${plan.color}15` }}
                      >
                        <Icon
                          className="size-5"
                          style={{ color: plan.color }}
                        />
                      </div>
                      <h3 className="text-xl font-semibold">{plan.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  {/* Preço */}
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">
                      {plan.period}
                    </span>
                    {plan.savings && (
                      <p className="text-xs text-[#00C9A7] mt-1 font-medium">
                        {plan.savings}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check className="size-4 shrink-0 text-[#4D7CFF]" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className={`w-full group/btn ${
                      plan.popular
                        ? "bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] hover:from-[#00C9A7] hover:to-[#4D7CFF]"
                        : ""
                    }`}
                    asChild
                  >
                    <Link href="/planos">
                      <span className="flex items-center justify-center gap-2">
                        {plan.cta}
                        <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                    </Link>
                  </Button>

                  {/* Efeito de brilho */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA para página de planos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Precisa de um plano para equipes ou empresa?
          </p>
          <Link href="/planos">
            <Button
              variant="outline"
              size="lg"
              className="group border-2 border-[#4D7CFF]/30 hover:border-[#4D7CFF] hover:bg-[#4D7CFF]/5 transition-all"
            >
              <span className="flex items-center gap-2">
                Ver todos os planos
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </Link>
        </motion.div>

        {/* Selo de garantia */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          viewport={{ once: true }}
          className="mt-8 flex justify-center"
        >
          <Badge
            variant="outline"
            className="gap-2 border-green-500/30 text-green-600 bg-green-500/5"
          >
            <Check className="size-3" />
            Cancele quando quiser • Sem fidelidade
          </Badge>
        </motion.div>
      </div>
    </section>
  );
}
