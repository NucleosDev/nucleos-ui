"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { ArrowRight, Sparkles, Zap, Check, Star } from "lucide-react";

export function CTA() {
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

      <div className="mx-auto max-w-4xl relative z-20">
        <div className="relative overflow-hidden rounded-3xl border border-[#4D7CFF]/20 bg-gradient-to-br from-[#4D7CFF]/10 via-[#00C9A7]/5 to-transparent p-8 text-center backdrop-blur-sm sm:p-12 lg:p-16">
          {/* Background com grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4D7CFF08_1px,transparent_1px),linear-gradient(to_bottom,#4D7CFF08_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

          {/* Bolhas decorativas */}
          <div className="absolute top-0 right-0 size-64 rounded-full bg-[#4D7CFF]/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 size-64 rounded-full bg-[#00C9A7]/20 blur-3xl" />

          <div className="relative z-10">
            {/* Badge */}
            <div className="mb-6 flex justify-center">
              <Badge
                variant="outline"
                className="gap-2 border-[#4D7CFF]/30 bg-[#4D7CFF]/10 px-4 py-2 text-[#4D7CFF]"
              >
                <Sparkles className="size-4" />
                <span>Pronto para começar no Nucleos?</span>
              </Badge>
            </div>

            {/* Título com gradiente */}
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Pronto para{" "}
              <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                transformar
              </span>{" "}
              sua produtividade?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Junte-se a milhares de pessoas que estão evoluindo todos os dias
              com Nucleos. Sua jornada começa agora.
            </p>

            {/* Lista de benefícios */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Check className="size-4 text-[#00C9A7]" />
                Sem cartão
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Check className="size-4 text-[#00C9A7]" />
                Cancele quando quiser
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Check className="size-4 text-[#00C9A7]" />
                Suporte incluso
              </div>
            </div>

            {/* Botões */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group w-full sm:w-auto bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] hover:from-[#00C9A7] hover:to-[#4D7CFF] text-white border-0 shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link href="/cadastro">
                  Criar conta grátis
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-[#4D7CFF]/30 hover:border-[#4D7CFF] hover:bg-[#4D7CFF]/5"
                asChild
              >
                <Link href="/painel">Ver demonstração</Link>
              </Button>
            </div>

            {/* Selo de confiança */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="size-6 rounded-full bg-gradient-to-br from-[#4D7CFF] to-[#00C9A7] flex items-center justify-center text-[10px] font-bold text-white border-2 border-background"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <span className="text-muted-foreground">
                <span className="font-semibold text-[#4D7CFF]">+10k</span>{" "}
                usuários ativos
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
