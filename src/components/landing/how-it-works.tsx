import { motion } from "framer-motion";
import { Sparkles, Zap, Target, Trophy, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Crie seus Núcleos",
    description:
      "Defina as áreas da sua vida que deseja desenvolver. Cada Núcleo representa um centro de energia focado no seu crescimento.",
    icon: <Zap className="size-6 text-[#4D7CFF]" />,
    color: "#4D7CFF",
  },
  {
    number: "02",
    title: "Estabeleça Hábitos",
    description:
      "Adicione hábitos a cada Núcleo. Configure a frequência e a quantidade de XP que cada um vale. Construa sua rotina ideal.",
    icon: <Target className="size-6 text-[#00C9A7]" />,
    color: "#00C9A7",
  },
  {
    number: "03",
    title: "Complete Atividades",
    description:
      "Registre suas atividades diárias. Cada tarefa completada adiciona experiência ao seu Núcleo correspondente.",
    icon: <Sparkles className="size-6 text-[#2EBD59]" />,
    color: "#2EBD59",
  },
  {
    number: "04",
    title: "Evolua e Celebre",
    description:
      "Acompanhe seu progresso, suba de nível e desbloqueie conquistas. Sua jornada de evolução acontece um passo de cada vez.",
    icon: <Trophy className="size-6 text-[#FFD700]" />,
    color: "#FFD700",
  },
];

export function HowItWorks() {
  return (
    <section

      className="relative pb-60 pt-60 overflow-hidden px-4 min-h-screen sm:px-6 lg:px-8"
    >
      {/* GRADIENTE SUPERIOR */}
      <div className="absolute top-0 left-0 right-0 h-100 pointer-events-none z-10 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />

      {/* GRADIENTE INFERIOR */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-10 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-black dark:via-black/60 dark:to-transparent" />

      {/* SEGUNDA CAMADA DE DEGRADÊ */}
      <div className="absolute bottom-0 left-0 right-0 h-80 pointer-events-none z-5 bg-gradient-to-t from-white/40 via-transparent to-transparent dark:from-black/40 dark:via-transparent dark:to-transparent" />

      {/* Background elements com parallax */}
      <motion.div

        className="absolute inset-0 -z-10"
      >
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-background/20 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-accent/20 blur-3xl animate-pulse delay-700" />
      </motion.div>

      {/* Grid pattern sutil */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

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
            className="gap-2 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF] mb-4"
          >
            <Sparkles className="size-4" />
            <span>Como funciona</span>
          </Badge>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-pretty text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Simples de usar,{" "}
            <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              flexível para evoluir
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Comece sua jornada em minutos. O sistema foi projetado para ser
            intuitivo e motivador desde o primeiro dia.
          </motion.p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4 overflow-hidden">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Linha conectora */}
              {index < steps.length - 1 && (
                <div className="absolute top-12 left-1/2 hidden h-px w-full lg:block">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-transparent opacity-30" />
                </div>
              )}

              <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-[#4D7CFF]/30 transition-all hover:shadow-xl hover:shadow-[#4D7CFF]/5 group">
                {/* Número decorativo de fundo */}
                <div className="absolute -top-2 -right-2 text-7xl font-bold text-[#4D7CFF]/5 select-none">
                  {step.number}
                </div>

                {/* Ícone com fundo colorido */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}20 0%, ${step.color}05 100%)`,
                    border: `1px solid ${step.color}30`,
                  }}
                >
                  <div
                    className="size-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${step.color}15` }}
                  >
                    {step.icon}
                  </div>
                </motion.div>

                {/* Número e título */}
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="text-sm font-bold"
                    style={{ color: step.color }}
                  >
                    {step.number}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                </div>

                {/* Descrição */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Indicador de progresso hover */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 h-1 rounded-b-2xl"
                  style={{ backgroundColor: step.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badge de CTA no final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-4 rounded-full bg-gradient-to-r from-[#4D7CFF]/10 to-[#00C9A7]/10 border border-[#4D7CFF]/20">
            <Link href="/get-started">
              <span className="text-sm font-medium">
                Pronto para começar?{" "}
                {/* <ArrowRight className="size-4 text-[#4D7CFF]" /> */}
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
