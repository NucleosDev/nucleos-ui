"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  totalArtigos: number;
  totalCategorias: number;
}

export function HeroSection({ totalArtigos, totalCategorias }: HeroSectionProps) {
  return (
    <div className="relative border-b border-border/50 overflow-hidden">
      {/* Gradientes de fundo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#4D7CFF]/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-[#4D7CFF]/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 size-96 rounded-full bg-[#00C9A7]/5 blur-3xl animate-pulse delay-700" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header com navegação */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2"
            >
              <Sparkles className="size-4 text-[#4D7CFF]" />
              <span className="text-[#4D7CFF]">Central de Ajuda</span>
            </Badge>
          </motion.div>
        </div>

        {/* Título e descrição */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto text-center mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-4">
            Como podemos{" "}
            <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              ajudar
            </span>
            ?
          </h1>
          <p className="text-lg text-muted-foreground">
            Encontre respostas, tutoriais e guias para aproveitar o Nucleos ao máximo.
          </p>
        </motion.div>

        {/* Busca profissional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl mb-6"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] rounded-xl opacity-0 group-hover:opacity-30 blur transition duration-500" />
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input
                placeholder="Buscar ajuda, tutoriais, perguntas..."
                className="pl-12 py-7 text-lg bg-background/80 backdrop-blur-sm border-2 focus-visible:ring-[#4D7CFF]"
              />
            </div>
          </div>
        </motion.div>

        {/* Estatísticas rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center gap-8 text-sm"
        >
          <div className="text-center">
            <span className="text-2xl font-bold text-[#4D7CFF]">{totalArtigos}+</span>
            <p className="text-muted-foreground">Artigos</p>
          </div>
          {/* <div className="text-center">
            <span className="text-2xl font-bold text-[#00C9A7]">{totalCategorias}</span>
            <p className="text-muted-foreground">Categorias</p>
          </div> */}
          <div className="text-center">
            <span className="text-2xl font-bold text-[#FF8C42]">24/7</span>
            <p className="text-muted-foreground">Suporte</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}