"use client";

import { ChevronRight, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface HeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
  demoLabel?: string;
  demoHref?: string;
}

export function HeroHome({
  eyebrow = "NEXT-GEN PRODUCTIVITY",
  title,
  subtitle,
  ctaLabel = "Comece agora",
  ctaHref = "#",
  demoLabel = "Ver demonstração",
  demoHref = "#demo",
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative mx-auto w-full pt-40 px-6 text-center md:px-8 
      min-h-[calc(100vh-40px)] overflow-hidden 
      bg-[linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background))_50%,hsl(var(--muted))_88%)]  
      dark:bg-[linear-gradient(to_bottom,hsl(var(--background)),transparent_30%,hsl(var(--muted))_78%,hsl(var(--background))_99%_50%)] 
      rounded-b-xl"
    >
      {/* GRADIENTE SUPERIOR */}

      {/* GRADIENTE INFERIOR */}

      {/* SEGUNDA CAMADA DE DEGRADÊ */}

      {/* Grid background com fade in suave */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -z-10 inset-0 h-[600px] w-full 
        bg-[linear-gradient(to_right,var(--border)_2px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] 
        dark:bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]
        bg-[size:6rem_5rem] 
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />

      {/* Radial Accent com escala e opacidade */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-1/2 top-[calc(100%-200px)] lg:top-[calc(100%-220px)] 
        h-[500px] w-[700px] md:h-[500px] md:w-[1100px] lg:h-[950px] lg:w-[130%] 
        -translate-x-1/2 rounded-[100%] border-[hsl(var(--primary))] bg-white dark:bg-black 
        bg-[radial-gradient(closest-side,#fff_90%,#000000)] 
        dark:bg-[radial-gradient(closest-side,#000_90%,#ffffff)]"
      />

      {/* Bottom radial glow com animação lenta */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
        className="
        pointer-events-none
        absolute
        bottom-[-350px]
        left-1/2
        -translate-x-1/2
        w-[1400px]
        rounded-full
        bg-[radial-gradient(closest-side,#ffffff,transparent)]
        blur-3xl
        "
      />

      {/* DEGRADÊ ESCURO NA BASE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.6 }}
        className="
        absolute
        bottom-0
        left-0
        right-0
        h-[300px]
        pointer-events-none
        bg-gradient-to-t
        from-white/90
        via-white/50
        to-transparent
        dark:from-black
        dark:via-black/80
        dark:to-transparent
        z-5
        "
      />

      {/* SEGUNDA CAMADA DE DEGRADÊ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="
        absolute
        bottom-0
        left-0
        right-0
        h-[500px]
        pointer-events-none
        bg-gradient-to-t
        via-transparent
        to-transparent
        from-white/60
        dark:from-black/60
        z-4
        "
      />

      {/* Conteúdo principal com animações em sequência */}
      <div className="relative z-10">
        {/* Eyebrow */}
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 flex justify-center"
          >
            <span
              className="
              flex
              items-center
              gap-1
              rounded-full
              border
              border-primary/30
              bg-[#f6f6f6]
              dark:bg-[#0a0a0a]
              px-5
              py-2
              text-xs
              uppercase
              tracking-widest
              text-[#a1a1aa]
              "
            >
              {eyebrow}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </motion.div>
            </span>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="
            mx-auto
            max-w-5xl
            text-balance
            text-5xl
            font-semibold
            leading-tight
            tracking-tight
            text-transparent
            bg-gradient-to-b
            from-white
            to-[#333]
            dark:from-white
            dark:to-[#222]
            bg-clip-text
            sm:text-6xl
            md:text-7xl
            lg:text-8xl
          "
        >
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="
            mx-auto
            mt-8
            max-w-2xl
            text-lg
            leading-relaxed
            text-[#9ca3af]
            md:text-xl
          "
        >
          {subtitle}
        </motion.p>

        {ctaLabel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
          >
            {/* Botão Começar agora - SEM QUALQUER HOVER COLORIDO */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-full sm:w-auto"
            ></motion.div>

            {/* Botão Ver demonstração - SEM QUALQUER HOVER COLORIDO */}
            {/* Botão Começar agora - Primário */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-full sm:w-[180px]"
            >
              <Button
                size="lg"
                asChild
                className="w-full group relative overflow-hidden bg-foreground text-primary-foreground shadow-lg shadow-foreground/25 hover:shadow-xl transition-all duration-300 hover:bg-foreground hover:text-primary-foreground"
              >
                <Link href={ROUTES.LOGIN}>
                  <span className="flex items-center justify-center gap-2 px-2">
                    Começar agora
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
            </motion.div>

            {/* Botão Ver demonstração - Outline */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-full sm:w-[180px]"
            >
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full group border-2 border-primary/30 bg-background/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-background/50 hover:border-primary/30"
              >
                <Link href="#como-funciona">
                  <span className="flex items-center justify-center gap-2 px-2 text-foreground/80">
                    Ver demonstração
                    <Zap className="size-4 transition-all duration-300 group-hover:rotate-12" />
                  </span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Bottom fade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        className="animate-fade-up relative mt-32 [perspective:2000px] 
        after:absolute after:inset-0 after:z-50 
        after:[background:linear-gradient(to_top,hsl(var(--background))_10%,transparent)]"
      />
    </section>
  );
}
