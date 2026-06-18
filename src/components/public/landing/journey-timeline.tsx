import {
  UserPlus,
  Target,
  Trophy,
  TrendingUp,
  Crown,
  Sparkles,
  Flame,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const etapas = [
  {
    icon: UserPlus,
    titulo: "Dia 1 - Começo",
    descricao:
      "Crie sua conta e configure seus primeiros Nucleos de acordo com seus objetivos.",
    nivel: "Nível 1",
    cor: "#4D7CFF", // chart-1
    xp: "0 XP",
  },
  {
    icon: Target,
    titulo: "Semana 1 - Hábitos",
    descricao:
      "Adicione tarefas diárias e comece a construir sua rotina. Ganhe seus primeiros XPs.",
    nivel: "Nível 5",
    cor: "#00C9A7", // chart-2
    xp: "+500 XP",
  },
  {
    icon: Trophy,
    titulo: "Mês 1 - Conquistas",
    descricao:
      "Desbloqueie suas primeiras conquistas e veja seu progresso nos gráficos.",
    nivel: "Nível 15",
    cor: "#2EBD59", // chart-3
    xp: "+2.5k XP",
  },
  {
    icon: TrendingUp,
    titulo: "Mês 3 - Evolução",
    descricao:
      "Seus hábitos estão consolidados. Você já nota a diferença na sua produtividade.",
    nivel: "Nível 30",
    cor: "#0077BE", // chart-4
    xp: "+8k XP",
  },
  {
    icon: Crown,
    titulo: "Mês 6 - Domínio",
    descricao:
      "Você domina suas áreas de desenvolvimento e inspira outros usuários.",
    nivel: "Nível 50",
    cor: "#8CD47E", // chart-5
    xp: "+25k XP",
  },
  {
    icon: Sparkles,
    titulo: "Ano 1 - Transformação",
    descricao:
      "Uma pessoa completamente transformada. Seus objetivos do ano passado são realidade.",
    nivel: "Nível 100",
    cor: "#FF8C42", // laranja personalizado
    xp: "+100k XP",
  },
];

export function JourneyTimeline() {
  return (
    <section className="relative overflow-hidden px-4 min-h-screen sm:px-6 lg:px-8">
      {/* GRADIENTE SUPERIOR */}
      <div className="absolute top-0 left-0 right-0 h-100 pointer-events-none z-10 --background-to-b from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />

      {/* GRADIENTE INFERIOR */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-10 --background-to-t from-white via-white/60 to-transparent dark:from-black dark:via-black/60 dark:to-transparent" />

      {/* SEGUNDA CAMADA DE DEGRADÊ */}
      <div className="absolute bottom-0 left-0 right-0 h-80 pointer-events-none z-5 --background-to-t from-white/40 via-transparent to-transparent dark:from-black/40 dark:via-transparent dark:to-transparent" />

      {/* Background elements com parallax */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-background/20 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-accent/20 blur-3xl animate-pulse delay-700" />
      </div>
      {/* Grid pattern sutil */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="mx-auto max-w-4xl relative z-20 flex flex-col items-center">
        {/* <div data-animate="fade-up">
          <Badge
            variant="outline"
            className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF]"
          >
            <Sparkles className="size-4" />
            <span>Sua Jornada</span>
          </Badge>
        </div> */}
        <h2
          data-animate="fade-up"
          data-delay="100"
          className="text-4xl md:text-5xl font-extrabold tracking-tight mt-6 text-neutral-900 dark:text-white text-center"
        >
          Como você vai{" "}
          <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            evoluir
          </span>
          .
        </h2>

        <p
          data-animate="fade-up"
          data-delay="200"
          className="mt-5 text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed text-center"
        >
          Veja o que esperar sendo um usuário do Nucleos.
        </p>

        <div className="mt-12 relative w-full">
          {/* Linha central com gradiente */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 --background-to-b from-[#4D7CFF] via-[#00C9A7] to-[#8CD47E] -translate-x-1/2 hidden md:block opacity-50" />

          <div className="space-y-8 md:space-y-0">
            {etapas.map((etapa, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row items-center gap-4 md:gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Conteúdo */}
                <div
                  className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                >
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`p-6 rounded-2xl border bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all ${
                      index % 2 === 0
                        ? "md:ml-auto md:mr-8"
                        : "md:mr-auto md:ml-8"
                    } max-w-sm`}
                    style={{
                      borderColor: `${etapa.cor}30`,
                      boxShadow: `0 4px 20px ${etapa.cor}10`,
                    }}
                  >
                    <div
                      className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                    >
                      <div
                        className="flex size-12 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${etapa.cor}15` }}
                      >
                        <etapa.icon
                          className="size-6"
                          style={{ color: etapa.cor }}
                        />
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <Badge
                          variant="outline"
                          className="text-xs font-semibold"
                          style={{
                            backgroundColor: `${etapa.cor}10`,
                            borderColor: `${etapa.cor}30`,
                            color: etapa.cor,
                          }}
                        >
                          {etapa.nivel}
                        </Badge>
                        <span
                          className="text-xs font-medium"
                          style={{ color: etapa.cor }}
                        >
                          {etapa.xp}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {etapa.titulo}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {etapa.descricao}
                    </p>

                    {/* Barra de progresso decorativa */}
                    <div className="mt-4 h-1 w-full bg-secondary/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(index + 1) * 16.67}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: etapa.cor }}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Círculo central animado */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative z-10 flex size-14 items-center justify-center rounded-full border-4 border-background shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${etapa.cor} 0%, ${etapa.cor}80 100%)`,
                  }}
                >
                  <span className="text-white font-bold text-lg">
                    {index + 1}
                  </span>

                  {/* Efeito de brilho */}
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{ backgroundColor: etapa.cor }}
                  />
                </motion.div>

                {/* Espaçador */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Badge de conquista final */}
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.8 }}
  viewport={{ once: true }}
  className="mt-12 flex justify-center"
>
  <Button
    size="lg"
    asChild
    className="group relative overflow-hidden bg-gradient-to-r from-[#4D7CFF] to-[#00C9A7] hover:from-[#00C9A7] hover:to-[#4D7CFF] transition-all duration-500 shadow-lg hover:shadow-xl border-0"
  >
    <Link href="/cadastro">
      <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
        <span className="flex items-center gap-2 text-white font-medium text-sm">
          Dê o primeiro passo.
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </span>
    </Link>
  </Button>
</motion.div>
      </div>
    </section>
  );
}
