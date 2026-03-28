"use client";

import { Card, CardContent } from "@/components/ui/card";
import {

  Brain,
  Dumbbell,
  Briefcase,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { useRef, useState } from "react";
import { NucleoCoreCard } from "@/components/nucleo/ui/nucleo-core-card";
import { NucleoCardCompact } from "@/components/nucleo/ui/nucleo-card-mini";
import { mockNucleos } from "@/components/nucleo/mocks/nucleo-card.mock";

// Ícones para cada tipo de Nucleo
const icons = {
  Estudos: <Brain className="size-5 text-primary" />,
  Fitness: <Dumbbell className="size-5 text-accent" />,
  Trabalho: <Briefcase className="size-5 text-destructive" />,
};

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  return (
    <section
      ref={containerRef}
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
        style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [0.5, 0]) }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-background/20 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-accent/20 blur-3xl animate-pulse delay-700" />
      </motion.div>

      {/* Grid pattern */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <motion.div
        style={{ opacity, scale, y }}
        className="mx-auto max-w-5xl text-center relative z-20"
      >
        {/* Badge animado (comentado) */}
        {/* <motion.div ... /> */}

        {/* Título */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-pretty text-6xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-6xl"
        >
          <span className="block">Use seu potencial para</span>
          <span className="bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            sua própria evolução
          </span>
          !
        </motion.h2>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        >
          Crie Nucleos para cada área da sua vida. Acompanhe seu progresso,
          ganhe XP, desbloqueie conquistas e veja sua evolução em tempo real.
          Produtividade que parece jogo.
        </motion.p>
      </motion.div>

      {/* Cards com preview - AGORA USANDO MINI CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative mx-auto mt-16 max-w-4xl lg:mt-20"
      >
        {/* Glow atrás dos cards */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/20 via-accent/20 to-transparent blur-3xl" />

        {/* Card principal */}
        <Card className=" p-0 overflow-hidden border-border/50 bg-card/50 shadow-2xl backdrop-blur-sm">
          {/* Mac window dots */}
          <div className="flex items-center gap-1.5 border-b border-border/50 bg-secondary/30 px-4 py-3">
            <div className="size-3 rounded-full bg-destructive/60" />
            <div className="size-3 rounded-full bg-chart-3/60" />
            <div className="size-3 rounded-full bg-accent/60" />
            <span className="ml-2 text-xs text-muted-foreground">Nucleos</span>
          </div>

          {/* Conteúdo com MINI CARDS */}
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Usando NucleoCardCompact para cada núcleo */}
              <NucleoCardCompact
                nucleo={mockNucleos[0]} // Estudos
                onClick={() => console.log("Estudos")}
              />
              <NucleoCardCompact
                nucleo={mockNucleos[1]} // Fitness
                onClick={() => console.log("Fitness")}
              />
              <NucleoCardCompact
                nucleo={mockNucleos[2]} // Trabalho
                onClick={() => console.log("Trabalho")}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats flutuantes com parallax */}
      <motion.div
        style={{
          x: useTransform(scrollYProgress, [0, 0.5], [0, -100]),
          opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]),
        }}
        className="absolute left-10 top-1/3 hidden lg:block z-20"
      >
      </motion.div>

      {/* Segundo stat flutuante */}
      <motion.div
        style={{
          x: useTransform(scrollYProgress, [0, 0.5], [0, 100]),
          opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]),
        }}
        className="absolute right-10 bottom-1/3 hidden lg:block z-20"
      >
      </motion.div>
    </section>
  );
}
