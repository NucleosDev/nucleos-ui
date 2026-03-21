import { Check, X, Sparkles, Zap, Trophy, Target, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const comparisons = [
  {
    feature: "Tarefas",
    semNucleos: "Espalhadas em vários apps",
    comNucleos: "Tudo em um só lugar",
    icon: <Zap className="size-4 text-[#4D7CFF]" />,
  },
  {
    feature: "Motivação",
    semNucleos: "Facilmente perdida",
    comNucleos: "Sistema de XP e níveis",
    icon: <Trophy className="size-4 text-[#FFD700]" />,
  },
  {
    feature: "Rotina",
    semNucleos: "Sem visão geral",
    comNucleos: "Dashboard completo",
    icon: <Target className="size-4 text-[#00C9A7]" />,
  },
  {
    feature: "Incentivo",
    semNucleos: "Difícil manter hábitos",
    comNucleos: "Streaks e conquistas",
    icon: <Flame className="size-4 text-[#FF8C42]" />,
  },
  {
    feature: "Visual",
    semNucleos: "Limitada",
    comNucleos: "Nucleos personalizados",
    icon: <Sparkles className="size-4 text-[#2EBD59]" />,
  },
];

export function Comparison() {
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

      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-[#4D7CFF]/5 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-[#00C9A7]/5 blur-3xl animate-pulse delay-700" />
      </div>

      <div className="mx-auto max-w-4xl relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-4 text-center"
        >
          <Badge
            variant="outline"
            className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF]"
          >
            <Sparkles className="size-4" />
            <span>Evolução.</span>
          </Badge>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-balance text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
        >
          A diferença que o{" "}
          <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Nucleos
          </span>{" "}
          faz
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground"
        >
          Compare sua rotina antes e depois de usar o Nucleos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl"
        >
          {/* Header */}
          <div className="grid grid-cols-3 bg-gradient-to-r from-[#4D7CFF]/5 via-transparent to-[#00C9A7]/5 border-b border-border/50">
            <div className="p-4 font-medium text-foreground/80">Aspecto</div>
            <div className="p-4 font-medium text-center border-x border-border/50 bg-/5 text-/90">
              Antes do Nucleos
            </div>
            <div className="p-4 font-medium text-center bg-gradient-to-r from-[#4D7CFF]/10 to-[#00C9A7]/10 text-[#4D7CFF] ">
              Depois do Nucleos
            </div>
          </div>

          {/* Rows */}
          {comparisons.map((item, index) => (
            <motion.div
              key={item.feature}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              viewport={{ once: true }}
              className={`grid grid-cols-3 ${
                index !== comparisons.length - 1
                  ? "border-b border-border/50"
                  : ""
              } hover:bg-muted/30 transition-colors group`}
            >
              <div className="p-4 font-medium flex items-center gap-2">
                <span className="text-[#4D7CFF] group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span>{item.feature}</span>
              </div>
              <div className="p-4 text-center border-x border-border/50 flex items-center justify-center gap-2 text-muted-foreground">
                <X className="size-5 text-/70 group-hover:scale-110 transition-transform" />
                <span className="text-sm">{item.semNucleos}</span>
              </div>
              <div className="p-4 text-center flex items-center justify-center gap-2">
                <Check className="size-5 text-[#4D7CFF] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-foreground/90">
                  {item.comNucleos}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Badge de stats no final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          viewport={{ once: true }}
          className="mt-8 flex justify-center gap-4"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#4D7CFF]/10 border border-[#4D7CFF]/20">
            <Trophy className="size-4 text-[#FFD700]" />
            <span className="text-sm font-medium">Conquiste.</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00C9A7]/10 border border-[#00C9A7]/20">
            <Flame className="size-4 text-[#FF8C42]" />
            <span className="text-sm font-medium">Desafie-se.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
