import { Check, X, Sparkles, Zap, Trophy, Target, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const comparisons = [
  {
    id: "1",
    feature: "Tarefas",
    semNucleos: "Espalhadas em vários apps",
    comNucleos: "Tudo em um só lugar",
    icon: <Zap className="size-4 text-[#4D7CFF]" />,
  },
  {
    id: "2",
    feature: "Motivação",
    semNucleos: "Facilmente perdida",
    comNucleos: "Sistema de XP e níveis",
    icon: <Trophy className="size-4 text-[#FFD700]" />,
  },
  {
    id: "3",
    feature: "Rotina",
    semNucleos: "Sem visão geral",
    comNucleos: "Dashboard completo",
    icon: <Target className="size-4 text-[#00C9A7]" />,
  },
  {
    id: "4",
    feature: "Incentivo",
    semNucleos: "Difícil manter hábitos",
    comNucleos: "Streaks e conquistas",
    icon: <Flame className="size-4 text-[#FF8C42]" />,
  },
  {
    id: "5",
    feature: "Visual",
    semNucleos: "Limitada",
    comNucleos: "Nucleos personalizados",
    icon: <Sparkles className="size-4 text-[#2EBD59]" />,
  },
];

export function Comparison() {
  return (
    <section className="relative pb-60 pt-60 overflow-hidden px-4 min-h-screen sm:px-6 lg:px-8">
      {/* Gradientes (sem animação de entrada) */}
      <div className="absolute top-0 left-0 right-0 h-100 pointer-events-none z-10 bg-gradient-to-b from-white via-white/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-10 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-black dark:via-black/60 dark:to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-80 pointer-events-none z-5 bg-gradient-to-t from-white/40 via-transparent to-transparent dark:from-black/40 dark:via-transparent dark:to-transparent" />

      {/* Background elements sem animação de entrada */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-background/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 size-96 rounded-full bg-[#4D7CFF]/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-[#00C9A7]/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl relative z-20">
        <div className="mb-4 text-center">
          <Badge
            variant="outline"
            className="gap-2 border-[#4D7CFF]/20 bg-[#4D7CFF]/5 px-4 py-2 text-[#4D7CFF]"
          >
            <Sparkles className="size-4" />
            <span>Evolução.</span>
          </Badge>
        </div>

        <h2 className="text-balance text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          A diferença que o{" "}
          <span className="bg-gradient-to-r from-[#4D7CFF] via-[#00C9A7] to-[#4D7CFF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Nucleos
          </span>{" "}
          faz
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Compare sua rotina antes e depois de usar o Nucleos.
        </p>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
          {/* Header */}
          <div className="grid grid-cols-3 bg-gradient-to-r from-[#4D7CFF]/5 via-transparent to-[#00C9A7]/5 border-b border-border/50">
            <div className="p-4 font-medium text-foreground/80">Aspecto</div>
            <div className="p-4 font-medium text-center border-x border-border/50 bg-background/5 text-foreground/90">
              Antes do Nucleos
            </div>
            <div className="p-4 font-medium text-center bg-gradient-to-r from-[#4D7CFF]/10 to-[#00C9A7]/10 text-[#4D7CFF]">
              Depois do Nucleos
            </div>
          </div>

          {/* Rows - com key adicionada */}
          {comparisons.map((item, index) => (
            <div
              key={item.id} // <-- KEY ADICIONADA
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
                <X className="size-5 text-muted-foreground group-hover:scale-110 transition-transform" />
                <span className="text-sm">{item.semNucleos}</span>
              </div>
              <div className="p-4 text-center flex items-center justify-center gap-2">
                <Check className="size-5 text-[#4D7CFF] group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-foreground/90">
                  {item.comNucleos}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Badge de stats no final */}
        <div className="mt-8 flex justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#4D7CFF]/10 border border-[#4D7CFF]/20">
            <Trophy className="size-4 text-[#FFD700]" />
            <span className="text-sm font-medium">Conquiste.</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00C9A7]/10 border border-[#00C9A7]/20">
            <Flame className="size-4 text-[#FF8C42]" />
            <span className="text-sm font-medium">Desafie-se.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
